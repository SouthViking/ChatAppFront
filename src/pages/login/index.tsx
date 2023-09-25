import { toast } from 'react-toastify';
import React, { useContext } from 'react';
import useWebSocket from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ChatRoomContext, UserDataContext } from '../../App';
import { ResponseMessageType, ConnectionResponseMessage } from '../../types/messages';

interface LoginInputs {
    username: string;
}

export const LoginForm = () => {
    const navigate = useNavigate();
    const userDataContext = useContext(UserDataContext);
    const chatRoomDataContext = useContext(ChatRoomContext);
    const { sendJsonMessage, lastMessage } = useWebSocket('ws://localhost:8080');
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>();

    const onSubmit: SubmitHandler<LoginInputs> = (data) => { 
        userDataContext?.setUserData((previousData) =>  ({ ...previousData, username: data.username }));
        sendJsonMessage({ 
            isConnect: true,
            timestamp: Date.now(),
            userData: {
                username: data.username,
            },
            type: ResponseMessageType.CONNECTION,
        });
    };

    React.useEffect(() => {
        try {
            if (lastMessage === null) {
                return;
            }

            const data: ConnectionResponseMessage = JSON.parse(lastMessage.data);
            if (data.type !== ResponseMessageType.CONNECTION) {
                if (data.type !== ResponseMessageType.ERROR) {
                    return;
                }
                console.log(`Internal error: ${data.message}`);
                toast.error(`There has been an internal error during the name registration. Please try again later.`);
            }

            if (!data.success) {
                console.log(`Internal error: ${data.message}`);
                toast.error(`${data.message}`);
                return;
            }
            

            userDataContext?.setUserData(data.userData);
            chatRoomDataContext?.setChatRoomData((prevChatRoomDataContext) => ({ ...prevChatRoomDataContext, userList: data.userList }));

            navigate('/chat-room');

        } catch (err: unknown) {
            console.log(`Internal error: ${err}`);
            toast.error(`Ups! There has been an internal error.`);
        }

    }, [lastMessage, navigate]);


    return <>
        <h1>💬 Enter your name to join the chat room</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                sx={{ input: { color: 'white' } }}
                variant="filled"
                id="login-username-input"
                error= { errors.username ? true : false }
                helperText = { errors.username ? 'Please select a valid username.' : null }
                {...register('username', { required: true })}
            />
            <div style={{ marginTop: '20px' }}>
                <Button color="success" type="submit" variant="contained">Join</Button>
            </div>
        </form>
    </>;
};