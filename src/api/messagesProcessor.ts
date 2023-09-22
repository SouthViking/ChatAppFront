import { toast } from 'react-toastify';
import { NavigateFunction } from 'react-router-dom';
import { MessageType, ResponseMessage } from '../pages/types/messages';

export const processServerMessage = (messageEvent: MessageEvent<string> | null, navigate: NavigateFunction) => {
    try {
        if (messageEvent === null) {
            return;
        }

        const data = JSON.parse(messageEvent.data) as ResponseMessage;

        // TODO: Use the same enum used in the backend.
        switch (data.type) {
            case MessageType.CONNECTION:
                processConnectionResponse(data, navigate);
                break;
            case MessageType.TEXT:
                break;
            case MessageType.ERROR:
                break;
            case MessageType.NOTIFICATION:
                break;
            default:
                break;
        }

    } catch (error: unknown) {
        console.log(`There has been an internal error during the processing of server message. Error: ${error}`);
        toast.error(`Ups! There has been a communication error.`);
    }
};

const processConnectionResponse = (data: ResponseMessage, navigate: NavigateFunction) => {
    if (data.success) {
        navigate('/chat-room');
        return;
    }

    toast.error(data.message ?? 'Ups! There has been an internal error during the connection with the server.');
};