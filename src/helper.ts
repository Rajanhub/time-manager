import { ContractDays, Task } from "./types/task";
let hoursInWeek: any;
const week5inCache: any = {};

///////////////////
export function getElapsedHours(start: string, end: string) {
  //@ts-ignore
  return (new Date(end) - new Date(start)) / (1000 * 60 * 60);
}
export function getHoursInWeek(contractDays: ContractDays) {
  return hoursInWeek
    ? hoursInWeek
    : Object.values(contractDays).reduce(
        (prev: any, current: any) => prev + current,
        0
      );
}
//Output-sunday,monday
export function getWeekDay(year: number, month: number, day: number) {
  return new Date(year, month, day).toLocaleString("en-us", {
    weekday: "long",
  });
}

export function getMonthName(date: string) {
  return new Date(date).toLocaleString("en-us", {
    month: "long",
  });
}

export function getWeek5hours(contractDays: any, year: number, month: number) {
  if (week5inCache.hasOwnProperty(month)) {
    return week5inCache[month];
  }
  let contractHours = 0;
  const daysInMonth: number = new Date(year, month + 1, 0).getDate();
  for (let i = 29; i <= daysInMonth; i++) {
    contractHours = contractHours + contractDays[getWeekDay(year, month, i)];
  }
  week5inCache[month] = contractHours;
  return contractHours;
}

export const calculateContractedHoursMonth = (
  contractDays: any,
  year: number,
  month: number
) => {
  const daysInMonth: number = new Date(year, month + 1, 0).getDate();
  const hasWeek5 = daysInMonth / 7 > 4;
  let contractHours = 4 * getHoursInWeek(contractDays);

  if (!hasWeek5) return contractHours;

  return contractHours + getWeek5hours(contractDays, year, month);
};

export function calculateActualHoursMonth([...tasks]: Task[]) {
  let actualHours: any = {};
  tasks.forEach((task) => {
    const month = getMonthName(task.task_date);
    if (actualHours.hasOwnProperty(month)) {
      actualHours[month] = createActualHour(actualHours[month], task);
    } else {
      actualHours[month] = createActualHour(0, task);
    }
  });
  return actualHours;
}

export function createActualHour(prev: number, current: Task): number {
  if (current.actual_in && current.actual_out)
    return prev + getElapsedHours(current.actual_in, current.actual_out);
  return prev;
}

export const calculateContractedHoursWeek = (
  year: number,
  month: number,
  week: number,
  contractDays: any
) => {
  if (week > 4) {
    return getWeek5hours(contractDays, year, month);
  }
  return getHoursInWeek(contractDays);
};

export function calculateActualHoursWeek([...tasks]: Task[], month: number) {
  let actualHours: any = {};
  tasks.forEach((task) => {
    if (new Date(task.task_date).getMonth() !== month) {
      return;
    }
    const week = `Week${Math.ceil(new Date(task.task_date).getDate() / 7)}`;

    if (actualHours.hasOwnProperty(week)) {
      actualHours[week] = createActualHour(actualHours[week], task);
    } else {
      actualHours[week] = createActualHour(0, task);
    }
  });
  return actualHours;
}
export function calculateActualHoursDay(
  [...tasks]: Task[],
  month: number,
  week: number
) {
  let actualHours: any = {};
  tasks.forEach((task) => {
    const m = new Date(task.task_date).getMonth();
    const w = Math.ceil(new Date(task.task_date).getDate() / 7);
    if (m !== month || w !== week) {
      return;
    }
    const day = new Date(task.task_date).toLocaleString("en-us", {
      weekday: "long",
    });
    if (actualHours.hasOwnProperty(day)) {
      actualHours[day] = createActualHour(actualHours[day], task);
    } else {
      actualHours[day] = createActualHour(0, task);
    }
  });
  return actualHours;
}
