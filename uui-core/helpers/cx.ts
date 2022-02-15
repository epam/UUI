import classNames from 'classnames';

export function cx(...args: ArgsType<typeof classNames>) {
    return classNames(args);
}