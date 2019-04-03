import BASE_URL from '../service/config';

export default function (avatarName: string): string {
    return `${BASE_URL}/image/${avatarName}`;
}
