import { ShadowToken } from './types';

export const getResultByPath = (target: Record<string, any>, path: string[]) => {
    return path.reduce((previous, current) => previous[current], target);
};

export const isObject = (value: any) => ({}.toString.call(value) === '[object Object]');

export const isVariable = (value: string) => value.startsWith('$') || value.startsWith('{');

export const isGradient = (str: string) => str.includes('gradient');

export const replaceJsonVarsFromGradient = (str: string) => {
    const regexp = /\$.+?(?=\,|\s)/g;
    return str.replace(regexp, (match) => {
        return `var(--${match.split('.').pop()})`;
    });
};

export const createVariableToken = (value: string) => {
    if (value.startsWith('$')) {
        return `var(--${value.split('.').pop()})`;
    } else {
        return `var(--${value.split('.').pop().slice(0, -1)})`;
    }
};

export const createSizeString = (value: string) => {
    if (value.includes('%')) {
        return value;
    }
    return value
        .split(' ')
        .map((size) => `${size}px`)
        .join(' ');
};

export const createShadowString = ({ type, x, y, blur, spread, color }: ShadowToken) => {
    let result = '';
    if (type === 'innerShadow') {
        result += 'inset ';
    }

    if (x !== null || x !== undefined) {
        x === '0' || x === 0 ? (result += `${x} `) : (result += `${x}px `);
    }

    if (y !== null || y !== undefined) {
        y === '0' || y === 0 ? (result += `${y} `) : (result += `${y}px `);
    }

    if (blur !== null || blur !== undefined) {
        blur === '0' || blur === 0 ? (result += `${blur} `) : (result += `${blur}px `);
    }

    if (spread !== null || spread !== undefined) {
        spread === '0' || spread === 0 ? (result += `${spread} `) : (result += `${spread}px `);
    }

    if (isVariable(color)) {
        result += createVariableToken(color);
    } else {
        result += color;
    }

    return result;
};

export const uppercaseFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
