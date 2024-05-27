import cx from 'classnames';
import React, { MouseEventHandler } from 'react';

import { ReactComponent as AlignCenter } from '../../icons/align-center.svg';
import { ReactComponent as FullWidth } from '../../icons/align-full-width.svg';
import { ReactComponent as AlignLeft } from '../../icons/align-left.svg';
import { ReactComponent as AlignRight } from '../../icons/align-right.svg';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import css from './ImageBlock.module.scss';
import { PlateImgAlign } from './types';

export function ImgToolbar({
    align,
    toggleBlockAlignment,
    isFullWidth,
    setMaxWidth,
}: {
    align?: PlateImgAlign,
    toggleBlockAlignment: (align: PlateImgAlign) => void,
    isFullWidth: () => boolean,
    setMaxWidth: () => void,
}) {
    /**
    * Prevents unwanted event propagation of focus change
    * on clicking buttons inside toolbar.
    */
    const onMouseDown: MouseEventHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div className={ cx(css.imageToolbar, 'slate-prevent-blur') } onMouseDown={ onMouseDown }>
            <ToolbarButton
                isActive={ align === 'left' }
                icon={ AlignLeft }
                onClick={ () => toggleBlockAlignment('left') }
            />
            <ToolbarButton
                isActive={ align === 'center' }
                icon={ AlignCenter }
                onClick={ () => toggleBlockAlignment('center') }
            />
            <ToolbarButton
                isActive={ align === 'right' }
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
}
