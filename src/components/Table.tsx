import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import Spinner from "./Spinner";

interface ITitle {
  name: string;
  label: string;
  type?: string;
}
interface ITableProps {
  titles: ITitle[];
  items: any[] | null;
}
interface ISortType {
  name: string;
  direction: "ASC" | "DESC";
}

export default function Table({ titles, items }: ITableProps) {
  const [sortedData, setSortedData] = useState<any[] | null>(null);
  const [sortType, setSortType] = useState<ISortType>({
    name: "Date",
    direction: "DESC",
  });

  useEffect(() => {
    if (!items) return;
    setSortedData(null);
    setSortedData([...items].sort((a, b) => {
        const [first, second] = sortType.direction === 'DESC' ? [b, a] : [a, b];
        let [val1, val2] = [first[sortType.name], second[sortType.name]];
        if (sortType.name === 'Date') {
          val1 = +new Date(val1)
          val2 = +new Date(val2)
        }
        return val1 - val2
    }))
  }, [sortType, items])
  

  const getSortArrow = (titleName: string) => {
    return titleName !== sortType?.name ? null : (
      <FontAwesomeIcon icon={sortType.direction === "DESC" ? "caret-down" : "caret-up"}/>
    );
  };
  
  const setSort = (titleName: string) => {
    if (sortType.name === titleName) {
      return setSortType({
        name: titleName,
        direction: sortType.direction === "ASC" ? "DESC" : "ASC",
      });
    }
    setSortType({ name: titleName, direction: "DESC" });
  };

  const getColumnValue = (value: string, type?: string) => {
    if (!type) return value;
    if (type === "decimal") return (+value).toFixed(2);
    if (type === "date") return format(new Date(value), "MMM dd, yyyy");
  };

  if (!sortedData?.length) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          {sortedData === null ? <Spinner /> : <p className="mt-2">No data available, Try again later.</p>}
        </div>
      </div>
    );
  }
  return (
    <table className="table border">
      <thead className="thead-light">
        <tr>
          {titles.map((title) => (
            <th
              className="pointer"
              key={title.name}
              onClick={() => setSort(title.name)}>
              {title.label} {getSortArrow(title.name)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData?.map((item, i) => (
          <tr key={i}>
            {titles.map((title) => (
              <td key={title.name}>
                {getColumnValue(item[title.name], title.type)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
