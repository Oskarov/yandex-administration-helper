import {ITask} from "./ITask";

export interface ITrackerQueueImport {
    id: number,
    key: string,
    name: string,
    description: string
}

export interface ITrackerQueueTask {
    pass?: boolean,
    id: string,
    key: string,
    summary: string,
    statusType: {
        value: string,
    },
    description: string,
    type: {
        id: string,
        key: string,
        display: string
    },
    priority: {
        key: string,
        display: string,
    }
    status: {
        key: string,
        display: string,
    }
    components?: {
        id: string,
        display: string
    }[],
    informationAssets?: string,
    infoSystem?: string,
    project?: {
        id: string,
        display: string
    },
    originalEstimation?: string,
    assignee?: {
        id: number,
        display: string
    }
    sprint: {
      display:string,
      id: string,
    }[],
    spent? : string
}

export interface IProjects {
    [id: string]: {
        name: string,
        isOpen: boolean,
        tasks: ITask[]
    }
}

export interface ITrackerBoard {
    id: number,
    version: number,
    name: string,
}

export interface ITrackerSprint {
    id: number,
    version: number,
    name: string,
    status: string,
    archived: string,
    createdBy: {
        id: number,
        display: string
    }
}

export interface ITrackerUser {
    uid: number,
    login: string,
    trackerUid: number,
    passportUid: number,
    firstName: string,
    lastName: string,
    display: string,
    email: string,
}

export interface ITrackerHeaders {
    "X-Total-Count": number
    "x-total-pages": number
}

export interface ITrackerState {
    queues: ITrackerQueueImport[],
    projects: IProjects
}

export interface ITrackerNoMemoState {
    boards: ITrackerBoard[],
    sprints: ITrackerSprint[],
    users: ITrackerUser[],
    tasksForTime: ITrackerQueueTask[]
}