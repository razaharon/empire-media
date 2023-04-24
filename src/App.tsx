import { useState, useEffect } from 'react';
import Graph from "./components/Graph";
import Header from "./components/Header";
import TabContent from "./components/TabContent";
import Table from "./components/Table";
import Tabs from "./components/Tabs";
import { StockContext } from './context/stockContext';
import { GetSocketEffect } from './hooks/WebSocketHook';
import { StockData } from './interfaces/StockData';
import { StockTimePeriod } from './types/StockTimePeriod';
import FetchStockHook from './hooks/FetchStockHook';
import { format } from 'date-fns';
import { tableTitles } from './consts/tableTitles';
import { DateStringWithTime, DateStringWithYear } from './consts/dateFormats';
import { config } from './config/config';
import './fontawesome';

function App() {
  const timeTabs: StockTimePeriod[] = ['1 Minute', '5 Minutes', '1 Hour', '1 Week']

  const [activeTab, setActiveTab] = useState('Overview');
  const [activeTimeTab, setactiveTimeTab] = useState<string>(timeTabs[0]);
  const [socketData, setSocketData] = useState<StockData | null>(null);
  const [tableDateFormat, setTableDateFormat] = useState(DateStringWithTime)
  const { stockData, fetchStockData } = FetchStockHook(config.stockIdentifier, activeTimeTab as StockTimePeriod);
  
  GetSocketEffect(config.instrumentKey, (data: StockData) => setSocketData(data));
  useEffect(() => {
    setTableDateFormat(activeTimeTab === '1 Week' ? DateStringWithYear : DateStringWithTime)
    
    fetchStockData(config.stockIdentifier, activeTimeTab as StockTimePeriod);
  }, [activeTimeTab]);

  const graphDateFormat = (val: string) => format(new Date(val), activeTimeTab === '1 Week' ? 'dd' : 'HH');
  
  return (
    <div className="row m-0">
      <StockContext.Provider value={socketData}>
      <div className="col-12 col-lg-6 offset-lg-3">
        <Header companyName={config.stockName} />
        <Tabs tabs={["Overview", "History"]} onTabChange={setActiveTab} />
        <hr />
        <Tabs tabs={timeTabs} onTabChange={setactiveTimeTab} />
          <TabContent id='Overview' activeTab={activeTab}>
            <Graph xLabel='Date' yLabel='Close' items={stockData} xLabelFormatter={graphDateFormat} dataKey='Close' />
          </TabContent>
          <TabContent id='History' activeTab={activeTab}>
            <Table titles={tableTitles} items={stockData} dateFormat={tableDateFormat} />
          </TabContent>
      </div>
      </StockContext.Provider>
    </div>
  );
}

export default App;
