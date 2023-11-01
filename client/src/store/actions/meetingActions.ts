import { TUser } from "../../types/users"

export const MEETING_SET_USERNAME = 'MEETING.SET_USERNAME'
export const MEETING_SET_ACTIVE_USERS = 'MEETING.SET_ACTIVE_USERS'

export const setUsername = (username: string) => {
    return {
        type: MEETING_SET_USERNAME,
        username,
    }
}

export const setActiveUsers = (activeUsers: TUser[]) => {
    return {
        type: MEETING_SET_ACTIVE_USERS,
        activeUsers,
    }
}