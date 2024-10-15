import {createSlice, PayloadAction}                              from '@reduxjs/toolkit';
import {IPerformerItem, IPerformersState, IPerformerTaskPayload} from "../interfaces/IPerformers";
import {ITask}                                                   from "../interfaces/ITask";
import {IProjects, ITrackerQueueImport, ITrackerState}           from "../interfaces/ITracker";

const initialState: ITrackerState = {
    queues: [],
    projects: {}
}

const trackerSlice = createSlice({
    name: 'tracker',
    initialState: initialState,
    reducers: {
        changeQueues: (state, {payload}: PayloadAction<ITrackerQueueImport[]>) => {
            return {
                ...state,
                queues: payload
            };
        },
        changeProjects: (state, {payload}: PayloadAction<IProjects>) => {
            return {
                ...state,
                projects: payload
            };
        },
        removeTaskFromProject: (state, {payload}: PayloadAction<{ projectId: string, taskUuid: string }>) => {
            return {
                ...state,
                projects: {
                    ...state.projects,
                    [payload.projectId]: {
                        ...state.projects[payload.projectId],
                        tasks: state.projects[payload.projectId].tasks.filter(i => i.uuid !== payload.taskUuid)
                    }

                }
            };
        },
        changeProjectOpenState: (state, {payload}: PayloadAction<{ projectId: string, isOpen: boolean }>) => {
            return {
                ...state,
                projects: {
                    ...state.projects,
                    [payload.projectId]: {
                        ...state.projects[payload.projectId],
                        isOpen: payload.isOpen
                    }
                }
            };
        },
        changeAllProjectsOpenState: (state, {payload}: PayloadAction<boolean>) => {
            function updateIsOpen(project: IProjects, isOpenState: boolean) {
                const updatedProject: IProjects = {};

                for (let key in project) {
                    updatedProject[key] = {...project[key], isOpen: isOpenState};
                }

                return updatedProject;
            }

            return {
                ...state,
                projects: updateIsOpen(state.projects, payload)
            };
        },
    }
})

export const trackerReducer = trackerSlice.reducer;
export const {
    changeQueues,
    changeProjects,
    removeTaskFromProject,
    changeProjectOpenState,
    changeAllProjectsOpenState
} = trackerSlice.actions;
