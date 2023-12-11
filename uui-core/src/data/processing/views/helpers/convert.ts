export const idToKey = <TId, >(id: TId) => typeof id === 'object' ? JSON.stringify(id) : `${id}`;
