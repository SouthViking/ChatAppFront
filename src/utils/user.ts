import { UserDataContextProvider } from "../types/context";

const USERNAME_LOCAL_KEY = 'username';
const AVATAR_COLOR_LOCAL_KEY = 'avatarColor';

export const isIncompleteUserDataContext = (userDataContext: UserDataContextProvider) => {
    return userDataContext.userData.username.length === 0 || userDataContext.userData.avatarColor === undefined;
};

export const isUserDataAvailable = () => {
    return !(localStorage.getItem(USERNAME_LOCAL_KEY) === null || localStorage.getItem(AVATAR_COLOR_LOCAL_KEY) === null);
};

export const loadUserDataFromStorage = (userDataContext: UserDataContextProvider) => {
    if (!isUserDataAvailable()) {
        return;
    }

    userDataContext.setUserData({ username: localStorage.getItem(USERNAME_LOCAL_KEY)!, avatarColor: localStorage.getItem(AVATAR_COLOR_LOCAL_KEY)! });
};