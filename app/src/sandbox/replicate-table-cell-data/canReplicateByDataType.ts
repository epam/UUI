export const canReplicateByDataType = (columnIndex: number, replicationDataType: string, columnDataTypes?: string[]) =>
    !(columnDataTypes && replicationDataType) || columnDataTypes[columnIndex] === replicationDataType;
