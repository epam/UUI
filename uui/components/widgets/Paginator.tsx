import React from 'react';
import cx from 'classnames';
import { Paginator as UuiPaginator, PaginatorRenderParams, PaginatorProps } from '@epam/uui-components';
import { Button } from '../buttons/Button';
import css from './Paginator.module.scss';
import { ReactComponent as ArrowLeftIcon } from '@epam/assets/icons/navigation-chevron_left-outline.svg';
import { ReactComponent as ArrowRightIcon } from '@epam/assets/icons/navigation-chevron_right-outline.svg';

export function Paginator(props: PaginatorProps) {
    const renderPaginator = (params: PaginatorRenderParams) => (
        <nav role="navigation" className={ cx(css.root, 'uui-paginator') } { ...params.rawProps }>
            <Button
                cx={ css[`navigation-size-${params.size ?? '30'}`] }
                size={ params.size }
                icon={ ArrowLeftIcon }
                onClick={ params.goToPrev }
                isDisabled={ params.isFirst || props.isDisabled }
                fill="outline"
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
                            fill="ghost"
                            color="secondary"
                            tabIndex={ -1 }
                            isDisabled={ props.isDisabled }
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
                            fill={ (page.isActive && 'outline') || 'ghost' }
                            color="primary"
                            isDisabled={ props.isDisabled }
                        />
                    );
                }
            })}
            <Button
                cx={ css[`navigation-size-${params.size ?? '30'}`] }
                size={ params.size }
                icon={ ArrowRightIcon }
                onClick={ params.goToNext }
                isDisabled={ params.isLast || props.isDisabled }
                fill="outline"
                color="secondary"
            />
        </nav>
    );

    return <UuiPaginator { ...props } render={ renderPaginator } />;
}
