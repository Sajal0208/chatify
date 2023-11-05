import { Box } from "@chakra-ui/react";
import * as webRTCGroupCallHandler from '../utils/webRTC/webRTCGroupCallHandler';
import { TGroupCallRoomsListItemProps } from "./GroupCallRoomsList";

export const GroupCallRoomsListItem = (props: TGroupCallRoomsListItemProps) => {
    const { room } = props;

    const onClickHandler = () => {
        webRTCGroupCallHandler.joinGroupCall(room.socketId, room.roomId);
    };

    return (
        <Box onClick={onClickHandler}>
            <span>{room.roomId}</span>
            <span>{room.hostName}</span>
        </Box>
    );
};
