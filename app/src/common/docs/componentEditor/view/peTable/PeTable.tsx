import * as React from 'react';
import { FlexCell, FlexRow, FlexSpacer, IconButton, ScrollBars, Text, Tooltip } from '@epam/uui';
import { PeTableRow } from './PeTableRow';
import { IPeTableProps } from './types';
import { ReactComponent as ResetIcon } from '../../../../../icons/reset-icon.svg';
import css from './peTable.module.scss';

export function PeTable<TProps>(props: IPeTableProps<TProps>) {
    const rows = props.propDoc.map((p, index: number) => {
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
            <PeTableToolbar title={ props.title } onResetAllProps={ props.onResetAllProps } titleTooltip={ props.titleTooltip } />
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

const PeTableToolbar = React.memo(
    function PeTableToolbarComponent<TProps>({ titleTooltip, title, onResetAllProps }: Pick<IPeTableProps<TProps>, 'titleTooltip' | 'title' | 'onResetAllProps'>) {
        return (
            <FlexRow key="head" size="36" padding="12" borderBottom spacing="6" cx={ css.boxSizing }>
                <Tooltip content={ titleTooltip }>
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
        <FlexRow key="table-head" size="36" padding="12" spacing="6" borderBottom cx={ css.boxSizing } background="surface-main">
            <FlexCell key="name" width={ 130 }>
                <Text size="24" fontWeight="600">
                    NAME
                </Text>
            </FlexCell>
            <FlexCell key="default" width={ 100 }>
                <Text size="24" fontWeight="600">
                    DEFAULT
                </Text>
            </FlexCell>
            <FlexCell key="examples" grow={ 1 }>
                <Text size="24" fontWeight="600">
                    PRESET
                </Text>
            </FlexCell>
        </FlexRow>
    );
});
