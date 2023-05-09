import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { SpinnerProps } from '@epam/uui';
import { Spinner } from '@epam/uui';
import { DefaultContext } from '../../docs';

const spinnerDoc = new DocBuilder<SpinnerProps>({ name: 'Spinner', component: Spinner }).withContexts(DefaultContext);

export default spinnerDoc;
