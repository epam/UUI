import React, { ReactEventHandler, useCallback, useMemo, useState } from "react";
import css from "./PresetsBlock.scss";
import { Accordion, IconContainer, TabButton, TextInput } from "@epam/promo";
import { DataColumnProps, IEditable } from "@epam/uui";
import { FlexSpacer } from "@epam/uui-components";
import plusIcon from "@epam/assets/icons/common/content-add-outline-18.svg";
import { ITablePreset, PersonsTableState } from "../../types";
import { svc } from "../../../../services";
import { hasPresetChanged, isDefaultPresetActive } from "../../helpers";
import { constants } from "../../data";
import { useChoosePreset, useCreateNewPreset } from "../../hooks";

interface IPresetsBlockProps extends IEditable<PersonsTableState> {
    presets: ITablePreset[];
    onPresetsChange: (presets: ITablePreset[]) => void;
    columns: DataColumnProps<any>[];
}

const PresetsBlock: React.FC<IPresetsBlockProps> = ({ presets, onPresetsChange, value, onValueChange, columns }) => {
    const [isOpened, setIsOpened] = useState(false);
    const [isAddingPreset, setIsAddingPreset] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const choosePreset = useChoosePreset(value, onValueChange);

    const addPreset: ReactEventHandler<HTMLDivElement> = useCallback(event => {
        event.stopPropagation();
        setIsAddingPreset(true);
        setIsOpened(true);
    }, []);
    
    const createNewPreset = useCreateNewPreset({
        presets, 
        onPresetsChange,
        choosePreset,
        value,
    });

    const saveNewPreset = useCallback(() => {
        if (!inputValue) {
            setIsAddingPreset(false);
            return;
        }

        createNewPreset(inputValue);

        setIsAddingPreset(false);
        setInputValue("");
    }, [inputValue, presets, value.filter, choosePreset]);

    const renderAddPresetIcon = useCallback(() => {
        return (
            <>
                <FlexSpacer/>
                <IconContainer icon={ plusIcon } cx={ [css.icon] } onClick={ addPreset }/>
            </>
        );
    }, [addPreset]);

    const activePresetId = +svc.uuiRouter.getCurrentLink().query?.presetId;
    const isDefaultActive = useMemo(() => isDefaultPresetActive(value, columns), [value, columns]);
    const resetToDefault = useCallback(() => choosePreset(constants.defaultPreset), [choosePreset]);
    
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
                    onClick={ isDefaultActive ? null : resetToDefault }
                    isLinkActive={ isDefaultActive }
                    direction="vertical"
                    size="36"
                    cx={ css.button }
                />
                { presets.map(preset => {
                    const isActive = preset.id === activePresetId;
                    const hasChanged = isActive && hasPresetChanged(preset, value.columnsConfig);
                    return (
                        <TabButton
                            key={ preset.id }
                            caption={ preset.name + (hasChanged ? "*" : "") }
                            onClick={ () => choosePreset(preset) }
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