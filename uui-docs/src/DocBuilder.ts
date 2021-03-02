import { IComponentDocs, DemoComponentProps, DemoContext, PropExample, PropDoc, PropSamplesCreationContext } from './types';
import * as React from 'react';

export class DocBuilder<TProps> implements IComponentDocs<TProps> {
    name: string;
    props?: PropDoc<TProps, keyof TProps>[];
    contexts?: DemoContext[];
    component: React.ComponentType<TProps>;

    constructor(docs: IComponentDocs<TProps>) {
        this.name = docs.name;
        this.props = docs.props || [];
        this.contexts = docs.contexts || [];
        this.component = docs.component || null;
    }

    public prop<TProp extends keyof TProps>(
        name: TProp,
        details?: Partial<PropDoc<TProps, TProp>>,
    ) {
        // Apply defaults
        details.isRequired = details.isRequired || false;
        details.examples = details.examples || [];

        if (typeof details.examples === 'function') {
            const originalExamples = details.examples;
            details.examples = (ctx: PropSamplesCreationContext<TProps>) => this.normalizeExamples(originalExamples(ctx));
        } else {
            details.examples = this.normalizeExamples(details.examples);
        }
        this.props.push({ name, ...details } as any);
        return this;
    }

    public implements(docs: IComponentDocs<Partial<TProps>>[]) {
        this.props = this.props.concat(...docs.map(i => i.props as any));
        this.contexts = this.contexts.concat(...docs.map(i => i.contexts));
        return this;
    }

    public withContexts(...contexts: (React.ComponentClass<DemoComponentProps> & { displayName: string })[]) {
        contexts.forEach(context => this.contexts.push({ context, name: context.displayName }));
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
        } else if (value.type && value.type.displayName) {
            return value.type.displayName;
        } else if (typeof value === 'function') {
            return 'callback';
        } else {
            return value.toString();
        }
    }
}
