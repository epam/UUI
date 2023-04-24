const MAX_ITEMS = 100;

export const getMaxItems = (maxItems: number | undefined) =>
    maxItems || maxItems === 0 ? maxItems : MAX_ITEMS;
