const pageScraper = require('./pageScraper');

const json = require('./bosses.json');
const downloadDirectory = './images';

async function scrapeAll(browserInstance) {
    let browser;
    try {
        for (boss in json.bosses) {
            console.log("Scraping drop images for => : ", json.bosses[boss].name);
            browser = await browserInstance;
            await pageScraper.scraper(browser, json.bosses[boss].webpage, downloadDirectory, json.bosses[boss].selectors);
        }
    } catch (error) {
        console.log("Could not resolve the browser instance => : ", error);
    }
    await browser.close();
}

module.exports = (browserInstance) => scrapeAll(browserInstance);