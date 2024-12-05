import { TShortTask } from './ITask';

export type TSortedTaskFields =
  | 'key'
  | 'summary'
  | 'projectName'
  | 'sprintsList'
  | 'createdBy'
  | 'createdAt'
  | 'assignee'
  | 'status';

export interface ITasksTrackerState {
  loading: boolean;
  error: string;
  query: string;
  tasks: TShortTask[];

  // key, name, project, sprint, create, createDate, performer, status
  sortField: TSortedTaskFields;
  sortDirecion: 'ASC' | 'DESC';
}
