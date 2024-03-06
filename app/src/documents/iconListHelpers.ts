import { IconBase } from '@epam/uui-docs';

declare let require: any;

// exclude folders common|legacy|templates from @epam/assets/icons
const iconsLoader: { ctx: any; iPath: string; delimiter?: string }[] = [
    { ctx: require.context('@epam/assets/icons/loaders', true, /^.*\.svg$/), iPath: '@epam/assets/icons/loaders' },
    { ctx: require.context('@epam/assets/icons', false, /^.*\.svg$/), iPath: '@epam/assets/icons' },
];

export function getAllIcons<TIcon>(): IconBase<TIcon>[] {
    const acc: IconBase<TIcon>[] = [];
    iconsLoader.forEach((t) => {
        const { ctx, iPath } = t;
        const keys = ctx.keys();
        keys.forEach((file: any) => {
            const { ReactComponent: icon } = ctx(file);
            const name = file.replace('.', iPath).split('/').pop();
            const i = {
                id: name, icon, name,
            };
            acc.push(i);
        });
    });
    return acc;
}
