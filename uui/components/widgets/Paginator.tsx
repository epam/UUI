import React from 'react';
import cx from 'classnames';
import { Paginator as UuiPaginator, PaginatorParams, PaginatorProps } from '@epam/uui-components';
import { Button } from '../buttons';
import css from './Paginator.scss';
import { ReactComponent as ArrowLeftIcon_24 } from '@epam/assets/icons/common/navigation-chevron-left-12.svg';
import { ReactComponent as ArrowRightIcon_24 } from '@epam/assets/icons/common/navigation-chevron-right-12.svg';
import { ReactComponent as ArrowLeftIcon_30 } from '@epam/assets/icons/common/navigation-chevron-left-18.svg';
import { ReactComponent as ArrowRightIcon_30 } from '@epam/assets/icons/common/navigation-chevron-right-18.svg';

export function Paginator(props: PaginatorProps) {
    const renderPaginator = (params: PaginatorParams) => (
        <nav role="navigation" className={ css.root } { ...params.rawProps }>
            <Button
                cx={ css[`navigation-size-${params.size ?? '30'}`] }
                size={ params.size }
                icon={ params.size === '30' ? ArrowLeftIcon_30 : ArrowLeftIcon_24 }
                onClick={ params.goToPrev }
                isDisabled={ params.isFirst }
                mode="outline"
                color="secondary"
            />
            {params.pages.map((page, index) => {
                if (page.type === 'spacer') {
                    return (
                        <Button
                            cx={ cx(css[`size-${params.size ?? '30'}`], css.spacer) }
                            size={ params.size }
                            key={ `${index}_spacer` }
                            caption="..."
                            mode="ghost"
                            color="secondary"
                            tabIndex={ -1 }
                        />
                    );
                } else {
                    return (
                        <Button
                            cx={ cx(css[`size-${params.size ?? '30'}`], css[`mode-${!page.isActive && 'ghost'}`]) }
                            size={ params.size }
                            key={ page.pageNumber }
                            caption={ page.pageNumber }
                            onClick={ () => page.onClick?.() }
                            rawProps={ { 'aria-current': page.isActive } }
                            mode={ (page.isActive && 'outline') || 'ghost' }
                            color="primary"
                        />
                    );
                }
            })}
            <Button
                cx={ css[`navigation-size-${params.size ?? '30'}`] }
                size={ params.size }
                icon={ params.size === '30' ? ArrowRightIcon_30 : ArrowRightIcon_24 }
                onClick={ params.goToNext }
                isDisabled={ params.isLast }
                mode="outline"
                color="secondary"
            />
        </nav>
    );

    return <UuiPaginator { ...props } render={ renderPaginator } />;
}
