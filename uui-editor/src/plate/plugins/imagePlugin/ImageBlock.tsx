import React, { useCallback, useRef } from 'react';
import cx from 'classnames';

import { Dropdown } from '@epam/uui-components';
import { uuiSkin } from "@epam/uui-core";

import { useFocused, useSelected} from 'slate-react';

import {
    focusEditor,
    getBlockAbove,
    ImageElement,
    setElements,
    ToolbarButton as PlateToolbarButton,
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

    const isFocused = useFocused();
    const isSelected = useSelected();

    if (element.type === 'loader') {
        return (
            <>
                <Spinner { ...props } cx={ css.spinner } />
                { props.children }
            </>
        );
    }

    const toggleBlockAlignment = (align: string) => {
        focusEditor(editor);
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
                <PlateToolbarButton
                    styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        isActive={ element.align === 'left' }
                        icon={ AlignLeft }
                        onClick={ () => toggleBlockAlignment('left') }
                    /> }
                />

                <PlateToolbarButton
                    styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        isActive={ element.align === 'center' }
                        icon={ AlignCenter }
                        onClick={ () => toggleBlockAlignment('center') }
                    /> }
                />

                <PlateToolbarButton
                    styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        isActive={ element.align === 'right' }
                        icon={ AlignRight }
                        onClick={ () => toggleBlockAlignment('right') }
                    /> }
                />

                <PlateToolbarButton
                    styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        isActive={ isFullWidth() }
                        icon={ FullWidth }
                        onClick={ setMaxWidth }
                    /> }
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
                        className={ cx(css.slateImage) }>
                        <ImageElement
                            align={ element.align }
                            { ...props }
                        />
                    </div>
                </div>
            ) }
            renderBody={ () => <FlexRow cx={ css.imageToolbarWrapper }>{ renderToolbar() }</FlexRow> }
            value={ isSelected && isFocused && block?.length && block[0].type === 'image' }
            placement='top'
        />
    );
};