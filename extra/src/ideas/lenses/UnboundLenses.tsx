import * as React from 'react';
import * as uui from '@epam/uui-core';
interface ILens<TBig, TSmall> {
    get(big: TBig): TSmall;
    set(big: TBig, small: TSmall): TBig;
}

class Lens<TBig, TSmall> {
    static on<TBig>(): Lens<TBig, TBig> {
        return null;
    }

    public toEditable(editable: uui.IEditable<TBig>): uui.IEditable<TSmall> {
        return null;
    }

    public prop<TKey extends keyof TBig>(key: TKey): Lens<TBig, TBig[TKey]> {
        return null;
    }

    public onChange(fn: (newValue: TSmall, oldValue: TSmall) => TSmall): Lens<TBig, TSmall> {
        return null;
    }
}

interface TestObj {
    name: string;
    details: {
        value: number;
    };
    country: string;
    city: string;
}

const lens = Lens.on<TestObj>();
const countryLens = lens.onChange((n, o) => ({ ...n, city: null })).prop('country');

class TestComponent extends React.Component<uui.IEditable<TestObj>> {
    render() {
        return (
            <>
                {/* <ls.TextInput { ...lens.prop('name').toEditable(this.props) } />
            <ls.TextInput { ...countryLens.toEditable(this.props) } /> */}
            </>
        );
    }
}
