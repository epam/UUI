import React, { useState } from 'react';
import {
    FlexRow, FlexSpacer, Panel, ScrollBars, TabButton, Text,
} from '@epam/promo';
import { ScrollSpyForm } from './ScrollSpyForm';
import { ScrollSpyModal } from './ScrollSpyModal';
import { ScrollSpyAnchor } from './ScrollSpyAnchor';
import css from './ScrollSpyDemo.module.scss';

enum Pages {
    Form = 'Form',
    Modal = 'Modal',
    Anchor = 'Anchor'
}

export function ScrollSpyDemo() {
    const [page, setPage] = useState(Pages.Form);

    const getScrollSpyDemoPage = () => {
        switch (page) {
            case Pages.Form:
                return <ScrollSpyForm />;
            case Pages.Modal:
                return <ScrollSpyModal />;
            case Pages.Anchor:
                return <ScrollSpyAnchor />;
        }
    };

    return (
        <Panel cx={ [css.panel, css.uuiThemePromo] } background="white" margin="24">
            <FlexRow size="48" padding="24">
                <Text size="48">
                    Scroll Spy
                </Text>
                <FlexSpacer />
            </FlexRow>
            <FlexRow padding="24" borderBottom background="none">
                <TabButton caption={ Pages.Form } isLinkActive={ page === Pages.Form } onClick={ page !== Pages.Form ? () => setPage(Pages.Form) : null } size="60" />
                <TabButton caption={ Pages.Modal } isLinkActive={ page === Pages.Modal } onClick={ page !== Pages.Modal ? () => setPage(Pages.Modal) : null } size="60" />
                <TabButton caption={ Pages.Anchor } isLinkActive={ page === Pages.Anchor } onClick={ page !== Pages.Anchor ? () => setPage(Pages.Anchor) : null } size="60" />
            </FlexRow>
            <ScrollBars>{getScrollSpyDemoPage()}</ScrollBars>
        </Panel>
    );
}
