const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
const json = require('./bosses.json');
const downloaded = new Set();

//Given a URL, i.e. https://oldschool.runescape.wiki/images/Phoenix.png?fe846, sends a GET request via axios to download the data for the image.
//Saves the data to param filePath
const download = async (imageURL, filePath) => {
    try {
        if (downloaded.has(imageURL)) {
            console.log("Already downloaded image => : ", imageURL.split('_')[0]);
            return
        } else {
            const response = await axios({
                method: 'GET',
                url: imageURL,
                responseType: 'stream',
            });
    
            const w = response.data.pipe(fs.createWriteStream(filePath));
            w.on('finish', () => {
                console.log('Successfully downloaded ' + filePath);
            });
            downloaded.add(imageURL);
        }
    } catch (err) { 
        console.log('Could not download image => : ', err);
    }
};

const waitTillHTMLRendered = async (page, timeout = 30000, checkDuration = 1000, minIterations = 3) => {
    const checkDurationMsecs = checkDuration;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = minIterations;
  
    while (checkCounts++ <= maxChecks) {
        let html = await page.content();
        let currentHTMLSize = html.length; 
  
        let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
  
        console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
  
        if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) {
            countStableSizeIterations++;
        } else {
            countStableSizeIterations = 0; //reset the counter
        }
  
        if (countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
        }
  
        lastHTMLSize = currentHTMLSize;
        await page.waitForTimeout(checkDurationMsecs);
    }  
};

const scraperObject = {
    async scraper(browser, url, downloadDirectory, selectors) {
        let ignore = json.ignore;
        let page = await browser.newPage();
        console.log(`Navigating to ${url} ... `);
        await page
            .goto(url, {
                'timeout': 10000,
                'waitUntil': 'load',
            })
            .catch((err) => console.log(`Error loading URL ${url} => : `, err));
        await waitTillHTMLRendered(page, 30000, 500, 3);

        let dropUrls = [];

        for (selector in selectors) {
            var tempUrls = []
            try {
                if (selectors[selector][0] !== '') {
                    tempUrls = await page.$(selectors[selector][0]);
                    tempUrls = await tempUrls.$$eval(selectors[selector][1], links => links.map(ele => ele.href));
                } else {
                    tempUrls = await page.$$eval(selectors[selector][1], links => links.map(ele => ele.href));
                }
                dropUrls = dropUrls.concat(tempUrls);
            } catch (err) {
                console.log("Error retrieving all drop links => : ", err)
            }
        }

        let pagePromise = (link) => new Promise(async(resolve, reject) => {
            let newPage = await browser.newPage();
            await newPage
                .goto(link, {
                    'timeout': 10000,
                    'waitUntil': 'load',
                })
                .catch((err) => console.log(`Error loading URL ${link} => : `, err));
            
            try {
                let imagePageSelector = 'div.floatleft a';
                let imageLink = await newPage.$eval(imagePageSelector, a => a.href);
            
                await newPage
                    .goto(imageLink, {
                        'timeout': 10000,
                        'waitUntil': 'load',
                    })
                    .catch((err) => console.log(`Error loading URL ${imageLink} => : `, err));

                let imageSelector = 'div.fullImageLink a img';
                if (!(ignore.includes(link))) {
                    let downloadLink = await newPage.$eval(imageSelector, img => img.src);
                    let fileName = await newPage.$eval(imageSelector, img => img.alt)
                    fileName = fileName.split(':').pop();
                    let filePath = path.resolve(downloadDirectory, fileName);
                    download(downloadLink, filePath);
                }
                resolve();
                await newPage.close();
            } catch (err) {
                console.log("Error downloading image => : ", err);
            }
        });

        for (link in dropUrls) {
            await pagePromise(dropUrls[link]);
        };
        await page.close();
    }
}

module.exports = scraperObject;