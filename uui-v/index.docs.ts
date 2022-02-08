import { DocBuilder } from '@epam/uui-docs';
declare var require: any;
const req = require.context('./components', true, /\.doc$/);
export const docs: {doc: DocBuilder<any>, category: string}[] = req.keys().map((file: any) => {
    const fileName = file.replace(/\.\//, '').replace(/\/.*/, '');
    return { doc: req(file), category: fileName[0].toUpperCase() + fileName.substr(1) };
});