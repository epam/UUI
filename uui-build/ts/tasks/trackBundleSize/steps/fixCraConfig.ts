import fs from 'fs';
import path from 'path';
import { appTargetDirResolved } from '../constants';

const webpackConfigResolved = path.resolve(appTargetDirResolved, 'node_modules/react-scripts/config/webpack.config.js');
const webpackPatch = { replaceWhat: 'resolve: {', replaceTo: 'resolve: {symlinks: false,' };

export const fixCraConfig = async () => {
    const contentStr = fs.readFileSync(webpackConfigResolved, 'utf8').toString();
    if (contentStr.indexOf(webpackPatch.replaceTo) === -1) {
        fs.writeFileSync(webpackConfigResolved, contentStr.replace(webpackPatch.replaceWhat, webpackPatch.replaceTo));
    }
};
