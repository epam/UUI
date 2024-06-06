import { TNormalizedMatrix } from '@epam/uui-docs';
import { IModal } from '@epam/uui-core';
import React from 'react';
import {
    Button,
    FlexCell,
    FlexRow, FlexSpacer,
    ModalBlocker, ModalFooter,
    ModalHeader,
    ModalWindow,
    Panel,
    ScrollBars, Text,
} from '@epam/uui';
import css from './matrixSummary.module.scss';

export function MatrixSummary(modalProps: IModal<string> & { arr: TNormalizedMatrix[], totalUseCases: number }) {
    const title = modalProps.totalUseCases > 1 ? `Props (total use cases: ${modalProps.totalUseCases})` : 'Props';
    return (
        <ModalBlocker { ...modalProps }>
            <ModalWindow width={ 640 }>
                <Panel background="surface-main">
                    <ModalHeader title={ title } onClose={ () => modalProps.abort() } />
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <FlexRow padding="24" vPadding="24">
                            <FlexCell minWidth={ 360 }>
                                { formatNormalizedMatrix(modalProps.arr) }
                            </FlexCell>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter>
                        <FlexSpacer />
                        <Button color="primary" caption="OK" onClick={ () => modalProps.success('OK') } />
                    </ModalFooter>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    );
}

function formatNormalizedMatrix(arr: TNormalizedMatrix[]): React.ReactNode | undefined {
    const result: React.ReactNode[] = [];
    arr.forEach((matrix, index) => {
        const matrixInfo = getMatrixInfo(matrix);
        const fixed = renderRows(matrixInfo.fixed, (name: string) => !!matrix[name].condition);
        const dynamic = renderRows(matrixInfo.dynamic, (name: string) => !!matrix[name].condition);
        const isNoProps = Object.keys(matrix).length === 0;
        if (result.length) {
            result.push(<br key={ `${index}_br` } />);
        }
        const title = arr.length > 1 ? `Matrix ${index + 1}` : '';
        result.push((
            <table className={ css.rootTable } key={ index }>
                { !!title && (
                    <thead>
                        <tr>
                            <th colSpan={ 2 } className={ css.title }>
                                { title }
                            </th>
                        </tr>
                    </thead>
                )}
                <tbody>
                    { fixed }
                    { dynamic }
                    {
                        isNoProps && (
                            <tr><td colSpan={ 2 }>No properties defined. Only use the default properties defined in "Property Explorer" will be used.</td></tr>
                        )
                    }
                </tbody>
            </table>
        ));
    });
    if (result.length) {
        return result;
    }
}

function renderRows(o: Record<string, unknown[]>, hasCondition: (name: string) => boolean): JSX.Element[] {
    return Object.keys(o).map((name) => {
        const valueArr = o[name as keyof typeof o];
        return (
            <tr key={ name }>
                <th className={ css.propName }>{`${name}${hasCondition(name) ? ' (conditional)' : ''}`}</th>
                <td className={ css.propValueContainer }>
                    <table className={ css.valueTable } border={ 1 }>
                        <tbody>
                            <tr>
                                {
                                    valueArr.map(stringifyPropValue).map((v, index) => {
                                        return (
                                            <td key={ index } className={ css.propValue }>
                                                <Text>{ v }</Text>
                                            </td>
                                        );
                                    })
                                }
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        );
    });
}

function stringifyPropValue(v: unknown) {
    if (v === null) {
        return 'null';
    }
    if (v === undefined) {
        return 'undefined';
    }
    if (['string', 'number', 'boolean'].includes(typeof v)) {
        return JSON.stringify(v);
    }
    if (React.isValidElement(v)) {
        return '<element>';
    }
    if (typeof v === 'function') {
        return '<callback>';
    }
    if (typeof (v as any).render?.name === 'string') {
        return (v as any).render?.name;
    }
    return trucStr(JSON.stringify(v));
}

function trucStr(str: string, truncAfter: number = 100) {
    const trunc = str.substring(0, Math.min(truncAfter, str.length));
    if (trunc.length < str.length) {
        return trunc + ' ...';
    }
    return trunc;
}

type TAcc = { fixed: Record<string, unknown[]>; dynamic: Record<string, unknown[]>; valueSpan: number };
function getMatrixInfo(matrix: TNormalizedMatrix): TAcc {
    return Object.keys(matrix).reduce<TAcc>((acc, name) => {
        const values = matrix[name].values;
        if (values.length > 1 || !!matrix[name].condition) {
            acc.dynamic[name] = values;
        } else {
            acc.fixed[name] = values;
        }
        acc.valueSpan = Math.max(acc.valueSpan, values.length);
        return acc;
    }, { fixed: {}, dynamic: {}, valueSpan: 1 });
}
