import React from 'react';
import { render } from '@epam/uui-test-utils';
import { withMods } from '../withMods';
import { IHasCaption, IHasCX } from '@epam/uui-core';

interface BaseProps {
    caption?: string;
    className?: string;
}

interface ModdedProps extends IHasCaption, IHasCX {}

const Base = ({ caption, className }: BaseProps) => <div className={ className }>{caption}</div>;
const Modded = withMods<BaseProps, ModdedProps>(Base, () => ({ cx: 'class-from-props' }));

describe('withMods', () => {
    it('should apply mods correctly', () => {
        const { asFragment } = render(<Modded cx="class-from-props" caption="test" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should apply mods without additional props', () => {
        const { asFragment } = render(<Modded cx="class-from-props" />);
        expect(asFragment()).toMatchSnapshot();
    });
});
