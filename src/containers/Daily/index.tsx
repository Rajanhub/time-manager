import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import { NavLink, useParams } from "react-router-dom";
import { ContractDays, DailyData } from "types/task";
import { useAPIContext } from "context";
import { MONTH, WEEK } from "Constants";
import { calculateActualHoursDay, getHoursInWeek } from "helper";

const days: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Daily() {
  const [dataList, setDataList] = useState<any>([]);
  const [length, setLength] = useState(0);
  const { tasks, contractDays }: any = useAPIContext();
  const { month: m, week: w } = useParams();

  useEffect(() => {
    const month = MONTH.indexOf(m || "");
    const week = WEEK.indexOf(w || "");

    if (month < 0 || week < 0) return;

    const weeksInMonth = Math.ceil(new Date(2022, month + 1, 0).getDate() / 7);
    setLength(weeksInMonth);
    if (tasks && contractDays) {
      const actualHours = calculateActualHoursDay(tasks, month, week + 1);
      //console.log(actualHours);
      let totalActual = 0;
      let totalContract = 0;
      const day = days.map((day, idx) => {
        const contractedHours = contractDays[day];
        totalActual = totalActual + (actualHours[day] || 0);
        totalContract = totalContract + contractedHours;
        return {
          day,
          contractedHours,
          actualHours: actualHours[day] || 0,
          adjustmentHour: (actualHours[day] || 0) - contractedHours,
        };
      });
      day.push({
        day: "Total",
        contractedHours: totalContract,
        actualHours: totalActual,
        adjustmentHour: totalActual - totalContract,
      });
      setDataList(day);
    }
  }, [contractDays, tasks, m, w]);
  const data = useMemo(() => dataList, [dataList]);
  const columns = useMemo(
    () => [
      {
        Header: "Days",
        accessor: (cell: DailyData, idx: number) => <div>{cell.day}</div>,
      },

      {
        Header: "Contracted Hours",
        accessor: (cell: DailyData, idx: number) => (
          <div className="contents">
            <div className="contracted_hour">
              {cell.contractedHours.toFixed(1)}
            </div>
            <div
              className={`adjustment_hour adjustment_hour--${
                cell.adjustmentHour < 0 ? "negative" : "positive"
              }`}
            >
              {cell.adjustmentHour.toFixed(1)}
            </div>
          </div>
        ),
      },
      {
        Header: "Actual Hours",
        accessor: (cell: DailyData, idx: number) => (
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
        <NavLink to="/">2022</NavLink>
        <NavLink to={`/${m}`}>{m}</NavLink>
        <ul className="nav">
          {Array.from({ length }, (_, idx) => (
            <li className="nav__item">
              <NavLink
                to={`/${m}/Week${idx + 1}`}
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
              >
                {`Week${idx + 1}`}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="table-responsive">
        <Table data={data} columns={columns} />
      </div>
    </div>
  );
}
