import { RichUtils } from 'draft-js';
import { IconButton } from '@epam/loveship';
import * as React from 'react';
import { DraftButtonProps, DraftInlineStyleButton } from '../types';

export function createInlineStyleLinkButton({ style, icon, caption }: DraftInlineStyleButton) {
    return class InlineStyleButton extends React.Component<DraftButtonProps> {

        toggleStyle = (event: React.MouseEvent<HTMLDivElement>) => {
            this.props.onValueChange(
                RichUtils.toggleInlineStyle(
                    this.props.value,
                    style,
                ),
            );
        }

        preventBubblingUp = (event: React.MouseEvent<HTMLDivElement>) => { event.preventDefault(); };

        styleIsActive = () => this.props.value && this.props.value.getCurrentInlineStyle().has(style);

        render() {
            return (
                <div
                    onMouseDown={ this.preventBubblingUp }
                >
                    <IconButton
                        onClick={ this.toggleStyle }
                        icon={ icon }
                        color={ this.styleIsActive() ? 'sky' : 'night600' }
                    />
                </div>
            );
        }
    };
}