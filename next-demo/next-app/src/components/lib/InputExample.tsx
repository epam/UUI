import { DatePicker, NumericInput } from '@epam/promo';
import {
    Checkbox,
    FlexCell,
    FlexRow,
    LabeledInput,
    Panel,
    PickerInput,
    Switch,
    TextInput,
} from '@epam/uui';
import React, { useCallback, useState } from 'react';
import {
    LazyDataSourceApiRequest,
    LazyDataSourceApiRequestContext,
    useArrayDataSource,
    useLazyDataSource,
    useUuiContext,
} from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import { TApi } from '../../helpers/apiDefinition';
import { AppContextType } from '../../helpers/appContext';

const languageLevels = [
    { id: 2, level: 'A1' },
    { id: 3, level: 'A1+' },
    { id: 4, level: 'A2' },
    { id: 5, level: 'A2+' },
    { id: 6, level: 'B1' },
    { id: 7, level: 'B1+' },
    { id: 8, level: 'B2' },
    { id: 9, level: 'B2+' },
    { id: 10, level: 'C1' },
    { id: 11, level: 'C1+' },
    { id: 12, level: 'C2' },
];

export const InputExample = () => {
    const [value, onValueChange] = useState<string | null>('');
    const [valueText, onValueChangeText] = useState<string | undefined>();
    const [hasBackground, setHasBackground] = useState(true);
    const [isDisabled] = useState(false);
    const [valueBool, onValueChangeBool] = useState<boolean>(false);
    const [valueNumNull, onValueChangeNumNull] = useState<number | null>(0);
    const [valueLazy, onValueChangeLazy] = useState<number[]>([]);
    const [valueArray, onValueChangeArray] = useState<any[]>([]);

    const svc = useUuiContext<TApi, AppContextType>();

    const loadPersons = useCallback(
        (request: LazyDataSourceApiRequest<Person, number>, ctx: LazyDataSourceApiRequestContext<Person, number>) => {
            return svc.api.demo.persons(request, ctx);
        },
        [svc.api.demo]
    );

    const dataSourceLazy = useLazyDataSource({ api: loadPersons }, []);

    const dataSource = useArrayDataSource(
        {
            items: languageLevels,
        },
        []
    );

    return (
        <Panel
            cx={'withGap'}
            rawProps={{
                style: { borderRadius: 0 },
            }}
        >
            <FlexRow>
                <FlexCell width={'auto'}>
                    <DatePicker
                        format='DD-MM-YYYY'
                        value={value}
                        onValueChange={onValueChange}
                    />
                </FlexCell>
            </FlexRow>
            <FlexRow>
                <LabeledInput
                    htmlFor='haveBackground'
                    label='Have background'
                    labelPosition='left'
                >
                    <Switch
                        id='haveBackground'
                        isDisabled={isDisabled}
                        value={hasBackground}
                        onValueChange={(newVal: boolean) => {
                            setHasBackground(newVal);
                        }}
                    />
                </LabeledInput>
            </FlexRow>
            <FlexRow>
                <Checkbox
                    label='Some label'
                    value={valueBool}
                    onValueChange={onValueChangeBool}
                />
            </FlexRow>
            <FlexRow>
                <NumericInput
                    step={2}
                    value={valueNumNull}
                    onValueChange={onValueChangeNumNull}
                    min={-10}
                    max={10}
                />
            </FlexRow>
            <FlexRow columnGap='12'>
                <FlexCell width={'auto'}>
                    <PickerInput
                        dataSource={dataSource}
                        value={valueArray}
                        onValueChange={onValueChangeArray}
                        getName={(item: any) => item.level}
                        entityName='Language level'
                        selectionMode='multi'
                        valueType={'id'}
                        sorting={{ field: 'level', direction: 'asc' }}
                    />
                </FlexCell>
            </FlexRow>
            <FlexRow>
                <FlexCell width={'auto'}>
                    <PickerInput
                        dataSource={dataSourceLazy}
                        value={valueLazy}
                        onValueChange={onValueChangeLazy}
                        entityName='person'
                        selectionMode='multi'
                        valueType='id'
                    />
                </FlexCell>
            </FlexRow>
            <FlexRow>
                <FlexCell width={'auto'}>
                    <LabeledInput label='Some label'>
                        <TextInput
                            value={valueText}
                            onValueChange={onValueChangeText}
                            placeholder='Please type text'
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </Panel>
    );
};
