import { devLogger } from './../uuiLogger';

type TProps = {
    property1: 'value1' | 'value2';
};

describe('uuiLogger', () => {
    it('should log warning', () => {
        const mockedConsoleError = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        devLogger.warnAboutDeprecatedPropValue<TProps, 'property1'>({
            component: 'TestComponent',
            propName: 'property1',
            propValue: 'value1',
            condition: () => true,
            propValueUseInstead: 'value2',
        });
        expect(mockedConsoleError.mock.lastCall[0])
            .toContain(
                '[UUI Warning]: (TestComponent) The value1 value of property1 is deprecated and will be removed in future versions. Please use value2 value instead.',
            );
        mockedConsoleError.mockClear();
    });

    it('should not log warning if condition is false', () => {
        const mockedConsoleError = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        devLogger.warnAboutDeprecatedPropValue<TProps, 'property1'>({
            component: 'TestComponent',
            propName: 'property1',
            propValue: 'value1',
            condition: () => false,
            propValueUseInstead: 'value2',
        });
        expect(mockedConsoleError).not.toHaveBeenCalled();
        mockedConsoleError.mockClear();
    });
});
