import { Paginator as UuiPaginator, PaginatorParams, PaginatorProps } from '@epam/uui-components';
import React from 'react';
import { PageButton } from './PageButton';
import css from './Paginator.scss';
import { ReactComponent as ArrowLeftIcon_24 } from '@epam/assets/icons/common/navigation-chevron-left-18.svg';
import { ReactComponent as ArrowRightIcon_24 } from '@epam/assets/icons/common/navigation-chevron-right-18.svg';
import { ReactComponent as ArrowLeftIcon_30 } from '@epam/assets/icons/common/navigation-chevron-left-24.svg';
import { ReactComponent as ArrowRightIcon_30 } from '@epam/assets/icons/common/navigation-chevron-right-24.svg';

export class Paginator extends React.Component<PaginatorProps> {
    renderPaginator(params: PaginatorParams) {
        return (
            <nav role="navigation" className={css.root} {...params.rawProps}>
                <PageButton
                    size={params.size}
                    icon={params.size === '30' ? ArrowLeftIcon_30 : ArrowLeftIcon_24}
                    onClick={params.goToPrev}
                    isDisabled={params.isFirst}
                    fill="white"
                    color="gray50"
                />
                {params.pages.map((page, index) => {
                    if (page.type === 'spacer') {
                        return <PageButton size={params.size} key={`${index}_spacer`} caption={'...'} fill="light" color="blue" tabIndex={-1} />;
                    } else {
                        return (
                            <PageButton
                                size={params.size}
                                key={page.pageNumber}
                                caption={page.pageNumber}
                                onClick={() => page.onClick?.()}
                                rawProps={{ 'aria-current': page.isActive }}
                                fill={(page.isActive && 'white') || 'light'}
                                color={'blue'}
                            />
                        );
                    }
                })}
                <PageButton
                    size={params.size}
                    icon={params.size === '30' ? ArrowRightIcon_30 : ArrowRightIcon_24}
                    onClick={params.goToNext}
                    isDisabled={params.isLast}
                    fill="white"
                    color="gray50"
                />
            </nav>
        );
    }

    render() {
        return <UuiPaginator {...this.props} render={this.renderPaginator} />;
    }
}
