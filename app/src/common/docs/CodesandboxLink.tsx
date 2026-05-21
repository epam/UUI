import React, { useRef, useState } from 'react';
import { codesandboxService } from '../../data/service';
import { Button } from '@epam/uui';
import css from './CodesandboxLink.module.scss';
import { FilesRecord } from '../../data/codesandbox/getCodesandboxConfig';
import { svc } from '../../services';
import { ReactComponent as CodesandboxIcon } from '../../icons/social-network-codesandbox-24.svg';

export function CodesandboxLink(props: { raw?: string, dirPath: string[] }) {
    const { raw, dirPath } = props;
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const parametersRef = useRef<HTMLInputElement>(null);
    const codesandboxLink = codesandboxService.getCodesandboxLink();

    const handleOpenInCodesandbox = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!codesandboxLink || !raw || isLoading || !formRef.current || !parametersRef.current) {
            return;
        }

        setIsLoading(true);
        try {
            const [stylesheets, assets] = await Promise.all([
                loadStylesheetsCode(raw, dirPath),
                loadAssetsCode(raw, dirPath),
            ]);
            const exampleCode = adaptExampleCodeForCodesandbox(raw);
            const codesandboxParameters = codesandboxService.getCodesandboxParameters(exampleCode, { ...stylesheets, ...assets });

            // Native form POST opens CodeSandbox in a new tab. fetch() is blocked by Cloudflare (403).
            parametersRef.current.value = codesandboxParameters;
            formRef.current.submit();
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
        <form
            ref={ formRef }
            action={ codesandboxLink }
            method="POST"
            target="_blank"
            onSubmit={ handleOpenInCodesandbox }
        >
            <input type="hidden" name="parameters" ref={ parametersRef } />
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

function getStylesheetImports(raw: string): string[] {
    const imports: string[] = [];
    const matcher = /from\s+['"](\.\/[^'"]+\.scss)['"]/g;
    let match: RegExpExecArray | null;
    while ((match = matcher.exec(raw)) !== null) {
        imports.push(match[1].replace(/^\.\//, ''));
    }
    return [...new Set(imports)];
}

function getAssetImports(raw: string): string[] {
    const imports: string[] = [];
    const matcher = /from\s+['"](\.\.?\/[^'"]+\.(?:svg|png|jpe?g|gif|webp))['"]/gi;
    let match: RegExpExecArray | null;
    while ((match = matcher.exec(raw)) !== null) {
        imports.push(match[1]);
    }
    return [...new Set(imports)];
}

/** Path for /api/get-code (relative to docs/_examples or above via ..). */
function resolveAssetPathForGetCode(dirPath: string[], importPath: string): string {
    const upsInImport = (importPath.match(/\.\.\//g) || []).length;
    const restParts = importPath.split('/').filter((segment) => segment !== '..' && segment !== '.' && segment !== '');
    const depthInExamples = dirPath.length;

    if (upsInImport <= depthInExamples) {
        const parent = dirPath.slice(0, dirPath.length - upsInImport);
        return [...parent, ...restParts].join('/');
    }

    const extraUps = upsInImport - depthInExamples;
    return `${'../'.repeat(extraUps)}${restParts.join('/')}`;
}

/** Flat path inside CodeSandbox (Example.tsx is at project root). */
function toSandboxAssetPath(importPath: string): string {
    return importPath.split('/').filter((segment) => segment !== '..' && segment !== '.' && segment !== '').join('/');
}

function adaptExampleCodeForCodesandbox(code: string): string {
    let result = code.replace(/from\s+(['"])(\.\/.+?)\.scss\1/g, 'from $1$2.css$1');

    getAssetImports(code).forEach((importPath) => {
        const sandboxPath = `./${toSandboxAssetPath(importPath)}`;
        const escaped = importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(`(from\\s+['"])${escaped}(['"])`, 'g'), `$1${sandboxPath}$2`);
    });

    return result;
}

async function loadAssetsCode(raw: string, dirPath: string[]): Promise<FilesRecord> {
    const pathArr = getAssetImports(raw);
    const entries = await Promise.all(
        pathArr.map(async (importPath) => {
            const path = resolveAssetPathForGetCode(dirPath, importPath);
            const file = await svc.api.getCode({ path });
            const sandboxPath = toSandboxAssetPath(importPath);
            return [sandboxPath, { content: file.raw, isBinary: false }] as const;
        }),
    );
    return Object.fromEntries(entries);
}

async function loadStylesheetsCode(raw: string, dirPath: string[]): Promise<FilesRecord> {
    const pathArr = getStylesheetImports(raw);
    const entries = await Promise.all(
        pathArr.map(async (filePath) => {
            const path = dirPath.concat(filePath).join('/');
            const stylesheet = await svc.api.getCode({ path });
            const cssFilePath = filePath.replace(/\.scss$/, '.css');
            const content = stylesheet.compiledCss ?? stylesheet.raw;
            return [cssFilePath, { content, isBinary: false }] as const;
        }),
    );
    return Object.fromEntries(entries);
}
