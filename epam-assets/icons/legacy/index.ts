declare var require: any;
const req = require.context('.', false, /\.svg$/);
export const icons = req.keys().map((file: any) => ({ icon: req(file), name: file.replace('.', '@epam/assets/icons') }));