import type { ComponentType } from 'react';
import type { IComponentDocs, DemoComponentProps, DemoContext, PropExample, PropDoc } from './types';

export class DocBuilder<TProps> implements IComponentDocs<TProps> {
    name: string;
    props?: PropDoc<TProps, keyof TProps>[];
    contexts?: DemoContext[];
    component: IComponentDocs<TProps>['component'];

    constructor(docs: IComponentDocs<TProps>) {
        this.name = docs.name;
        this.props = docs.props || [];
        this.contexts = docs.contexts || [];
        this.component = docs.component || null;
    }

    public prop<TProp extends keyof TProps>(name: TProp, details?: Partial<PropDoc<TProps, TProp>>) {
        // Apply defaults
        details.isRequired = details.isRequired || false;
        details.examples = details.examples || [];

        if (typeof details.examples === 'function') {
            const originalExamples = details.examples;
            details.examples = (ctx) => this.normalizeExamples(originalExamples(ctx));
        } else {
            details.examples = this.normalizeExamples(details.examples);
        }
        this.props.push({ name, ...details } as any);
        return this;
    }

    public implements(docs: any[] extends DocBuilder<TProps>[] ? any[] : never) {
        docs.forEach((doc) => {
            this.props.push(...doc.props);
            this.contexts.push(...doc.contexts);
        });
        return this;
    }

    public withContexts(...contexts: ComponentType<DemoComponentProps>[]) {
        contexts.forEach((context) => this.contexts.push({ context, name: context.displayName }));
        return this;
    }

    private normalizeExamples(examples: PropExample<any>[]) {
        return examples.map((example, index) => {
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
            return 'none';
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
