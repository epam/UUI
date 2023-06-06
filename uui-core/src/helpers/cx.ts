import classNames from 'classnames';

interface ClassDictionary {
    [id: string]: any;
}

interface ClassArray extends Array<ClassValue> {}

/* The ClassValue type is a union type that represents the valid values that can be passed as arguments to the classnames function. It can be one of the following types:
- string: A string representing a class name.
- number: A number representing a class name. This is useful when using CSS modules.
- ClassDictionary: An object whose keys are class names and values are booleans. If the value is true, the corresponding class name will be included in the resulting string, otherwise it will be omitted.
- ClassArray: An array of values of type ClassValue. This allows you to pass multiple class names or class dictionaries as arguments to classnames.
- undefined: If undefined is passed as an argument, it will be ignored.
- null: If null is passed as an argument, it will be ignored.
- boolean: If a boolean value is passed as an argument, it will be ignored if it is false and included if it is true. */
export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;

export const cx = (...args: ClassValue[]) => {
    return classNames(...args);
};
