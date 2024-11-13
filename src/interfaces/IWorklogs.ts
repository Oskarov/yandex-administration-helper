import { Dayjs } from 'dayjs';

// данные о задаче внутри поля worklogs
export type TWorklogTaskData = {
  code: string;
  name: string;
  link: string;
  comment: string;
  createdAt: string;
  duration: number;
};

// данные о задаче внутри поля tasksData
export type TTaskData = {
  key: string;
  type: string;
  name: string;
  assignee: string;
  status: string;
  totalDuration: number;
  createdAt: string;
  createdBy: string;
  originalEstimation: string;
  priority: string;
};

export type TPerformetOption = {
  label: string;
  key: number;
};

export type TState = {
  loading: boolean;
  errors: string[];
  filters: {
    performers: TPerformetOption[];
    dateFrom: Dayjs | null;
    dateTo: Dayjs | null;
  };
  worklogs: Record<string, Record<string, TWorklogTaskData[]>> | null;
  tasksData: Record<string, TTaskData | null> | null;
  foundTasks: string[];
};
