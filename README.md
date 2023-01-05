# osrs-wiki-web-image-scraper
Web scraper utilizing Puppeteer written in Javascript to crawl Oldschool Runescape Wiki pages and download images.

To custom scrape a list of OSRS bosses, modify bosses.json. Bosses.json contains a list of boss objects which have a name, webpage, and list of selectors. It also contains a list of ignored URLs. These URLs are not scraped.

By default, bosses.json includes all OSRS bosses and the selectors include uniques and tertiary drops.
