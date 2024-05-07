import * as React from 'react';
import {
    Button, ControlGroup,
    Dropdown, DropdownMenuBody, DropdownMenuButton, DropdownSubMenu, Text, Tooltip,
} from '@epam/uui';
import { ReactComponent as PreviewIcon } from '@epam/assets/icons/common/media-fullscreen-12.svg';
import { ReactComponent as MenuIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { TPredefinedPreviewRefItem, TPreviewRef } from '../../../../../preview/types';
import { DropdownBodyProps } from '@epam/uui-core';

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

    const renderPredefinedPreviewList = (props: DropdownBodyProps) => {
        if (hasPredefinedPreviews) {
            const grouped: Record<string | undefined, TPredefinedPreviewRefItem[]> = {};
            previewRef.predefinedPreviewRefs.forEach((item) => {
                if (!grouped[item.groupId]) {
                    grouped[item.groupId] = [];
                }
                grouped[item.groupId].push(item);
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const renderPlainList = (list: TPredefinedPreviewRefItem[], groupId: string | undefined) => {
                return list.map(
                    ({ link, id }) => {
                        return <DropdownMenuButton key={ id } caption={ id } href={ link } target="_blank" />;
                    },
                );
            };
            const menuContent = Object.keys(grouped).map((groupId) => {
                const list = grouped[groupId];
                if (groupId === 'undefined') {
                    return (
                        <React.Fragment key={ groupId }>
                            {renderPlainList(list, undefined)}
                        </React.Fragment>
                    );
                } else {
                    return (
                        <DropdownSubMenu caption={ groupId } key={ groupId }>
                            {renderPlainList(list, groupId)}
                        </DropdownSubMenu>
                    );
                }
            });
            return (
                <DropdownMenuBody { ...props } rawProps={ { style: { padding: '6px 0' } } }>
                    {menuContent}
                </DropdownMenuBody>
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
