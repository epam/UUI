import * as React from 'react';
import { IModal, UuiContexts } from '@epam/uui-core';
import { TextInput, ModalHeader, ModalBlocker, ModalWindow, FlexRow, FlexSpacer, LabeledInput, Panel, Button } from '@epam/loveship';
import { i18n } from '../../../i18n';


export interface ImageModalState {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    proportion?: number;
    isApplyProportions?: boolean;
    srcIsInvalid?: boolean;
}

interface ImageModalProps extends IModal<ImageModalState>, ImageModalState { }

export const showImageModal = (context: UuiContexts, initialState: ImageModalState) =>
    context.uuiModals.show<ImageModalState>(modalProps => <ImageModal { ...modalProps } { ...initialState } />);

class ImageModal extends React.Component<ImageModalProps, ImageModalState> {

    state = {
        src: this.props.src,
        alt: this.props.alt,
        width:  this.props.width || 0,
        height:  this.props.height || 0,
        proportion: this.getProportion(this.props.width, this.props.height),
        isApplyProportions: false,
        srcIsInvalid: false,
    };

    getProportion(width: number, height: number) {
        if (!width || !height) {
            return 1;
        } else {
            return Math.round(width / height * 100) / 100;
        }
    }

    render() {
        const srcValidationProps = {
            isInvalid: this.state.srcIsInvalid,
            validationMessage: i18n.rte.imageModal.validationInputSource,
        };
        return (
            <ModalBlocker { ...this.props }>
                <ModalWindow>
                    <Panel background='white' style={ { overflowY: 'auto', maxHeight: '100%' } }>
                        <ModalHeader borderBottom title={ i18n.rte.imageModal.modalHeader } onClose={ () => this.props.abort() } />
                        <FlexRow type='form'>
                            <LabeledInput { ...srcValidationProps } label={ i18n.rte.imageModal.inputSource }>
                                <TextInput
                                    value={ this.state.src }
                                    onValueChange={ (value) => {
                                        this.setState({ src: value });
                                        const img = new Image();
                                        img.onload = () => this.setState({
                                            width: img.width,
                                            height: img.height,
                                            proportion: this.getProportion(img.width, img.height),
                                            srcIsInvalid: false,
                                        });
                                        img.onerror = () => this.setState({ width: 0, height: 0, srcIsInvalid: true });
                                        img.src = value;
                                    } }
                                />
                            </LabeledInput>
                        </FlexRow>
                        <FlexRow type='form'>
                            <LabeledInput label={ i18n.rte.imageModal.inputImageDescr }>
                                <TextInput
                                    value={ this.state.alt }
                                    onValueChange={ (value) => this.setState({ alt: value }) }
                                />
                            </LabeledInput>
                        </FlexRow>
                        { /* <FlexRow vPadding='12' padding='24'>
                        <LabeledInput label='Dimensions'>
                            <ControlWrapper size="36">
                                <NumericInput
                                    cx={ css.input }
                                    max={ 1920 }
                                    min={ 0 }
                                    value={ this.state.width }
                                    onValueChange={ (value) => this.setState({
                                        width: value,
                                        height: this.state.isApplyProportions ? (Math.round(value / this.state.proportion * 100) / 100) : this.state.height
                                    }) }
                                />
                                <div className={ css.separator }> × </div>
                                <NumericInput
                                    cx={ css.input }
                                    max={ 1920 }
                                    min={ 0 }
                                    value={ this.state.height }
                                    onValueChange={ (value) => this.setState({
                                        height: value,
                                        width: this.state.isApplyProportions ? (Math.round(value * this.state.proportion * 100) / 100) : this.state.width
                                    }) }
                                />
                                <Checkbox
                                    cx={ css.checkbox }
                                    value={ this.state.isApplyProportions }
                                    onValueChange={ checkboxValue => this.setState({
                                        isApplyProportions: checkboxValue,
                                        height: checkboxValue ? (Math.round(this.state.width / this.state.proportion * 100) / 100) : this.state.height
                                    }) }
                                />
                                <div className={ css.checkboxLabel }> Apply proportions </div>
                            </ControlWrapper>
                        </LabeledInput>
                    </FlexRow> */ }
                        <FlexRow padding='24' vPadding='24'>
                            <FlexSpacer />
                            <Button onClick={ () => this.props.abort() } color='white' caption={ i18n.rte.imageModal.buttonCancel } />
                            <Button
                                onClick={ () => this.props.success({
                                    src: this.state.src,
                                    alt: this.state.alt,
                                    // width: this.state.width,
                                    // height: this.state.height
                                }) }
                                color='grass'
                                caption={ i18n.rte.imageModal.buttonOk }
                            />
                        </FlexRow>
                    </Panel>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}
