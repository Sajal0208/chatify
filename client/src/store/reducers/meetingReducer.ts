import * as meetingActions from "../actions/meetingActions";

export interface IMeetingState {
  username: string;
  activeUsers: TUser[];
  groupCallRooms: TRoom[];
}

const initState = {
  username: "",
  activeUsers: [],
  groupCallRooms: [],
};

const reducer = (state: IMeetingState = initState, action: any) => {
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
    case meetingActions.MEETING_SET_GROUP_CALL_ROOMS:
      return {
        ...state,
        groupCallRooms: action.groupCallRooms,
      }
    default:
      return state;
  }
};

export default reducer;
