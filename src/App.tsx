import { useState, useEffect } from 'react';
import Graph from "./components/Graph";
import Header from "./components/Header";
import TabContent from "./components/TabContent";
import Table from "./components/Table";
import Tabs from "./components/Tabs";
import { StockContext } from './context/stockContext';
import { GetSocketEffect } from './hooks/webSocketHook';
import { IStockDataResponse, StockData } from './interfaces/StockData';
import { StockTimePeriod } from './types/StockTimePeriod';
import StockService from './services/stock.service';
import './fontawesome';
import { format } from 'date-fns';
import { config } from './config/config';

const stockService = new StockService();

function App() {
  const timeTabs: StockTimePeriod[] = ['1 Minute', '5 Minutes', '1 Hour', '1 Week']

  const [activeTab, setActiveTab] = useState('Overview');
  const [activeTimeTab, setactiveTimeTab] = useState<string>(timeTabs[0]);
  const [stockData, setStockData] = useState<IStockDataResponse[]|null>([]);
  const [data, setData] = useState<StockData | null>(null);
  GetSocketEffect(config.instrumentKey, (data: StockData) => setData(data));

  useEffect(() => {
    setStockData(null);
    stockService.getStockData(config.stockIdentifier, activeTimeTab as StockTimePeriod).then(data => setStockData(data))
  }, [activeTimeTab]);

  const graphDateFormat = (val: string) => format(new Date(val), activeTimeTab === '1 Week' ? 'dd' : 'HH');

  const tableTitles = [
    { name: "Date", label: "Date", type: 'date' },
    { name: "High", label: "High", type: 'decimal' },
    { name: "Low", label: "Low", type: 'decimal' },
    { name: "Open", label: "Open", type: 'decimal' },
    { name: "Close", label: "Close", type: 'decimal' },
    { name: "Change", label: "% Change", type: 'decimal' }
  ];
  
  return (
    <div className="row m-0">
      <StockContext.Provider value={data}>
      <div className="col-12 col-lg-6 offset-lg-3">
        <Header companyName={config.stockName} />
        <Tabs tabs={["Overview", "History"]} onTabChange={setActiveTab} />
        <hr />
        <Tabs tabs={timeTabs} onTabChange={setactiveTimeTab} />
          <TabContent id='Overview' activeTab={activeTab}>
            <Graph xLabel='Date' yLabel='Close' items={stockData} xLabelFormatter={graphDateFormat} dataKey='Close' />
          </TabContent>
          <TabContent id='History' activeTab={activeTab}>
            <Table titles={tableTitles} items={stockData} />
          </TabContent>
      </div>
      </StockContext.Provider>
    </div>
  );
}

export default App;
