import React from 'react';
import { toast } from 'react-toastify';
import useWebSocket from 'react-use-websocket';
import SendIcon from '@mui/icons-material/Send';
import { ServerUserData } from '../../types/user';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ChatRoomContext, UserDataContext } from '../../App';
import { ResponseMessageType, UserMessageType } from '../../types/messages';
import { 
    Grid,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    Avatar,
    ListItemText,
    Divider,
    TextField,
    Fab,
    ListItemButton,
    Chip,
    Stack,
} from '@mui/material';

interface ChatBoxInputs {
    message: string;
}

const styles: Record<string, React.CSSProperties> = {
    chatSection: {
        width: '60vw',
        height: '80vh'
    },
    border: {
        borderRight: '1px solid #e0e0e0',
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    },
};

export const ChatRoom = () => {
    const firstLoad = React.useRef(true);
    const userDataContext = React.useContext(UserDataContext);
    const chatRoomDataContext = React.useContext(ChatRoomContext);
    const [ messageList, setMessageList ] = React.useState<any[]>([]);
    const { register, handleSubmit, resetField } = useForm<ChatBoxInputs>();
    const [ avatarColor, setAvatarColor ] = React.useState<string | null>(null);
    const { lastMessage, sendJsonMessage } = useWebSocket('ws://localhost:8080');


    const onSubmit: SubmitHandler<ChatBoxInputs> = (data) => {
        const messageToSend = {
            type: UserMessageType.TEXT,
            timestamp: Date.now(),
            username: userDataContext?.userData.username ?? 'Unknown',
            text: data.message,
            sentAt: Date.now()
        };

        sendJsonMessage({
            type: UserMessageType.TEXT,
            timestamp: Date.now(),
            username: userDataContext?.userData.username ?? 'Unknown',
            text: data.message,
            sentAt: Date.now(),
        });

        setMessageList((previousMessageList) => ([...previousMessageList, {
            from: messageToSend.username,
            type: messageToSend.type,
            sentAt: messageToSend.sentAt,
            text: messageToSend.text,
        }]));

        resetField('message');
    };

    const updateChatRoomUserList = (currentUserList: ServerUserData[]) => {
        chatRoomDataContext?.setChatRoomData((prevChatRoomData) => {
            return {
                ...prevChatRoomData,
                userList: currentUserList.filter(userData => userData.username !== userDataContext?.userData.username),
            };
        });
    };

    React.useEffect(() => {
        if (firstLoad.current && userDataContext) {
            sendJsonMessage({
                isConnect: true,
                userData: {
                    username: userDataContext.userData.username
                },
                type: ResponseMessageType.CONNECTION,
            });

            firstLoad.current = false;
        }

        if (lastMessage === null) {
            return;
        }
        
        const data = JSON.parse(lastMessage.data);

        if (data.type === ResponseMessageType.USER_CONNECTION) {
            updateChatRoomUserList(data.userList);

            toast.info(`${data.username} has ${data.isConnect ? 'joined' : 'left'} the chat room!`);
    
        } else if (data.type === ResponseMessageType.CONNECTION) {
            updateChatRoomUserList(data.userList);

            userDataContext?.setUserData(data.userData);
            setAvatarColor(data.userData.avatar?.hexColor);
        
        } else if (data.type === ResponseMessageType.USER_TEXT) {
            setMessageList((previousMessageList) => [...previousMessageList, data]);
        }

    }, [lastMessage]);

    return (
        <div>
            <Grid container>
                <Grid item xs={12} >
                    <Typography variant="h4" className="header-message" style={{ marginBottom: 20 }}>💬 Chat App</Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper} style={styles.chatSection}>
                <Grid item xs={3} style={styles.border}>
                    <List>
                        <ListItemButton key="user-profile">
                            <ListItemIcon>
                            <Avatar sx={{ backgroundColor: `#${avatarColor}` }}>{userDataContext?.userData.username[0] ?? '?'}</Avatar>
                            </ListItemIcon>
                            <ListItemText primary={userDataContext?.userData.username ?? 'User'}></ListItemText>
                        </ListItemButton>
                    </List>
                    <Divider />
                    <List>
                        { (chatRoomDataContext?.chatRoomData.userList ?? []).map(currentUser => {
                            return <ListItemButton key={`list-item-button-${currentUser.username}`}>
                            <ListItemIcon>
                                <Avatar sx={{ backgroundColor: `#${currentUser.avatar?.hexColor}` }}>{currentUser.username[0]}</Avatar>
                            </ListItemIcon>
                            <ListItemText primary={currentUser.username}></ListItemText>
                        </ListItemButton>
                        }) }
                    </List>
                </Grid>
                <Grid item xs={9}>
                    <List style={styles.messageArea}>

                        { messageList.map(message => {
                            return <ListItem key={`message-${message.timestamp}`}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1}>
                                            <Chip avatar={<Avatar>{message.from[0]}</Avatar>} label={message.from} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} style={{ marginTop: 10, paddingLeft: 15 }}>
                                        <Chip label={message.text} />
                                    </Grid>
                                    <Grid item xs={12} style={{ paddingLeft: 15 }}>
                                        <ListItemText secondary={new Date(message.sentAt).toUTCString()}></ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        }) }

                    </List>
                    <Divider />
                    <Grid container style={{padding: '20px'}}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid item xs={11}>
                                    <TextField {...register('message', { required: true })} variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={1}>
                                <Fab type="submit" color="primary" aria-label="add"><SendIcon /></Fab>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );

};