export type ETask = Task[];

export interface Task {
  task_id: string;
  title: string;
  description: string;
  task_date: string;
  actual_in?: string;
  actual_out?: string;
}

export interface ContractDays {
  Sunday: number;
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
}

export interface MonthlyData {
  month: string;
  contractedHours: number;
  actualHours: number;
  adjustmentHour: number;
}

export interface WeeklyData {
  week: string;
  contractedHours: number;
  actualHours: number;
  adjustmentHour: number;
}
export interface DailyData {
  day: string;
  contractedHours: number;
  actualHours: number;
  adjustmentHour: number;
}
