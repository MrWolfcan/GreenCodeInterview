import {By, Key, Builder, until} from "selenium-webdriver";
import webdriver from "selenium-webdriver";
import assert from "assert";
import chrome from "selenium-webdriver/chrome.js";


describe("Personal license pricing/order form tests: ", function () {

    const gridUrl = 'http://81.95.108.25:4444/';
    let driver = new Builder().forBrowser("chrome").setChromeOptions(
        new chrome.Options().addArguments('disable-popup-blocking', '--start-maximized', 'disable-infobars')).build();

    it("(1year) Check if the button redirects on expected URL: ", async function () {
        await buttonRedirect(12, 'price-personal-purchase', 'personal');
    });

    it("(1year) Check if the license title is correct: ", async function () {
        await checkTitle('SmartMeter Personal');
    });

    it("(1year) Check if the correct 'License for' option is selected: ", async function () {
        await optionSelected(12, "PERSONAL/");
    });

    it('(1year) Check that form can not be sent without required fields and proceed to payment: ', async function () {
        await fillCredentials("personal", 12);
    });

    it("(1month) Check if the button redirects on expected URL: ", async function () {
        await buttonRedirect(1, 'price-personal-purchase', 'personal');
    });

    it("(1month) Check if the license title is correct: ", async function () {
        await checkTitle('SmartMeter Personal');
    });

    it("(1month) Check if the correct 'License for' option is selected: ", async function () {
        await optionSelected(1, 'PERSONAL/');
    });
    it('(1month) Check that form can not be sent without required fields and proceed to payment: ', async function () {
        await fillCredentials('personal', 1);
        await driver.quit();
    });

    async function buttonRedirect(months, purchaseButtonId, licence) {
        try{
            await driver.get("https://www.smartmeter.io/pricing");
            if (months === 1 && await driver.findElement(By.className("grey")).getText() === "1 month") {
                await clickByXpath("/html/body/main/section[2]/div/div/label/span");
            } else if (months === 12 && await driver.findElement(By.className("grey")).getText() !== "1 month") {
                await clickByXpath("/html/body/main/section[2]/div/div/label/span");
            }
            await driver.findElement(By.id(purchaseButtonId)).click();
            await verifyUrlContactInfo(licence, months);
        }catch (err){
            console.log(err);
        }

    }
    async function clickByXpath(xpath) {
        try{
            await driver.findElement(By.xpath(xpath)).click();
        }catch (err){
            console.log(err);
        }

    }
    async function checkTitle(expectedValue) {
        try{
            await driver.findElement(By.xpath('/html/body/main/section[3]/div/article/p[1]/strong')).getText().then(textValue => {
                assert.equal(textValue, expectedValue);
            });
        }catch (err){
            console.log(err);
        }

    }
    async function optionSelected(months, expectedValue) {
        try{
            await driver.findElement(By.xpath("/html/body/main/section[4]/div/form/div[1]/div[4]/select")).getAttribute('value').then(value => {
                assert.equal(value, expectedValue + months);
            });
        }catch (err){
            console.log(err);
        }

    }
    async function fillCredentials(licence, months) {
        try{
            let credentials = ["greencode@greencode.cz", "Adam", "Vl??an", "Testovac?? 365/17\nPraha 6, Veleslav??n\n160 00"];
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
        }catch (err){
            console.log(err);
        }
    }
    async function verifyUrlContactInfo(licence, months) {
        try{
            await driver.getCurrentUrl().then(currentUrl => {
                assert.equal(currentUrl, "https://www.smartmeter.io/purchase?licence=" + licence + "&period=" + months);
            });
        }catch (err){
            console.log(err);
        }

    }
});
