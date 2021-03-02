import getVideoId from 'get-video-id';
import flatten from 'lodash.flatten';
import { parseStringToCSSProperties, prependHttp } from "@epam/uui";
import Html from 'slate-html-serializer';
import { Editor } from "slate-react";


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
        case 'videoportal': return `//videoportal.epam.com/video/iframe.html?video=${id}`;
        case 'vimeo': return `https://player.vimeo.com/video/${id}`;
        default: return src;
    }
}

export function getBlockDesirialiser(blockTags: Record<string, string>) {
    return (el: any, next: any) => {
        const block = blockTags[el.tagName.toLowerCase()];

        if (block) {
            return {
                object: 'block',
                type: block,
                nodes: next(el.childNodes),
            };
        }
    };
}

export function getMarkDeserializer(marks: Record<string, string>) {
    return (el: any, next: any) => {
        const mark = marks[el.tagName.toLowerCase()];

        if (mark) {
            return {
                object: 'mark',
                type: mark,
                nodes: next(el.childNodes),
            };
        }
    };
}

export function getSerializer(plugins: any) {
    let rules: any = [];
    flatten(plugins).map((plugin: any) => {
        plugin.serializers && plugin.serializers.map((serializer: any) => {
            rules.push({
                deserialize: serializer,
            });
        });
    });
    return new Html({ rules: rules });
}

export function getReadableFileSizeString(fileSizeInBytes: number) {
    let i = -1;
    let byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1000;
        i++;
    } while (fileSizeInBytes > 1000);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

export function isTextSelected(editor: Editor) {
    return editor && !(editor.value.selection.isBlurred || editor.value.selection.isCollapsed || editor.value.fragment.text === '');
}