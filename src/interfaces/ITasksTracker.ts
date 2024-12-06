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

export enum TaskStatuses {
  ALL = 'Все',
  BACKLOG = 'Бэклог',
  IN_WORK = 'В работе',
  DONE = 'Готово',
  CANCELED = 'Отменено',
  PAUSED = 'Пауза',
}

export interface ITasksTrackerState {
  loading: boolean;
  error: string;
  query: string;
  tasks: TShortTask[];

  // key, name, project, sprint, create, createDate, performer, status
  sortField: TSortedTaskFields;
  sortDirecion: 'ASC' | 'DESC';

  // filter
  filterStatus: TaskStatuses;
  // filterStatus: TaskStatuses[];
  showOnlyUpdatedTasks: boolean;
}
