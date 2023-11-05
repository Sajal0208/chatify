import React from 'react'
import { ICallState } from '../store/reducers/callReducer'
import { connect } from 'react-redux'
import GroupCallButton from './GroupCallButton'
import { callStates, setLocalCameraEnabled, setLocalMicrophoneEnabled } from '../store/actions/callActions'
import * as webRTCGroupCallHandler from '../utils/webRTC/webRTCGroupCallHandler'
import GroupCallRoom from './GroupCallRoom'

const GroupCall = (props: any) => {
    const { callState, localStream, groupCallActive, groupCallStreams } = props;

    const createRoom = () => {
        webRTCGroupCallHandler.createNewGroupCall();
    }

    const leaveRoom = () => {
        webRTCGroupCallHandler.leaveGroupCall();
    }

    console.log(groupCallActive)
    console.log(callState)

    return (
        <div>
            {!groupCallActive && localStream && callState !== callStates.CALL_IN_PROGRESS && <GroupCallButton onClickHandler={createRoom} label={"Create Room"} />}
            {groupCallActive && <GroupCallRoom {...props} />}
            {groupCallActive && <GroupCallButton onClickHandler={leaveRoom} label={"Leave Room"} />}
        </div>
    )
}

const mapStateToProps = ({ call }: {
    call: ICallState
}) => {
    return {
        ...call
    }
}

const mapActionsToProps = (dispatch: any) => {
    return {
        setCameraEnabled: (enabled: boolean) => dispatch(setLocalCameraEnabled(enabled)),
        setMicrophoneEnabled: (enabled: boolean) => dispatch(setLocalMicrophoneEnabled(enabled))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(GroupCall);