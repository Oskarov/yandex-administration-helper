export interface ITask {
    uuid: string,
    trackerId?: string
    name: string,
    number: string,
    capacity: number,
    type: number,
    project: string,
    component: string,
    hasEstimate: boolean,
    inSomeSprint: boolean,
    inSprintDisplay?: string,
    inSprintId?: string,
    infoSystem?: string,
    informationAssets?: string
}

export interface ITasksState {
    items: ITask[],
    directTasks: ITask[],
}

export const TASK_TYPES_ENUM = {
    REVIEW: 10,
    MEETINGS: 20,
    VACATION: 30,
    HOLLYDAYS: 40,
    DEV_TASK: 50,
    TESTING: 60,
    ANALYTICS: 70,
    DEPLOY: 80,
    OTHER: 90
}


export const taskTypes = [
    {
        id: 1,
        name: 'Код Ревью',
        type: TASK_TYPES_ENUM.REVIEW
    },
    {
        id: 2,
        name: 'Встречи',
        type: TASK_TYPES_ENUM.MEETINGS
    },
    {
        id: 3,
        name: 'Разработка',
        type: TASK_TYPES_ENUM.DEV_TASK
    },
    {
        id: 4,
        name: 'Тестирование',
        type: TASK_TYPES_ENUM.TESTING
    },
    {
        id: 5,
        name: 'Аналитика',
        type: TASK_TYPES_ENUM.ANALYTICS
    },
    {
        id: 6,
        name: 'Деплой',
        type: TASK_TYPES_ENUM.DEPLOY
    },
    {
        id: 7,
        name: 'Другое',
        type: TASK_TYPES_ENUM.OTHER
    }
];

export const projectsList = [
    {
        id: 10,
        name: 'TMS',
        color: '#172f70'
    },
    {
        id: 20,
        name: 'STK',
        color: '#177026'
    },
    {
        id: 30,
        name: 'STOR',
        color: '#70172f'
    },
    {
        id: 40,
        name: 'PP',
        color: '#705417'
    },
    {
        id: 50,
        name: 'GA',
        color: '#ff8132'
    },
    {
        id: 60,
        name: 'COM',
        color: '#fcd94b'
    }
]
