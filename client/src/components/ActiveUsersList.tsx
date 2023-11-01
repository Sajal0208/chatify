import { Box } from '@chakra-ui/react'
import React from 'react'
import { connect } from 'react-redux'
import { callToOtherUser } from '../utils/webRTC/webRTCHandler'
import { TUser } from '../types/users'
import { callStates } from '../store/actions/callActions'

const ActiveUsersList = ({ activeUsers, callState }: {
    activeUsers: TUser[]
    callState: string
}) => {
    console.log(activeUsers)

    return (
        <div>
            {activeUsers && activeUsers.map((activeUser) => {
                return (
                    <ActiveUsersListItem callState={callState} key={activeUser.socketId} activeUser={activeUser} />
                )
            })}
        </div>
    )
}

const mapStateToProps = (store: any) => {
    return {
        activeUsers: store.meeting.activeUsers,
        callState: store.call.callState
    }
}

const ActiveUsersListItem = ({ activeUser, callState }: {
    activeUser: TUser
    callState: string
}) => {

    const onListItemClick = () => {
        if (callState === callStates.CALL_AVAILABLE) {
            callToOtherUser(activeUser);
        }
    }

    return (
        <Box className="p-4 hover:bg-white hover:text-black hover:cursor-pointer" onClick={onListItemClick}>
            {activeUser.username}
        </Box>
    )
}

export default connect(mapStateToProps)(ActiveUsersList);


