import React, { useEffect, useState } from 'react';
import { codesandboxService } from '../../data/service';
import { Button } from '@epam/uui';
import css from './CodesandboxLink.module.scss';
import { FilesRecord } from '../../data/codesandbox/getCodesandboxConfig';
import { svc } from '../../services';
import { ReactComponent as CodesandboxIcon } from '../../icons/social-network-codesandbox-24.svg';

export function CodesandboxLink(props: { raw?: string, dirPath: string[] }) {
    const { raw, dirPath } = props;
    const [codesandboxParameters, setCodesandboxParameters] = useState<string>();
    const codesandboxLink = codesandboxService.getCodesandboxLink();

    useEffect(() => {
        if (!raw) {
            return;
        }
        let destroyed = false;
        loadStylesheetsCode(raw, dirPath)
            .then((stylesheets) => {
                if (destroyed) { return; }
                const params = codesandboxService.getCodesandboxParameters(raw, stylesheets);
                setCodesandboxParameters(params);
            })
            .catch((err) => console.error(err));
        return () => {
            destroyed = true;
        };
    }, [raw, dirPath]);

    if (!codesandboxLink || !codesandboxParameters) {
        return null;
    }

    return (
        <form action={ codesandboxLink } method="POST" target="_blank">
            <input type="hidden" name="parameters" value={ codesandboxParameters } />
            <Button
                cx={ css.externalLink }
                rawProps={ { type: 'submit', tabIndex: 0 } }
                fill="ghost"
                icon={ CodesandboxIcon }
                iconPosition="right"
                caption="Open in Codesandbox"
            />
        </form>
    );
}

function getComponentStylesheet(raw: string): string[] {
    // Match .example.scss or .scss
    const matcher = /\.\/\w+(?:.example)?(?:.module)?.scss/;
    const stylesheets = raw.match(matcher);
    if (stylesheets !== null) {
        return stylesheets.map((match) => {
            // Compose path from match and current directory path
            const [, filePath] = match.split('/');
            return filePath;
        });
    }
    return [];
}

async function loadStylesheetsCode(raw: string, dirPath: string[]): Promise<FilesRecord> {
    const pathArr = getComponentStylesheet(raw);
    const p = pathArr.map(async (filePath) => {
        const path = dirPath.concat(filePath).join('/');
        const stylesheet = await svc.api.getCode({ path });
        return {
            [filePath]: { content: stylesheet.raw, isBinary: false },
        };
    });
    const infoArr = await Promise.all(p);
    return infoArr.reduce((acc, info) => {
        Object.assign(acc, info);
        return acc;
    }, {});
}
