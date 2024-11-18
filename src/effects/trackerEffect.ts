import { Dispatch } from 'redux';
import { addPerformer, editTaskForPerformer } from '../slices/performers';
import { generateRandomString } from '../utils/generateRandomString';
import QueueService from '../api/queue-service';
import { changeProjects, changeQueues } from '../slices/tracker';
import { IProjects, ITrackerQueueTask } from '../interfaces/ITracker';
import { store } from '../store/store';
import calculateHoursFromTrackerTack from '../utils/calculateHoursFromTrackerTack';
import CalculateTypeFromTrackerTack from '../utils/calculateTypeFromTrackerTack';
import {
  changeBoards,
  changeSprints,
  changeTasks,
  changeUsers,
} from '../slices/trackerNoMemo';
import SprintService from '../api/sprint-service';
import { setLoading } from '../slices/app';

export const getAllQueuesAction = () => {
  return async function (dispatch: Dispatch<any>) {
    const response = await QueueService.getAllQueues();
    if (response.success && response.data) {
      let result = [...response.data];
      console.log(response);

      // @ts-ignore
      console.log(response.headers['x-total-pages']);
      if (response.headers && response.headers['x-total-pages'] > 1) {
        const totalPages = response.headers['x-total-pages'];
        const getNewResult = async (page: number) => {
          setTimeout(async () => {
            const response = await QueueService.getAllQueues(page);
            if (response.data?.length) {
              result = [...result, ...response.data];
              if (page < totalPages) {
                await getNewResult(++page);
              } else {
                dispatch(changeQueues(result));
              }
            }
          }, 1000);
        };
        await getNewResult(2);
      } else {
        dispatch(changeQueues(result));
      }
    }
  };
};

export const getAllBoardsAction = () => {
  return async function (dispatch: Dispatch<any>) {
    const response = await QueueService.getAllBoards();
    if (response.success && response.data) {
      let result = [...response.data];

      if (response.headers && response.headers['x-total-pages'] > 1) {
        const totalPages = response.headers['x-total-pages'];
        const getNewResult = async (page: number) => {
          setTimeout(async () => {
            const response = await QueueService.getAllBoards(page);
            if (response.data?.length) {
              result = [...result, ...response.data];
              if (page < totalPages) {
                await getNewResult(++page);
              } else {
                dispatch(changeBoards(result));
              }
            }
          }, 1000);
        };
        await getNewResult(2);
      } else {
        dispatch(changeBoards(result));
      }
    }
  };
};

export const getAllTasksByQueueKey = (queueKey: string) => {
  return async function (dispatch: Dispatch<any>) {
    dispatch(setLoading('Загрузка очереди'));
    const response = await QueueService.getAllTasksByQueue(queueKey);
    if (response.success && response.data) {
      let result = [...response.data];

      if (response.headers && response.headers['x-total-pages'] > 1) {
        const totalPages = response.headers['x-total-pages'];
        const getNewResult = async (page: number) => {
          dispatch(
            setLoading(`Загрузка очереди. Страница ${page} из ${totalPages}`),
          );
          setTimeout(async () => {
            const response = await QueueService.getAllTasksByQueue(
              queueKey,
              page,
            );
            if (response.data?.length) {
              result = [...result, ...response.data];
              if (page < totalPages) {
                await getNewResult(++page);
              } else {
                dispatch(setTasksFromTracker(result));
                dispatch(setLoading(''));
              }
            }
          }, 1000);
        };
        await getNewResult(2);
      } else {
        dispatch(setTasksFromTracker(result));
        dispatch(setLoading(''));
      }
    }
  };
};

export const getAllTasksBySprintId = (
  id: number,
  forRemove: boolean,
  startUploading: boolean,
  saving: boolean,
) => {
  return async function (dispatch: Dispatch<any>) {
    dispatch(setLoading(`Загрузка спринта, получение задач.`));
    const response = await QueueService.getAllTasksBySprint(id);
    if (response.success && response.data) {
      let result = [...response.data];
      if (response.headers && response.headers['x-total-pages'] > 1) {
        const totalPages = response.headers['x-total-pages'];
        const getNewResult = async (page: number) => {
          dispatch(
            setLoading(
              `Загрузка спринта. Страница задач ${page} из ${totalPages}`,
            ),
          );
          setTimeout(async () => {
            const response = await QueueService.getAllTasksBySprint(id, page);
            if (response.data?.length) {
              result = [...result, ...response.data];
              if (page < totalPages) {
                await getNewResult(++page);
              } else {
                if (saving) {
                  dispatch(changeTasks(result));
                }
                if (forRemove) {
                  dispatch(removeSprintFromTasks(result, id, true));
                } else {
                  dispatch(setLoading(``));
                }
              }
            }
          }, 1000);
        };
        await getNewResult(2);
      } else {
        if (saving) {
          dispatch(changeTasks(result));
        }
        if (forRemove) {
          dispatch(removeSprintFromTasks(result, id, true));
        } else {
          dispatch(setLoading(``));
        }
      }
    }
  };
};

export const createTasksInSprint = (
  targetSprintId: number,
  performersData: { taskName: string; id: number }[],
  queueKey: string,
) => {
  return async function (dispatch: Dispatch<any>) {
    dispatch(setLoading(`Создание задач`));
    let tasksCount = performersData.length;
    performersData.forEach((task, idx) => {
      setTimeout(
        async () => {
          dispatch(setLoading(`Осталось создать задач: ${tasksCount - idx}`));
          const response = await SprintService.createTaskForSprint(
            task.id,
            task.taskName,
            targetSprintId,
            queueKey,
          );
          if (!response) {
            console.log('bad');
          }
          if (idx + 1 >= tasksCount) {
            dispatch(setLoading(``));
          }
        },
        1000 * idx + 1,
      );
    });
  };
};

export const removeSprintFromTasks = (
  tasks: ITrackerQueueTask[],
  sprintToRemoveId: number,
  startUploading: boolean,
) => {
  return async function (dispatch: Dispatch<any>) {
    let tasksCount = tasks.length;
    tasks.forEach((task, idx) => {
      setTimeout(
        async () => {
          dispatch(setLoading(`Очистка спринта. Осталось задач ${tasksCount}`));
          const response = await QueueService.changeTaskSprint(
            task.id,
            null,
            sprintToRemoveId,
          );
        },
        1000 * idx + 1,
      );
    });

    setTimeout(
      () => {
        if (startUploading) {
          dispatch(uploadSprint(sprintToRemoveId));
        } else {
          dispatch(setLoading(``));
        }
      },
      1000 * tasks.length + 5,
    );
  };
};

interface IUploadingTask {
  taskNumber: string;
  performerDisplay: string;
  performerId: number;
  taskId: string;
}

export const uploadSprint = (sprintId: number) => {
  return async function (dispatch: Dispatch<any>) {
    dispatch(setLoading(`Загрузка спринта`));
    let performers = store.getState().performers.items;
    let tasks: IUploadingTask[] = [];
    if (!!performers.length) {
      performers.forEach(performer => {
        performer.tasks.forEach(task => {
          if (
            task.trackerId &&
            performer.trackerDisplay &&
            performer.trackerId
          ) {
            tasks.push({
              taskNumber: task.number,
              performerDisplay: performer.trackerDisplay,
              performerId: performer.trackerId,
              taskId: task.trackerId,
            });
          }
        });
      });
    }

    let tasksCount = tasks.length;
    tasks.forEach((task, idx) => {
      setTimeout(
        async () => {
          dispatch(setLoading(`Осталось выгрузить задач: ${tasksCount - idx}`));
          const response = await SprintService.setTaskForTracker(
            task.performerId,
            task.taskId,
            sprintId,
          );
          if (!response) {
            console.log('bad');
          }
          if (idx + 1 >= tasksCount) {
            dispatch(setLoading(``));
          }
        },
        1000 * idx + 1,
      );
    });

    dispatch(setLoading(``));
  };
};

export const getAllSprintsByBoardId = (id: number) => {
  return async function (dispatch: Dispatch<any>) {
    const response = await QueueService.getAllSprintsByBoardId(id);
    if (response.success && response.data) {
      let result = [...response.data];

      if (response.headers && response.headers['x-total-pages'] > 1) {
        const totalPages = response.headers['x-total-pages'];
        const getNewResult = async (page: number) => {
          setTimeout(async () => {
            const response = await QueueService.getAllSprintsByBoardId(
              id,
              page,
            );
            if (response.data?.length) {
              result = [...result, ...response.data];
              if (page < totalPages) {
                await getNewResult(++page);
              } else {
                dispatch(changeSprints(result));
              }
            }
          }, 1000);
        };
        await getNewResult(2);
      } else {
        dispatch(changeSprints(result));
      }
    }
  };
};

export const setTasksFromTracker = (trackerTasks: ITrackerQueueTask[]) => {
  return async function (dispatch: Dispatch<any>) {
    const performers = store.getState().performers.items;
    const projects: IProjects = {};
    trackerTasks.forEach(trackerTask => {
      let pass = false;
      let taskFirstComponent = trackerTask.components?.length
        ? trackerTask.components[0].display
        : '';
      performers.forEach(performer => {
        performer.tasks.forEach(task => {
          if (task.number === trackerTask.key) {
            if (task.number === 'TMS-604') {
              console.log(trackerTask);
            }
            pass = true;
            dispatch(
              editTaskForPerformer({
                performerUuid: performer.uuid,
                task: {
                  uuid: task.uuid,
                  number: task.number,
                  trackerId: trackerTask.id,
                  name: trackerTask.summary,
                  project: trackerTask.project?.display || '',
                  capacity: trackerTask.originalEstimation
                    ? calculateHoursFromTrackerTack(
                        trackerTask.originalEstimation,
                      )
                    : task.capacity,
                  type: CalculateTypeFromTrackerTack(trackerTask.type.key),
                  component: taskFirstComponent,
                  hasEstimate: !!trackerTask.originalEstimation,
                  inSomeSprint:
                    !!trackerTask.sprint && !!trackerTask.sprint.length,
                  inSprintDisplay:
                    !!trackerTask.sprint && !!trackerTask.sprint.length
                      ? trackerTask.sprint[0].display
                      : '',
                  inSprintId:
                    !!trackerTask.sprint && !!trackerTask.sprint.length
                      ? trackerTask.sprint[0].id
                      : '',
                  infoSystem: !!trackerTask.infoSystem
                    ? trackerTask.infoSystem
                    : '',
                  informationAssets: !!trackerTask.informationAssets
                    ? trackerTask.informationAssets
                    : '',
                },
              }),
            );
          }
        });
      });
      if (
        !pass &&
        CalculateTypeFromTrackerTack(trackerTask.type.key) === 50 &&
        trackerTask.project?.display != 'Администрация'
      ) {
        const project = trackerTask.project?.id ? trackerTask.project?.id : '0';
        let projectTasks = projects[project]?.tasks || [];
        let projectOpen = projects[project]?.isOpen || true;
        projects[project] = {
          name: trackerTask.project?.display || 'Без проекта',
          isOpen: projectOpen,
          tasks: [
            ...projectTasks,
            {
              uuid: generateRandomString(10),
              number: trackerTask.key,
              name: trackerTask.summary,
              project: trackerTask.project?.display || '',
              capacity: trackerTask.originalEstimation
                ? calculateHoursFromTrackerTack(trackerTask.originalEstimation)
                : 1,
              type: CalculateTypeFromTrackerTack(trackerTask.type.key),
              component: taskFirstComponent,
              hasEstimate: !!trackerTask.originalEstimation,
              inSomeSprint: !!trackerTask.sprint && !!trackerTask.sprint.length,
              inSprintDisplay:
                !!trackerTask.sprint && !!trackerTask.sprint.length
                  ? trackerTask.sprint[0].display
                  : '',
              inSprintId:
                !!trackerTask.sprint && !!trackerTask.sprint.length
                  ? trackerTask.sprint[0].id
                  : '',
              infoSystem: !!trackerTask.infoSystem
                ? trackerTask.infoSystem
                : '',
              informationAssets: !!trackerTask.informationAssets
                ? trackerTask.informationAssets
                : '',
            },
          ],
        };
      }
    });
    dispatch(changeProjects(projects));
  };
};

export const getAllUsersAction = () => {
  return async function (dispatch: Dispatch<any>) {
    const response = await SprintService.getAllUsers();
    if (response.success && response.data) {
      let result = [...response.data];
      if (response.headers && response.headers['x-total-pages'] > 1) {
        const totalPages = response.headers['x-total-pages'];
        const getNewResult = async (page: number) => {
          setTimeout(async () => {
            const response = await SprintService.getAllUsers(page);
            if (response.data?.length) {
              result = [...result, ...response.data];
              if (page < totalPages) {
                await getNewResult(++page);
              } else {
                dispatch(changeUsers(result));
              }
            }
          }, 1000);
        };
        await getNewResult(2);
      } else {
        dispatch(changeUsers(result));
      }
    }
  };
};
