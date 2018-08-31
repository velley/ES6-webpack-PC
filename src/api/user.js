import request from 'utils/axios'

export default {
    login(data) {
        return request('/user/login.do','post',data)
    },
    logOut() {
        return request('/user/logout.do','post')
    },
    checkLogin() {
        return request('/user/get_user_info.do','post')
    }
}