import * as React from 'react';
import { FlexCell, FlexRow, FlexSpacer, IconButton, ScrollBars, Text, Tooltip } from '@epam/uui';
import { PeTableRow } from './PeTableRow';
import { IPeTableProps } from './types';
import { ReactComponent as ResetIcon } from '../../../../../icons/reset-icon.svg';
import css from './peTable.module.scss';
import { PropDoc } from '@epam/uui-docs';

const LABELS = {
    componentProperties: 'Component properties',
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
        <section aria-label={ LABELS.componentProperties } className={ css.container }>
            <PeTableToolbar tooltip={ props.typeRef } title={ props.title } onResetAllProps={ props.onResetAllProps } />
            <div role="table" className={ css.table }>
                <PeTableHeader />
                <div className={ css.rowProps } role="rowgroup">
                    <ScrollBars>
                        { rows }
                    </ScrollBars>
                </div>
            </div>
            { props.children }
        </section>
    );
}
PeTable.displayName = 'PeTable';

const PeTableToolbar = React.memo(
    function PeTableToolbarComponent<TProps>({ title, onResetAllProps, tooltip }: Pick<IPeTableProps<TProps>, 'title' | 'onResetAllProps'> & { tooltip: string }) {
        return (
            <FlexRow size="36" padding="12" borderBottom spacing="6" cx={ css.boxSizing }>
                <Tooltip content={ tooltip }>
                    <Text fontSize="16" lineHeight="24" cx={ css.vPadding } fontWeight="600">
                        {title}
                    </Text>
                </Tooltip>
                <FlexSpacer />
                <Tooltip placement="auto" content="Reset setting">
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
const PeTableHeader = React.memo(function HeaderComponent() {
    return (
        <div role="rowgroup">
            <FlexRow size="36" padding="12" spacing="6" borderBottom cx={ css.boxSizing } background="surface-main" rawProps={ { role: 'row' } }>
                <FlexCell key="name" width={ 130 } rawProps={ { role: 'columnheader' } }>
                    <Text size="24" fontWeight="600">
                        NAME
                    </Text>
                </FlexCell>
                <FlexCell key="default" width={ 100 } rawProps={ { role: 'columnheader' } }>
                    <Text size="24" fontWeight="600">
                        DEFAULT
                    </Text>
                </FlexCell>
                <FlexCell key="examples" grow={ 1 } rawProps={ { role: 'columnheader' } }>
                    <Text size="24" fontWeight="600">
                        PRESET
                    </Text>
                </FlexCell>
            </FlexRow>
        </div>
    );
});
