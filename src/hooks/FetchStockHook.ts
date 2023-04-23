import { endOfDay, format, subDays, subYears } from 'date-fns';
import { useEffect, useState } from 'react'
import { IStockDataResponse } from '../interfaces/StockData';
import { StockTimePeriod } from '../types/StockTimePeriod';

const apiUrl = 'https://test.fxempire.com/api/v1/en/stocks/chart/candles';

function getQueryParams(identifier: string, timePeriod: StockTimePeriod): URLSearchParams {
    let { StartTime, period, percision } = getVariablesByTimePeriod(timePeriod);
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

function getVariablesByTimePeriod(timePeriod: string) {
    let StartTime = format(subDays(new Date(), 1), 'MM/dd/yyyy');
    let period = 1;
    let percision = 'Minutes';
    if (timePeriod === '5 Minutes')
        period = 5;
    if (timePeriod === '1 Hour')
        percision = 'Hours';
    if (timePeriod === '1 Week') {
        period = 24 * 7;
        percision = 'Hours';
        StartTime = format(subYears(new Date(), 1), 'MM/dd/yyyy');
    }
    return { StartTime, period, percision };
}

export default function FetchStockHook(identifier: string, timePeriod: StockTimePeriod) {
    const [stockData, setStockData] = useState<IStockDataResponse[]|null>(null);
    const fetchStockData = (identifier: string, timePeriod: StockTimePeriod) => {
        fetch(`${apiUrl}?${getQueryParams(identifier, timePeriod)}`).then(response => {
            response.json().then(data => setStockData(data))
        });
    }
    useEffect(() => {
        fetchStockData(identifier, timePeriod);
    }, [])
    return { stockData, fetchStockData };
}
