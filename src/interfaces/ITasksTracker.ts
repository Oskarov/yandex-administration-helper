import { TShortTask } from './ITask';

export type TShortTaskFields = keyof TShortTask;

export interface ITasksTrackerState {
  loading: boolean;
  error: string;
  query: string;
  tasks: TShortTask[];

  // key, name, project, sprint, create, createDate, performer, status
  sortField: TShortTaskFields;
  sortDirecion: 'ASC' | 'DESC';
}
