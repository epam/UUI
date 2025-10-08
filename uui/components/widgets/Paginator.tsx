import React from 'react';
import cx from 'classnames';
import type { Overwrite } from '@epam/uui-core';
import { Paginator as UuiPaginator, PaginatorRenderParams, PaginatorProps as UuiPaginatorProps } from '@epam/uui-components';
import { Button } from '../buttons/Button';
import { settings } from '../../settings';

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
        <nav role="navigation" className={ cx('uui-paginator', `uui-size-${props.size || settings.paginator.sizes.default}`) } { ...params.rawProps }>
            <ul
                className={ css.root }
            >
                <li>
                    <Button
                        size={ props.size || settings.paginator.sizes.default }
                        icon={ settings.paginator.icons.leftArrowIcon }
                        onClick={ params.goToPrev }
                        isDisabled={ params.isFirst || props.isDisabled }
                        fill="outline"
                        color="secondary"
                        rawProps={ {
                            'aria-label': 'Previous page',
                        } }
                    />
                </li>
                {params.pages.map((page, index) => {
                    if (page.type === 'spacer') {
                        return (
                            <li
                                key={ `${index}_spacer` }
                            >
                                <Button
                                    cx={ cx(css.spacer, css.page) }
                                    size={ props.size || settings.paginator.sizes.default }
                                    caption="..."
                                    fill="ghost"
                                    color="secondary"
                                    tabIndex={ -1 }
                                    isDisabled={ props.isDisabled }
                                />
                            </li>
                        );
                    } else {
                        return (
                            <li
                                key={ page.pageNumber }
                            >
                                <Button
                                    cx={ cx(css[`mode-${!page.isActive && 'ghost'}`], css.page) }
                                    size={ props.size || settings.paginator.sizes.default }
                                    caption={ page.pageNumber }
                                    onClick={ () => page.onClick?.() }
                                    rawProps={ { 'aria-current': page.isActive } }
                                    fill={ (page.isActive && 'outline') || 'ghost' }
                                    color="primary"
                                    isDisabled={ props.isDisabled }
                                />
                            </li>
                        );
                    }
                })}
                <li>
                    <Button
                        size={ props.size || settings.paginator.sizes.default }
                        icon={ settings.paginator.icons.rightArrowIcon }
                        onClick={ params.goToNext }
                        isDisabled={ params.isLast || props.isDisabled }
                        fill="outline"
                        color="secondary"
                        rawProps={ {
                            'aria-label': 'Next page',
                        } }
                    />
                </li>
            </ul>
        </nav>
    );

    return <UuiPaginator { ...props } render={ renderPaginator } />;
}
