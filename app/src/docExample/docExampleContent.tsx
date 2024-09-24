import React from 'react';
import { Alert, FlexRow, Spinner } from '@epam/uui';
import { Page } from '../common';

import css from './docExampleContent.module.scss';

interface IDocExampleContent {
    isLoading: boolean;
    errorMsg?: string;
    Component?: React.FC;
}
export function DocExampleContent(props: IDocExampleContent) {
    const { isLoading, errorMsg, Component } = props;

    const renderContent = () => {
        if (isLoading) {
            return <Spinner />;
        }
        if (errorMsg) {
            return <Alert color="error">{errorMsg}</Alert>;
        }
        if (Component) {
            return (
                <FlexRow
                    rawProps={ { tabIndex: 0 } }
                    cx={ css.exampleContent }
                    size={ null }
                    vPadding="48"
                    padding="24"
                    borderBottom
                    alignItems="top"
                    columnGap="12"
                >
                    <Component />
                </FlexRow>
            );
        }
        return null;
    };

    return (
        <Page renderHeader={ () => null }>
            <div className={ css.exampleRoot } aria-busy={ isLoading } aria-label="Doc Example Content">
                { renderContent() }
            </div>
        </Page>
    );
}
