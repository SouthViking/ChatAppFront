import { toast } from 'react-toastify';
import React, { useContext } from 'react';
import { UserDataContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ResponseMessageType, ResponseMessage } from '../../types/messages';
import { generateRandomHexColor, isIncompleteUserDataContext, isUserDataAvailable, loadUserDataFromStorage } from '../../utils';

interface LoginInputs {
    username: string;
}

export const LoginForm = () => {
    const navigate = useNavigate();
    const userDataContext = useContext(UserDataContext);

    const { sendJsonMessage, lastMessage } = useWebSocket('ws://localhost:8080');
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>();

    const onSubmit: SubmitHandler<LoginInputs> = (data) => { 
        userDataContext?.setUserData((previousData) =>  ({ ...previousData, username: data.username }));
        sendJsonMessage({ 
            isConnect: true,
            timestamp: Date.now(),
            username: data.username,
            type: ResponseMessageType.CONNECTION,
        });
    };

    React.useEffect(() => {
        try {
            if (isIncompleteUserDataContext(userDataContext!) && isUserDataAvailable()) {
                loadUserDataFromStorage(userDataContext!);
                return navigate('/chat-room');
            }

            if (lastMessage === null) {
                return;
            }

            const data: ResponseMessage = JSON.parse(lastMessage.data);
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

            localStorage.setItem('username', userDataContext!.userData.username);
            const assignedAvatarColor = generateRandomHexColor();
            userDataContext?.setUserData((prevUserData) => ({ ...prevUserData, avatarColor: assignedAvatarColor }));
            localStorage.setItem('avatarColor', assignedAvatarColor);

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