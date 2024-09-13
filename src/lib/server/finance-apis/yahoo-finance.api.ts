import yahooFinance from 'yahoo-finance2';
import type {Quote, QuoteField, QuoteOptions} from "yahoo-finance2/dist/esm/src/modules/quote";

type Stock = string

export class YahooFinanceApi {

    private static STOCKS: Stock[] = ["APPL"]

    async getStockData(): Promise<Quote[]> {
        const promises = YahooFinanceApi.STOCKS.map(stock => this.getStock(stock))
        return await Promise.all(promises);
    }

    private async getStock(stock: Stock): Promise<Quote> {
        const fields: QuoteField[] = ["regularMarketPrice", "regularMarketTime"];
        const options: QuoteOptions = {fields: fields}
        try {
            return await yahooFinance.quote(stock);
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    }
}
