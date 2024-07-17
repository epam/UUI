import * as React from 'react';
import { INotification } from '@epam/uui-core';
import { IconButton, FlexRow, FlexSpacer, NotificationCard, Switch, Text, Tooltip } from '@epam/uui';
//
import { copyTextToClipboard } from '../../../../helpers';
import { svc } from '../../../../services';
//
import css from './DemoCode.module.scss';
import { ReactComponent as CopyIcon } from '../../../../icons/icon-copy.svg';
import { ReactComponent as NotificationIcon } from '../../../../icons/notification-check-fill-24.svg';
import { PropDocPropsUnknown } from '@epam/uui-docs';

interface IDemoCode {
    tagName: string;
    demoComponentProps: PropDocPropsUnknown
}

export function DemoCode(props: IDemoCode) {
    const [showCode, setShowCode] = React.useState(false);
    const { tagName, demoComponentProps } = props;
    return (
        <>
            <FlexRow key="code-head" size="36" padding="12" columnGap="6" borderBottom={ showCode }>
                <Switch label="View Code" value={ showCode } onValueChange={ () => setShowCode((prev) => !prev) } />
                <FlexSpacer />
                <Tooltip content="Copy code" placement="top">
                    <IconButton icon={ CopyIcon } onClick={ () => copyTextToClipboard(renderCode({ demoComponentProps, tagName }), showNotification) } />
                </Tooltip>
            </FlexRow>
            {showCode && (
                <FlexRow key="code" size="36" padding="12">
                    <pre className={ css.root }>{renderCode({ demoComponentProps, tagName })}</pre>
                </FlexRow>
            )}
        </>
    );
}

function showNotification() {
    svc.uuiNotifications.show(
        (props: INotification) => (
            <NotificationCard { ...props } icon={ NotificationIcon } onClose={ null } color="info">
                <Text size="36">
                    Code was copied to the clipboard
                </Text>
            </NotificationCard>
        ),
        { duration: 3, position: 'top-right' },
    ).catch(() => {});
}

/**
 * It never throws error
 * @param o
 */
function safeJsonStringify(o: object) {
    let res = '...';
    try {
        res = JSON.stringify(o);
    } catch (err) {}
    return res;
}

function renderCode(params: { demoComponentProps: PropDocPropsUnknown, tagName: string }) {
    const {
        demoComponentProps,
        tagName,
    } = params;
    const props: string[] = [];
    let children: string = null;
    Object.keys(demoComponentProps).forEach((name) => {
        const val = demoComponentProps[name] as any;
        if (val === undefined) {
            props.push(`${name}={undefined}`);
        } else if (name === 'children') {
            children = '{/* ' + (val.displayName || 'children') + ' */}';
        } else if (val === true) {
            props.push(name);
        } else if (val === null) {
            props.push(`${name}={null}`);
        } else if (typeof val === 'string') {
            props.push(`${name}="${val}"`);
        } else if (typeof val === 'number') {
            props.push(`${name}={${val}}`);
        } else if (val.displayName) {
            props.push(`${name}={${val.displayName}}`);
        } else if (val.$$typeof?.toString() === 'Symbol(react.forward_ref)') {
            props.push(`${name}={${val.render.name}}`);
        } else if (typeof val === 'function') {
            props.push(`${name}={() => { /* code */ }`);
        } else if (name === 'dataSource') {
            props.push(`${name}={() => { /* code */ }`);
        } else {
            props.push(`${name}={${safeJsonStringify(val)}}`);
        }
    });

    let propsStr = props.join(' ');
    if (propsStr.length > 0) {
        propsStr = ' ' + propsStr;
    }
    if (propsStr.length > 80) {
        propsStr = '\n' + props.map((p) => '    ' + p).join('\n') + '\n';
    }

    if (children) {
        return `<${tagName}${propsStr}>${children}</${tagName}>`;
    } else {
        return `<${tagName}${propsStr} />`;
    }
}
