'use client';

import React, { useState } from 'react';
import { Panel, FlexSpacer, FlexRow, Switch, MultiSwitch } from '@epam/promo';
import {
  SlateEditor,
  defaultPlugins,
  imagePlugin,
  videoPlugin,
  toDoListPlugin,
  baseMarksPlugin,
  linkPlugin,
  iframePlugin,
  notePlugin,
  separatorPlugin,
  tablePlugin,
  quotePlugin,
  colorPlugin,
  superscriptPlugin,
  headerPlugin,
  listPlugin,
  placeholderPlugin,
  codeBlockPlugin,
  EditorValue,
} from '@epam/uui-editor';
import { demoData } from '@epam/uui-docs';
import css from '../../styles/SlateEditorBasicExample.module.scss';
import { withErrorHandle } from '../../components/withErrorHandle';

type EditorFontSize = '14' | '16';
type EditorMode = 'form' | 'inline';

export default withErrorHandle(function SlateEditorBasicExample() {
  const [value, setValue] = useState<EditorValue | null>(
    demoData.slateInitialValue
  );
  const [isReadonly, setIsReadonly] = useState<boolean>(false);
  const [mode, setMode] = useState<EditorMode>('form');
  const [fontSize, setFontSize] = useState<EditorFontSize>('14');

  // const uploadFile = (file: File, onProgress: (progress: number) => unknown): unknown => {
  //     return svc.uuiApi.uploadFile(ORIGIN.concat('/api/uploadFile'), file, {
  //         onProgress,
  //     });
  // }

  const plugins = [
    ...defaultPlugins,
    baseMarksPlugin(),
    headerPlugin(),
    colorPlugin(),
    superscriptPlugin(),
    listPlugin(),
    toDoListPlugin(),
    quotePlugin(),
    linkPlugin(),
    notePlugin(),
    // uploadFilePlugin({ uploadFile })
    // attachmentPlugin(),
    imagePlugin(),
    videoPlugin(),
    iframePlugin(),
    separatorPlugin(),
    tablePlugin(),
    placeholderPlugin({
      items: [
        {
          name: 'Name',
          field: 'name',
        },
        {
          name: 'Email',
          field: 'email',
        },
      ],
    }),
    codeBlockPlugin(),
  ];

  return (
    <div className={'withGap'}>
      <h2>Demo example with RichTextEditor(RTE)</h2>
      <Panel cx={css.root}>
        <FlexRow
          columnGap='18'
          vPadding='12'
        >
          <MultiSwitch
            items={[
              { id: '14', caption: '14' },
              { id: '16', caption: '16' },
            ]}
            value={fontSize}
            onValueChange={(value: EditorFontSize) => setFontSize(value)}
            color='blue'
          />
          <FlexSpacer />
          <Switch
            value={mode === 'inline'}
            onValueChange={(val: boolean) => setMode(val ? 'inline' : 'form')}
            label='Inline mode'
          />
          <Switch
            value={isReadonly}
            onValueChange={setIsReadonly}
            label='View mode'
          />
        </FlexRow>

        <SlateEditor
          value={value}
          onValueChange={setValue}
          isReadonly={isReadonly}
          plugins={plugins}
          mode={mode}
          placeholder='Add description'
          minHeight={'none'}
          fontSize={fontSize}
        />
      </Panel>
    </div>
  );
});
