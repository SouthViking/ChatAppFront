import { toast } from 'react-toastify';
import { NavigateFunction } from 'react-router-dom';

export const processServerMessage = (messageEvent: MessageEvent<any> | null, navigate: NavigateFunction) => {
    try {
        if (messageEvent === null) {
            return;
        }

        const data = JSON.parse(messageEvent.data);

        // TODO: Use the same enum used in the backend.
        switch (data.type) {
            case 0:
                processConnectionResponse(data, navigate);
                break;
            default:
                break;
        }

    } catch (error: unknown) {
        console.log(`There has been an internal error during the processing of server message. Error: ${error}`);
        toast.error(`Ups! There has been a communication error.`);
    }
};

const processConnectionResponse = (data: Record<string, object>, navigate: NavigateFunction) => {
    data.success ? navigate('/chat-room') : toast.error('Ups! There has been an internal error during the connection with the server.');
};