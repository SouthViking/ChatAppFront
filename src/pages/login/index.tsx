import React from 'react';
import { UserDataContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

interface LoginInputs {
    username: string;
}

export const LoginForm = () => {
    const navigate = useNavigate();
    const userDataContext = React.useContext(UserDataContext);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>();

    const onSubmit: SubmitHandler<LoginInputs> = (data) => {
        userDataContext?.setUserData((previousData) =>  ({ ...previousData, username: data.username }));
        
        navigate('/chat-room');
    };

    return <>
        <h1>💬 Enter your name to join the chat room</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                sx={{ input: { color: 'white' } }}
                variant="filled"
                id="login-username-input"
                error= { errors.username ? true : false }
                helperText = { errors.username ? 'Please select a valid username' : null }
                {...register('username', { required: true })}
            />
            <div style={{ marginTop: '20px' }}>
                <Button color="success" type="submit" variant="contained">Join</Button>
            </div>
        </form>
    </>;
};