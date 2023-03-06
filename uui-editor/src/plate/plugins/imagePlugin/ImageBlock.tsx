import React, { useCallback, useRef } from 'react';
import cx from 'classnames';

import { Dropdown } from '@epam/uui-components';
import { uuiSkin } from "@epam/uui-core";

import {
    getBlockAbove,
    ImageElement,
    setElements,
} from '@udecode/plate';

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as AlignLeft } from '../../../icons/align-left.svg';
import { ReactComponent as AlignCenter } from '../../../icons/align-center.svg';
import { ReactComponent as AlignRight } from '../../../icons/align-right.svg';
import { ReactComponent as FullWidth } from '../../../icons/align-full-width.svg';

import css from './ImageBlock.scss';

const { FlexRow, Spinner } = uuiSkin;

export const Image = (props: any) => {
    const ref = useRef(null);
    const { editor, element } = props;

    if (element.type === 'loader') {
        return (
            <Spinner { ...props } cx={ css.spinner }/>
        );
    }

    const toggleBlockAlignment = (align: string) => {
        setElements(editor, {
            ...element,
            align,
        });
    };

    const setMaxWidth = () => {
        if (ref?.current?.clientWidth) {
            setElements(editor, {
                ...element,
                width: ref?.current?.clientWidth,
            });
        }
    };

    const isFullWidth = () => {
        const clientWidth = ref?.current?.clientWidth;
        return !clientWidth || (clientWidth === element.width);
    };

    const renderToolbar = useCallback(() => {
        return (
            <div className={ cx(css.imageToolbar, 'slate-prevent-blur') }>
                <ToolbarButton
                    isActive={ element.align === 'left' }
                    icon={ AlignLeft }
                    onClick={ () => toggleBlockAlignment('left') }
                />
                <ToolbarButton
                    isActive={ element.align === 'center' }
                    icon={ AlignCenter }
                    onClick={ () => toggleBlockAlignment('center') }
                />
                <ToolbarButton
                    isActive={ element.align === 'right' }
                    icon={ AlignRight }
                    onClick={ () => toggleBlockAlignment('right') }
                />
                <ToolbarButton
                    isActive={ isFullWidth() }
                    icon={ FullWidth }
                    onClick={ setMaxWidth }
                />
            </div>
        );
    }, [element, toggleBlockAlignment, isFullWidth, setMaxWidth]);

    const block = getBlockAbove(editor);

    return (
        <Dropdown
            renderTarget={ (innerProps: any) => (
                <div ref={ innerProps.ref } className={ cx(css.wrapper) }>
                    <div
                        ref={ ref }
                        className={ cx(css.slateImage, false ? css.containerWrapper : undefined) }>
                        <ImageElement
                            align={ element.align }
                            { ...props }
                        />
                    </div>
                </div>
            ) }
            renderBody={ () => <FlexRow cx={ css.imageToolbarWrapper }>{ renderToolbar() }</FlexRow> }
            value={ block?.length && block[0].type === 'image' }
            placement='top'
        />
    );
};