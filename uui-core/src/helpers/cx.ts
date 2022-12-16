import classNames from 'classnames';

type ArgsType<T> = T extends (...args: infer A) => any ? A : never;
export function cx(...args: ArgsType<typeof classNames>) {
    return classNames(args);
}
