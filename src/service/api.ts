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
        if (res.data.code !== 200) {
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
