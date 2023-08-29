export const i18n = {
    lenses: {
        validation: {
            isRequiredMessage: 'The field is mandatory',
            lessThanMinimumValueMessage: (minValue: number) => `Value should not be less than ${minValue}`,
            greaterThanMaximumValueMessage: (maxValue: number) => `Value should not be greater than ${maxValue}`,
            greaterThanMaximumLengthMessage: (maxLength: number) => `Maximum length is ${maxLength} characters`,
        },
    },
    locale: undefined as string,
};
