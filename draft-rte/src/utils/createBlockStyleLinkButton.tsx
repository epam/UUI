import { RichUtils } from 'draft-js';
import { IconButton } from '@epam/loveship';
import * as React from 'react';
import { DraftBlockStyleButton, DraftButtonProps } from '../types';
import { blockTypeIsActive } from './helpers';

export function createBlockStyleLinkButton({ blockType, icon, caption }: DraftBlockStyleButton) {
    return class BlockStyleLinkButton extends React.Component<DraftButtonProps> {

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
            return (
                <div
                    onMouseDown={ this.preventBubblingUp }
                >
                    <IconButton
                        onClick={ this.toggleStyle }
                        icon={ icon }
                        color={ blockTypeIsActive(this.props.value, blockType) ? 'sky' : 'night600' }
                    />
                </div>
            );
        }
    };
}