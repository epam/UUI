import * as React from 'react';
import {Metadata, RenderFormProps, INotification, FormSaveResponse} from "@epam/uui";
import {svc} from "../../../services";
import {
    FlexCell,
    FlexRow,
    FlexSpacer,
    Text,
    Button,
    LabeledInput,
    TextInput,
    SuccessNotification,
    Form,
} from "@epam/promo";

interface Login {
    email: string;
    password: string;
}

interface BasicFormExampleState {
    login: Login;
}

interface ServerResponseExample<T> {
    form?: T;
    error?: {
        name: 'user-exists';
        message: string;
    };
}

export class ServerValidationExample extends React.PureComponent<{}, BasicFormExampleState> {
    constructor(props: {}) {
        super(props);
        
        this.state = {
            login: {
                email: "Ivan_Ivanov@epam.com",
                password: "",
            },
        };
        
        this.onSave = this.onSave.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
    }

    private getMetaData(): Metadata<Login> {
        return {
            props: {
                email: {isRequired: true},
                password: {isRequired: true},
            },
        };
    }

    private renderForm(props: RenderFormProps<Login>) {
        let lens = props.lens;

        return (
            <FlexCell width='100%'>
                <FlexRow vPadding='12'>
                    <FlexCell grow={ 1 }>
                        <LabeledInput label='Email' { ...lens.prop('email').toProps() } >
                            <TextInput placeholder='Email' { ...lens.prop('email').toProps() } />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow vPadding='12'>
                    <FlexCell grow={ 1 }>
                        <LabeledInput label='Password' { ...lens.prop('password').toProps() }>
                            <TextInput placeholder='Password'
                                       type='password'
                                       { ...lens.prop('password').toProps() }/>
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow vPadding='12' spacing='12'>
                    <FlexSpacer/>
                    <Button caption='Validate' onClick={ props.validate }/>
                    <Button caption='Save' onClick={ props.save } color='green'/>
                </FlexRow>
            </FlexCell>
        );
    }

    private renderNotification(props: INotification) {
        return (
            <SuccessNotification { ...props }>
                <Text>Form saved</Text>
            </SuccessNotification>
        );
    }

    private async onSave(formState: Login) {
        const response: ServerResponseExample<Login> = await svc.api.success.validateForm(formState);
        if (!response.error) return response as FormSaveResponse<Login>;
        
        // Prefer to return the ICanBeInvalid structure from the server directly, and pass it to the Form as is. Here, we demonstrate how to handle the case when it's not possible. In such cases, you can convert your server-specific errors to the ICanBeInvalid interface on client.
        if (response.error.name === "user-exists") {
            return {
                validation: {
                    isInvalid: true,
                    validationProps: {
                        email: {
                            isInvalid: true,
                            validationMessage: response.error.message,
                        },
                    },
                },
            };
        }
    }

    private onSuccess(formState: Login) {
        return svc.uuiNotifications.show(this.renderNotification);
    }

    public render() {
        return (
            <Form<Login>
                value={ this.state.login }
                onSave={ this.onSave }
                onSuccess={ this.onSuccess }
                renderForm={ this.renderForm }
                getMetadata={ this.getMetaData }
            />
        );
    }
}
