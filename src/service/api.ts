import Vue from 'vue';
import ajax from './ajax';

interface User {
    username: string,
    avatar: string,
}

interface BaseData {
    status: number,
    msg: string,
}

interface BaseResponse<Data> {
    config: any;
    data: Data;
    headers: {
        'content-type': string,
    },
    request: XMLHttpRequest,
    status: number,
    statusText: string,
}

interface AuthorizeData extends BaseData {
    username: string,
    avatar: string,
}
export function authorize(): Promise<BaseResponse<AuthorizeData>> {
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

interface LoginData extends BaseData {
    username: string,
}
export function login(username: string, password: string): Promise<BaseResponse<LoginData>> {
    return ajax({
        method: 'post',
        url: '/loginAuth',
        data: {
            username,
            password,
        },
    });
}

export function logout(): Promise<BaseResponse<BaseData>> {
    return ajax({
        url: '/logout',
    });
}

export function checkUsername(username: string): Promise<BaseResponse<BaseData>> {
    return ajax({
        method: 'post',
        url: '/usernameCheck',
        data: {
            username,
        },
    });
}

interface RegisterParams {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}
interface RegisterData extends BaseData {
    username: string,
}
export function register(params: RegisterParams): Promise<BaseResponse<RegisterData>> {
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

export function addPost(fileName: string, caption: string, allFollowers: boolean):
    Promise<BaseResponse<BaseData>> {
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

export interface SearchFriendUser {
    username: string,
    avatar: string,
}
interface SearchFriendData extends BaseData {
    users: SearchFriendUser[];
}
export function searchFriend(username: string): Promise<BaseResponse<SearchFriendData>> {
    return ajax({
        url: '/searchFriend',
        data: {
            username,
        },
    });
}

interface FetchUserInfoData extends BaseData {
    user: {
        username: string,
        avatar: string,
    }
}
export function fetchUserInfo(username: string): Promise<BaseResponse<FetchUserInfoData>> {
    return ajax({
        url: '/fetchUserInfo',
        data: {
            username,
        },
    });
}

interface GetFollowStateData extends BaseData {
    requestState: number,
}
export function getFollowState(followee: string): Promise<BaseResponse<GetFollowStateData>> {
    return ajax({
        url: '/getFollowState',
        data: {
            followee,
        },
    });
}

export function followRequest(followee: string): Promise<BaseResponse<BaseData>> {
    return ajax({
        url: '/followRequest',
        data: {
            followee,
        },
    });
}

export interface Follower {
    avatar: string;
    followerUsername: string;
}

interface ShowRequestData extends BaseData {
    users: Follower[];
}
export function showRequest(): Promise<BaseResponse<ShowRequestData>> {
    return ajax({
        url: '/showRequestFollowee',
    });
}
