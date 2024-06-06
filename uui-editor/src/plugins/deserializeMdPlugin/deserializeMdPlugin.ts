import { getPluginType, PlateEditor, getPluginOptions, isUrl, PlatePlugin, Value, TDescendant, TElement } from '@udecode/plate-common';
import {
    MARK_ITALIC, MARK_BOLD, MARK_CODE,
} from '@udecode/plate-basic-marks';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import {
    RemarkTextRules,
    MdastNodeType,
    MdastNode,
    RemarkPluginOptions,
    remarkTransformText,
    DeserializeMdPlugin,
    KEY_DESERIALIZE_MD,
    RemarkElementRule,
    createDeserializeMdPlugin as createDeserializeMdRootPlugin,
    remarkDefaultElementRules,
} from '@udecode/plate-serializer-md';
import unified from 'unified';
import markdown from 'remark-parse';

const remarkDefaultTextRules: RemarkTextRules<Value> = {
    text: {},
    emphasis: { mark: ({ editor }) => getPluginType(editor, MARK_ITALIC) },
    strong: { mark: ({ editor }) => getPluginType(editor, MARK_BOLD) },
    inlineCode: { mark: ({ editor }) => getPluginType(editor, MARK_CODE) },
};

export const remarkTextTypes: MdastNodeType[] = [
    'emphasis',
    'strong',
    'delete',
    'inlineCode',
    // 'html',
    'text',
];

const remarkTransformNode = <V extends Value>(
    node: MdastNode,
    options: RemarkPluginOptions<V>,
): TDescendant | TDescendant[] => {
    const { type } = node;

    if (remarkTextTypes.includes(type!)) {
        return remarkTransformText(node, options);
    }

    return remarkTransformElement(node, options);
};

function remarkPlugin<V extends Value>(options: RemarkPluginOptions<V>) {
    const compiler = (node: { children: Array<MdastNode> }) => {
        return node.children.flatMap((child) =>
            remarkTransformNode(child, options));
    };

    // @ts-ignore
    this.Compiler = compiler;
}

const remarkTransformElement = <V extends Value>(
    node: MdastNode,
    options: RemarkPluginOptions<V>,
): TElement | TElement[] => {
    const { elementRules } = options;

    const { type } = node;
    const elementRule = (elementRules as any)[type!];
    if (!elementRule) return [];

    return elementRule.transform(node, options);
};

/**
 * Deserialize content from Markdown format to Slate format.
 * `editor` needs
 */
export const deserializeMd = <V extends Value>(
    editor: PlateEditor<V>,
    data: string,
) => {
    const { elementRules, textRules } = getPluginOptions<DeserializeMdPlugin, V>(
        editor,
        KEY_DESERIALIZE_MD,
    );

    const tree: any = unified()
        .use(markdown as any)
        .use(remarkPlugin, {
            editor,
            elementRules,
            textRules,
        } as unknown as RemarkPluginOptions<V>)
        .processSync(data);

    return tree.result;
};

// TODO: move to plate
const htmlRule: RemarkElementRule<Value> = {
    transform: (node, options) => {
        return {
            type: getPluginType(options.editor, ELEMENT_PARAGRAPH),
            children: [{ text: node.value?.replace(/(<br>)|(<br\/>)/g, '') || '' }],
        };
    },
};

export const createDeserializeMdPlugin = (): PlatePlugin => createDeserializeMdRootPlugin({
    then: (editor) => ({
        editor: {
            insertData: {
                format: 'text/plain',
                query: ({ data, dataTransfer }) => {
                    const htmlData = dataTransfer.getData('text/html');
                    if (htmlData) {
                        return false;
                    }

                    // if content is simply a URL pass through to not break LinkPlugin
                    const { files } = dataTransfer;
                    if (!files?.length && isUrl(data)) {
                        return false;
                    }
                    return true;
                },
                getFragment: ({ data }) => deserializeMd<Value>(editor, data),
            },
        },
    }),
    options: {
        elementRules: {
            ...remarkDefaultElementRules,
            html: htmlRule,
        } as any,
        textRules: remarkDefaultTextRules,
    },
});
