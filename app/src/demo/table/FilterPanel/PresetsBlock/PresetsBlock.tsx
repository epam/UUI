import React, { ReactEventHandler, useCallback, useState } from 'react';
import { IPresetsApi, ITablePreset, Accordion, IconContainer, TextInput, VerticalTabButton, FlexSpacer } from '@epam/uui';
import { ReactComponent as PlusIcon } from '@epam/assets/icons/common/content-add-outline-18.svg';
import css from './PresetsBlock.scss';


interface IPresetsBlockProps {
    presets: ITablePreset[];
    createNewPreset: IPresetsApi["createNewPreset"];
    isDefaultPresetActive: IPresetsApi["isDefaultPresetActive"];
    resetToDefault: IPresetsApi["resetToDefault"];
    activePresetId: IPresetsApi["activePresetId"];
    hasPresetChanged: IPresetsApi["hasPresetChanged"];
    choosePreset: IPresetsApi["choosePreset"];
}

const PresetsBlock: React.FC<IPresetsBlockProps> = ({ presets, createNewPreset, isDefaultPresetActive, resetToDefault, activePresetId, hasPresetChanged, choosePreset }) => {
    const [isOpened, setIsOpened] = useState(true);
    const [isAddingPreset, setIsAddingPreset] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const addPreset: ReactEventHandler<HTMLDivElement> = useCallback(event => {
        event.stopPropagation();
        setIsAddingPreset(true);
        setIsOpened(true);
    }, []);

    const saveNewPreset = useCallback(() => {
        if (!inputValue) {
            setIsAddingPreset(false);
            return;
        }

        createNewPreset(inputValue);

        setIsAddingPreset(false);
        setInputValue("");
    }, [inputValue, createNewPreset]);

    const renderAddPresetIcon = useCallback(() => {
        return (
            <>
                <FlexSpacer/>
                <IconContainer icon={ PlusIcon } cx={ [css.icon] } onClick={ addPreset }/>
            </>
        );
    }, [addPreset]);

    return (
        <Accordion
            title="Presets"
            mode="inline"
            padding="18"
            renderAdditionalItems={ renderAddPresetIcon }
            value={ isOpened }
            onValueChange={ setIsOpened }
            cx={ css.accordion }
        >
            <>
                <VerticalTabButton
                    key="default"
                    caption="Default"
                    onClick={ isDefaultPresetActive ? null : resetToDefault }
                    isLinkActive={ isDefaultPresetActive }
                    size="36"
                    cx={ css.button }
                />
                { presets.map(preset => {
                    const isActive = preset.id === activePresetId;
                    const hasChanged = isActive && hasPresetChanged(preset);
                    return (
                        <VerticalTabButton
                            key={ preset.id }
                            caption={ preset.name + (hasChanged ? "*" : "") }
                            onClick={ () => choosePreset(preset) }
                            isLinkActive={ isActive }
                            size="36"
                            cx={ [css.button, hasChanged && css.changed] }
                        />
                    );
                }) }
                { isAddingPreset && (
                    <div className={ css.inputWrapper }>
                        <TextInput
                            onBlur={ saveNewPreset }
                            onAccept={ saveNewPreset }
                            value={ inputValue }
                            onValueChange={ setInputValue }
                            autoFocus
                        />
                    </div>
                ) }
            </>
        </Accordion>
    );
};

export default React.memo(PresetsBlock);