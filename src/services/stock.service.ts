import { IStockDataResponse } from "../interfaces/StockData";
import { StockTimePeriod } from "../types/StockTimePeriod";
import { format, endOfDay, subDays, subYears } from 'date-fns';

export default class StockService {

    private readonly _apiUrl = 'https://test.fxempire.com/api/v1/en/stocks/chart/candles';

    public async getStockData(identifier: string, timePeriod: StockTimePeriod): Promise<IStockDataResponse[]> {
        const response = await fetch(`${this._apiUrl}?${this._getQueryParams(identifier, timePeriod)}`);
        return await response.json();
    }

    private _getQueryParams(identifier: string, timePeriod: StockTimePeriod): URLSearchParams {
        let StartTime = format(subDays(new Date(), 1), 'MM/dd/yyyy');
        let period = 1;
        let percision = 'Minutes';
        if (timePeriod === '5 Minutes') period = 5;
        if (timePeriod === '1 Hour') percision = 'Hours';
        if (timePeriod === '1 Week') {
            period = 24 * 7;
            percision = 'Hours';
            StartTime = format(subYears(new Date(), 1), 'MM/dd/yyyy');
        }
        return new URLSearchParams({
            Identifier: identifier,
            IdentifierType: 'Symbol',
            AdjustmentMethod: 'All',
            IncludeExtended: 'False',
            StartTime,
            EndTime: format(endOfDay(new Date()), 'MM/dd/yyyy HH:mm'),
            period: period.toString(),
            Precision: percision,
            _fields: 'ChartBars.StartDate,ChartBars.High,ChartBars.Low,ChartBars.StartTime,ChartBars.Open,ChartBars.Close,ChartBars.Volume'
        });
    }
}