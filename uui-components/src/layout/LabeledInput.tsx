import * as React from 'react';
import cx from 'classnames';
import * as css from './LabeledInput.scss';
import { Icon, uuiElement, labelMod, LabeledInputCoreProps } from '@epam/uui';
import { TooltipProps } from '../overlays/Tooltip';
import { Svg } from '../widgets/Svg';
import { i18n } from '../../i18n';

export interface LabeledInputProps extends LabeledInputCoreProps {
    Tooltip?: React.ComponentClass<TooltipProps>;
    infoIcon?: Icon;
}

const uuiLabeledInput: Record<string, string> = {
    infoIcon: 'uui-labeled-input-info-icon',
    asterisk: 'uui-labeled-input-asterisk',
    optional: 'uui-labeled-input-optional',
};

export class LabeledInput extends React.Component<LabeledInputProps> {
    render() {
        const Tooltip = this.props.Tooltip;
        const isCanBeOptional = !this.props.isRequired && this.props.labelPosition !== 'left' && this.props.isOptional;

        return (
            <div className={ cx(css.container, this.props.cx) }>
                <div className={ cx(labelMod[this.props.labelPosition ? this.props.labelPosition : 'top']) }>
                    { this.props.label &&
                        <div className={ uuiElement.label }>
                            { this.props.label }
                            { this.props.isRequired && <span className={ uuiLabeledInput.asterisk } >*</span> }
                            { this.props.info && Tooltip &&
                                <Tooltip content={ this.props.info }>
                                    <Svg svg={ this.props.infoIcon } cx={ uuiLabeledInput.infoIcon } />
                                </Tooltip>
                            }
                            { isCanBeOptional &&
                                <div className={ css.optionalFieldWrapper } >
                                    <div className={ uuiLabeledInput.optional } >{ i18n.labeledInput.optionalFieldLabel }</div>
                                </div>
                            }
                        </div>
                    }
                    { this.props.children }
                </div>
                { this.props.isInvalid && <div className={ uuiElement.invalidMessage }>{ this.props.validationMessage }</div> }
            </div>
        );
    }
}