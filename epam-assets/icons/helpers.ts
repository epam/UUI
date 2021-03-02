import { icons } from './index';

export type IconList<TIcon> = {
    id: string,
    parentId?: string,
    icon: TIcon,
    name: string,
    size: number,
};

export function getIconGroupName(path: string) {
    let common = path.match('@epam/assets/icons/common/');

    if (common && common.length > 0) {
        return path.split('-').slice(0, -1).join('-').replace('@epam/assets/icons/common/', '');
    }

    return path.replace('@epam/assets/icons/loaders/', '').split('_').slice(0, -1).join('-');
}

function getIconSize(path: string) {
    const info = path.match(/\d{2}/);
    return info ? +info[0] : null;
}

export function getGroupedIcons<TIcon>() {
    let groupedIcons: { [key: string]: IconList<TIcon>[] } = {};
    icons.forEach((item: IconList<TIcon>) => {
        let groupName = getIconGroupName(item.name);
        if (groupedIcons[groupName]) {
            groupedIcons[groupName].push({ ...item, size: getIconSize(item.name), id: item.name });
        } else {
            groupedIcons[groupName] = [{ ...item, size: getIconSize(item.name), id: item.name }];
        }
    });

    return groupedIcons;
}

export function getIconList<TIcon>(includeChildren?: boolean): IconList<TIcon>[] {
    let groupedIcons = getGroupedIcons<TIcon>();
    let baseDepthIcons: IconList<TIcon>[] = [];
    for (let key in groupedIcons) {
        baseDepthIcons.push({ ...groupedIcons[key][0], name: key, id: key });
        includeChildren && groupedIcons[key].forEach((item: IconList<TIcon>) => {
            baseDepthIcons.push({ ...item, parentId: key });
        });
    }

    return baseDepthIcons;
}