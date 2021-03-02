import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { Panel } from '../../components/layout/FlexItems';
import 'moment/locale/ru';
import moment from "moment";
import { i18n } from "../../i18n";

export class LocaleContext extends React.Component<DemoComponentProps, any> {
    public static displayName = "RU locale";

    componentWillUnmount() {
        i18n.datePicker.locale = 'en';

    }
    
    render() {
        const { DemoComponent, props } = this.props;

        i18n.datePicker.locale = 'ru';

        return (
            <Panel margin='24' style={ { padding: '12px', background: props.theme == 'dark' && '#2c2f3c' } }>
                <DemoComponent key={ i18n.datePicker.locale } { ...props } />
            </Panel>
        );
    }
}