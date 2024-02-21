import { createSlice } from "@reduxjs/toolkit";

export const generateFileToUrl = (file, type = "application/octet-stream") => {
    const blob = new Blob([new Uint8Array(file)], {type});

    return URL.createObjectURL(blob);
}
export const authSlice = createSlice ({
    name: 'auth',
    initialState: { user: null},
    reducers: {
        updateAuthUser: (state, action) => {
            const user = action.payload;
            let avatar = user.avatar;
            try {
                avatar = JSON.parse(user.avatar)

                if (typeof avatar === 'object') {
                    avatar = generateFileToUrl(avatar.value.data)
                }
            } catch (e) {
                avatar = user.avatar;
            }
            return Object.assign({}, state, {
                user: {...user, avatarURL: avatar},
            })
        }
    }
})
export const {updateAuthUser} = authSlice.actions;
export default authSlice.reducer;