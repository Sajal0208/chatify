import { RootState } from "../store/store";
import { IMeetingState } from "../store/reducers/meetingReducer";
import { connect } from "react-redux";
import { GroupCallRoomsListItem } from "./GroupCallRoomsListItem";

interface TGroupCallRoomsListProps extends IMeetingState {

}

const GroupCallRoomsList = (props: TGroupCallRoomsListProps) => {
    const { groupCallRooms } = props;

    return (
        <>
            {
                groupCallRooms.map((room: TRoom) => {
                    const { roomId } = room;
                    return (
                        <GroupCallRoomsListItem key={roomId} room={room} />
                    )
                })
            }
        </>
    )
}

export type TGroupCallRoomsListItemProps = {
    room: TRoom;
}

const mapStateToProps = (store: RootState) => {
    const meeting = store.meeting
    return {
        ...meeting
    }
}

export default connect(mapStateToProps)(GroupCallRoomsList);