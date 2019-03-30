import ajax from './ajax';

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

export function register() {

}
