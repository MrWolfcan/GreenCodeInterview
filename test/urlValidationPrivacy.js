import {By, Key, Builder, until} from "selenium-webdriver";
import webdriver from "selenium-webdriver";
import assert from "assert";
import chrome from "selenium-webdriver/chrome.js";

describe("Footer additional redirects: ", function (){

    const gridUrl = 'http://81.95.108.25:4444/';
    let driver = new Builder().forBrowser("chrome").setChromeOptions(
        new chrome.Options().addArguments('disable-popup-blocking', '--start-maximized', 'disable-infobars')).build();

    it('Check if privacy-policy redirects on expected URL: ', async function () {
           try {
               await startBrowser();
               await clickByXpath("/html/body/footer/div/nav/ul/li[8]/a");
               await verifyUrl("https://smartmeter.io/privacy-policy");
           }finally {
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
