import { loaderIcons } from './loaders';

declare var require: any;
const req = require.context('./common', false, /\.svg$/);
export const commonIcons = req.keys().map((file: any) => ({ icon: req(file), name: file.replace('.', '@epam/assets/icons/common') }));

export const icons = loaderIcons.concat(commonIcons);