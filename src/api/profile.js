import funnyFaceAxios from "../axios/axios";
const baseRoute = 'profile/'
const user = JSON.parse(window.localStorage.getItem('user-info'))
const token = user?.token
const userId = user?.id_user

const profileApi = {
    show: (data) => {
        return funnyFaceAxios.get(baseRoute, data, {
            headers:{
                Authorization: `Bearer ${token}`,
            } 
        });
    },
    postAvatar: (data) => {
        return funnyFaceAxios.post(`changeavatar/${userId}`, {
            headers:{
                Authorization: `Bearer ${token}`,
            } 
        });
    }
}

export default profileApi;