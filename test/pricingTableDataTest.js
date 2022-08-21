import {By, Key, Builder} from "selenium-webdriver";
import webdriver from "selenium-webdriver";
import assert from "assert";
import {
    personalLicenseYear,
    proLicenseYear,
    proPlusLicenseYear,
    corporateLicenseYear,
    personalLicenseMonth,
    proLicenseMonth,
    proPlusLicenseMonth,
    corporateLicenseMonth
} from "../src/pricingTableValues.js";
import chrome from "selenium-webdriver/chrome.js";


describe("Check pricing site: ", function () {

    const gridUrl = 'http://81.95.108.25:4444/';
    let driver = new Builder().forBrowser("chrome").setChromeOptions(
        new chrome.Options().addArguments('disable-popup-blocking', '--start-maximized', 'disable-infobars')).build();


    it("Check if all values in pricing table are correct for 1 year billing period: ", async function () {

        await driver.get("https://www.smartmeter.io/pricing");

        if (await driver.findElement(By.className("grey")).getText() !== "1 month") {
            await driver.findElement(By.xpath("/html/body/main/section[2]/div/div/label/span")).click();
        }
        let scrapedData = await scrapeData(1);
        let schemas = [personalLicenseYear, proLicenseYear, proPlusLicenseYear, corporateLicenseYear];
        for (let numberOfLicenses = 0; numberOfLicenses < 4; numberOfLicenses++) {
            assert.deepEqual(JSON.stringify(scrapedData[numberOfLicenses]), JSON.stringify(schemas[numberOfLicenses]));
        }

    });
    it("Check if all values in pricing table are correct for 1 month billing period: ", async function () {

        if (await driver.findElement(By.className("grey")).getText() === "1 month") {
            await driver.findElement(By.xpath("/html/body/main/section[2]/div/div/label/span")).click();
        }
        let scrapedData = await scrapeData(2);
        let schemas = [personalLicenseMonth, proLicenseMonth, proPlusLicenseMonth, corporateLicenseMonth];
        for (let numberOfLicenses = 0; numberOfLicenses < 4; numberOfLicenses++) {
            assert.deepEqual(JSON.stringify(scrapedData[numberOfLicenses]), JSON.stringify(schemas[numberOfLicenses]));
        }
        await driver.quit();
    });

    async function scrapeData(period) {
        let personal = {}, pro = {}, proPlus = {}, corporate = {};
        let licenseTypes = [personal, pro, proPlus, corporate];
        let theadProperties = ["license", "priceAndPeriod", "button", "title"];
        let tbodyProperties = ["virtualUserLimit", "numberOfTests", "testDuration", "multiLicense", "techSupp", "workingOff", "reports", "recorder", "loadTesting", "integrationSupp"]
        for (let a = 0; a < 4; a++) {
            let supera = a + 2;
            if (a < 3) {
                licenseTypes[a][theadProperties[0]] = await driver.findElement(By.xpath("/html/body/main/section[2]/div/table/thead/tr[2]/th[" + supera + "]/h4")).getText();
                licenseTypes[a][theadProperties[1]] = await driver.findElement(By.xpath("/html/body/main/section[2]/div/table/thead/tr[2]/th[" + supera + "]/p[1]")).getText();
                licenseTypes[a][theadProperties[2]] = await driver.findElement(By.xpath("/html/body/main/section[2]/div/table/thead/tr[2]/th[" + supera + "]/a")).getText();
                licenseTypes[a][theadProperties[3]] = await driver.findElement(By.xpath("/html/body/main/section[2]/div/table/thead/tr[2]/th[" + supera + "]/p[2]")).getText();
            } else {
                licenseTypes[a][theadProperties[0]] = await driver.findElement(By.xpath("/html/body/main/section[2]/div/table/thead/tr[2]/th[" + supera + "]/div/h4")).getText();
                licenseTypes[a][theadProperties[1]] = await driver.findElement(By.xpath("/html/body/main/section[2]/div/table/thead/tr[2]/th[" + supera + "]/div/div[" + period + "]/p")).getText();
                licenseTypes[a][theadProperties[2]] = await driver.findElement(By.xpath("/html/body/main/section[2]/div/table/thead/tr[2]/th[" + supera + "]/div/div[" + period + "]/a")).getText();
                licenseTypes[a][theadProperties[3]] = await driver.findElement(By.xpath("/html/body/main/section[2]/div/table/thead/tr[2]/th[" + supera + "]/div/p")).getText();
            }
        }
        for (let a = 0; a < 4; a++) {
            for (let b = 0; b < 10; b++) {
                let row = b + 3;
                let column = a + 1;
                licenseTypes[a][tbodyProperties[b]] = await driver.findElement(By.xpath("/html/body/main/section[2]/div/table/tbody/tr[" + row + "]/td[" + column + "]")).getText();
            }
        }
        return licenseTypes;
    }
});