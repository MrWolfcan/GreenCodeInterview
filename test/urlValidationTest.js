import {By, Key, Builder, until} from "selenium-webdriver";
import webdriver from "selenium-webdriver";
import assert from "assert";
import chrome from "selenium-webdriver/chrome.js";

describe("URL pattern validation test and footer correct copyright across the menu: ", function (){

    const gridUrl = 'http://81.95.108.25:4444/';
    let driver = new Builder().forBrowser("chrome").setChromeOptions(
        new chrome.Options().addArguments('disable-popup-blocking', '--start-maximized', 'disable-infobars')).build();

    it('Check if all menu buttons redirect on expected URL: ', async function () {
        try{
            let urls = ["features", "pricing", "download", "blog", "contact", "learn"];
            await startBrowser();
            for (let a = 0; a < 6; a++) {
                await getRidOfCookies();
                let actualLi = a + 2;
                await proceedToAndCheck(actualLi, urls[a]);
            }
        }finally {
            await driver.quit();
        }
    });
    async function startBrowser() {
        await driver.get("https://www.smartmeter.io");
    }
    async function getRidOfCookies() {
        try{
            let cookies = await driver.findElement(By.xpath("/html/body/div/div[1]/div[5]/div[1]/a"));
            await cookies.click();
        }catch (e) {
            console.log("Preventive cookie acceptance.");
        }

    }
    async function proceedToAndCheck(li, url) {

        await driver.findElement(By.xpath("/html/body/header/div/nav/ul/li[" + li + "]/a")).click();
        await driver.getCurrentUrl().then(currentUrl => {
            assert.equal(currentUrl, "https://www.smartmeter.io/" + url);
        });
        await driver.findElement(By.xpath("/html/body/footer/div[2]/div/p")).getText().then(copyrightText => {
            let expectedCopyright = "Created by Etnetera\n" +
                "© 2022 Etnetera a.s.";
            assert.equal(copyrightText, expectedCopyright);
        });
    }
})
