import assert from "assert";
import {Builder, By} from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

describe("Footer additional redirects: ", function () {

    const gridUrl = 'http://81.95.108.25:4444/';
    let driver = new Builder().forBrowser("chrome").setChromeOptions(
        new chrome.Options().addArguments('disable-popup-blocking', '--start-maximized', 'disable-infobars')).build();

    it('Check if refund-policy redirects on expected URL: ', async function () {
        try {
            await startBrowser();
            await clickByXpath("/html/body/footer/div/nav/ul/li[9]/a");
            await verifyUrl("https://smartmeter.io/refund-policy");
        } finally {
            await driver.quit();
        }
    });
    async function verifyUrl(url) {
        await driver.getCurrentUrl().then(currentUrl => {
            assert.equal(currentUrl, url);
        })
    }
    async function clickByXpath(xpath) {
        await driver.findElement(By.xpath(xpath)).click();
    }
    async function startBrowser() {
        await driver.get("https://www.smartmeter.io");
    }

})
