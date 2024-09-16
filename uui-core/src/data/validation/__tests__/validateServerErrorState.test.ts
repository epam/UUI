import { validateServerErrorState } from '../validateServerErrorState';
import { ValidationState } from '../../lenses';

interface IBar {
    name: string;
    age?: number;
    location?: {
        city?: string;
    }
}

interface IFoo {
    name?: string;
    nested?: IBar;
    array?: IBar[];
    map?: Record<string, IBar>;
}

describe('validateServerErrorState', () => {
    let serverValidation: ValidationState;
    let currentFormState: IFoo;
    let lastFormState: IFoo;

    it('should be valid when lastFormState is missing', () => {
        serverValidation = { isInvalid: true };
        currentFormState = { name: 'test' };

        const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
        expect(result).toStrictEqual({ isInvalid: false });
    });

    it('should be valid when serverValidation is valid', () => {
        serverValidation = { isInvalid: false };

        const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
        expect(result).toStrictEqual({ isInvalid: false });
    });

    it('should be invalid when serverValidation field is invalid and not changed', () => {
        serverValidation = {
            isInvalid: true,
            validationProps: {
                name: {
                    isInvalid: true,
                    validationMessage: 'User already exists',
                },
            },
        };
        currentFormState = { name: 'test' };
        lastFormState = currentFormState;

        const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
        expect(result).toStrictEqual(serverValidation);
    });

    it('should be valid when serverValidation field is invalid but changed', () => {
        serverValidation = {
            isInvalid: true,
            validationProps: {
                name: {
                    isInvalid: true,
                    validationMessage: 'User already exists',
                },
            },
        };
        currentFormState = { name: 'test changed' };
        lastFormState = { name: 'test' };

        const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
        expect(result).toStrictEqual({
            isInvalid: false,
            validationProps: {
                name: {
                    isInvalid: false,
                },
            },
        });
    });

    it('should correctly compare entities', () => {
        serverValidation = {
            isInvalid: true,
            validationProps: {
                array: {
                    isInvalid: true,
                    validationMessage: 'Wrong array',
                },
            },
        };
        currentFormState = {
            array: [
                {
                    name: 'test',
                },
            ],
        };
        lastFormState = currentFormState;

        let result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
        expect(result).toStrictEqual(serverValidation);

        lastFormState = {
            array: [
                {
                    name: 'test',
                },
            ],
        };

        result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
        expect(result).toStrictEqual({
            isInvalid: false,
            validationProps: {
                array: {
                    isInvalid: false,
                },
            },
        });
    });

    describe('validateServerErrorState: handle changed fields', () => {
        it('all fields should be invalid', () => {
            serverValidation = {
                isInvalid: true,
                validationProps: {
                    name: {
                        isInvalid: true,
                        validationMessage: 'User already exists',
                    },
                    nested: {
                        isInvalid: true,
                        validationProps: {
                            name: {
                                isInvalid: true,
                                validationMessage: 'Another user already exists',
                            },
                            age: {
                                isInvalid: true,
                                validationMessage: 'Wrong age',
                            },
                        },
                    },
                },
            };
            currentFormState = {
                name: 'test',
                nested: {
                    name: 'nested changed',
                    age: 30,
                },
            };
            lastFormState = {
                name: 'test',
                nested: {
                    name: 'nested',
                    age: 30,
                },
            };

            const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
            expect(result).toStrictEqual({
                isInvalid: true,
                validationProps: {
                    name: serverValidation.validationProps.name,
                    nested: {
                        isInvalid: true,
                        validationProps: {
                            age: serverValidation.validationProps.nested.validationProps.age,
                            name: {
                                isInvalid: false,
                            },
                        },
                    },
                },
            });
        });

        it('only "name" field should be invalid', () => {
            currentFormState = {
                name: 'test',
                nested: {
                    name: 'nested changed',
                    age: 31,
                },
            };

            const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
            expect(result).toStrictEqual({
                isInvalid: true,
                validationProps: {
                    name: serverValidation.validationProps.name,
                    nested: {
                        isInvalid: false,
                        validationProps: {
                            age: {
                                isInvalid: false,
                            },
                            name: {
                                isInvalid: false,
                            },
                        },
                    },
                },
            });
        });

        it('only "nested.name" field should be invalid', () => {
            currentFormState = {
                name: 'test changed',
                nested: {
                    name: 'nested',
                    age: 31,
                },
            };

            const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
            expect(result).toStrictEqual({
                isInvalid: true,
                validationProps: {
                    name: {
                        isInvalid: false,
                    },
                    nested: {
                        isInvalid: true,
                        validationProps: {
                            name: serverValidation.validationProps.nested.validationProps.name,
                            age: {
                                isInvalid: false,
                            },
                        },
                    },
                },
            });
        });

        it('only "nested.age" field should be invalid', () => {
            currentFormState = {
                name: 'test changed',
                nested: {
                    name: 'nested changed',
                    age: 30,
                },
            };

            const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
            expect(result).toStrictEqual({
                isInvalid: true,
                validationProps: {
                    name: {
                        isInvalid: false,
                    },
                    nested: {
                        isInvalid: true,
                        validationProps: {
                            age: serverValidation.validationProps.nested.validationProps.age,
                            name: {
                                isInvalid: false,
                            },
                        },
                    },
                },
            });
        });

        it('both nested fields should be invalid', () => {
            currentFormState = {
                name: 'test changed',
                nested: {
                    name: 'nested',
                    age: 30,
                },
            };

            const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
            expect(result).toStrictEqual({
                isInvalid: true,
                validationProps: {
                    name: {
                        isInvalid: false,
                    },
                    nested: serverValidation.validationProps.nested,
                },
            });
        });

        it('should work, when removed item with error from current state', () => {
            lastFormState = {
                name: 'test',
                nested: {
                    name: 'nested changed',
                    age: 30,
                },
            };
            currentFormState = {
                name: 'test',
                nested: {
                    name: 'nested',
                },
            };
            serverValidation = {
                isInvalid: true,
                validationProps: {
                    name: {
                        isInvalid: false,
                    },
                    nested: {
                        isInvalid: true,
                        validationProps: {
                            name: {
                                isInvalid: false,
                            },
                        },
                    },
                },
            };
            const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
            expect(result).toStrictEqual({
                isInvalid: false,
                validationProps: {
                    name: serverValidation.validationProps.name,
                    nested: {
                        isInvalid: false,
                        validationProps: {
                            name: {
                                isInvalid: false,
                            },
                        },
                    },
                },
            });
        });

        it('should work recursive, when removed parent of child with error from current state', () => {
            lastFormState = {
                name: 'test',
                nested: {
                    name: 'nested',
                    age: 30,
                    location: {
                        city: 'Minsk',
                    },
                },
            };
            currentFormState = {
                name: 'test',
                nested: {
                    name: 'nested',
                    age: 30,
                },
            };
            serverValidation = {
                isInvalid: true,
                validationProps: {
                    name: {
                        isInvalid: false,
                    },
                    nested: {
                        isInvalid: true,
                        validationProps: {
                            name: {
                                isInvalid: false,
                            },
                            age: {
                                isInvalid: false,
                            },
                            location: {
                                isInvalid: true,
                                validationProps: {
                                    city: {
                                        isInvalid: true,
                                        validationMessage: 'Wrong city',
                                    },
                                },
                            },
                        },
                    },
                },
            };
            const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
            expect(result).toStrictEqual({
                isInvalid: false,
                validationProps: {
                    name: serverValidation.validationProps.name,
                    nested: {
                        isInvalid: false,
                        validationProps: {
                            age: serverValidation.validationProps.nested.validationProps.age,
                            name: serverValidation.validationProps.nested.validationProps.name,
                            location: {
                                isInvalid: false,
                                validationProps: {
                                    city: {
                                        isInvalid: false,
                                    },
                                },
                            },
                        },
                    },
                },
            });
        });

        // TODO: add to validation, currently it's not supported
        it.skip('array or object should contain error message if returned by server validation', () => {
            lastFormState = {
                name: 'test',
                nested: {
                    name: 'nested',
                    age: 30,
                    location: {
                        city: 'Minsk',
                    },
                },
            };
            currentFormState = {
                name: 'test',
                nested: {
                    name: 'nested',
                    age: 30,
                    location: {
                        city: 'Minsk',
                    },
                },
            };
            serverValidation = {
                isInvalid: true,
                validationProps: {
                    name: {
                        isInvalid: false,
                    },
                    nested: {
                        isInvalid: true,
                        validationProps: {
                            name: {
                                isInvalid: false,
                            },
                            age: {
                                isInvalid: false,
                            },
                            location: {
                                isInvalid: true,
                                validationMessage: 'Wrong location',
                            },
                        },
                    },
                },
            };
            const result = validateServerErrorState(currentFormState, lastFormState, serverValidation);
            expect(result).toStrictEqual({
                isInvalid: false,
                validationProps: {
                    name: serverValidation.validationProps.name,
                    nested: {
                        isInvalid: false,
                        validationProps: {
                            age: serverValidation.validationProps.nested.validationProps.age,
                            name: serverValidation.validationProps.nested.validationProps.name,
                            location: serverValidation.validationProps.nested.validationProps.location,
                        },
                    },
                },
            });
        });
    });
});
