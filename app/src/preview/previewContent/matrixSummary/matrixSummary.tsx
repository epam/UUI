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

export function MatrixInfo(modalProps: IModal<string> & { arr: TNormalizedMatrix[], totalUseCases: number }) {
    const title = modalProps.totalUseCases > 1 ? `Props (total use cases: ${modalProps.totalUseCases})` : 'Props';
    return (
        <ModalBlocker { ...modalProps }>
            <ModalWindow>
                <Panel background="surface-main">
                    <ModalHeader title={ title } onClose={ () => modalProps.abort() } />
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <FlexRow padding="24" vPadding="24">
                            <FlexCell>
                                { formatNormalizedMatrix(modalProps.arr) }
                            </FlexCell>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter>
                        <FlexSpacer />
                        <Button color="primary" caption="Ok" onClick={ () => modalProps.success('ok') } />
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
        const fixed = renderRows(matrixInfo.fixed);
        const dynamic = renderRows(matrixInfo.dynamic);
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
                </tbody>
            </table>
        ));
    });
    if (result.length) {
        return result;
    }
}

function renderRows(o: Record<string, unknown[]>): JSX.Element[] {
    return Object.keys(o).map((name) => {
        const valueArr = o[name as keyof typeof o];
        return (
            <tr key={ name }>
                <th className={ css.propName }>{`${name}`}</th>
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

type TAcc = { fixed: Record<string, unknown[]>; dynamic: Record<string, unknown[]>; totalUseCases: number; valueSpan: number };
function getMatrixInfo(matrix: TNormalizedMatrix): TAcc {
    return Object.keys(matrix).reduce<TAcc>((acc, name) => {
        const values = matrix[name].values;
        if (values.length > 1) {
            if (!acc.totalUseCases) {
                acc.totalUseCases = values.length;
            } else {
                acc.totalUseCases *= values.length;
            }
            acc.dynamic[name] = values;
        } else {
            acc.fixed[name] = values;
        }
        acc.valueSpan = Math.max(acc.valueSpan, values.length);
        return acc;
    }, { fixed: {}, dynamic: {}, totalUseCases: 1, valueSpan: 1 });
}
