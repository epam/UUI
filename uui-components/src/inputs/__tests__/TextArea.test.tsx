import * as React from 'react';
import { render, fireEvent, screen } from '@epam/uui-test-utils';
import { TextArea, TextAreaProps } from '../TextArea';

describe('TextArea', () => {
    const defaultProps: TextAreaProps = {
        value: '',
        onValueChange: jest.fn(),
    };

    it('renders without crashing', () => {
        const { container } = render(<TextArea { ...defaultProps } />);
        expect(container).toBeInTheDocument();
    });

    it('calls onChange when value is changed', () => {
        render(<TextArea { ...defaultProps } />);
        const textarea = screen.getByRole('textbox');

        fireEvent.change(textarea, { target: { value: 'Test' } });

        expect(defaultProps.onValueChange).toHaveBeenCalledWith('Test');
    });

    it('truncates value if maxLength is exceeded', () => {
        render(<TextArea { ...defaultProps } maxLength={ 5 } />);
        const textarea = screen.getByRole('textbox');

        fireEvent.change(textarea, { target: { value: 'This is a long text' } });

        expect(defaultProps.onValueChange).toHaveBeenCalledWith('This ');
    });

    it('does not truncate value if maxLength is not exceeded', () => {
        render(<TextArea { ...defaultProps } maxLength={ 10 } />);
        const textarea = screen.getByRole('textbox');

        fireEvent.change(textarea, { target: { value: 'Short text' } });

        expect(defaultProps.onValueChange).toHaveBeenCalledWith('Short text');
    });

    it('calls onBlur when textarea is blurred', () => {
        const onBlurMock = jest.fn();
        render(<TextArea { ...defaultProps } onBlur={ onBlurMock } />);
        const textarea = screen.getByRole('textbox');

        fireEvent.blur(textarea);

        expect(onBlurMock).toHaveBeenCalled();
    });

    it('updates inFocus state to false when textarea is blurred', () => {
        render(<TextArea { ...defaultProps } />);
        const textarea = screen.getByRole('textbox');

        fireEvent.blur(textarea);

        expect(textarea).not.toHaveFocus();
    });

    it('calls onFocus when textarea is focused', () => {
        const onFocusMock = jest.fn();
        render(<TextArea { ...defaultProps } onFocus={ onFocusMock } />);
        const textarea = screen.getByRole('textbox');

        fireEvent.focus(textarea);

        expect(onFocusMock).toHaveBeenCalled();
    });

    it('updates inFocus state to true when textarea is focused', () => {
        render(<TextArea { ...defaultProps } />);
        const textarea = screen.getByRole('textbox');

        fireEvent.focus(textarea);

        expect(textarea).toHaveFocus();
    });

    it('calls focus on textarea when wrapper is focused', () => {
        const { container } = render(<TextArea { ...defaultProps } />);
        const wrapper = container.firstChild;
        const textarea = screen.getByRole('textbox');

        fireEvent.focus(wrapper);

        expect(textarea).toHaveFocus();
    });

    it('updates height when value is updated', () => {
        const { rerender } = render(<TextArea { ...defaultProps } autoSize={ true } />);
        const textarea = screen.getByRole('textbox');

        jest.spyOn(textarea, 'offsetHeight', 'get').mockReturnValue(200);
        jest.spyOn(textarea, 'clientHeight', 'get').mockReturnValue(50);
        jest.spyOn(textarea, 'scrollHeight', 'get').mockReturnValue(25);

        rerender(<TextArea { ...defaultProps } value="Updated Value" autoSize={ true } />);

        expect(textarea.style.height).toBe('175px');
    });

    it('updates height when component is mounted', () => {
        jest.useFakeTimers();
        render(<TextArea { ...defaultProps } autoSize={ true } />);
        const textarea = screen.getByRole('textbox');

        jest.spyOn(textarea, 'offsetHeight', 'get').mockReturnValue(200);
        jest.spyOn(textarea, 'clientHeight', 'get').mockReturnValue(50);
        jest.spyOn(textarea, 'scrollHeight', 'get').mockReturnValue(25);

        jest.runAllTimers();

        expect(textarea.style.height).toBe('175px');
    });
});
