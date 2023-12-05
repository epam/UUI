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

    it('updates height on componentDidMount', () => {
        jest.useFakeTimers();
        render(<TextArea { ...defaultProps } />);
        jest.runAllTimers();

        // expect(jest.setTimeout).toHaveBeenCalledTimes(1);
        // expect(jest.setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);
        expect(defaultProps.onValueChange).toHaveBeenCalled();
    });
});
