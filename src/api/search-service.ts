import httpClient from './httpClient';

// TODO: data typisation
type TSearchWorklogsResponse = {
  success: boolean;
  data: any[] | null;
  error: any;
};

type TSearchTasksResponse = {
  success: boolean;
  data: any[] | null;
  error: any;
};

export const FORMAT_TYPE = 'YYYY-MM-DD';

const SearchService = {
  // searchWorklogs
  searchWorklogs: async (
    id: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<TSearchWorklogsResponse> => {
    try {
      const { data } = await httpClient.post(`/worklog/_search`, {
        createdBy: id,
        createdAt: { from: dateFrom, to: dateTo },
      });

      return {
        data,
        success: true,
        error: '',
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        error: `Error fetching worklogs: ${error.message} (${error.status})`,
      };
    }
  },

  // searchingTasks
  searchTasks: async (tasksKeys: string[]): Promise<TSearchTasksResponse> => {
    try {
      const { data } = await httpClient.post(`/issues/_search`, {
        keys: tasksKeys,
      });

      return {
        data,
        success: true,
        error: '',
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        error: `Error searching tasks: ${error.message} (${error.status})`,
      };
    }
  },
};

export default SearchService;
