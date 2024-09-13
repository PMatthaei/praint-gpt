const finnhub = await import('finnhub');
import {env} from "$env/dynamic/private";

type Stock = string

export class FinnhubFinanceApi {

    private static STOCKS: Stock[] = ["APPL"]

    private api: any

    constructor() {
        this.api = new finnhub.DefaultApi();
        const apiKey = finnhub.ApiClient.instance.authentications['api_key'];
        apiKey.apiKey = env.FINNHUB_IO_API_KEY;
    }

    async getStockData(): Promise<any[]> {
        const promises = FinnhubFinanceApi.STOCKS.map(stock => this.getStock(stock))
        return await Promise.all(promises);
    }

    private async getStock(stock: Stock): Promise<any> {
        try {
            this.api.quote(stock, (error, data, response) => {
                return new Promise((resolve, reject) => {
                    if(error){
                        reject(error)
                    }
                    if(data){
                        resolve(data)
                    }
                    console.log(response.body)
                    resolve(undefined)
                })
            })

        } catch (error) {
            console.error(`Error fetching stock price: ${error.message}`);
        }
    }
}
