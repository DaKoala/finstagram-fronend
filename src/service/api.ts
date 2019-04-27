import Vue from 'vue';
import ajax from './ajax';

interface User {
    username: string,
    avatar: string,
}

export interface Group {
    groupName: string,
    groupOwner: string,
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

interface Post {
    fileName: string;
    caption: string;
    allFollowers: boolean;
    sharedGroups: { groupName: string, groupOwner: string, }[];
}

export function addPost(params: Post):
    Promise<BaseResponse<BaseData>> {
    return ajax({
        method: 'post',
        url: '/uploadPost',
        data: {
            fileName: params.fileName,
            caption: params.caption,
            allFollowers: params.allFollowers,
            sharedGroups: params.sharedGroups,
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

export function manageRequest(followerUsername: string, response: number):
    Promise<BaseResponse<BaseData>> {
    return ajax({
        url: '/manageRequest',
        data: {
            response,
            followerUsername,
        },
    });
}

interface JoinedGroupsData extends BaseData {
    groups: Group[];
}
export function getJoinedGroups(hasGroupMember = false): Promise<BaseResponse<JoinedGroupsData>> {
    return ajax({
        url: '/getJoinedGroups',
        data: {
            hasGroupMember,
        },
    });
}

interface CreateGroupData extends BaseData {
    groupName: string;
}
export function createGroup(groupName: string): Promise<BaseResponse<CreateGroupData>> {
    return ajax({
        url: '/createGroup',
        data: {
            groupName,
        },
    });
}

interface AddMemberData extends BaseData {
    newMembers: string[];
}
export function addMember(
    groupName: string,
    friends: string[],
): Promise<BaseResponse<AddMemberData>> {
    return ajax({
        method: 'post',
        url: '/addFriend',
        data: {
            groupName,
            friends,
        },
    });
}

export interface Photo {
    photoID: number;
    photoOwner: string;
    timestamp: string;
    filePath: string;
    caption: string;
}
interface ShowPhotoData extends BaseData {
    photos: Photo[];
}
export function showPhoto(): Promise<BaseResponse<ShowPhotoData>> {
    return ajax({
        url: '/showPhoto',
    });
}

export function tagPhoto(photoID: number, targetName: string): Promise<BaseResponse<BaseData>> {
    return ajax({
        url: '/tagPhoto',
        data: {
            photoID,
            targetName,
        },
    });
}

export interface TaggedPerson {
    fname: string;
    lname: string;
}
interface PhotoTagData extends BaseData {
    people: TaggedPerson[];
}
export function photoTag(photoID: number): Promise<BaseResponse<PhotoTagData>> {
    return ajax({
        url: '/photoTag',
        data: {
            photoID,
        },
    });
}

export interface TagRequest {
    filePath: string;
    photoID: number;
}
interface GetTagData extends BaseData {
    tags: TagRequest[];
}
export function getTag(): Promise<BaseResponse<GetTagData>> {
    return ajax({
        url: '/getTag',
    });
}

export function manageTag(photoID: number, response: number): Promise<BaseResponse<BaseData>> {
    return ajax({
        url: '/manageTag',
        data: {
            photoID,
            response,
        },
    });
}

interface IsLikedData extends BaseData {
    liked: boolean;
}
export function isLiked(photoID: number): Promise<BaseResponse<IsLikedData>> {
    return ajax({
        url: '/isLiked',
        data: {
            photoID,
        },
    });
}

export function likePhoto(photoID: number): Promise<BaseResponse<BaseData>> {
    return ajax({
        url: '/like',
        data: {
            photoID,
        },
    });
}
