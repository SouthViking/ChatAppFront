
export interface UserData {
    username: string;
}

export interface UserDataContextProvider {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}