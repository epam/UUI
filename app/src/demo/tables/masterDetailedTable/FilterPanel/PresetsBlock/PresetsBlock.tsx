import React, { ReactEventHandler, useCallback, useState } from 'react';
import { IPresetsApi } from '@epam/uui-core';
import {
    Accordion, IconContainer, TextInput, VerticalTabButton, FlexSpacer,
} from '@epam/uui';
import { ReactComponent as PlusIcon } from '@epam/assets/icons/common/content-add-outline-18.svg';
import css from './PresetsBlock.module.scss';

interface PresetsBlockProps extends IPresetsApi {}

const PresetsBlock: React.FC<PresetsBlockProps> = ({
    presets, createNewPreset, activePresetId, hasPresetChanged, choosePreset,
}) => {
    const [isOpened, setIsOpened] = useState(true);
    const [isAddingPreset, setIsAddingPreset] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const addPreset: ReactEventHandler<HTMLDivElement> = useCallback((event) => {
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
        setInputValue('');
    }, [inputValue, createNewPreset]);

    const renderAddPresetIcon = useCallback(() => {
        return (
            <>
                <FlexSpacer />
                <IconContainer icon={ PlusIcon } cx={ [css.icon] } onClick={ addPreset } />
            </>
        );
    }, [addPreset]);

    return (
        <Accordion title="Presets" mode="inline" padding="18" renderAdditionalItems={ renderAddPresetIcon } value={ isOpened } onValueChange={ setIsOpened } cx={ css.accordion }>
            <>
                {presets.map((preset) => {
                    const isActive = preset.id === activePresetId;
                    const hasChanged = isActive && hasPresetChanged(preset);
                    return (
                        <VerticalTabButton
                            key={ preset.id }
                            caption={ preset.name + (hasChanged ? '*' : '') }
                            onClick={ () => choosePreset(preset) }
                            isLinkActive={ isActive }
                            size="36"
                            cx={ [css.button, hasChanged && css.changed] }
                        />
                    );
                })}
                {isAddingPreset && (
                    <div className={ css.inputWrapper }>
                        <TextInput onBlur={ saveNewPreset } onAccept={ saveNewPreset } value={ inputValue } onValueChange={ setInputValue } autoFocus />
                    </div>
                )}
            </>
        </Accordion>
    );
};

export default /* @__PURE__ */React.memo(PresetsBlock);
