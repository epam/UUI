import { UserSettingsContext } from '../UserSettingsContext';

describe('UserSettingsContext', () => {
    it('should work correctly', () => {
        const context = new UserSettingsContext();

        context.set('test key 1', 'test value 1');
        expect(context.get('test key 1')).toBe('test value 1');

        context.set('test key 2', 'test value 2');
        expect(context.get('test key 2')).toBe('test value 2');

        context.set('test key 1', 'new value 1');
        expect(context.get('test key 1')).toBe('new value 1');

        expect(context.get('missing key', 'initial value')).toBe('initial value');
    });
});
