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
  BACKLOG = 'Беклог',
  IN_WORK = 'В работе',
  DONE = 'Готово',
  CANCELED = 'Отменено',
  PAUSED = 'Пауза',
}

export interface ITrackerTaskType{
  id: number
  display: string
  key: string
}


export const TrackerTaskTypes: ITrackerTaskType[] = [
  {
    "id": 32,
    "display": "Аналитика",
    "key": "analytics"
  },
  {
    "id": 35,
    "display": "Тестирование",
    "key": "testing"
  },
  {
    "id": 126,
    "display": "Организационная",
    "key": "organizational"
  },
  {
    "id": 118,
    "display": "Разработка",
    "key": "development"
  },
  {
    "id": 111,
    "display": "Код ревью",
    "key": "codeReview"
  },
  {
    "id": 1,
    "display": "Ошибка",
    "key": "bug"
  }
]

export interface ITasksTrackerState {
  loading: boolean;
  error: string;
  query: string;
  tasks: TShortTask[];

  // key, name, project, sprint, create, createDate, performer, status
  sortField: TSortedTaskFields;
  sortDirecion: 'ASC' | 'DESC';
  sortedTasks: string[];

  // filter
  filterStatus: TaskStatuses;
  showOnlyUpdatedTasks: boolean;

  // select
  selectedTasks: string[];
  selectAllTasks: boolean;
}
