import React from 'react';
import { useNavigate } from 'react-router-dom'
import useWebSocket from 'react-use-websocket';
import { Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { processServerMessage } from '../api/messagesProcessor';

interface LoginInputs {
    username: string;
}

const WEBSOCKET_URL = 'ws://localhost:8080';

export default function LoginForm () {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>();
    const { sendJsonMessage, lastMessage } = useWebSocket(WEBSOCKET_URL, {
        onOpen: () => {
            console.log('Websocket connection has been established.');
        },
    });

    const onSubmit: SubmitHandler<LoginInputs> = (data) => { 
        sendJsonMessage({ 
            timestamp: Date.now(),
            type: 0,
            username: data.username,
         });
    };

    React.useEffect(() => {
        processServerMessage(lastMessage, navigate);
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
    </>
}