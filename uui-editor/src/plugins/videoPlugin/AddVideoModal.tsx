export {};
// import * as React from 'react';
// import { IModal, prependHttp, uuiSkin } from '@epam/uui-core';
// import { FlexSpacer } from '@epam/uui-components';
// import css from './AddVideoModal.scss';
// import { Editor } from "slate-react";
// import getVideoId from "get-video-id";
//
//
// const { LabeledInput, ModalBlocker, ModalWindow, ModalHeader, FlexRow, TextInput, ModalFooter, Button } = uuiSkin;
//
//
// interface AddVideoModalProps extends IModal<any> {
//     editor: Editor;
// }
//
// export type VideoService = 'youtube' | 'vimeo' | 'videoportal' | 'vine' | 'videopress';
//
// export function getVideoInfo(url: string): { id?: string, service?: VideoService } {
//
//     const videoInfo = getVideoId(url);
//     if (videoInfo.id || videoInfo.service) {
//         return videoInfo;
//     }
//
//     if (url.includes('videoportal.epam.com')) {
//         const service = 'videoportal';
//         const result = url.match(/(?:videoportal.epam.com\/video\/)+(\w+)/);
//         let id;
//
//         if (result) {
//             id = result[1];
//         }
//
//         return { id, service };
//     }
//
//     return {};
// }
//
// export function getVideoSrc(src: string) {
//     const { id, service } = getVideoInfo(prependHttp(src, { https: false }));
//
//     switch (service) {
//         case 'youtube': return `https://www.youtube.com/embed/${id}`;
//         case 'videoportal': return `//videoportal.epam.com/video/iframe.html?video=${id}`;
//         case 'vimeo': return `https://player.vimeo.com/video/${id}`;
//         default: return src;
//     }
// }
//
// export class AddVideoModal extends React.Component<AddVideoModalProps> {
//     state: any = {
//         src: '',
//         file: null,
//     };
//
//     createVideoBlock = () => {
//         const src = getVideoSrc(this.state.src);
//
//         const block = ((this.props.editor) as any).createBlock({ src: src }, 'iframe');
//         this.props.editor.insertBlock(block) ;
//         this.props.success(true);
//     }
//
//     render() {
//         return (
//             <ModalBlocker { ...this.props }>
//                 <ModalWindow >
//                     <ModalHeader title="Add video" onClose={ this.props.abort } />
//                     <FlexRow cx={ css.inputWrapper }>
//                         <LabeledInput label='Video url' >
//                             <TextInput value={ this.state.src } onValueChange={ (newVal) => this.setState({ src: newVal }) } autoFocus/>
//                         </LabeledInput>
//                     </FlexRow>
//                     <ModalFooter borderTop >
//                         <FlexSpacer />
//                         <Button type='cancel' caption='Cancel' onClick={ () => this.props.abort() } />
//                         <Button type='success' caption='Ok' isDisabled={ !this.state.src } onClick={ this.createVideoBlock }
//                         />
//                     </ModalFooter>
//                 </ModalWindow>
//             </ModalBlocker>
//         );
//     }
// }
