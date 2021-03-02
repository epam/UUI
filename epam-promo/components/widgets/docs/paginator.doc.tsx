import { DocBuilder } from '@epam/uui-docs';
import { PaginatorProps } from '@epam/uui-components';
import { Paginator } from "../Paginator";
import { DefaultContext, iEditable } from "../../../docs";

const paginatorDoc = new DocBuilder<PaginatorProps>({name: 'Paginator', component: Paginator })
    .implements([iEditable] as any)
    .prop('size', { examples: ['24', { value: '30', isDefault: true }] })
    .prop('value', { examples: [1, { value: 5, isDefault: true }, 6, 8], isRequired: true })
    .prop('totalPages', { examples: [5 , 8, { value: 10, isDefault: true }, 100, 1000], isRequired: true })
    .withContexts(DefaultContext);

export = paginatorDoc;