import React from 'react';
import { IEditable } from '@epam/uui-core';
import { TextInput } from '@epam/loveship';

type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[] ? ElementType : never;

class EditableLensHelper<T> {
    public value: T;
    public onValueChange: (newVal: T) => void;
    constructor(editable: IEditable<T>) {
        this.value = editable.value;
        this.onValueChange = editable.onValueChange;
    }

    public prop<TKey extends keyof T>(propName: TKey): EditableLensHelper<T[TKey]> {
        return new EditableLensHelper({
            value: this.value[propName],
            onValueChange: (newVal) => ({ ...(this.value as any), [propName]: newVal }),
        });
    }

    public index(index: number): EditableLensHelper<ArrayElement<T>> {
        if (this.value != null && !Array.isArray(this.value)) {
            throw new Error('Attempt to call EditableLensHelper.index on non-array');
        }
        return new EditableLensHelper({
            value: (this.value as any)[index],
            onValueChange: (newVal) => {
                const arr = [...(this.value as any)];
                arr[index] = newVal;
                return arr;
            },
        });
    }

    public default(defaultValue: T) {
        return new EditableLensHelper({
            value: this.value || defaultValue,
            onValueChange: (newVal) => this.onValueChange(newVal || defaultValue),
        });
    }
}

const Lens = {
    onEditableComponent<T>(component: any) {
        return new EditableLensHelper<T>(component.props);
    },

    on<T>(editable: IEditable<T>) {
        return new EditableLensHelper<T>(editable);
    },
};

// import { Lens } from 'uui'

interface SomeComponentState {
    name: string;
    num: number;
    arr: { itemName: string }[];
}

interface SomeComponentProps extends IEditable<SomeComponentState> {}

class SomeComponent extends React.Component<IEditable<SomeComponentState>> {
    render() {
        const lens = Lens.onEditableComponent<SomeComponentState>(this);
        return (
            <>
                <TextInput { ...lens.prop('name') } />
                <TextInput { ...lens.prop('arr').index(10).prop('itemName') } />
            </>
        );
    }
}
