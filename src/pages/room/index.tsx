import React from 'react';
import { toast } from 'react-toastify';
import { UserDataContext } from '../../App';
import useWebSocket from 'react-use-websocket';
import SendIcon from '@mui/icons-material/Send';
import { SubmitHandler, useForm } from 'react-hook-form';
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

const generateAvatarColor = () => {
    const storedAvatarColor = localStorage.getItem('avatarColor');
    const avatarColor = storedAvatarColor ?? Math.random().toString(16).substr(-6);

    localStorage.setItem('avatarColor', avatarColor);
    
    return avatarColor;
};

export const ChatRoom = () => {
    const userDataContext = React.useContext(UserDataContext);
    const { lastMessage, sendJsonMessage } = useWebSocket('ws://localhost:8080');
    const [messageList, setMessageList] = React.useState<any[]>([]);
    const { register, handleSubmit, resetField } = useForm<ChatBoxInputs>();
    const [avatarColor, setAvatarColor] = React.useState(generateAvatarColor());

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

    const loadUsername = () => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername !== null) {
            userDataContext?.setUserData((prevUserData) => ({ ...prevUserData, username: storedUsername }));
        }
    }

    React.useEffect(() => {
        if (userDataContext?.userData.username.length === 0) {
            loadUsername();
        }

        if (lastMessage === null) {
            return;
        }
        
        const data = JSON.parse(lastMessage.data);

        if (data.type === ResponseMessageType.USER_CONNECTION) {
            const connectionMessage = `${data.username} has ${data.isConnect ? 'joined' : 'left'} the chat room!`;
            toast.info(connectionMessage);
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
                        <ListItemButton key="user1">
                            <ListItemIcon>
                                <Avatar>U1</Avatar>
                            </ListItemIcon>
                            <ListItemText primary="User 1"></ListItemText>
                        </ListItemButton>
                        <ListItemButton key="user2">
                            <ListItemIcon>
                                <Avatar>U2</Avatar>
                            </ListItemIcon>
                            <ListItemText primary="User 2"></ListItemText>
                        </ListItemButton>
                        <ListItemButton key="user3">
                            <ListItemIcon>
                                <Avatar>U3</Avatar>
                            </ListItemIcon>
                            <ListItemText primary="User 3"></ListItemText>
                        </ListItemButton>
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
                            <Grid xs={1}>
                                <Fab type="submit" color="primary" aria-label="add"><SendIcon /></Fab>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );

};