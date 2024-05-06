import type { ComponentType } from 'react';
import {
    DemoContext,
    IComponentDocs,
    PropDoc, PropDocPropsUnknown,
    PropExample,
    PropExampleObject,
    TDocContext,
    TComponentPreviewList,
    TComponentPreview,
    TPreviewPropsItemRenderCases, TPreviewCellSize, TPreviewMatrix,
} from './types';
import { TestMatrixUtils } from './utils/testMatrixUtils';

export class DocPreviewBuilder<TProps> {
    listOfPreviews: TComponentPreviewList<TProps> = [];

    /**
     * Most recently added preview will replace another one with same ID
     * @param previewItem
     */
    add(previewItem: TComponentPreview<TProps, keyof TProps>): void;
    add(id: string, matrix: TPreviewMatrix<TProps>, cellSize?: TPreviewCellSize): void;
    add(...args: any[]) {
        let previewItem: TComponentPreview<TProps, keyof TProps>;
        if (typeof args[0] === 'string') {
            const [id, matrix, cellSize] = args;
            previewItem = { id, matrix, cellSize };
        } else {
            previewItem = args[0];
        }
        this.listOfPreviews = this.listOfPreviews.filter(({ id }) => id !== previewItem.id);
        this.listOfPreviews.push({
            id: previewItem.id,
            ...previewItem,
        });
    }

    update(id: string, updateMatrixFn: (prevMatrix: TComponentPreview<TProps>['matrix']) => TComponentPreview<TProps>['matrix']) {
        const prev = this.listOfPreviews.find((i) => i.id === id);
        if (prev) {
            prev.matrix = { ...updateMatrixFn(prev.matrix) };
        } else {
            throw new Error(`Unable to find preview by id = ${id}`);
        }
    }
}

export class DocBuilder<TProps> implements IComponentDocs<TProps> {
    name: string;
    props?: PropDoc<TProps, keyof TProps>[];
    contexts?: DemoContext<TProps>[];
    docPreview?: DocPreviewBuilder<TProps>;

    component: IComponentDocs<TProps>['component'];
    constructor(docs: IComponentDocs<TProps>) {
        this.name = docs.name;
        this.props = docs.props || [];
        this.contexts = docs.contexts || [];
        this.component = docs.component || null;
    }

    /**
     * Add the prop to the list.
     * If prop with such name already exists, then it throws error.
     * @param name
     * @param details
     */
    public prop<TProp extends keyof TProps>(name: TProp, details: Partial<PropDoc<TProps, TProp>>) {
        return this._prop<TProp>(name, details, 'add');
    }

    /**
     * Merges the details to the existing prop.
     * If the prop not found, then it throws error.
     * @param name
     * @param details
     */
    public merge<TProp extends keyof TProps>(name: TProp, details: Partial<PropDoc<TProps, TProp>>) {
        return this._prop<TProp>(name, details, 'merge');
    }

    /**
     * Map of example name to example props
     * @param propName
     */
    public getPropExamplesMap<TProp extends keyof TProps>(
        propName: TProp,
    ) {
        const res: { [exampleName: string] : PropExampleObject<any> } = {};
        const examples = this.getPropDetails(propName).examples;
        if (Array.isArray(examples)) {
            // The array of examples is always normalized here.
            (examples as PropExampleObject<any>[]).forEach((e) => {
                res[e.name] = e;
            });
        } else {
            // cannot do anything here - just skip.
        }
        return res;
    }

    public getPropDetails<TProp extends keyof TProps>(propName: TProp): Omit<PropDoc<TProps, TProp>, 'name'> | undefined {
        const prop = this.props.find((p) => (p.name as unknown as TProp) === propName) as PropDoc<TProps, TProp>;
        if (prop) {
            const { name, ...details } = prop;
            return details;
        }
    }

    public setDefaultPropExample<TProp extends keyof TProps>(
        propName: TProp,
        isDefaultExample: (example: PropExampleObject<TProps[TProp]>, index: number) => boolean,
    ): void {
        const prevPropDetails = this.getPropDetails(propName);
        if (Array.isArray(prevPropDetails.examples)) {
            const prevExamples = prevPropDetails.examples as PropExampleObject<TProps[TProp]>[];
            prevPropDetails.examples = prevExamples.map(({ isDefault, ...ex }, index) => {
                if (isDefaultExample(ex, index)) {
                    return { ...ex, isDefault: true };
                }
                return ex;
            });
            this.merge(propName, prevPropDetails);
        }
    }

    setDocPreview(docPreview: DocPreviewBuilder<TProps>) {
        this.docPreview = docPreview;
    }

    getPreviewRenderCaseGroups() {
        return this.docPreview?.listOfPreviews.map((ppi) => {
            return DocBuilder.convertPreviewPropsItemToRenderCases(ppi as TComponentPreview<unknown>, this as DocBuilder<PropDocPropsUnknown>);
        });
    }

    static convertPreviewPropsItemToRenderCases = (ppi: TComponentPreview<unknown>, docs: DocBuilder<PropDocPropsUnknown>): TPreviewPropsItemRenderCases => {
        let ctxToSet = ppi.context || TDocContext.Default;
        // Assumption: all components support Default context, so we never report error when Default context is selected.
        const ctxToSetSupported = ctxToSet === TDocContext.Default || !!docs.contexts.find((ctx) => ctx.name === ctxToSet);
        if (!ctxToSetSupported) {
            ctxToSet = undefined;
            console.error(`The context="${ctxToSet}" is not supported by the component`);
        }
        const result: TPreviewPropsItemRenderCases = {
            id: ppi.id,
            context: ctxToSet,
            props: [],
            cellSize: ppi.cellSize,
        };
        const matrixConfig = TestMatrixUtils.normalizePreviewPropsMatrix<unknown>({ matrix: ppi.matrix, docs: docs as unknown as IComponentDocs<unknown> });
        result.props = TestMatrixUtils.createTestMatrix({ matrixNorm: matrixConfig });
        return result;
    };

    private _prop<TProp extends keyof TProps>(
        name: TProp,
        details: Partial<PropDoc<TProps, TProp>>,
        mode: 'merge' | 'add' = 'add',
    ) {
        const index = this.props.findIndex((p) => p.name === name as keyof TProps);
        const exists = index !== -1;

        // Apply defaults
        if (['add'].indexOf(mode) !== -1) {
            details.isRequired = details.isRequired || false;
            details.examples = details.examples || [];
        }

        if (details.examples) {
            if (typeof details.examples === 'function') {
                const originalExamples = details.examples;
                details.examples = (ctx) => this.normalizeExamples(originalExamples(ctx));
            } else {
                details.examples = this.normalizeExamples(details.examples);
            }
        }

        if (exists) {
            if (mode !== 'merge') {
                const msg = `[DocBuilder] property "${String(name)}" already exists!`;
                console.error(msg);
                throw new Error(msg);
            }
            const prev = this.props[index];
            this.props[index] = { name, ...prev, ...details } as any;
        } else {
            if (mode !== 'add') {
                const msg = `[DocBuilder] property "${String(name)}" not found!`;
                console.error(msg);
                throw new Error(msg);
            }
            this.props.push({ name, ...details } as any);
        }

        return this;
    }

    public implements(docs: any[] extends DocBuilder<TProps>[] ? any[] : never) {
        docs.forEach((doc) => {
            this.props.push(...doc.props);
            this.contexts.push(...doc.contexts);
        });
        return this;
    }

    public withContexts(...contexts: ComponentType<TProps>[]) {
        contexts.forEach((context) => this.contexts.push({ context, name: context.displayName }));
        return this;
    }

    public withContextsReplace(...contexts: ComponentType<TProps>[]) {
        this.contexts = [];
        contexts.forEach((context) => this.contexts.push({ context, name: context.displayName }));
        return this;
    }

    private normalizeExamples(examples?: PropExample<any>[]): PropExampleObject<any>[] {
        return examples?.map((example, index) => {
            if (example == null || typeof example === 'number' || typeof example === 'string' || typeof example === 'boolean' || typeof example === 'function') {
                example = {
                    value: example,
                };
            } else {
                example = { ...example };
            }
            example.id = index + '';
            example.name = example.name || this.exampleValueToString(example.value);
            return example;
        });
    }

    private exampleValueToString(value: PropExample<any>) {
        if (typeof value === 'string') {
            return value;
        } else if (value == null) {
            return 'null';
        } else if (value.displayName) {
            return value.displayName;
        } else if (value.type?.displayName) {
            return value.type.displayName;
        } else if (value.name) {
            return value?.name;
        } else if (typeof value === 'function') {
            return 'callback';
        } else {
            return value.toString();
        }
    }
}
