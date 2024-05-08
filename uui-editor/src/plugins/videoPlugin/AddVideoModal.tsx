import * as React from 'react';
import { IModal, prependHttp } from '@epam/uui-core';
import { FlexSpacer, FlexRow, ModalBlocker, ModalHeader, ModalWindow, ModalFooter, LabeledInput, Button, TextInput } from '@epam/uui';
import css from './AddVideoModal.module.scss';

import getVideoId from 'get-video-id';
import { useState } from 'react';
import { PlateEditor, setElements } from '@udecode/plate-common';

interface AddVideoModalProps extends IModal<any> {
    editor: PlateEditor;
}

export type VideoService = 'youtube' | 'vimeo' | 'videoportal' | 'vine' | 'videopress';

export function getVideoInfo(url: string): { id?: string, service?: VideoService } {
    const videoInfo = getVideoId(url);
    if (videoInfo.id || videoInfo.service) {
        return videoInfo;
    }

    if (url.includes('videoportal.epam.com')) {
        const service = 'videoportal';
        const result = url.match(/(?:videoportal.epam.com\/video\/)+(\w+)/);
        let id;

        if (result) {
            id = result[1];
        }

        return { id, service };
    }

    return {};
}

export function getVideoSrc(src: string) {
    const { id, service } = getVideoInfo(prependHttp(src, { https: false }));

    switch (service) {
        case 'youtube': return `https://www.youtube.com/embed/${id}`;
        case 'videoportal': return `https://videoportal.epam.com/video/iframe.html?video=${id}`;
        case 'vimeo': return `https://player.vimeo.com/video/${id}`;
        default: return src;
    }
}

export function AddVideoModal({ editor, success, abort, ...props }: AddVideoModalProps) {
    const [src, setSrc] = useState('');

    const createVideoBlock = () => {
        const formattedSrc = getVideoSrc(src);
        setElements(editor, {
            type: 'iframe',
            data: { src: formattedSrc },
            url: formattedSrc,
        });

        success(true);
    };

    return (
        <ModalBlocker { ...props } success={ success } abort={ abort }>
            <ModalWindow>
                <ModalHeader title="Add video" onClose={ abort } />
                <FlexRow cx={ css.inputWrapper }>
                    <LabeledInput label="Video url">
                        <TextInput
                            value={ src }
                            onValueChange={ (v) => {
                                if (v) {
                                    setSrc(v);
                                }
                            } }
                            autoFocus
                        />
                    </LabeledInput>
                </FlexRow>
                <ModalFooter borderTop>
                    <FlexSpacer />
                    <Button color="secondary" fill="outline" caption="Cancel" onClick={ () => abort() } />
                    <Button
                        color="primary"
                        caption="Ok"
                        isDisabled={ !src }
                        onClick={ createVideoBlock }

                    />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
