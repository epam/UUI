import React from 'react';
import { IPropDocEditor, TSharedPropEditorType } from '../../types';
import { CssClassEditor } from './cssClassEditor';
import { JsonEditor } from './jsonEditor';
import { JsonView } from './jsonView';
import { LinkEditor } from './linkEditor';
import { NumEditor } from './numEditor';
import { StringEditor, StringWithExamplesEditor } from './stringEditor';
import { MultiUnknownEditor } from './multiUnknownEditor';
import { SingleUnknownEditor } from './singleUnknownEditor';
import { CantResolve } from './cantResolve';

export const SharedPropEditorsMap: Record<TSharedPropEditorType, React.FC<IPropDocEditor>> = {
    CssClassEditor,
    JsonEditor,
    JsonView,
    LinkEditor,
    NumEditor,
    StringEditor,
    StringWithExamplesEditor,
    MultiUnknownEditor,
    SingleUnknownEditor,
    CantResolve,
};
