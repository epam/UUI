import { IconList, IconGroup } from '@epam/uui-docs';

declare let require: any;
// exclude folders common|legacy|templates from @epam/assets/icons
const groupsLoader: { ctx: any; iPath: string; delimiter?: string }[] = [
    { ctx: require.context('@epam/assets/icons/loaders', true, /.*\.svg$/), iPath: '@epam/assets/icons/loaders' },
    { ctx: require.context('@epam/assets/icons', true, /^((?!common|legacy|templates).)*\.svg$/), iPath: '@epam/assets/icons' },
];
function getAllIconsGrouped<TIcon>(): IconGroup<TIcon> {
    const acc: IconGroup<TIcon> = {};
    groupsLoader.forEach((t) => {
        const { ctx, iPath } = t;
        const keys = ctx.keys();
        keys.forEach((file: any) => {
            const { ReactComponent: icon } = ctx(file);
            const name = file.replace('.', iPath).split('/').pop();
            const groupName = name.replace(`${iPath}/`, '').replace('.svg', '');
            const size = getIconSize(name);
            const i = {
                id: name, icon, name, groupName, size,
            };
            const g = acc[groupName] || (acc[groupName] = []);
            g.push(i);
        });
    });
    return acc;
}
function getIconSize(path: string) {
    const info = path.match(/\d{2}/);
    return info ? +info[0] : null;
}

const groupedIcons = getAllIconsGrouped<any>();

export function getGroupedIcons() {
    return groupedIcons;
}

export function getIconList<TIcon>(includeChildren?: boolean) {
    return Object.keys(groupedIcons).reduce<IconList<TIcon>[]>((acc, key) => {
        const first = groupedIcons[key][0];
        acc.push({ ...first, name: key, id: key });
        if (includeChildren) {
            groupedIcons[key].forEach((item) => {
                acc.push({ ...item, parentId: key });
            });
        }
        return acc;
    }, []);
}
