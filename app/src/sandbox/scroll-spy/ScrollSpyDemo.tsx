import React, { useState } from 'react';
import {
    FlexRow, FlexSpacer, Panel, ScrollBars, Text, Tabs,
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
            <Tabs
                value={ page }
                onValueChange={ (pageNext: Pages) => {
                    if (pageNext !== page) {
                        setPage(pageNext);
                    }
                } }
                items={ [
                    {
                        id: Pages.Form,
                        caption: Pages.Form,
                        size: '60',
                    },
                    {
                        id: Pages.Modal,
                        caption: Pages.Modal,
                        size: '60',
                    },
                    {
                        id: Pages.Anchor,
                        caption: Pages.Anchor,
                        size: '60',
                    },
                ] }
                padding="24"
            />
            <ScrollBars>{getScrollSpyDemoPage()}</ScrollBars>
        </Panel>
    );
}
