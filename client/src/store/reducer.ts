import { combineReducers } from "redux";
import meetingReducer from "./reducers/meetingReducer";
import callReducer from "./reducers/callReducer";

export default combineReducers({
    meeting: meetingReducer,
    call: callReducer,
})