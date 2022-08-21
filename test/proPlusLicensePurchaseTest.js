import {By, Key, Builder, until} from "selenium-webdriver";
import webdriver from "selenium-webdriver";
import assert from "assert";
import chrome from "selenium-webdriver/chrome.js";


describe("ProPlus license pricing/order form tests: ", function () {

    const gridUrl = 'http://81.95.108.25:4444/';
    let driver = new Builder().forBrowser("chrome").setChromeOptions(
        new chrome.Options().addArguments('disable-popup-blocking', '--start-maximized', 'disable-infobars')).build();

    it("(1year) Check if the button redirects on expected URL: ", async function () {
        await buttonRedirect(12, 'price-pro-plus-purchase', 'pro_plus');
    });

    it("(1year) Check if the license title is correct: ", async function () {
        await checkTitle('SmartMeter Pro+');
    });

    it("(1year) Check if the correct 'License for' option is selected: ", async function () {
        await optionSelected(12, "PRO_PLUS/");
    });

    it('(1year) Check that form can not be sent without required fields and proceed to payment: ', async function () {
        await fillCredentials("pro_plus", 12);
    });

    it("(1month) Check if the button redirects on expected URL: ", async function () {
        await buttonRedirect(1, 'price-pro-plus-purchase', 'pro_plus');
    });

    it("(1month) Check if the license title is correct: ", async function () {
        await checkTitle('SmartMeter Pro+');
    });

    it("(1month) Check if the correct 'License for' option is selected: ", async function () {
        await optionSelected(1, 'PRO_PLUS/');
    });
    it('(1month) Check that form can not be sent without required fields and proceed to payment: ', async function () {
        await fillCredentials('pro_plus', 1);
        await driver.quit();
    });

    async function buttonRedirect(months, purchaseButtonId, licence) { // 1 / 12
        await driver.get("https://www.smartmeter.io/pricing");
        if (months === 1 && await driver.findElement(By.className("grey")).getText() === "1 month") {
            await clickByXpath("/html/body/main/section[2]/div/div/label/span");
        } else if (months === 12 && await driver.findElement(By.className("grey")).getText() !== "1 month") {
            await clickByXpath("/html/body/main/section[2]/div/div/label/span");
        }
        await driver.findElement(By.id(purchaseButtonId)).click();
        await verifyUrlContactInfo(licence, months);
    }
    async function clickByXpath(xpath) {
        await driver.findElement(By.xpath(xpath)).click();
    }
    async function checkTitle(expectedValue) {
        await driver.findElement(By.xpath('/html/body/main/section[3]/div/article/p[1]/strong')).getText().then(textValue => {
            assert.equal(textValue, expectedValue);
        });
    }
    async function optionSelected(months, expectedValue) {
        await driver.findElement(By.xpath("/html/body/main/section[4]/div/form/div[1]/div[4]/select")).getAttribute('value').then(value => {
            assert.equal(value, expectedValue + months);
        });
    }
    async function fillCredentials(licence, months) {
        let credentials = ["greencode@greencode.cz", "Adam", "Vlčan", "Testovací 365/17\nPraha 6, Veleslavín\n160 00"];
        let tag = ["input", "textarea"];
        let goToPaymentButton = "/html/body/main/section[4]/div/form/div[1]/div[8]/input[2]";
        await clickByXpath(goToPaymentButton);
        await verifyUrlContactInfo(licence, months);

        for (let n = 1; n < 5; n++) {
            let littleHelper = n;
            if (n === 4) {
                tag.shift();
                littleHelper += 2;
            }
            await driver.findElement(By.xpath("/html/body/main/section[4]/div/form/div[1]/div[" + littleHelper + "]/" + tag[0] + "")).sendKeys(credentials[n - 1]);
            await clickByXpath(goToPaymentButton);
            if (n === 4) {
                await driver.getCurrentUrl().then(currentUrl => {
                    assert.equal(currentUrl, "https://www.smartmeter.io/purchase$a219-setupLicenceData");
                });
                await driver.findElement(By.xpath("/html/body/main/section[3]/div/article/h2")).getText().then(currentTitle => {
                    assert.equal(currentTitle, "PAYMENT");
                })
            } else await verifyUrlContactInfo(licence, months);

        }
    }
    async function verifyUrlContactInfo(licence, months) {
        await driver.getCurrentUrl().then(currentUrl => {
            assert.equal(currentUrl, "https://www.smartmeter.io/purchase?licence=" + licence + "&period=" + months);
        });
    }
});
