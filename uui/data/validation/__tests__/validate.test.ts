import { validate } from "../validate";
import {Metadata} from "../../../types";

interface IBar {
    name: string;
}
interface IFoo {
    name?: string;
    nested?: IBar;
    array?: IBar[];
    map?: Record<string, IBar>;
}

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


describe('validate', () => {
    it('Empty required field should be invalid, filled - valid', () => {
        expect(validate({ name: '' }, fooMetadata)).toHaveProperty('isInvalid', true);
        expect(validate({ name: 'hello' }, fooMetadata)).toHaveProperty('isInvalid', false);
    });

    it('If nested object has invalid fields - root should also be invalid', () => {
        expect(validate({ nested: { name: "" } }, nestedMetadata)).toHaveProperty('isInvalid', true);
        expect(validate({ nested: { name: "hello" } }, nestedMetadata)).toHaveProperty('isInvalid', false);
    });

    it('If nested object is an array and "all" modifier is used in meta, result should have {[index]: ValidationState} structure', () => {
        expect(validate({ array: [{ name: "hello" }, { name: "" }] }, arrayMetadata)).toMatchObject({
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
                            isInvalid: true, validationProps: {
                                name: { isInvalid: true },
                            },
                        },
                    },
                },
            },
        });
    });

    it('If nested object is an object and  "all" modifier is used in meta, result should have {[key]: ValidationState} structure', () => {
        expect(validate({ map: { user1: { name: "hello" }, user2: { name: "" } } }, mapMetadata)).toMatchObject({
            isInvalid: true,
            validationProps: {
                map: {
                    isInvalid: true,
                    validationProps: {
                        user1: {
                            isInvalid: false, validationProps: {
                                name: { isInvalid: false },
                            },
                        },
                        user2: {
                            isInvalid: true, validationProps: {
                                name: { isInvalid: true },
                            },
                        },
                    },
                },
            },
        });
    });
});