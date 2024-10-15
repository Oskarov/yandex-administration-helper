import {performersReducer}    from "../slices/performers";
import {tasksReducer}         from "../slices/tasks";
import {appReducer}           from "../slices/app";
import {modalReducer}         from "../slices/modal";
import {trackerReducer}       from "../slices/tracker";
import {trackerNoMemoReducer} from "../slices/trackerNoMemo";

const reducer = {
    performers: performersReducer,
    tasks: tasksReducer,
    app: appReducer,
    modal: modalReducer,
    tracker: trackerReducer,
    trackerNoMemo: trackerNoMemoReducer
};
export default reducer;
