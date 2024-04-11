import { ILens, useArrayDataSource, useAsyncDataSource } from '@epam/uui-core';
import { PersonLanguageInfo } from '../types';
import { ReactComponent as ClearIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import { ReactComponent as AddIcon } from '@epam/assets/icons/common/action-add-18.svg';
import { useUuiContext } from '@epam/uui-core';
import { TApi } from '../../../data';
import { UuiContexts } from '@epam/uui-core';
import { demoData } from '@epam/uui-docs';
import {
    Button, FlexCell, FlexRow, IconButton, LabeledInput, PickerInput, RichTextView,
} from '@epam/uui';
import { emptyInfo } from '../defaultData';
import * as React from 'react';

export function LanguagesSection({ lens }: { lens: ILens<PersonLanguageInfo[]> }) {
    const svc = useUuiContext<TApi, UuiContexts>();

    const languageDataSource = useAsyncDataSource(
        {
            api: () => svc.api.demo.languages({}).then((r) => r.items),
        },
        [],
    );

    const languageLevelsDataSource = useArrayDataSource(
        {
            items: demoData.languageLevels,
        },
        [],
    );

    function removeLanguage(index: number) {
        const resultItems = lens.get().filter((_, i: number) => index !== i);
        return lens.set(resultItems);
    }

    function addLanguage(item: PersonLanguageInfo) {
        return lens.set(lens.get().concat(item));
    }
    
    const renderLanguageItem = (languageInfo: PersonLanguageInfo, index: number) => {
        const lensItem = lens.index(index);
        const isClearable = index !== 0 || languageInfo.language || languageInfo.speakingLevel || languageInfo.writingLevel;

        return (
            <FlexRow key={ index } vPadding="12" columnGap="18" alignItems="top">
                <FlexCell width={ 186 }>
                    <LabeledInput htmlFor={ `language-${index}` } label="Language" { ...lensItem.prop('language').toProps() }>
                        <PickerInput
                            { ...lensItem.prop('language').toProps() }
                            dataSource={ languageDataSource }
                            selectionMode="single"
                            valueType="id"
                            id={ `language-${index}` }
                            placeholder="Select Language"
                        />
                    </LabeledInput>
                </FlexCell>
                <FlexCell width={ 120 }>
                    <LabeledInput htmlFor={ `speakingLevel-${index}` } label="Speaking" { ...lensItem.prop('speakingLevel').toProps() }>
                        <PickerInput
                            { ...lensItem.prop('speakingLevel').toProps() }
                            dataSource={ languageLevelsDataSource }
                            selectionMode="single"
                            valueType="id"
                            id={ `speakingLevel-${index}` }
                            placeholder="Select Level"
                            getName={ (item) => item.level }
                        />
                    </LabeledInput>
                </FlexCell>
                <FlexCell width={ 120 }>
                    <LabeledInput htmlFor={ `writingLevel-${index}` } label="Writing" { ...lensItem.prop('writingLevel').toProps() }>
                        <PickerInput
                            { ...lensItem.prop('writingLevel').toProps() }
                            dataSource={ languageLevelsDataSource }
                            selectionMode="single"
                            valueType="id"
                            id={ `writingLevel-${index}` }
                            placeholder="Select Level"
                            getName={ (item) => item.level }
                        />
                    </LabeledInput>
                </FlexCell>
                <FlexCell alignSelf="flex-end" grow={ 1 }>
                    <FlexRow size="36" alignItems="center">
                        {isClearable && <IconButton icon={ ClearIcon } onClick={ () => removeLanguage(index) } />}
                    </FlexRow>
                </FlexCell>
            </FlexRow>
        );
    };

    return (
        <>
            <RichTextView>
                <h3>Languages</h3>
            </RichTextView>
            
            {lens.get().map(renderLanguageItem)}

            <FlexRow vPadding="12">
                <Button onClick={ () => addLanguage(emptyInfo.language) } caption="Add One More" icon={ AddIcon } fill="none" />
            </FlexRow>
        </>
    );
}
