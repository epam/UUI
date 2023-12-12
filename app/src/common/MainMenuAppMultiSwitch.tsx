import React from 'react';
import css from './MainMenuAppMultiSwitch.module.scss';
import { IAnalyticableOnChange, IEditable } from '@epam/uui-core';
import { Button, ControlGroup, ButtonProps, SizeMod } from '@epam/promo';
import { svc } from '../services';

type MainMenuAppMultiSwitchPropsItem<TValue> = ButtonProps & {
    id: TValue;
};

export interface MainMenuAppMultiSwitchProps<TValue> extends IEditable<TValue>, SizeMod, IAnalyticableOnChange<TValue> {
    /**
     * Defines an array of items for the MainMenuAppMultiSwitch component.
     */
    items: MainMenuAppMultiSwitchPropsItem<TValue>[];
    /**
     * Defines a component color.
     */
    color?: 'blue' | 'green' | 'red' | 'gray50' | 'gray';
}

export class MainMenuAppMultiSwitch<TValue> extends React.Component<MainMenuAppMultiSwitchProps<TValue>> {
    handleClick = (id: TValue) => {
        this.props.onValueChange(id);
        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(id, this.props.value);
            svc.uuiAnalytics.sendEvent(event);
        }
    };

    render() {
        return (
            <ControlGroup>
                {this.props.items.map((item, index) => (
                    <Button
                        { ...item }
                        isDisabled={ this.props.isDisabled }
                        key={ index + '-' + item.id }
                        onClick={ () => this.handleClick(item.id) }
                        size={ this.props.size }
                        cx={ this.props.value === item.id ? css.activeButton : css.noneButton }
                    />
                ))}
            </ControlGroup>
        );
    }
}
