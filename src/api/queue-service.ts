import httpClient from './httpClient';
import {
  ITrackerBoard,
  ITrackerHeaders,
  ITrackerQueueImport,
  ITrackerQueueTask,
  ITrackerSprint,
} from '../interfaces/ITracker';

const QueueService = {
  getAllQueues: async (
    page?: number,
  ): Promise<{
    success: boolean;
    data?: ITrackerQueueImport[];
    headers?: ITrackerHeaders;
  }> => {
    try {
      const { status, data, headers } = await httpClient.get(`/queues/`, {
        params: { page: !!page ? page : 1 },
      });

      return {
        success: true,
        data: data,
        headers,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  },
  getAllTasksByQueue: async (
    key: string,
    page?: number,
  ): Promise<{
    success: boolean;
    data?: ITrackerQueueTask[];
    headers?: ITrackerHeaders;
  }> => {
    try {
      const { status, data, headers } = await httpClient.post(
        `/issues/_search`,
        {
          query: `Queue: ${key} Status: open "Sort by": Updated DESC`,
        },
        {
          params: {
            page: !!page ? page : 1,
            expand: 'workflow',
          },
        },
      );

      return {
        success: true,
        data: data,
        headers,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  },
  getAllTasksBySprint: async (
    id: number,
    page?: number,
  ): Promise<{
    success: boolean;
    data?: ITrackerQueueTask[];
    headers?: ITrackerHeaders;
  }> => {
    try {
      const { status, data, headers } = await httpClient.post(
        `/issues/_search`,
        {
          query: `Sprint: ${id} "Sort by": Updated DESC`,
        },
        {
          params: {
            page: !!page ? page : 1,
            expand: 'workflow',
          },
        },
      );

      return {
        success: true,
        data: data,
        headers,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  },
  getTaskByKey: async (
    key: string,
  ): Promise<{ success: boolean; data?: ITrackerQueueTask; error: any }> => {
    try {
      const { data } = await httpClient.get(`/issues/${key}`);

      return {
        success: true,
        data: data,
        error: null,
      };
    } catch (e) {
      return {
        success: false,
        error: e,
      };
    }
  },
  getAllBoards: async (
    page?: number,
  ): Promise<{
    success: boolean;
    data?: ITrackerBoard[];
    headers?: ITrackerHeaders;
  }> => {
    try {
      const { status, data, headers } = await httpClient.get(`/boards/`, {
        params: { page: !!page ? page : 1 },
      });

      return {
        success: true,
        data: data,
        headers,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  },
  getAllSprintsByBoardId: async (
    boardId: number,
    page?: number,
  ): Promise<{
    success: boolean;
    data?: ITrackerSprint[];
    headers?: ITrackerHeaders;
  }> => {
    try {
      const { status, data, headers } = await httpClient.get(
        `/boards/${boardId}/sprints`,
        { params: { page: !!page ? page : 1, archived: false } },
      );

      return {
        success: true,
        data: data,
        headers,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  },
  changeTaskSprint: async (
    key: string,
    sprintToAdd: number | null,
    sprintToRemove: number | null,
  ): Promise<{ success: boolean }> => {
    try {
      const { status, data, headers } = await httpClient.patch(
        `/issues/${key}`,
        {
          /*   sprint: !!sprintId ? `[{"id":"${sprintId}"}]` : null*/
          sprint: {
            add: !!sprintToAdd ? [sprintToAdd] : [],
            remove: !!sprintToRemove ? [sprintToRemove] : [],
          },
        },
      );

      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  },
};
export default QueueService;
