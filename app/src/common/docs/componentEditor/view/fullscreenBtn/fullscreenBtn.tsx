import * as React from 'react';
import {
    Button, ControlGroup,
    Dropdown, DropdownMenuButton, Panel, Text, Tooltip,
} from '@epam/uui';
import { ReactComponent as PreviewIcon } from '@epam/assets/icons/common/media-fullscreen-12.svg';
import { ReactComponent as MenuIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { TPreviewRef } from '../../../../../preview/types';

const LABELS = {
    Fullscreen: 'Fullscreen',
    OpenFullscreen: 'Open Fullscreen',
};

export function FullscreenBtn(props: { previewRef: TPreviewRef }) {
    const { previewRef } = props;

    const renderPreviewTooltipContent = () => {
        const err = previewRef.error;
        return (
            <>
                <Text size="30">{ LABELS.OpenFullscreen }</Text>
                { err && <Text size="30" color="warning">{ err }</Text> }
            </>
        );
    };

    const hasPredefinedPreviews = previewRef.predefinedPreviewRefs.length > 0;

    const renderPredefinedPreviewList = () => {
        if (hasPredefinedPreviews) {
            return (
                <Panel background="surface-main" shadow={ true }>
                    {
                        previewRef.predefinedPreviewRefs.map(({ link, id }) => {
                            return (
                                <DropdownMenuButton caption={ id } href={ link } target="_blank" />
                            );
                        })
                    }
                </Panel>
            );
        }
        return null;
    };

    return (
        <ControlGroup>
            <Tooltip placement="auto" color="neutral" content={ renderPreviewTooltipContent() }>
                <Button
                    target="_blank"
                    icon={ PreviewIcon }
                    href={ previewRef.link }
                    caption={ LABELS.Fullscreen }
                    fill="none"
                    size="24"
                />
            </Tooltip>
            { hasPredefinedPreviews && (
                <Dropdown
                    renderBody={ renderPredefinedPreviewList }
                    renderTarget={ (props) => <Button { ...props } size="24" fill="none" icon={ MenuIcon } isDropdown={ false } /> }
                    placement="bottom-end"
                />
            )}
        </ControlGroup>
    );
}
