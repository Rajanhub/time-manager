import { MONTH } from "Constants";
import { useAPIContext } from "context";
import { calculateActualHoursWeek, calculateContractedHoursWeek } from "helper";
import { months } from "moment";
import { useEffect, useState, useMemo } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { WeeklyData } from "types/task";
import Table from "../../components/Table";

export default function Weekly() {
  const [dataList, setDataList] = useState<any>([]);

  const { tasks, contractDays } = useAPIContext();
  const { month: value } = useParams();

  useEffect(() => {
    const month = MONTH.indexOf(value || "");
    if (month < 0) return;
    if (tasks && contractDays) {
      const daysInMonth: number = new Date(2022, month + 1, 0).getDate();
      const length = daysInMonth / 7 > 4 ? 5 : 4;
      const actualHours = calculateActualHoursWeek(tasks, month);
      let totalActual = 0;
      let totalContract = 0;
      const weeks = Array.from({ length }, (_, idx) => {
        const contractedHours = calculateContractedHoursWeek(
          2022,
          month,
          idx + 1,
          contractDays
        );
        totalActual = totalActual + (actualHours[`Week${idx + 1}`] || 0);
        totalContract = totalContract + contractedHours;
        return {
          week: `Week${idx + 1}`,
          contractedHours,
          actualHours: actualHours[`Week${idx + 1}`] || 0,
          adjustmentHour:
            (actualHours[`Week${idx + 1}`] || 0) - contractedHours,
        };
      });
      weeks.push({
        week: "Total",
        contractedHours: totalContract,
        actualHours: totalActual,
        adjustmentHour: totalActual - totalContract,
      });
      setDataList(weeks);
      //calculateContractedHoursWeek(2022,month,);
    }
  }, [contractDays, tasks, value]);

  const data = useMemo(() => dataList, [dataList]);
  const columns = useMemo(
    () => [
      {
        Header: "Weeks",
        accessor: (cell: WeeklyData, idx: number) => (
          <div>
            {cell.week === "Total" ? (
              cell.week
            ) : (
              <Link to={cell.week}>{cell.week}</Link>
            )}
          </div>
        ),
      },

      {
        Header: "Contracted Hours",
        accessor: (cell: WeeklyData, idx: number) => (
          <div className="contents">
            <div className="contracted_hour">
              {cell.contractedHours.toFixed(1)}
            </div>
            <div
              className={`adjustment_hour adjustment_hour--${
                cell.adjustmentHour > 0 ? "negative" : "positive"
              }`}
            >
              {cell.adjustmentHour.toFixed(1)}
            </div>
          </div>
        ),
      },
      {
        Header: "Actual Hours",
        accessor: (cell: WeeklyData, idx: number) => (
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
        <ul className="nav">
          {MONTH.map((el) => (
            <li className="nav__item">
              <NavLink
                to={"/" + el}
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
              >
                {el}
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
