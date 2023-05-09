import { ICanBeInvalid } from '../../../types';
import { mergeValidation } from '../mergeValidation';

describe('mergeValidation', () => {
    let clientValidation: ICanBeInvalid;
    let serverValidation: ICanBeInvalid;

    it('should be valid', () => {
        clientValidation = { isInvalid: false };
        serverValidation = { isInvalid: false };

        const result = mergeValidation(clientValidation, serverValidation);
        expect(result).toStrictEqual(clientValidation);
    });

    it('should the same as clientValidation', () => {
        clientValidation = {
            isInvalid: true,
            validationProps: {
                name: {
                    isInvalid: true,
                    validationMessage: 'User already exists',
                },
            },
        };
        serverValidation = { isInvalid: false };

        const result = mergeValidation(clientValidation, serverValidation);
        expect(result).toStrictEqual(clientValidation);
    });

    it('should the same as serverValidation', () => {
        clientValidation = { isInvalid: false };
        serverValidation = {
            isInvalid: true,
            validationProps: {
                name: {
                    isInvalid: true,
                    validationMessage: 'User already exists',
                },
            },
        };

        const result = mergeValidation(clientValidation, serverValidation);
        expect(result).toStrictEqual(serverValidation);
    });

    it('should merge both validations', () => {
        clientValidation = {
            isInvalid: true,
            validationProps: {
                age: {
                    isInvalid: true,
                    validationMessage: 'Wrong age',
                },
            },
        };
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
                        deep: {
                            isInvalid: true,
                            validationMessage: 'Deep message',
                        },
                    },
                },
            },
        };

        const result = mergeValidation(clientValidation, serverValidation);
        expect(result).toStrictEqual({
            isInvalid: true,
            validationProps: {
                name: {
                    isInvalid: true,
                    validationMessage: 'User already exists',
                },
                age: {
                    isInvalid: true,
                    validationMessage: 'Wrong age',
                },
                nested: {
                    isInvalid: true,
                    validationProps: {
                        deep: {
                            isInvalid: true,
                            validationMessage: 'Deep message',
                        },
                    },
                },
            },
        });
    });

    it('should prefer clientValidation on collision', () => {
        clientValidation = {
            isInvalid: true,
            validationProps: {
                name: {
                    isInvalid: true,
                    validationMessage: 'Wrong name',
                },
            },
        };
        serverValidation = {
            isInvalid: true,
            validationProps: {
                name: {
                    isInvalid: true,
                    validationMessage: 'User already exists',
                },
            },
        };

        const result = mergeValidation(clientValidation, serverValidation);
        expect(result).toStrictEqual(clientValidation);
    });
});
