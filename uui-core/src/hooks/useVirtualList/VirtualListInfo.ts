import type { VirtualListState } from '../../types';

interface Props {
    scrollContainer: HTMLElement,
    listContainer: HTMLElement,
    value: VirtualListState,
    rowsCount: number,
    blockSize: number,
    overdrawRows: number,
    rowHeights: number[],
    rowOffsets: number[],
    listOffset: number,
    estimatedHeight?: number,
    averageRowHeight?: number,
}

export class VirtualListInfo {
    constructor(
        public readonly scrollContainer: Props['scrollContainer'],
        public readonly listContainer: Props['listContainer'],
        public readonly value: Props['value'],
        public readonly rowsCount: Props['rowsCount'],
        public readonly blockSize: Props['blockSize'],
        public readonly overdrawRows: Props['overdrawRows'],
        public readonly rowHeights: Props['rowHeights'],
        public readonly rowOffsets: Props['rowOffsets'],
        public readonly listOffset: Props['listOffset'],
        public readonly estimatedHeight?: Props['estimatedHeight'],
        public readonly averageRowHeight?: Props['averageRowHeight'],
    ) {}

    get containerScrollTop() {
        return this.scrollContainer.scrollTop ?? 0;
    }

    get containerScrollBottom() {
        return this.containerScrollTop + this.scrollContainer.clientHeight ?? 0;
    }
}
