
export interface UserData {
    username: string;
    avatarColor?: string;
}

export interface UserDataContextProvider {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}