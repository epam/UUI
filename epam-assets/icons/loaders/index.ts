declare var require: any;
const req = require.context('.', false, /\.svg$/);

export const loaderIcons = req.keys().map((file: any) => {
    const { ReactComponent: Icon } = req(file);
    return { icon: Icon, name: file.replace('.', '@epam/assets/icons/loaders') };
});