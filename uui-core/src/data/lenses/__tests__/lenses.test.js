const { Lens } = require('../index');

describe('lenses', () => {
    it('prop().get() for scalar', () => {
        const lens = Lens.onEditable({ value: { name: 'test' } });
        expect(lens.prop('name').get()).toBe('test');
    });
    it('prop().get() for object', () => {
        const lens = Lens.onEditable({ value: { obj: { name: 'test' } } });
        expect(lens.prop('obj').get()).toEqual({ name: 'test' });
        expect(lens.prop('obj').prop('name').get()).toBe('test');
    });
    it('prop().get() from missing props', () => {
        const lens = Lens.onEditable({ value: {} });
        expect(lens.prop('obj').get()).not.toBeDefined();
        expect(lens.prop('obj').prop('name').get()).not.toBeDefined();
    });
    it('prop().index() on array', () => {
        const lens = Lens.onEditable({ value: ['test'] });
        expect(lens.index(0).get()).toBe('test');
        expect(lens.index(1).get()).not.toBeDefined();
    });
});
