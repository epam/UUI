export interface AllowedReplicationDirections {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
}

interface Coordinates {
    columnIndex: number;
    rowIndex: number;
}

export const canReplicateByDirection = (startCoordinates: Coordinates, currentCoordinates: Coordinates, allowedDirections: AllowedReplicationDirections) => {
    if (!allowedDirections.top && startCoordinates.rowIndex > currentCoordinates.rowIndex) {
        return false;
    }

    if (!allowedDirections.bottom && startCoordinates.rowIndex < currentCoordinates.rowIndex) {
        return false;
    }

    if (!allowedDirections.left && startCoordinates.columnIndex > currentCoordinates.columnIndex) {
        return false;
    }

    if (!allowedDirections.right && startCoordinates.columnIndex < currentCoordinates.columnIndex) {
        return false;
    }

    return true;
};
