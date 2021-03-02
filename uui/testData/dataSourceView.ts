import {dataSource} from "./dataSource";

export const dataSourceView = dataSource
    .getView({topIndex: 0, visibleCount: 10, focusedIndex: 1}, () => {});