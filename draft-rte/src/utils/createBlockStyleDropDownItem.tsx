import * as React from 'react';
import { RichUtils } from 'draft-js';
import { upperFirst, toLower } from 'lodash';
import { cx } from '@epam/uui-core';
import { Button } from '@epam/uui-components';
import { DraftBlockStyleButton, DraftButtonProps } from '../types';
import { blockTypeIsActive } from './helpers';
import css from '../common/Toolbar/buttons/HeaderDropdownButton.module.scss'
export function createBlockStyleDropDownItem({ blockType, icon, caption = '' }: DraftBlockStyleButton) {
    return class BlockStyleDropDownItem extends React.Component<DraftButtonProps> {

        toggleStyle = (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            this.props.onValueChange(
                RichUtils.toggleBlockType(
                    this.props.value,
                    blockType,
                ),
            );
        }

        preventBubblingUp = (event: React.MouseEvent<HTMLDivElement>) => { event.preventDefault(); };

        render() {
            const className = blockType
                .split('-')
                .map((s) => upperFirst(toLower(s)))
                .join('');

            const captionClassNames = [
                css.caption,
                blockTypeIsActive(this.props.value, blockType) ? css.active : '',
            ].join(' ');

            return (
                <div
                    onMouseDown={ this.preventBubblingUp }
                    className={cx(css.HeaderDropdownButtonWrapper, )}
                >
                    <Button
                        caption={ caption }
                        onClick={ this.toggleStyle }
                        icon={ icon ? icon : null }
                        cx={ cx(css[className || ''], captionClassNames) }
                    />
                </div>
            );
        }
    };
}
