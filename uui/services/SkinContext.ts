import { ButtonCoreProps, CheckboxCoreProps, FlexCellProps, FlexRowProps, TextInputCoreProps, SpinnerCoreProps, ModalWindowProps,
    ModalBlockerProps, ModalFooterCoreProps, ModalHeaderCoreProps, ButtonSemanticProps, LabeledInputCoreProps } from '../types';
import * as React from 'react';

interface ISkinComponent<TProps, TSemanticProps= {}> {
    component: React.ComponentClass<TProps>;
    mapProps?(props: SkinContextComponentProps<TProps, TSemanticProps>): TProps;
    render(props: SkinContextComponentProps<TProps, TSemanticProps>): React.ReactElement<SkinContextComponentProps<TProps, TSemanticProps>>;
}

export type SkinContextComponentProps<TProps, TSemanticProps = {}> = TProps & TSemanticProps & {
    usageContext?: string[];
};


export function skinComponent<TProps, TSemanticProps = {}>(
    component: React.ComponentClass<TProps>,
    mapProps?: (props: SkinContextComponentProps<TProps, TSemanticProps>) => TProps,
): ISkinComponent<TProps, TSemanticProps> {
    return {
        component,
        mapProps,
        render: props => (React.createElement(component, mapProps ? mapProps(props) : props) as any),
    };
}

export interface ISkin {
    Button: ISkinComponent<ButtonCoreProps, ButtonSemanticProps>;
    IconButton: ISkinComponent<ButtonCoreProps>;
    Checkbox: ISkinComponent<CheckboxCoreProps>;
    FlexRow: ISkinComponent<FlexRowProps>;
    FlexCell: ISkinComponent<FlexCellProps>;
    Spinner: ISkinComponent<SpinnerCoreProps>;
    TextInput: ISkinComponent<TextInputCoreProps>;
    ModalWindow: ISkinComponent<ModalWindowProps>;
    ModalBlocker: ISkinComponent<ModalBlockerProps>;
    ModalHeader: ISkinComponent<ModalHeaderCoreProps>;
    ModalFooter: ISkinComponent<ModalFooterCoreProps>;
    LabeledInput: ISkinComponent<LabeledInputCoreProps>;
}

export class SkinContext {
    skin: ISkin;

    public setSkin(skin: ISkin) {
        this.skin = skin;
    }

    public Button = (props: ButtonCoreProps & ButtonSemanticProps) => this.skin.Button.render(props);
    public IconButton = (props: SkinContextComponentProps<ButtonCoreProps>) => this.skin.IconButton.render(props);
    public Checkbox = (props: CheckboxCoreProps) => this.skin.Checkbox.render(props);
    public FlexRow = (props: FlexRowProps) => this.skin.FlexRow.render(props);
    public FlexCell = (props: FlexCellProps) => this.skin.FlexCell.render(props);
    public Spinner = (props: SpinnerCoreProps) => this.skin.Spinner.render(props);
    public TextInput = (props: TextInputCoreProps) => this.skin.TextInput.render(props);
    public ModalWindow = (props: ModalWindowProps) => this.skin.ModalWindow.render(props);
    public ModalBlocker = (props: ModalBlockerProps) => this.skin.ModalBlocker.render(props);
    public ModalHeader = (props: ModalHeaderCoreProps) => this.skin.ModalHeader.render(props);
    public ModalFooter = (props: ModalFooterCoreProps) => this.skin.ModalFooter.render(props);
    public LabeledInput = (props: LabeledInputCoreProps) => this.skin.LabeledInput.render(props);
}

export const uuiSkin = new SkinContext();