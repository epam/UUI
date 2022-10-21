export const returnByCondition = <T, F>(condition: boolean, ifTrue: T, ifFalse: F) => {
    return condition ? ifTrue : ifFalse;
};
