import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StockContext } from "../context/stockContext";
import Spinner from "./Spinner";
import { StockData } from "../interfaces/StockData";

interface IHeaderProps {
    companyName: string
}

export default function Header({ companyName }: IHeaderProps) {
  const data: StockData|null = useContext(StockContext);
  if (!data) {
    return (
      <div className="container-fluid my-2">
        <div className="row">
          <div className="col-12 text-center p-4 shadow-sm rounded">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container-fluid my-2">
      <div className="row">
        <div className="col-12 d-flex justify-content-between p-4 shadow-sm rounded">
          <div className="text-left text-gray">
            <h2>{companyName}</h2>
            <small className="text-secondary">
              As of: {new Date(data.lastUpdate).toUTCString()}
            </small>
          </div>
          <div className="w-25">
            <div className="d-flex align-items-center justify-content-center">
              <FontAwesomeIcon
                size="2x"
                icon={data.change < 0 ? "caret-down" : "caret-up"}
                className={`${data.change < 0 ? "red" : "green"} mx-2`}/>
              <h2>{data.last}</h2>
            </div>
            <div
              className={`d-flex align-items-center justify-content-between ${
                data.change < 0 ? "red" : "green"}`}>
              <span>{data.change.toFixed(2)}</span>
              <span>({data.percentChange.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
