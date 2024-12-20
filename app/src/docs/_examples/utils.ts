import { ExampleProps } from './types';
import { OneOfEditor } from '@epam/uui-docs';

export const getAllPropValues = (propName: string, shouldRevert: boolean | undefined, props: ExampleProps): any => {
    const values = (props.propDocs[propName].editor as OneOfEditor).options;

    return shouldRevert ? values.slice().reverse() : values;
};
