import * as React from 'react';
import { IEditableDebouncer } from '../IEditableDebouncer';
import { shallow, ShallowWrapper } from 'enzyme';
import { IEditable } from '../../types/props';

const delay = () => new Promise(resolve => setTimeout(resolve, 1));

describe('IEditableDebouncer', () => {
    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('should call onValueChanged synchronously, if disableDebounce = true', () => {
        const outerOnValueChange = jest.fn(() => {});
        let lastRenderProps: IEditable<number> = null;
        const component = shallow(<IEditableDebouncer
            value={ 1 }
            onValueChange={ outerOnValueChange }
            render={ (props) => { lastRenderProps = props; return null; } }
            disableDebounce={ true }
        />);
        lastRenderProps.onValueChange(2);
        expect(lastRenderProps.value).toBe(2);
        expect(outerOnValueChange).toBeCalledWith(2);
    });

    it('should call onValueChanged delayed', done => {
        const outerOnValueChange = jest.fn(() => {});
        let lastRenderProps: IEditable<number> = null;
        const component = shallow(<IEditableDebouncer
            value={ 1 }
            onValueChange={ outerOnValueChange }
            render={ (props) => { lastRenderProps = props; return null; } }
            debounceDelay={ 5 }
        />);
        lastRenderProps.onValueChange(2);

        expect(lastRenderProps.value).toBe(2);
        expect(outerOnValueChange).not.toBeCalled();

        setTimeout(() => {
            expect(lastRenderProps.value).toBe(2);
            expect(outerOnValueChange).not.toBeCalled();
        }, 1);

        setTimeout(() => {
            expect(lastRenderProps.value).toBe(2);
            expect(outerOnValueChange).toBeCalledWith(2);
            done();
        }, 10);
    });

    it('should change inner value immediately if outer value is changed outside', () => {
        const outerOnValueChange = jest.fn(() => {});
        let lastRenderProps: IEditable<number> = null;
        const component = shallow(<IEditableDebouncer
            value={ 1 }
            onValueChange={ outerOnValueChange }
            render={ (props) => { lastRenderProps = props; return null; } }
            debounceDelay={ 5 }
        />);
        lastRenderProps.onValueChange(3);
        component.setProps({ value: 2 });
        expect(lastRenderProps.value).toBe(2);
    });
});