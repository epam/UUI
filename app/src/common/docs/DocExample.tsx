import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { TDocConfig } from '@epam/uui-docs';
import { LinkButton, FlexSpacer, Switch, FlexRow, Spinner, FlexCell } from '@epam/uui';
import { EditableDocContent } from './EditableDocContent';
import { svc } from '../../services';
import { CodesandboxLink } from './CodesandboxLink';
import { Code } from './Code';
import { docExampleLoader } from './docExampleLoader';
import { ThemeId } from '@epam/uui-docs';
import { generateNewRawString, getSkin, useCode, useExampleProps, usePropEditorTypeOverride } from './utils';

import { ReactComponent as PreviewIcon } from '@epam/assets/icons/common/media-fullscreen-12.svg';

import css from './DocExample.module.scss';
import { useAppThemeContext } from '../../helpers/appTheme';
import { CX } from '@epam/uui-core';

interface DocExampleProps {
    path: string;
    title?: string;
    onlyCode?: boolean;
    width?: number | 'auto';
    cx?: CX;
    disableCodesandbox?: boolean;
    config?: TDocConfig;
}

function DocExampleFsBtn({ path, theme }: { path: string; theme: ThemeId }) {
    const regex = /^(.*)\/(\w+)\.example\.tsx$/;
    const examplePath = path.replace(regex, '$1/$2');
    const href = `/docExample?theme=${encodeURIComponent(theme)}&examplePath=${encodeURIComponent(examplePath)}`;
    return (
        <LinkButton
            target="_blank"
            icon={ PreviewIcon }
            iconPosition="right"
            href={ href }
            caption="Fullscreen"
        />
    );
}

export function DocExample(props: DocExampleProps) {
    const [showCode, setShowCode] = useState(false);
    const [component, setComponent] = useState<{ elementType: any }>();
    const [raw, setRaw] = useState<string>();
    const { theme } = useAppThemeContext();
    const skin = getSkin(theme, true);
    const type = props?.config?.bySkin[skin]?.type;
    const propsOverride = usePropEditorTypeOverride(theme, type);
    const { exampleProps, isLoading: examplePropsIsLoading } = useExampleProps(props.config, type, theme, propsOverride);
    const code = useCode(props.path, raw, exampleProps, props.config);

    useEffect(() => {
        const { path, onlyCode } = props;

        if (!onlyCode) {
            docExampleLoader({ path: path }).then((elementType) => {
                setComponent({ elementType });
            });
        }
    }, []);

    useEffect(() => {
        const { path } = props;

        svc.api.getCode({ path }).then((r) => {
            setRaw(r.raw);
        });
    }, []);

    const getDescriptionFileName = (): string => {
        const name = props.path.replace(new RegExp(/\.example.tsx|\./g), '').replace(/\//g, '-').replace(/^-/, '');
        return name;
    };

    const renderCode = (isVisible: boolean): React.ReactNode => {
        return code && <Code isVisible={ isVisible } codeAsHtml={ code } />;
    };

    const renderPreview = () => {
        const dirPath = props.path.split('/').slice(0, -1);

        const codesandboxRaw = (props.config && raw && exampleProps) ? generateNewRawString(raw, exampleProps) : raw;

        return (
            <div>
                <FlexRow
                    size={ null }
                    vPadding="48"
                    padding="24"
                    borderBottom
                    alignItems="top"
                    columnGap="12"
                    rawProps={ { role: 'region', 'aria-label': 'Example preview' } }
                >
                    { 
                        examplePropsIsLoading 
                            ? <FlexCell grow={ 1 }><Spinner /></FlexCell> 
                            : component && React.createElement(component.elementType, { propDocs: exampleProps }) 
                    }
                </FlexRow>
                <footer>
                    <FlexRow
                        padding="12"
                        vPadding="12"
                        cx={ [css.containerFooter] }
                        columnGap="12"
                        rawProps={ { role: 'toolbar', 'aria-label': 'Documentation example controls' } }
                        borderBottom={ showCode }
                    >
                        <Switch
                            value={ showCode }
                            onValueChange={ setShowCode }
                            label="View code"
                            aria-label="Toggle code visibility"
                        />
                        <FlexSpacer />
                        {!props.disableCodesandbox && !examplePropsIsLoading && <CodesandboxLink raw={ codesandboxRaw } dirPath={ dirPath } />}
                        <DocExampleFsBtn path={ props.path } theme={ theme } />
                    </FlexRow>
                </footer>
                { renderCode(showCode)}
            </div>
        );
    };

    return (
        <section
            className={ cx(css.container, props.cx) }
            aria-labelledby={ getDescriptionFileName() }
            itemScope
            itemType="http://schema.org/SoftwareApplication"
        >
            <EditableDocContent
                title={ props.title }
                fileName={ getDescriptionFileName() }
                id={ getDescriptionFileName() }
            />
            <div
                className={ css.previewContainer }
                style={ { width: props.width } }
                role="region"
                aria-label="Example preview"
            >
                {props.onlyCode ? renderCode(true) : renderPreview()}
            </div>
        </section>
    );
}
