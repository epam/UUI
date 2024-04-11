import * as React from 'react';
import {
    FlexCell,
    FlexRow,
    FlexSpacer,
    IconButton,
    ScrollBars,
    Text,
    Tooltip,
} from '@epam/uui';
import { PeTableRow } from './PeTableRow';
import { IPeTableProps } from './types';
import { ReactComponent as ResetIcon } from '../../../../../icons/reset-icon.svg';
import css from './peTable.module.scss';
import { PropDoc } from '@epam/uui-docs';

const LABELS = {
    Name: 'NAME',
    Default: 'DEFAULT',
    Preset: 'PRESET',
    ResetSettings: 'Reset setting',
};

function propsComparator<TProps>(p1: PropDoc<TProps, keyof TProps>, p2: PropDoc<TProps, keyof TProps>) {
    return p1.name.toLowerCase().localeCompare(p2.name.toLowerCase());
}

export function PeTable<TProps>(props: IPeTableProps<TProps>) {
    const sortedProps = [...props.propDoc].sort((p1, p2) => propsComparator<TProps>(p1, p2));

    const rows = sortedProps.map((p, index: number) => {
        const key = `${p.name}_${index}`;
        const value = props.inputData[p.name]?.value;
        const exampleId = props.inputData[p.name]?.exampleId;
        return (
            <PeTableRow<TProps>
                key={ key }
                prop={ p }
                value = { value }
                exampleId = { exampleId }
                onClearProp={ props.onClearProp }
                propContext={ props.propContext }
                onValueChange={ props.onValueChange }
                onExampleIdChange={ props.onExampleIdChange }
            />
        );
    });

    return (
        <div className={ css.container }>
            <PeTableToolbar
                tooltip={ props.typeRef }
                title={ props.title }
                onResetAllProps={ props.onResetAllProps }
            />
            <PeTableHeader />
            <div className={ css.rowProps }>
                <ScrollBars>
                    { rows }
                </ScrollBars>
            </div>
            { props.children }
        </div>
    );
}
PeTable.displayName = 'PeTable';

const PeTableToolbar = /* @__PURE__ */React.memo(
    function PeTableToolbarComponent<TProps>({ title, onResetAllProps, tooltip }: Pick<IPeTableProps<TProps>, 'title' | 'onResetAllProps'> & { tooltip: string }) {
        return (
            <FlexRow key="head" size="36" padding="12" borderBottom columnGap="12" cx={ [css.boxSizing, css.toolbar] }>
                <Tooltip content={ tooltip }>
                    <Text fontSize="16" lineHeight="24" cx={ css.vPadding } fontWeight="600">
                        {title}
                    </Text>
                </Tooltip>
                <FlexSpacer />
                <Tooltip placement="auto" content={ LABELS.ResetSettings }>
                    <IconButton
                        icon={ ResetIcon }
                        onClick={ onResetAllProps }
                        color="info"
                    />
                </Tooltip>
            </FlexRow>
        );
    },
);
const PeTableHeader = /* @__PURE__ */React.memo(function HeaderComponent() {
    const getText = (msg: string) => (
        <Text size="24" fontWeight="600">
            { msg }
        </Text>
    );
    return (
        <FlexRow
            key="table-head"
            size="36"
            padding="12"
            columnGap="6"
            borderBottom
            cx={ css.boxSizing }
            background="surface-main"
        >
            <FlexCell key="name" width={ 130 }>
                {getText(LABELS.Name)}
            </FlexCell>
            <FlexCell key="default" width={ 100 }>
                {getText(LABELS.Default)}
            </FlexCell>
            <FlexCell key="examples" grow={ 1 }>
                {getText(LABELS.Preset)}
            </FlexCell>
        </FlexRow>
    );
});
