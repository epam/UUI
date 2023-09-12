import React, { useState } from 'react';
import { FlexCell, FlexRow, LabeledInput, Panel, PickerInput } from '@epam/uui';
import { usePropsDataSources } from '../dataHooks';
import { ExportInfo } from './ExportInfo';

export function Docs() {
    const [packageName, setPackageName] = useState<string>(null);
    const [exportName, setExportName] = useState<string>(null);
    const {
        exportsDs,
        modulesDs,
    } = usePropsDataSources({ packageName, exportName });

    return (
        <Panel shadow>
            <FlexRow padding="12" vPadding="18" spacing="18">
                <FlexCell width="auto">
                    <LabeledInput label="Package name">
                        <PickerInput
                            valueType="id"
                            getName={ ({ name }) => name }
                            dataSource={ modulesDs }
                            selectionMode="single"
                            value={ packageName }
                            onValueChange={ setPackageName }
                        />
                    </LabeledInput>
                    <LabeledInput label="Exported entity">
                        <PickerInput
                            valueType="id"
                            getName={ ({ name }) => name }
                            dataSource={ exportsDs }
                            selectionMode="single"
                            value={ exportName }
                            onValueChange={ setExportName }
                        />
                    </LabeledInput>
                    <ExportInfo packageName={ packageName } exportName={ exportName } />
                </FlexCell>
            </FlexRow>
        </Panel>
    );
}
