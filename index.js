//Load necessary javascript modules
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

//List of webpages, URL, that we want to scrape
const listOfPages = [
    'https://oldschool.runescape.wiki/w/Unsired', 
    //Array.from(document.querySelectorAll("span.plinkt-template a img"))
    'https://oldschool.runescape.wiki/w/Alchemical_Hydra', 
    //Array.from(document.querySelector("h3.mw-header:has(> a#Pre-roll) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Ancient_chest#Opened',
    //Array.from(document.querySelector("table.wikitable").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Chest_(Barrows)',
    //Array.from(document.querySelectorAll("h4.mw-header + table"))
    'https://oldschool.runescape.wiki/w/Callisto',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Cerberus',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Chaos_Elemental',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Chaos_Fanatic',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Chest_(Tombs_of_Amascut)#Opened',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Commander_Zilyana',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Corporeal_Beast',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Other) ~ table").querySelectorAll("td:has(a[title='Corporeal Beast']) ~ td span.plink-template a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Dagannoth_Prime',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Other) ~ table").querySelectorAll("td:has(a[title='Dagannoth Prime']) ~ td span.plink-template a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Dagannoth_Rex',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Other) ~ table").querySelectorAll("td:has(a[title='Dagannoth Rex']) ~ td span.plink-template a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Dagannoth_Supreme',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Other) ~ table").querySelectorAll("td:has(a[title='Dagannoth Supreme']) ~ td span.plink-template a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Crazy_archaeologist',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/General_Graardor',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Giant_Mole',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Grotesque_Guardians',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Kalphite_Queen',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Other) ~ table").querySelectorAll("td:has(a[title='Kalphite Queen']) ~ td span.plink-template a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/King_Black_Dragon',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Kraken#Kraken',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Slayer_bosses) ~ table").querySelectorAll("td:has(a[title='Kraken']) ~ td span.plink-template a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Kree%27arra',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/K%27ril_Tsutsaroth',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Nex',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/The_Nightmare',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Phosani%27s_Nightmare',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Sarachnis',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Pre-roll) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Scorpia',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Tempoross',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Unique_Rewards) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Reward_Chest_(The_Gauntlet)',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary_2) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Monumental_chest',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Pre-roll) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Thermonuclear_smoke_devil',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Slayer_bosses) ~ table").querySelectorAll("td:has(a[title='Thermonuclear smoke devil']) ~ td span.plink-template a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Venenatis',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Vet%27ion',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Vorkath',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Supply_crate',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Unique) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Zalcano',
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    'https://oldschool.runescape.wiki/w/Zulrah'
    //Array.from(document.querySelector("h3.mw-header:has(> a#Uniques) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table").querySelectorAll("td.inventory-image a img"))
    //Array.from(document.querySelector("h3.mw-header:has(> a#Mutagens) ~ table").querySelectorAll("td.inventory-image a img"))
]

//Wilderness Bosses
//Array.from(document.querySelector("h3.mw-header:has(> a#Wilderness_bosses) ~ table").querySelectorAll("span.plink-template a img"))


//Test URL
// const scrapeUrl = 'https://oldschool.runescape.wiki/w/Zulrah';

//Local Directory to save images
const saveDirectory = 'C:\\Users\\thoma\\projects\\webscraper\\images';

//Given a URL, i.e. https://oldschool.runescape.wiki/images/Phoenix.png?fe846, sends a GET request via axios to download the data for the image.
//Saves the data to param filePath
const download = async (imageURL, filePath) => {

    try {
      const response = await axios({
        method: 'GET',
        url: imageURL,
        responseType: 'stream',
      });
  
      const w = response.data.pipe(fs.createWriteStream(filePath));
      w.on('finish', () => {
        console.log('Successfully downloaded ' + filePath);
      });
    } catch (err) { 
      throw new Error(err);
    }
  }; 

//Launch a new page to scrapeUrl using puppeteer and scrape all images.
//Download the images to a directory.
const scrapePage = async (scrapeUrl) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(scrapeUrl);

    const imageLinksJSON = await page.evaluate((scrapeUrl) => {
      const result = [];
      
      //If the scrapeUrl is for osrs wiki unsired then
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <span class=plinkt-template>.
      //Append all elements to result.
      if (scrapeUrl === 'https://oldschool.runescape.wiki/w/Unsired') {
        const images = 
          Array.from(
            document.querySelectorAll("span.plinkt-template a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
            result.push(images[i]);
        }
      };

      //If there exists a <table class=wikitable> and scrapeUrl is osrs wiki chambers of xeric ancient chest then
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <td class=inventory-image>
      //from that table. Append all elements to result.
      if (document.querySelector("table.wikitable") && scrapeUrl === 'https://oldschool.runescape.wiki/w/Ancient_chest#Opened') {
        const images = 
          Array.from(
            document.querySelector("table.wikitable")
            .querySelectorAll("td.inventory-image a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Unique>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <td class=inventory-image>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Unique) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Unique) ~ table")
            .querySelectorAll("td.inventory-image a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };


      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Uniques>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <td class=inventory-image>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Uniques) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Uniques) ~ table")
            .querySelectorAll("td.inventory-image a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

            //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Unique_Rewards>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <td class=inventory-image>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Unique_Rewards) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Unique_Rewards) ~ table")
            .querySelectorAll("td.inventory-image a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Mutagens>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <td class=inventory-image>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Mutagens) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Mutagens) ~ table")
            .querySelectorAll("td.inventory-image a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };
      
      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Tertiary>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <td class=inventory-image>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Tertiary) ~ table")
            .querySelectorAll("td.inventory-image a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Tertiary_2>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <td class=inventory-image>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Tertiary_2) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Tertiary_2) ~ table")
            .querySelectorAll("td.inventory-image a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };


      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Pre-roll>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <td class=inventory-image>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Pre-roll) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Pre-roll) ~ table")
            .querySelectorAll("td.inventory-image a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

      //If the scrapeUrl is osrs wiki barrows then
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <td class=inventory-image>
      //from the table that is an adjacent sibling to <h4 class=mw-header>. Append all elements to result.
      if (scrapeUrl === 'https://oldschool.runescape.wiki/w/Chest_(Barrows)') {
        const imagesBarrows = 
          Array.from(
            document.querySelectorAll("h4.mw-header + table td.inventory-image a img")
          ).map(
            ele => ele.currentSrc
          );
      
        for (let i = 0; i < imagesBarrows.length; i++) {
          result.push(imagesBarrows[i]);
        }
      };

      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Slayer_bosses>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <span class=plink-template> 
      //with a parent of <td> who is a sibling of a <td> with a child that has <a title='Thermonuclear smoke devil'>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Slayer_bosses) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Slayer_bosses) ~ table")
            .querySelectorAll("td:has(a[title='Thermonuclear smoke devil']) ~ td span.plink-template a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };
            
      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Slayer_bosses>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <span class=plink-template> 
      //with a parent of <td> who is a sibling of a <td> with a child that has <a title='Kraken'>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Slayer_bosses) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Slayer_bosses) ~ table")
            .querySelectorAll("td:has(a[title='Kraken']) ~ td span.plink-template a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Other>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <span class=plink-template> 
      //with a parent of <td> who is a sibling of a <td> with a child that has <a title='Corporeal Beast'>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Other) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Other) ~ table")
            .querySelectorAll("td:has(a[title='Corporeal Beast']) ~ td span.plink-template a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Other>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <span class=plink-template> 
      //with a parent of <td> who is a sibling of a <td> with a child that has <a title='Dagannoth Prime'>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Other) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Other) ~ table")
            .querySelectorAll("td:has(a[title='Dagannoth Prime']) ~ td span.plink-template a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Other>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <span class=plink-template> 
      //with a parent of <td> who is a sibling of a <td> with a child that has <a title='Dagannoth Rex'>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Other) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Other) ~ table")
            .querySelectorAll("td:has(a[title='Dagannoth Rex']) ~ td span.plink-template a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Other>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <span class=plink-template> 
      //with a parent of <td> who is a sibling of a <td> with a child that has <a title='Dagannoth Supreme'>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Other) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Other) ~ table")
            .querySelectorAll("td:has(a[title='Dagannoth Supreme']) ~ td span.plink-template a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

      //If there exists a <table> on the page following a <h3 class=mw-header> which has a child <a id=Other>
      //Grab the currentSrc from all <img> with a parent of <a> with a parent of <span class=plink-template> 
      //with a parent of <td> who is a sibling of a <td> with a child that has <a title='Kalphite Queen'>
      //from that <table>. Append all elements to result.
      if (document.querySelector("h3.mw-header:has(> a#Other) ~ table")) {
        const images = 
          Array.from(
            document.querySelector("h3.mw-header:has(> a#Other) ~ table")
            .querySelectorAll("td:has(a[title='Kalphite Queen']) ~ td span.plink-template a img")
          ).map(
            ele => ele.currentSrc
          );
        
        for (let i = 0; i < images.length; i++) {
          result.push(images[i]);
        }
      };

      return JSON.stringify(result);
    });

    JSON.parse(imageLinksJSON).forEach((imageURL) => {
      const fileName = imageURL.split('/').pop().split('?')[0];
      const filePath = path.resolve(saveDirectory, fileName);
      download(imageURL, filePath);
    });

    await browser.close();
}

//Iterate through listOfPages and send to scrapePage
for (let i = 0; i < listOfPages.length; i++) {
  scrapePage(listOfPages[i]);
}