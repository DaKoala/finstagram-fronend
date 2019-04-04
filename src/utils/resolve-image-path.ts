import BASE_URL from '../service/config';

export function resolveImagePath(avatarName: string): string {
    return `${BASE_URL}/image/${avatarName}`;
}

export function resolveImagePathCallback(item: { avatar: string }): { avatar: string } {
    const newItem = item;
    newItem.avatar = resolveImagePath(newItem.avatar);
    return newItem;
}
