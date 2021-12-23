import React from "react";
import { Paginator as UuiPaginator, PaginatorParams, PaginatorProps } from '@epam/uui-components';
import * as css from './Paginator.scss';
import { PageButton } from "./PageButton";
import { ReactComponent as ArrowLeftIcon_24 } from '../icons/navigation-chevron-left-18.svg';
import { ReactComponent as ArrowRightIcon_24 } from '../icons/navigation-chevron-right-18.svg';
import { ReactComponent as ArrowRightIcon_30 } from '../icons/navigation-chevron-right-24.svg';
import { ReactComponent as ArrowLeftIcon_30 } from '../icons/navigation-chevron-left-24.svg';

export class Paginator extends React.Component<PaginatorProps> {
    renderPaginator(params: PaginatorParams) {
        return (
            <div className={ css.root }>
                <PageButton size={ params.size } icon={ (params.size === '30') ? ArrowLeftIcon_30 : ArrowLeftIcon_24 } onClick={ params.goToPrev } isDisabled={ params.isFirst } fill={ (params.isFirst && 'solid') || 'white' } color='night400' />
                {
                    params.pages.map((page, index) => {
                        if (page.type === 'spacer') {
                            return <PageButton size={ params.size } key={ index } caption={ '...' } fill='light' color='sky' tabIndex={ -1 } />;
                        } else {
                            return <PageButton size={ params.size } key={ index } caption={ page.pageNumber } onClick={ () => page.onClick() } fill={ (page.isActive && 'white') || 'light' } color={ 'sky' } rawProps={{ 'aria-current': page.isActive }} />;
                        }
                    })
                }
                <PageButton size={ params.size } icon={ (params.size === '30') ? ArrowRightIcon_30 : ArrowRightIcon_24 } onClick={ params.goToNext } isDisabled={ params.isLast } fill={ (params.isLast && 'solid') || 'white' } color='night400' />
            </div>
        );
    }

    render() {
        return <UuiPaginator { ...this.props } render={ this.renderPaginator } />;
    }
}
