import { ServerUserData } from './user';

export interface UserData {
    username: string;
    avatar?: {
        hexColor: string;
    }
}

export interface UserDataContextProvider {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export interface ChatRoomData {
    userList: ServerUserData[];
}

export interface ChatRoomContextProvider {
    chatRoomData: ChatRoomData;
    setChatRoomData: React.Dispatch<React.SetStateAction<ChatRoomData>>;
}