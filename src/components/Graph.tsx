import { useContext } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { StockContext } from "../context/stockContext";
import Spinner from './Spinner';

interface IGraphProps {
  items: any[]|null;
  dataKey: string;
  xLabel?: string;
  yLabel?: string;
  xLabelFormatter?: ((value: any, index: number) => string)
}

export default function Graph({ items, dataKey, xLabel, yLabel, xLabelFormatter }: IGraphProps) {
  const stockContext = useContext(StockContext);
  if (!items?.length) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          {items === null ? <Spinner /> : <p className="mt-2">No data available, Try again later.</p>}
        </div>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={items}>
        <Line type="monotone" dataKey={dataKey} stroke="#91BEF6" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey={xLabel} tickFormatter={xLabelFormatter} />
        <YAxis dataKey={yLabel} />
        <ReferenceLine y={stockContext?.last} stroke="green" strokeDasharray="3 3" />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
