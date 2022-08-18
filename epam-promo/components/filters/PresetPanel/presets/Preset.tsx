import React, { useCallback, useState } from "react";
import cx from "classnames";
import css from "./Preset.scss";
import { DataTableState, ITablePreset, useUuiContext } from "@epam/uui-core";
import { ControlGroup } from "../../../layout";
import { TabButton } from "../../../buttons";
import { TabButtonDropdown } from "./TabButtonDropdown";
import { PresetInput } from "./PresetInput";
import { SuccessNotification } from "../../../overlays";
import { Text } from "../../../typography";

interface IPresetProps {
    preset: ITablePreset;
    setRenamedPresetCaption: React.Dispatch<React.SetStateAction<string>>;
    choosePreset: (preset: ITablePreset) => void;
    hasPresetChanged: (preset: ITablePreset) => boolean;
    duplicatePreset: (preset: ITablePreset) => void;
    updatePreset: (preset: ITablePreset) => void;
    isActivePreset: ITablePreset;
    addPreset: () => void;
    renamedPresetCaption: string;
    tableState: DataTableState;
    resetToDefault: () => void;
    deletePreset: (preset: ITablePreset) => void;
    newPresetCaption: string;
    setNewPresetCaption: React.Dispatch<React.SetStateAction<string>>;
}

export const Preset = (props: IPresetProps) => {
    const { uuiNotifications } = useUuiContext();
    const [renamedPreset, setRenamedPreset] = useState<ITablePreset | null>(null);

    const renamePresetOnBlurHandler = useCallback(() => {
        if (props.newPresetCaption.length) {
            return;
        }
        setRenamedPreset(null);
    }, [props.newPresetCaption.length]);

    const cancelRenamePreset = useCallback(() => {
        props.setNewPresetCaption("");
        setRenamedPreset(null);
    }, [props.setNewPresetCaption]);

    const renamePreset = (preset?: ITablePreset) => {
        if (!renamedPreset && preset) {
            props.setNewPresetCaption(preset.name);
            setRenamedPreset(preset);
        } else if (renamedPreset) {
            const newPreset: ITablePreset = {
                ...renamedPreset,
                name: props.newPresetCaption,
            };
            props.updatePreset(newPreset);
            setRenamedPreset(null);
            props.setNewPresetCaption("");
        }
    };

    const saveInCurrent = useCallback((preset: ITablePreset) => {
        const newPreset = {
            ...preset,
            filter: props.tableState.filter,
            columnsConfig: props.tableState.columnsConfig,
        };
        props.updatePreset(newPreset);
        successNotificationHandler('Changes saved!');
    }, [props.tableState.filter, props.tableState.columnsConfig]);

    const copyUrlToClipboard = async () => {
        await navigator.clipboard.writeText(location.href);
        successNotificationHandler('Link copied!');
    };

    const successNotificationHandler = useCallback((text: string) => {
        uuiNotifications.show((props) => (
            <SuccessNotification { ...props } >
                <Text size="36" font="sans" fontSize="14">{ text }</Text>
            </SuccessNotification>
        ), { position: 'top-right', duration: 3 }).catch(() => null);
    }, [props]);

    const tabButtonDropdownApi = {
        copyUrlToClipboard: copyUrlToClipboard,
        saveInCurrent: saveInCurrent,
        renamePreset: renamePreset,
        addPreset: props.addPreset,
        choosePreset: props.choosePreset,
        duplicatePreset: props.duplicatePreset,
        hasPresetChanged: props.hasPresetChanged,
        isActivePreset: props.isActivePreset,
        resetToDefault: props.resetToDefault,
        deletePreset: props.deletePreset,
        preset: props.preset,
    };

    return (
        <div key={ props.preset.id } className={ css.presetButtonWrapper }>
            {
                (renamedPreset?.id === props.preset.id)
                    ? <PresetInput
                        onValueChange={ props.setRenamedPresetCaption }
                        value={ props.renamedPresetCaption }
                        onAccept={ renamePreset }
                        onCancel={ cancelRenamePreset }
                        onBlur={ renamePresetOnBlurHandler }
                    />
                    : <ControlGroup
                        cx={ cx(css.defaultPresetButton, {
                            [css.presetTubWrapper]: props.isActivePreset?.id === props.preset.id,
                        }) }>
                        <TabButton
                            cx={ css.presetTabButton }
                            caption={ props.preset.name }
                            onClick={ () => props.choosePreset(props.preset) }
                            size="36"
                            withNotify={ props.isActivePreset?.id === props.preset.id && props.hasPresetChanged(props.preset) }
                            icon={ () => <TabButtonDropdown { ...tabButtonDropdownApi }/> }
                            iconPosition="right"
                        />
                    </ControlGroup>
            }
        </div>
    );
};
