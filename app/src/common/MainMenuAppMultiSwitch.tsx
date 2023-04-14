import React from 'react';
import css from './MainMenuAppMultiSwitch.scss';
import { IAnalyticableOnChange, IEditable } from '@epam/uui-core';
import { ButtonProps } from '@epam/uui-components';
import { Button, ControlGroup, ButtonMods, ButtonColor, SizeMod } from '@epam/promo';
import {svc} from "../services";

interface MainMenuAppMultiSwitchPropsItem<TValue> extends ButtonProps, ButtonMods {
    id: TValue;
}

export interface MainMenuAppMultiSwitchProps<TValue> extends IEditable<TValue>, SizeMod, IAnalyticableOnChange<TValue> {
    items: MainMenuAppMultiSwitchPropsItem<TValue>[];
    color?: ButtonColor;
}

export class MainMenuAppMultiSwitch<TValue> extends React.Component<MainMenuAppMultiSwitchProps<TValue>> {
    handleClick = (id: TValue) => {
        this.props.onValueChange(id);
        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(id, this.props.value);
            svc.uuiAnalytics.sendEvent(event);
        }
    }

    render() {
        return (
            <ControlGroup>
                {
                    this.props.items.map((item, index) =>
                        <Button
                            { ...item }
                            isDisabled={ this.props.isDisabled }
                            key={ index + '-' + item.id }
                            onClick={ () => this.handleClick(item.id) }
                            size={ this.props.size }
                            cx={ this.props.value === item.id ? css.activeButton : css.noneButton }
                        />,
                    )
                }
            </ControlGroup>
        );
    }
}
