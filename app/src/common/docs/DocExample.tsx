import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { TDocConfig } from '@epam/uui-docs';
import { LinkButton, FlexSpacer } from '@epam/uui';
import { Switch, FlexRow } from '@epam/promo';
import { EditableDocContent } from './EditableDocContent';
import { svc } from '../../services';
import { CodesandboxLink } from './CodesandboxLink';
import { Code } from './Code';
import { docExampleLoader } from './docExampleLoader';
import { ThemeId } from '../../data';
import { generateNewRawString, getSkin, useCode, useExampleProps, usePropEditorTypeOverride } from './utils';
import { QueryHelpers } from './baseDocBlock/utils/queryHelpers';

import { ReactComponent as PreviewIcon } from '@epam/assets/icons/common/media-fullscreen-12.svg';

import css from './DocExample.module.scss';
import { useAppThemeContext } from '../../helpers/appTheme';

const EXAMPLES_PATH_PREFIX = './_examples';

const LABELS = {
    Fullscreen: 'Fullscreen',
};

interface DocExampleProps {
    path: string;
    title?: string;
    onlyCode?: boolean;
    width?: number | 'auto';
    cx?: string;
    disableCodesandbox?: boolean;
    config?: TDocConfig;
}

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

export function DocExample(props: DocExampleProps) {
    const [showCode, setShowCode] = useState(false);
    const [component, setComponent] = useState<{ elementType: any }>();
    const [raw, setRaw] = useState<string>();
    const { theme } = useAppThemeContext();
    const isSkin = QueryHelpers.isSkin();
    const skin = getSkin(theme, isSkin);
    const type = props?.config?.bySkin[skin]?.type;
    const propsOverride = usePropEditorTypeOverride(theme, type);
    const exampleProps = useExampleProps(props.config, type, theme, propsOverride);
    const code = useCode(props.path, raw, exampleProps, props.config);

    useEffect(() => {
        const { path, onlyCode } = props;

        if (!onlyCode) {
            const exPathRelative = `.${path.substring(EXAMPLES_PATH_PREFIX.length)}`;
            docExampleLoader({ path: exPathRelative }).then((elementType) => {
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
        return name.substring(1);
    };

    const renderCode = (): React.ReactNode => {
        return code && <Code codeAsHtml={ code } />;
    };

    const renderPreview = () => {
        const dirPath = props.path.split('/').slice(0, -1);
        const codesandboxRaw = (props.config && raw && exampleProps) ? generateNewRawString(raw, exampleProps) : raw;

        console.log('config', props.config, exampleProps, codesandboxRaw);
        if (props.config && (!exampleProps || !codesandboxRaw)) {
            return null;
        }

        return (
            <>
                <FlexRow size={ null } vPadding="48" padding="24" borderBottom alignItems="top" columnGap="12">
                    {component && React.createElement(component.elementType, { propDocs: exampleProps })}
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
                {props.onlyCode ? renderCode() : renderPreview()}
            </div>
        </div>
    );
}
