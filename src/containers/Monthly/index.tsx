import { MONTH } from "Constants";
import { useAPIContext } from "context";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import {
  calculateActualHoursMonth,
  calculateContractedHoursMonth,
} from "../../helper";
import { MonthlyData } from "../../types/task";

export default function Monthly() {
  const [dataList, setDataList] = useState<any>([]);
  const { tasks, contractDays } = useAPIContext();

  useEffect(() => {
    if (tasks && contractDays) {
      const actualHours = calculateActualHoursMonth(tasks);
      let totalActual = 0;
      let totalContract = 0;
      const months = MONTH.map((month, idx) => {
        const contractedHours = calculateContractedHoursMonth(
          contractDays,
          2022,
          idx
        );
        totalActual = totalActual + (actualHours[month] || 0);
        totalContract = totalContract + contractedHours;
        return {
          month,
          contractedHours,
          actualHours: actualHours[month] || 0,
          adjustmentHour: (actualHours[month] || 0) - contractedHours,
        };
      });
      months.push({
        month: "Total",
        contractedHours: totalContract,
        actualHours: totalActual,
        adjustmentHour: totalActual - totalContract,
      });
      setDataList(months);
    }
  }, [tasks, contractDays]);

  const data = React.useMemo(() => dataList, [dataList]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Month",
        accessor: (cell: MonthlyData, idx: number) => (
          <div>
            {cell.month === "Total" ? (
              cell.month
            ) : (
              <Link to={cell.month}>{cell.month}</Link>
            )}
          </div>
        ),
      },

      {
        Header: "Contracted Hours",
        accessor: (cell: MonthlyData, idx: number) => (
          <div className="contents">
            <div className="contracted_hour">
              {cell.contractedHours.toFixed(1)}
            </div>
            <div
              className={`adjustment_hour adjustment_hour--${
                cell.adjustmentHour > 0 ? "positive" : "negative"
              }`}
            >
              {cell.adjustmentHour.toFixed(1)}
            </div>
          </div>
        ),
      },
      {
        Header: "Actual Hours",
        accessor: (cell: MonthlyData, idx: number) => (
          <div className="actual_hour">{cell.actualHours.toFixed(1)}hrs</div>
        ),
      },
    ],

    []
  );
  return (
    <div className="card">
      <div className="table_description">
        <div className="title">Clean Ad Walker</div>
      </div>
      <div className="table-responsive">
        <Table data={data} columns={columns} />
      </div>
    </div>
  );
}
