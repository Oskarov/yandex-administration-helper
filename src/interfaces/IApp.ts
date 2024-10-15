import {ReactComponent}      from "*.svg";
import {ITrackerQueueImport} from "./ITracker";

export interface IAppState {
    rowSize: number,
    sprintSize: number,
    valueOfDivision: number,
    lastQueue: ITrackerQueueImport | null
    loadingText: string,
    taskLighting:boolean,
    sprintLighting:boolean
}

export interface IConfirmation {
    isOpen: boolean,
    confirmationFunction: () => void,
    dialogType?: 'positive' | 'negative',
    dialogText?: string
}

export interface IInformation {
    isOpen: boolean,
    modalTitle?: string
    modalText?: any
    closeButton?: boolean
}
