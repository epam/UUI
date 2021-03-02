import * as React from 'react';
import range from 'lodash.range';
import {IAnalyticableOnChange, IEditable, UuiContexts, uuiContextTypes} from "@epam/uui";

export interface PaginatorParams {
    size: '24' | '30';
    pages: PaginatorItem[];
    goToNext(): void;
    goToPrev(): void;
    isLast: boolean;
    isFirst: boolean;
}

interface PaginatorItem {
    type: 'page' | 'spacer';
    pageNumber?: number;
    isActive?: boolean;
    onClick?(): void;
}

export interface PaginatorProps extends IEditable<number>, IAnalyticableOnChange<number> {
    size: '24' | '30';
    totalPages: number;
    render?(params: PaginatorParams): any;
}

const FIRST_PAGE = 1;
const SIMPLE_PAGINATION_ITEMS = 7;

export class Paginator extends React.Component<PaginatorProps> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;
    // size = this.props.size || '36';

    isFirst = () => {
        return this.props.value === FIRST_PAGE;
    }

    isLast = () => {
        return this.props.value === this.props.totalPages;
    }

    getPagesView(): PaginatorItem[] {
        const paginatorItems: PaginatorItem[] = [];
        const pages = this.props.totalPages;
        const currentPage = this.props.value;
        const onClick = (value: number) => {
            this.props.onValueChange(value);
            
            if (this.props.getValueChangeAnalyticsEvent) {
                const event = this.props.getValueChangeAnalyticsEvent(value, this.props.value);
                this.context.uuiAnalytics.sendEvent(event);
            }
        };

        function addPage(page: number) {
            if (page !== currentPage) {
                return paginatorItems.push({ type: 'page', pageNumber: page, onClick: () => onClick(page) });
            }
            return paginatorItems.push({ type: 'page', pageNumber: page, onClick: () => onClick(page), isActive: true });
        }

        function addSpacer() {
            return paginatorItems.push({ type: 'spacer' });
        }

        // If the number of pages is not more than the maximum number of displayed pages, then we add all pages to the array

        if (pages <= SIMPLE_PAGINATION_ITEMS) {
            range(1, pages + 1).map((pageNumber: number) => {
                addPage(pageNumber);
            });
        }

        // If the number of pages exceeds the maximum number of displayed pages

        if (pages > SIMPLE_PAGINATION_ITEMS) {
            // If the current page is less than the maximum number of pages displayed at the beginning before the spacer,
            // we show the couple pages, spacer and the last page
            if (currentPage < 5) {
                range(1, 6).map((pageNumber: number) => {
                    addPage(pageNumber);
                });
                addSpacer();
                addPage(pages);
            }

            // If the current page is greater than the maximum number of pages that are shown at the beginning
            // and less than the maximum number of pages that are shown at the end
            // to show the first page, a spacer, three pages of the current, spacer, and the last page
            if (currentPage > pages - 4) {
                addPage(1);
                addSpacer();
                range(pages - 4, pages + 1).map((pageNumber: number) => {
                    addPage(pageNumber);
                });
            }

            // If the current page is greater than the maximum number of pages displayed at the end after the spacer,
            // we show the first page, spacer and last pages
            if (currentPage > 4 && currentPage < pages - 3) {
                addPage(1);
                addSpacer();
                range(currentPage - 1, currentPage + 2).map((pageNumber: number) => {
                    addPage(pageNumber);
                });
                addSpacer();
                addPage(pages);
            }
        }

        return paginatorItems;
    }

    goToNext = () => {
        this.props.onValueChange(this.props.value + 1);
    }

    goToPrev = () => {
        this.props.onValueChange(this.props.value - 1);
    }

    render() {
        return this.props.render({
            size: this.props.size,
            pages: this.getPagesView(),
            goToNext: this.goToNext,
            goToPrev: this.goToPrev,
            isFirst: this.isFirst(),
            isLast: this.isLast(),
        });
    }
}