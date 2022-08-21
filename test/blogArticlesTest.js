import {By, Key, Builder, until} from "selenium-webdriver";
import webdriver from "selenium-webdriver";
import assert from "assert";
import chrome from "selenium-webdriver/chrome.js";


describe("Check blog site: ", function () {
//.usingServer(gridUrl)
    const gridUrl = 'http://81.95.108.25:4444/';
    let driver = new Builder().forBrowser("chrome").setChromeOptions(
        new chrome.Options().addArguments('disable-popup-blocking', '--start-maximized', 'disable-infobars')).build();

    it('Check if every article in BLOG section has its own img, date, title, perex, more: ', async function () {
        try{
            await getBlog();
            await findAllArticlesAndCheck();
        }finally {
            await driver.quit();
        }
    });
    async function getBlog() {
        await driver.get("https://www.smartmeter.io/blog");
    }

    async function getByXpathGetTextThenAssert(url) {
        await driver.findElement(By.xpath(url)).getText().then(value => {
            assert.notEqual(value, "");
        });
    }

    async function findAllArticlesAndCheck() {
        let articles = await driver.findElements(By.tagName("article"));
        await driver.findElement(By.xpath("/html/body/main/section[3]/div/article/a/img")).getAttribute('alt').then(alt => {
            assert.notEqual(alt, "");
        });
        await getByXpathGetTextThenAssert("/html/body/main/section[3]/div/article/div/p[1]");
        await getByXpathGetTextThenAssert("/html/body/main/section[3]/div/article/div/h4");
        await getByXpathGetTextThenAssert("/html/body/main/section[3]/div/article/div/p[2]");
        await getByXpathGetTextThenAssert("/html/body/main/section[3]/div/article/div/div/a");


        for (let numberOfArticles = 1; numberOfArticles < articles.length; numberOfArticles++) {
            //let actualArticle = numberOfArticles + 1;
            await driver.findElement(By.xpath("/html/body/main/section[4]/div/article[" + numberOfArticles + "]/a/img")).getAttribute('alt').then(alt => {
                assert.notEqual(alt, "");
            });
            await getByXpathGetTextThenAssert("/html/body/main/section[4]/div/article[" + numberOfArticles + "]/div/p[1]");
            await getByXpathGetTextThenAssert("/html/body/main/section[4]/div/article[" + numberOfArticles + "]/div/h4");
            await getByXpathGetTextThenAssert("/html/body/main/section[4]/div/article[" + numberOfArticles + "]/div/p[2]");
            await getByXpathGetTextThenAssert("/html/body/main/section[4]/div/article[" + numberOfArticles + "]/div/a");

        }

    }
})