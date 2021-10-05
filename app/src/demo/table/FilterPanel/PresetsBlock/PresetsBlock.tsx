import React, { ReactEventHandler, useCallback, useMemo, useState } from "react";
import css from "./PresetsBlock.scss";
import { Accordion, IconContainer, TabButton, TextInput } from "@epam/promo";
import { DataColumnProps, IEditable } from "@epam/uui";
import { FlexSpacer } from "@epam/uui-components";
import plusIcon from "@epam/assets/icons/common/content-add-outline-18.svg";
import { IPresetsApi, PersonsTableState } from "../../types";

interface IPresetsBlockProps extends IEditable<PersonsTableState> {
    presetsApi: IPresetsApi;
}

const PresetsBlock: React.FC<IPresetsBlockProps> = ({ value, presetsApi }) => {
    const [isOpened, setIsOpened] = useState(true);
    const [isAddingPreset, setIsAddingPreset] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // const choosePreset = useChoosePreset(value, onValueChange);

    const addPreset: ReactEventHandler<HTMLDivElement> = useCallback(event => {
        event.stopPropagation();
        setIsAddingPreset(true);
        setIsOpened(true);
    }, []);
    
    // const createNewPreset = useCreateNewPreset({
    //     choosePreset,
    //     value,
    //     onValueChange,
    // });

    const saveNewPreset = useCallback(() => {
        if (!inputValue) {
            setIsAddingPreset(false);
            return;
        }

        presetsApi.createNewPreset(inputValue);

        setIsAddingPreset(false);
        setInputValue("");
    }, [inputValue, presetsApi]);

    const renderAddPresetIcon = useCallback(() => {
        return (
            <>
                <FlexSpacer/>
                <IconContainer icon={ plusIcon } cx={ [css.icon] } onClick={ addPreset }/>
            </>
        );
    }, [addPreset]);

    // const activePresetId = +svc.uuiRouter.getCurrentLink().query?.presetId;
    // const isDefaultActive = useMemo(() => isDefaultPresetActive(value, columns), [value, columns]);
    // const resetToDefault = useCallback(() => choosePreset(constants.defaultPreset), [choosePreset]);
    
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
                <TabButton
                    key="default"
                    caption="Default"
                    onClick={ presetsApi.isDefaultPresetActive ? null : presetsApi.resetToDefault }
                    isLinkActive={ presetsApi.isDefaultPresetActive }
                    direction="vertical"
                    size="36"
                    cx={ css.button }
                />
                { value.presets.map(preset => {
                    const isActive = preset.id === presetsApi.activePresetId;
                    const hasChanged = isActive && presetsApi.hasPresetChanged(preset);
                    return (
                        <TabButton
                            key={ preset.id }
                            caption={ preset.name + (hasChanged ? "*" : "") }
                            onClick={ () => presetsApi.choosePreset(preset) }
                            isLinkActive={ isActive }
                            direction="vertical"
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