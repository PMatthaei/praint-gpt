import axios from 'axios';
import cheerio from 'cheerio';

type URL = string

export class Scraper {
    async scrape(url: URL): Promise<cheerio.Root> {
        try {
            const { data } = await axios.get(url);
            return cheerio.load(data)
        } catch (error) {
            console.error(`Error scraping ${url}:`, error);
        }
    }
}
