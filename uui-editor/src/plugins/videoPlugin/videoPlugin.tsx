export {};
// import { Editor } from 'slate-react';
// import * as React from 'react';
// import { useUuiContext } from '@epam/uui-core';
// import { AddVideoModal } from './AddVideoModal';
// import { ReactComponent as VideoIcon } from '../../icons/video.svg';
// import { ToolbarButton } from '../../implementation/ToolbarButton';
// import { isTextSelected } from '../../helpers';
//
// export const videoPlugin = () => {
//
//     return {
//         sidebarButtons: [
//             VideoButton,
//         ],
//     };
// };
//
// const VideoButton = (props: { editor: Editor }) => {
//     const context = useUuiContext();
//
//     return <ToolbarButton
//         onClick={ () => context.uuiModals.show<string>(modalProps => <AddVideoModal { ...modalProps } editor={ props.editor } />)
//             .catch(() => null) }
//         icon={ VideoIcon }
//         isDisabled={ isTextSelected(props.editor) }
//     />;
// };