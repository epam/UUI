import { validate } from '../validate';
import { Metadata } from '../../../types';

interface IBar {
    id?: number;
    name: string;
}
interface IFoo {
    name?: string;
    nested?: IBar;
    array?: IBar[];
    map?: Record<string, IBar>;
}

const initBarValue: IBar = {
    name: '',
};

const initFooValueSimple: IFoo = {
    name: '',
};

const initFooValueNested: IFoo = {
    nested: initBarValue,
};

const initFooValueArray: IFoo = {
    array: [initBarValue, initBarValue],
};

const initFooValueMap: IFoo = {
    map: { user1: initBarValue, user2: initBarValue },
};

const fooMetadata: Metadata<IFoo> = {
    props: {
        name: { isRequired: true },
    },
};

const nestedMetadata: Metadata<IFoo> = {
    props: {
        nested: {
            props: {
                name: {
                    isRequired: true,
                },
            },
        },
    },
};

const arrayMetadata: Metadata<IFoo> = {
    props: {
        array: {
            all: {
                props: {
                    name: {
                        isRequired: true,
                    },
                },
            },
        },
    },
};

const mapMetadata: Metadata<IFoo> = {
    props: {
        map: {
            all: {
                props: {
                    name: {
                        isRequired: true,
                    },
                },
            },
        },
    },
};

const emptyFooValue: IFoo = initFooValueSimple;
const filledFooValue: IFoo = { name: 'hello' };
const emptyBarValue: IBar = initBarValue;
const filledBarValue: IBar = { name: 'hello' };

describe('validate', () => {
    it('Empty required field should be invalid, filled - valid', () => {
        expect(validate(emptyFooValue, fooMetadata, initFooValueSimple, 'save')).toHaveProperty('isInvalid', true);
        expect(validate(filledFooValue, fooMetadata, initFooValueSimple, 'save')).toHaveProperty('isInvalid', false);
    });

    it('If nested object has invalid fields - root should also be invalid', () => {
        expect(validate({ nested: emptyBarValue }, nestedMetadata, initFooValueNested, 'save')).toHaveProperty('isInvalid', true);
        expect(validate({ nested: filledBarValue }, nestedMetadata, initFooValueNested, 'save')).toHaveProperty('isInvalid', false);
    });

    it('If nested object is an array and "all" modifier is used in meta, result should have {[index]: ValidationState} structure', () => {
        expect(validate({ array: [filledBarValue, emptyBarValue] }, arrayMetadata, initFooValueArray, 'save')).toMatchObject({
            isInvalid: true,
            validationProps: {
                array: {
                    isInvalid: true,
                    validationProps: {
                        0: {
                            isInvalid: false,
                            validationProps: {
                                name: { isInvalid: false },
                            },
                        },
                        1: {
                            isInvalid: true,
                            validationProps: {
                                name: { isInvalid: true },
                            },
                        },
                    },
                },
            },
        });
        expect(validate({ array: [filledBarValue, emptyBarValue] }, arrayMetadata, initFooValueArray, 'change')).toMatchObject({
            isInvalid: false,
            validationProps: {
                array: {
                    isInvalid: false,
                    validationProps: {
                        0: {
                            isInvalid: false,
                            validationProps: {
                                name: { isInvalid: false },
                            },
                        },
                    },
                },
            },
        });
    });

    it('If nested object is an object and  "all" modifier is used in meta, result should have {[key]: ValidationState} structure', () => {
        expect(validate({ map: { user1: filledBarValue, user2: emptyBarValue } }, mapMetadata, initFooValueMap, 'save')).toMatchObject({
            isInvalid: true,
            validationProps: {
                map: {
                    isInvalid: true,
                    validationProps: {
                        user1: {
                            isInvalid: false,
                            validationProps: {
                                name: { isInvalid: false },
                            },
                        },
                        user2: {
                            isInvalid: true,
                            validationProps: {
                                name: { isInvalid: true },
                            },
                        },
                    },
                },
            },
        });
        expect(validate({ map: { user1: filledBarValue, user2: emptyBarValue } }, mapMetadata, initFooValueMap, 'change')).toMatchObject({
            isInvalid: false,
            validationProps: {
                map: {
                    isInvalid: false,
                    validationProps: {
                        user1: {
                            isInvalid: false,
                            validationProps: {
                                name: {
                                    isInvalid: false,
                                },
                            },
                        },
                    },
                },
            },
        });
    });

    it('Can use custom validators', () => {
        const value: IBar = { name: 'bar' };
        const meta: Metadata<IBar> = {
            props: {
                name: {
                    validators: [(v) => [v === 'bar' && 'expect anything but bar']],
                },
            },
        };
        expect(validate(value, meta, initBarValue, 'save')).toEqual({
            isInvalid: true,
            validationProps: {
                name: {
                    isInvalid: true,
                    validationMessage: 'expect anything but bar',
                },
            },
        });
    });

    it('Metadata root can contain rules', () => {
        const value: IBar = { name: 'bar' };
        const meta: Metadata<IBar> = {
            isRequired: true,
            validators: [(v) => [!v && 'failed']],
            props: { name: { isRequired: true } },
            all: { isRequired: true },
        };
        const resultDefault = validate(value, meta, initBarValue, 'save');
        const resultOnChanged = validate(value, meta, initBarValue, 'change');
        expect(resultDefault).toEqual(expect.objectContaining({ isInvalid: false }));
        expect(resultOnChanged).toEqual(expect.objectContaining({ isInvalid: false }));
    });

    it('Custom validators receive parent objects', () => {
        const validator = jest.fn().mockReturnValue(['error']);
        const value = {
            array: [{ id: 100, name: 'abc' }, { id: 101, name: 'bcd' }],
        };
        const initValue = {
            array: [{ id: 100, name: 'abc' }, { id: 101, name: 'bcd' }],
        };

        const resultDefault = validate<IFoo>(
            value,
            {
                props: {
                    array: {
                        all: {
                            props: {
                                name: {
                                    validators: [validator],
                                },
                            },
                        },
                    },
                },
            },
            initValue,
            'save',
        );

        expect(validator).toBeCalledTimes(2);
        expect(validator).nthCalledWith(1, 'abc', value.array[0], value.array, value);
        expect(validator).nthCalledWith(2, 'bcd', value.array[1], value.array, value);

        const resultWithOnChanged = validate<IFoo>(
            value,
            {
                props: {
                    array: {
                        all: {
                            props: {
                                name: {
                                    validators: [validator],
                                },
                            },
                        },
                    },
                },
            },
            initFooValueArray,
            'change',
        );

        const resultWithNotChangedValue = validate<IFoo>(
            value,
            {
                props: {
                    array: {
                        all: {
                            props: {
                                name: {
                                    validators: [validator],
                                },
                            },
                        },
                    },
                },
            },
            initValue,
            'change',
        );

        expect(resultDefault).toMatchObject({
            isInvalid: true,
            validationProps: {
                array: {
                    isInvalid: true,
                    validationProps: {
                        0: {
                            isInvalid: true,
                            validationProps: {
                                name: { isInvalid: true, validationMessage: 'error' },
                            },
                        },
                        1: {
                            isInvalid: true,
                            validationProps: {
                                name: { isInvalid: true, validationMessage: 'error' },
                            },
                        },
                    },
                },
            },
        });

        expect(resultWithOnChanged).toMatchObject({
            isInvalid: true,
            validationProps: {
                array: {
                    isInvalid: true,
                    validationProps: {
                        0: {
                            isInvalid: true,
                            validationProps: {
                                name: { isInvalid: true, validationMessage: 'error' },
                            },
                        },
                        1: {
                            isInvalid: true,
                            validationProps: {
                                name: { isInvalid: true, validationMessage: 'error' },
                            },
                        },
                    },
                },
            },
        });

        expect(resultWithNotChangedValue).toMatchObject({
            isInvalid: false,
        });
    });
});
