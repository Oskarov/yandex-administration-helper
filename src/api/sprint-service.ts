import httpClient                      from "./httpClient";
import {ITrackerHeaders, ITrackerUser} from "../interfaces/ITracker";

const SprintService = {
    getAllUsers: async (page?: number): Promise<{ success: boolean, data?: ITrackerUser[], headers?: ITrackerHeaders }> => {
        try {
            const {status, data, headers} = await httpClient.get(`/users/`, {params: {page: !!page ? page : 1}});

            return {
                success: true,
                data: data,
                headers
            }
        } catch (e) {
            return {
                success: false
            }
        }
    },
    setTaskForTracker: async ( performerId: number, taskId: string, sprintId: number): Promise<{ success: boolean }> => {
        try {
            const {status, data, headers} = await httpClient.patch(`/issues/${taskId}`,
                {
                    sprint: {
                        "add": [sprintId]
                    },
                    assignee: performerId
                },);

            return {
                success: true
            }
        } catch (e) {
            return {
                success: false
            }
        }
    },
    createTaskForSprint: async (performerId: number, taskName: string, sprintId: number, queueKey:string): Promise<{ success: boolean }> => {
        try {
            const {status, data, headers} = await httpClient.post(`/issues/`,
                {
                    summary: taskName,
                    sprint: [sprintId],
                    assignee: performerId,
                    queue: queueKey,
                    type: "organizational"
                },);

            return {
                success: true
            }
        } catch (e) {
            return {
                success: false
            }
        }
    }
}




export default SprintService;
