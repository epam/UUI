import * as React from 'react';
import cx from 'classnames';
import { withMods } from '../withMods';
import { IHasCX, IHasCaption, IHasForwardedRef } from '../../types';
import { renderer, render, screen } from '@epam/uui-test-utils';

interface ComponentProps extends IHasCaption, IHasCX {}

describe('withMods', () => {
    /* eslint-disable react/prefer-stateless-function */
    class ClassComponent extends React.Component<ComponentProps & IHasForwardedRef<HTMLDivElement>> {
        render() {
            return (
                <div
                    role="note"
                    className={ cx(this.props.cx) }
                    ref={ this.props.forwardedRef }
                >
                    { this.props.caption ?? 'test' }
                </div>
            );
        }
    }

    function FunctionalComponent(props: ComponentProps, ref: any) {
        return (
            <div className={ cx(props.cx) } ref={ ref } role="note">
                { props.caption ?? 'test' }
            </div>
        );
    }

    it('class components (snapshot)', () => {
        const Modded = withMods(
            ClassComponent,
            () => 'class-from-mods',
            (props) => ({ caption: props.caption + '!' }),
        );

        const tree = renderer.create(<Modded cx="class-from-props" caption="test" />);
        expect(tree).toMatchSnapshot();
    });

    it('functional component (snapshot)', () => {
        const Modded = withMods(
            FunctionalComponent,
            () => 'class-from-mods',
            () => ({ caption: 'from mod' }),
        );

        const tree = renderer.create(<Modded cx="class-from-props" />);
        expect(tree).toMatchSnapshot();
    });

    it('forwardRef on functional component', () => {
        const Original = React.forwardRef(FunctionalComponent);

        const Modded = withMods(Original, () => 'class-from-mods');

        const ref: React.RefObject<HTMLDivElement> = { current: null };

        render(<Modded ref={ ref } />);

        const component: HTMLDivElement = screen.getByRole('note');

        expect(component.className).toEqual('class-from-mods');
        expect(ref.current).not.toBeNull();
        expect(ref.current!.className).toEqual('class-from-mods');
        expect(ref.current!.innerHTML).toEqual('test');
    });

    it('forwardRef on class component', () => {
        const Modded = withMods(ClassComponent, () => 'test-class', () => ({ caption: 'mod' }));

        const ref: React.RefObject<HTMLDivElement> = { current: null };

        render(<Modded ref={ ref } cx="my-class" />);

        const component: HTMLDivElement = screen.getByRole('note');
        expect(component.className).toEqual('test-class my-class');

        expect(ref.current).not.toBeNull();
        expect(ref.current!.innerHTML).toEqual('mod');
    });

    it('forwardRef on class component (no props)', () => {
        const Modded = withMods(ClassComponent);

        const ref: React.RefObject<HTMLDivElement> = { current: null };

        render(<Modded ref={ ref } />);

        expect(ref.current).not.toBeNull();
        expect(ref.current!.innerHTML).toEqual('test');
    });

    // There's some issue with tests on React.memo components
    // It crashes with 'Cannot add property current, object is not extensible'
    // TBD: investigate
    it.skip('React.memo component', () => {
        const MemoizedComponent = React.memo(FunctionalComponent);

        const Modded = withMods<ComponentProps>(MemoizedComponent, () => 'class-from-mods', () => ({ caption: 'mod' }));

        render(<Modded />);

        const component: HTMLDivElement = screen.getByRole('note');

        expect(component.className).toEqual('class-from-mods');
    });
});
