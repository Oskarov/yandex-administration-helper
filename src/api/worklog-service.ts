import httpClient from './httpClient';
import dayjs from 'dayjs';

type TGetWorklogsResponse = {
  success: boolean;
  data: any[] | null;
  error: any;
};

export const FORMAT_TYPE = 'YYYY-MM-DD';

const WorklogService = {
  searchWorklogs: async (
    id: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<TGetWorklogsResponse> => {
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
};

export default WorklogService;
