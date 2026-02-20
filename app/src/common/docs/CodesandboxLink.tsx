import React, { useState } from 'react';
import { codesandboxService } from '../../data/service';
import { Button } from '@epam/uui';
import css from './CodesandboxLink.module.scss';
import { FilesRecord } from '../../data/codesandbox/getCodesandboxConfig';
import { svc } from '../../services';
import { ReactComponent as CodesandboxIcon } from '../../icons/social-network-codesandbox-24.svg';

export function CodesandboxLink(props: { raw?: string, dirPath: string[] }) {
    const { raw, dirPath } = props;
    const [isLoading, setIsLoading] = useState(false);
    const codesandboxLink = codesandboxService.getCodesandboxLink();

    const handleOpenInCodesandbox = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!codesandboxLink || !raw || isLoading) {
            return;
        }

        setIsLoading(true);
        try {
            const stylesheets = await loadStylesheetsCode(raw, dirPath);
            const codesandboxParameters = codesandboxService.getCodesandboxParameters(raw, stylesheets);

            const apiUrl = codesandboxLink.replace('?query=', '?json=1&query=');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `parameters=${encodeURIComponent(codesandboxParameters)}`,
            });

            const result = await response.json();
            if (result.sandbox_id) {
                window.open(`https://codesandbox.io/p/sandbox/${result.sandbox_id}`, '_blank');
            } else {
                console.error('[CodeSandbox] Error:', result.error || 'Unknown error');
            }
        } catch (error) {
            console.error('[CodeSandbox] Failed to create sandbox:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!codesandboxLink || !raw) {
        return null;
    }

    return (
        <form onSubmit={ handleOpenInCodesandbox }>
            <Button
                cx={ css.externalLink }
                rawProps={ { type: 'submit', tabIndex: 0 } }
                fill="ghost"
                icon={ CodesandboxIcon }
                iconPosition="right"
                caption={ isLoading ? 'Processing...' : 'Open in Codesandbox' }
                isDisabled={ isLoading }
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
