declare var require: any;
const req = require.context('.', false, /\.svg$/);
export const loaderIcons = req.keys().map((file: any) => ({ icon: req(file), name: file.replace('.', '@epam/assets/icons/loaders') }));