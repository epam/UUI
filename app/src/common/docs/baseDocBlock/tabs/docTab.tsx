import * as React from 'react';
import { useCallback } from 'react';
import cx from 'classnames';
import { TDocConfig, TSkin } from '@epam/uui-docs';
import { RichTextView, ScrollBars } from '@epam/uui';
import { TypeRefSection } from '../../../apiReference/TypeRefSection';
//
import css from './docTab.module.scss';

type TDocTabProps = {
    title: string;
    config: TDocConfig | undefined;
    renderDocTitle: () => React.ReactNode;
    renderSectionTitle: (title: string) => React.ReactNode;
    renderContent: () => React.ReactNode;
};

export function DocTab(props: TDocTabProps) {
    const renderDocTitle = useCallback(() => {
        const customTitle = props.renderDocTitle();
        if (customTitle) {
            return customTitle;
        }
        return (
            <RichTextView>
                <h1>{props.title}</h1>
            </RichTextView>
        );
    }, [props.title, props.renderDocTitle]);

    const renderApiBlock = useCallback(() => {
        if (props.config) {
            const configGeneric = props.config.bySkin;
            /**
             * API block is always based on the "UUI" TS type.
             * But if it's not defined for some reason, then the first available skin is used instead.
             */
            const skinSpecific = configGeneric[TSkin.UUI] || configGeneric[Object.keys(configGeneric)[0] as TSkin];
            const docsGenType = skinSpecific?.type;
            if (docsGenType) {
                return (
                    <>
                        { props.renderSectionTitle('Api') }
                        <TypeRefSection showCode={ true } typeRef={ docsGenType } />
                    </>
                );
            }
        }
    }, [props.config, props.renderSectionTitle]);

    return (
        <ScrollBars>
            <div className={ cx(css.widthWrapper) }>
                {renderDocTitle()}
                {props.renderContent()}
                {renderApiBlock()}
            </div>
        </ScrollBars>
    );
}
