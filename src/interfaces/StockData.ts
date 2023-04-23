export interface StockData {
    last: number;
    change: number;
    percentChange: number;
    lastUpdate: string;
}

export interface IStockDataResponse {
    StartDate: string,
    StartTime: string,
    Open: number,
    High: number,
    Low: number,
    Close: number,
    Volume: number,
    Date: Date
}

