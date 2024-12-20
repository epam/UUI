import React, { useState, useEffect } from 'react';
import prism from 'prismjs';
import cx from 'classnames';
import { TDocConfig, TTypeProp, overrideProp } from '@epam/uui-docs';
import { LinkButton, FlexSpacer } from '@epam/uui';
import { Switch, FlexRow } from '@epam/promo';
import { EditableDocContent } from './EditableDocContent';
import { svc } from '../../services';
import { CodesandboxLink } from './CodesandboxLink';
import { Code } from './Code';
import { docExampleLoader } from './docExampleLoader';
import { ThemeId } from '../../data';
import { generateNewRawString, getSkin, usePropEditorTypeOverride } from './utils';
import { loadDocsGenType } from '../apiReference/dataHooks';
import { QueryHelpers } from './baseDocBlock/utils/queryHelpers';

import { ReactComponent as PreviewIcon } from '@epam/assets/icons/common/media-fullscreen-12.svg';

import css from './DocExample.module.scss';

interface DocExampleProps {
    path: string;
    title?: string;
    onlyCode?: boolean;
    width?: number | 'auto';
    cx?: string;
    disableCodesandbox?: boolean;
    config?: TDocConfig;
}

const EXAMPLES_PATH_PREFIX = './_examples';

export function DocExample(props: DocExampleProps) {
    const [showCode, setShowCode] = useState(false);
    const [component, setComponent] = useState<{ elementType: any }>();
    const [code, setCode] = useState<string>();
    const [raw, setRaw] = useState<string>();
    const [generatedRaw, setGeneratedRaw] = useState<string>();
    const [exampleProps, setExampleProps] = useState<Record<string, TTypeProp>>();
    const isSkin = QueryHelpers.isSkin();
    const theme = QueryHelpers.getTheme();
    const skin = getSkin(theme, isSkin);
    const type = props?.config?.bySkin[skin]?.type;
    const propsOverride = usePropEditorTypeOverride(theme, type);

    useEffect(() => {
        if (raw && exampleProps) {
            const result = generateNewRawString(raw, exampleProps);
            const highlightedCode = prism.highlight(result, prism.languages.ts, 'typescript');
            setCode(highlightedCode);
            setGeneratedRaw(result);
        }
    }, [exampleProps, raw]);

    useEffect(() => {
        setExampleProps(undefined);
        async function loadExampleProps() {
            const config = props?.config;
            let initialProps: TTypeProp[];

            if (!!type) {
                const { content: { details } } = await loadDocsGenType(type);
                initialProps = details.props;
            }

            if (!!config && !!initialProps) {
                const updatedProps: Record<string, TTypeProp> = initialProps.reduce((prev, current) => {
                    if (propsOverride && propsOverride[current.name]) {
                        const newProp = overrideProp(current, propsOverride[current.name]);
                        return { ...prev, [current.name]: newProp };
                    }

                    return { ...prev, [current.name]: current };
                }, {});

                setExampleProps(updatedProps);
            }
        }

        loadExampleProps().catch(console.error);
    }, [props?.config, propsOverride, skin, theme, type]);

    useEffect(() => {
        const { path } = props;

        svc.api
            .getCode({ path })
            .then((r) => {
                setCode(r.highlighted);
                setRaw(r.raw);
            });
    }, []);

    useEffect(() => {
        const { path, onlyCode } = props;

        if (!onlyCode) {
            const exPathRelative = `.${path.substring(EXAMPLES_PATH_PREFIX.length)}`;
            docExampleLoader({ path: exPathRelative }).then((elementType) => {
                setComponent({ elementType });
            });
        }
    }, []);

    const getDescriptionFileName = (): string => {
        const name = props.path
            .replace(new RegExp(/\.example.tsx|\./g), '')
            .replace(/\//g, '-')
            .replace(/^-/, '');
        return name.substring(1);
    };

    const renderCode = (): React.ReactNode => {
        return <Code codeAsHtml={ code } />;
    };

    const renderPreview = (propDocs: Record<string, TTypeProp>) => {
        const dirPath = props.path.split('/').slice(0, -1);
        const codesandboxRaw = props.config ? generatedRaw : raw;

        if (props.config && (!propDocs || !generatedRaw)) {
            return null;
        }

        return (
            <>
                <FlexRow size={ null } vPadding="48" padding="24" borderBottom alignItems="top" columnGap="12">
                    {component && React.createElement(component.elementType, { propDocs })}
                </FlexRow>
                <div className={ css.containerFooterWrapper }>
                    <FlexRow padding="12" vPadding="12" cx={ [css.containerFooter] } columnGap="12">
                        <Switch value={ showCode } onValueChange={ setShowCode } label="View code" />
                        <FlexSpacer />
                        {!props.disableCodesandbox && <CodesandboxLink raw={ codesandboxRaw } dirPath={ dirPath } />}
                        <DocExampleFsBtn path={ props.path } theme={ theme } />
                    </FlexRow>
                </div>
                {showCode && renderCode()}
            </>
        );
    };

    return (
        <div className={ cx(css.container, props.cx) }>
            <EditableDocContent title={ props.title } fileName={ getDescriptionFileName() } />
            <div className={ css.previewContainer } style={ { width: props.width } }>
                {props.onlyCode ? renderCode() : renderPreview(exampleProps)}
            </div>
        </div>
    );
}

const LABELS = {
    Fullscreen: 'Fullscreen',
};

const DocExampleFsBtn: React.FC<{ path: string; theme: ThemeId }> = ({ path, theme }) => {
    const regex = /^\.\/_examples\/(.*)\/(\w+)\.example\.tsx$/;
    const examplePath = path.replace(regex, '$1/$2');
    const href = `/docExample?theme=${encodeURIComponent(theme)}&examplePath=${encodeURIComponent(examplePath)}`;
    return (
        <LinkButton
            target="_blank"
            icon={ PreviewIcon }
            iconPosition="right"
            href={ href }
            caption={ LABELS.Fullscreen }
        />
    );
};
