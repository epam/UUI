import { TDescendant, Value, isElement } from '@udecode/plate-common';
import { IMAGE_PLUGIN_TYPE } from '../plugins/imagePlugin/constants';

export const CONTENT_VERSION = '1.0.1';
export const DEFAULT_CONTENT_VERSION = '1.0.0';

// const isInline = (element: TElement) => [
//     LINK_ELEMENT_TYPE,
//     // 'button',
//     // 'badge',
// ].includes(element.type);

// const isInlineNode = <V extends Value>(node: EDescendant<V>) =>
//     isText(node) || (isElement(node) && isInline(node));

const migrateImageElementTo_1_0_1 = <N extends TDescendant>(element: N) => {
    // console.log('migrate image element');

    return {
        ...element,
        // migrations
    };
};

const MIGRATIONS_1_0_1 = '1.0.1';
const migrateElementTo_1_0_1 = <N extends TDescendant>(node: N) => {
    if (node.type === IMAGE_PLUGIN_TYPE) {
        return migrateImageElementTo_1_0_1(node);
    }

    // add more 1.0.1 migrations here
    return node;
};

const migrateNodes = <N extends TDescendant>(version: string, descendants: N[]) => {
    const usedVerion = version;

    // TODO: make use of cloneDeep
    // eslint-disable-next-line no-param-reassign
    descendants = descendants.map((node) => {
        if (usedVerion < CONTENT_VERSION) {
            // console.log('used verison < CONTENT_VERSION', usedVerion, node);

            if (usedVerion < MIGRATIONS_1_0_1) {
                // console.log('used verison < MIGRATIONS_1_0_1', node);
                return migrateElementTo_1_0_1(node);
            }

            // add other version migrations here
        }

        return node;
    });

    return descendants;
};

const migrate = <N extends TDescendant>(version: string, descendants: N[]) => {
    // eslint-disable-next-line no-param-reassign
    descendants = migrateNodes(version, descendants);

    // eslint-disable-next-line no-param-reassign
    descendants = descendants.map((node) => {
        if (isElement(node)) {
            return {
                ...node,
                children: migrate(version, node.children),
            };
        }

        return node;
    });

    return descendants;
};

export const migratePlateContent = (version: string, initialValue: Value): Value => {
    const usedVerion = version;

    if (usedVerion < CONTENT_VERSION) {
        return migrate(version, initialValue);
    }

    return initialValue;
};
