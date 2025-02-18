import React from 'react';
import cx from 'classnames';
import { Overwrite } from '@epam/uui-core';
import { Paginator as UuiPaginator, PaginatorRenderParams, PaginatorProps as UuiPaginatorProps } from '@epam/uui-components';
import { Button } from '../buttons';
import { settings } from '../../index';

import css from './Paginator.module.scss';

export interface PaginatorModsOverride {}

interface PaginatorMods {
    /**
     * Defines component size
     *  @default '30'
     * */
    size?: '24' | '30';
}

export interface PaginatorProps extends UuiPaginatorProps, Overwrite<PaginatorMods, PaginatorModsOverride> {}

export function Paginator(props: PaginatorProps) {
    const renderPaginator = (params: PaginatorRenderParams) => (
        <nav role="navigation" className={ cx(css.root, 'uui-paginator', `uui-size-${props.size || settings.paginator.sizes.default}`) } { ...params.rawProps }>
            <Button
                size={ props.size || settings.paginator.sizes.default }
                icon={ settings.paginator.icons.leftArrowIcon }
                onClick={ params.goToPrev }
                isDisabled={ params.isFirst || props.isDisabled }
                fill="outline"
                color="secondary"
            />
            {params.pages.map((page, index) => {
                if (page.type === 'spacer') {
                    return (
                        <Button
                            cx={ cx(css.spacer, css.page) }
                            size={ props.size || settings.paginator.sizes.default }
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
                            cx={ cx(css[`mode-${!page.isActive && 'ghost'}`], css.page) }
                            size={ props.size || settings.paginator.sizes.default }
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
                size={ props.size || settings.paginator.sizes.default }
                icon={ settings.paginator.icons.rightArrowIcon }
                onClick={ params.goToNext }
                isDisabled={ params.isLast || props.isDisabled }
                fill="outline"
                color="secondary"
            />
        </nav>
    );

    return <UuiPaginator { ...props } render={ renderPaginator } />;
}
