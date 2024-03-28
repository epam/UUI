export const setObjectFlag = (object: any, key: string, value: boolean) => {
    return { ...object, [key]: value };
};
