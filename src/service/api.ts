import Vue from 'vue';
import ajax from './ajax';

export function authorize(): Promise<any> {
    return ajax({
        url: '/authorize',
    });
}

export async function authorizeBeforeLoad(app: Vue) {
    try {
        const res = await authorize();
        const { data } = res;
        if (data.status === 200) {
            app.$store.commit('updateInfo', {
                username: data.username,
                avatar: data.avatar,
            });
        } else {
            app.$router.push('/');
        }
    } catch (e) {
        app.$router.push('/');
    }
}

export function login(username: string, password: string): Promise<any> {
    return ajax({
        method: 'post',
        url: '/loginAuth',
        data: {
            username,
            password,
        },
    });
}

export function logout(): Promise<any> {
    return ajax({
        url: '/logout',
    });
}

export function checkUsername(username: string): Promise<any> {
    return ajax({
        method: 'post',
        url: '/usernameCheck',
        data: {
            username,
        },
    });
}

interface registerParams {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}
export function register(params: registerParams): Promise<any> {
    return ajax({
        method: 'post',
        url: '/registerAuth',
        data: {
            username: params.username,
            password: params.password,
            firstName: params.firstName,
            lastName: params.lastName,
        },
    });
}

export function addPost(fileName: string, caption: string, allFollowers: boolean): Promise<any> {
    return ajax({
        method: 'post',
        url: '/uploadPost',
        data: {
            fileName,
            caption,
            allFollowers,
        },
    });
}

export function searchFriend(username: string): Promise<any> {
    return ajax({
        url: '/searchFriend',
        data: {
            username,
        },
    });
}

export function fetchUserInfo(username: string): Promise<any> {
    return ajax({
        url: '/fetchUserInfo',
        data: {
            username,
        },
    });
}

export function getFollowState(followee: string): Promise<any> {
    return ajax({
        url: '/getFollowState',
        data: {
            followee,
        },
    });
}

export function followRequest(followee: string): Promise<any> {
    return ajax({
        url: '/followRequest',
        data: {
            followee,
        },
    });
}
