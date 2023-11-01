import { AnyAction } from "redux";
import * as meetingActions from "../actions/meetingActions";

// interface MeetingAction extends AnyAction {
//   username: string;
//   activeUsers: User[];
// }

const initState = {
  username: "",
  activeUsers: [],
};

const reducer = (state = initState, action: any) => {
  switch (action.type) {
    case meetingActions.MEETING_SET_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    case meetingActions.MEETING_SET_ACTIVE_USERS:
      return {
        ...state,
        activeUsers: action.activeUsers,
      };
    default:
      return state;
  }
};

export default reducer;
