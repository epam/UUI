import { useForm } from '../useForm';

describe.only('useForm', () => {
    interface IFoo {
        dummy: string;
        tummy?: string;
    }

    it('Should return isChanged as true whenever the lens is changed', () => {});
    it('Should correctly set isInvalid on form submit depending on the value', () => {});
    it('Should start validation on save and keep validation state valid values passed', () => {});
    it('Should do nothing, if value isn`t changed', () => {});
    it('Should return isInvalid as false for 1 and more invalid fields', () => {});
    it('Should show the same value, if you: save => leave => come back', () => {});
    it('Should undo to previous value, redo to the next value', () => {});
    it('Should revert and load last passed value', () => {});
    it('Should have a lock on the first form change, release lock on save', () => {});
    it('Should call beforeLeave after component unmount', () => {});
    it('Should store unsaved data to localstorage', () => {});
    it('Should clear unsaved data in localstorage after save', () => {});
    it('Should call onError if onSave promise is rejected', () => {});
    it('Should restore data from local storage after leaving form without saving changes', () => {});
});

describe('useForm server validation', () => {
    interface IAdvancedFoo {
        dummy: string;
        deep: {
            inner: string,
        };
        deep2?: {
            inner2: string;
        };
    }

    it('Should correctly handle server validation', () => {});
    it('Should keep server error notification until field is changed', () => {});
    it('Should keep only validationProps tree with validationMessage in the end', () => {});
});