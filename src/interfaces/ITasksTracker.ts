import { TFullTask } from './ITask';

export interface ITasksTrackerState {
  loading: boolean;
  error: string;
  query: string;
  tasks: Record<string, TFullTask>;
}
