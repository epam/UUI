import * as React from 'react';
import { Value } from 'slate';
import { CX, cx, IEditableDebouncer } from '@epam/uui';
import { Blocker } from '@epam/loveship';
import { SlateEditor, basePlugins, toDoListPlugin, attachmentPlugin, imagePlugin, videoPlugin, linkPlugin, iframePlugin, notePlugin, separatorPlugin, headerPlugin, colorPlugin, superscriptPlugin, listPlugin, quotePlugin, tablePlugin, codeBlockPlugin,
} from "@epam/uui-editor";
import { svc } from '../../services';
import * as css from './EditableDocContent.scss';
import { useCallback, useEffect, useImperativeHandle, useState } from "react";

export interface EditableDocContentApi {
    persistCurrentValue: () => Promise<void>;
}

export interface EditableDocContentProps {
    fileName: string;
    minHeight?: number | 'none';
    wrapperCx?: CX;
    editorCx?: CX;
    isPersistOnChange?: boolean;
    apiRef?: React.MutableRefObject<EditableDocContentApi>;
}

const plugins = [
    ...basePlugins,
    headerPlugin(),
    colorPlugin(),
    superscriptPlugin(),
    listPlugin(),
    toDoListPlugin(),
    linkPlugin(),
    quotePlugin(),
    attachmentPlugin(),
    imagePlugin(),
    videoPlugin(),
    iframePlugin(),
    notePlugin(),
    separatorPlugin(),
    tablePlugin(),
    codeBlockPlugin(),
];

EditableDocContent.plugins = plugins;
export function EditableDocContent(props: EditableDocContentProps) {
    const { minHeight = 36, wrapperCx, editorCx, fileName, isPersistOnChange = true, apiRef } = props;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [content, setContent] = useState<Value>(null);

    useEffect(() => {
        let isOutdated = false;

        svc.uuiApi.processRequest('/api/get-doc-content', 'POST', { name: fileName })
            .then(res => {
                if (isOutdated) {
                    return;
                }
                setContent(res.content && Value.fromJSON(res.content));
                setIsLoading(false);
            });
        return () => {
            isOutdated = true;
        };
    }, [fileName]);

    const persistValue = useCallback(async (content: Value) => {
        await svc.uuiApi.processRequest('/api/save-doc-content', 'POST', {
            name: fileName,
            content: content.toJSON() || null,
        });
    }, [fileName]);

    const persistCurrentValue = useCallback(async () => {
        await persistValue(content);
    }, [fileName, content, persistValue]);

    const handleValueChange = useCallback(async (content: Value) => {
        setContent(content);
        if (isPersistOnChange) {
            await persistValue(content);
        }
    }, [isPersistOnChange, persistValue]);

    useImperativeHandle(apiRef, () => {
        return {
            persistCurrentValue,
        };
    }, [persistCurrentValue]);

    return (
        <div className={ cx(css.wrapper, wrapperCx) } >
            <IEditableDebouncer
                disableDebounce={ !isPersistOnChange }
                value={ content }
                onValueChange={ handleValueChange }
                render={ (props) => <SlateEditor
                    placeholder='Please type'
                    plugins={ plugins }
                    cx={ cx(css.container, editorCx) }
                    mode='inline'
                    isReadonly={ !window.location.host.includes('localhost') }
                    minHeight={ minHeight }
                    fontSize="16"
                    { ...props }
                /> }
            />
            <Blocker isEnabled={ isLoading } />
        </div>

    ) ;
}
