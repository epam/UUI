import { LOADING_RECORD, PENDING_RECORD } from '../tree/constants';
import { RecordStatus } from '../tree/types';

export const isInProgress = (status: RecordStatus): status is typeof PENDING_RECORD | typeof LOADING_RECORD =>
    [PENDING_RECORD, LOADING_RECORD].includes(status);
