import httpClient from './httpClient';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';

type TGetWorklogsResponse = {
  success: boolean;
  data: any[];
  error: string;
};

export const FORMAT_TYPE = 'YYYY-MM-DD';

const WorklogService = {
  searchWorklogs: async (
    id: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<TGetWorklogsResponse> => {
    try {
      const { data } = await httpClient.post(`/worklogs/_search`, {
        createdBy: id,
        createdAt: {
          from: `${dayjs(dateFrom).format(FORMAT_TYPE)}T00:00:00`,
          to: `${dayjs(dateTo).format(FORMAT_TYPE)}T23:59:59`,
        },
      });

      return {
        data,
        success: true,
        error: '',
      };
    } catch (error: any) {
      return {
        data: [],
        success: false,
        error: `Error fetching worklogs: ${error.message} (${error.status})`,
      };
    }
  },
};

export default WorklogService;
