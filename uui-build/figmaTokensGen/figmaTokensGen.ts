import { IFigmaVar, TUuiCssToken } from './types';
import { FileUtils } from './utils/fileUtils';
import { IGNORED_VAR_PLACEHOLDER } from './constants';
import { FigmaScriptsContext } from './context/context';

export function genFigmaTokens() {
    const ctx = new FigmaScriptsContext();
    const source = FileUtils.readFigmaVarCollection();
    const variables = source.variables.map((figmaVar) => {
        const { isSupported, cssVar, cssToken } = extractCssTokenFromVar({ figmaVar, ctx });
        if (isSupported) {
            ctx.log.logSupported(cssToken);
        } else {
            ctx.log.logUnsupported(cssToken);
        }
        return {
            ...figmaVar,
            codeSyntax: {
                ...figmaVar.codeSyntax,
                WEB: isSupported ? cssVar : IGNORED_VAR_PLACEHOLDER,
            },
        };
    });

    FileUtils.writeResults({
        result: {
            ...source,
            variables,
        },
        ctx,
    });
}

function isSupportedByUuiApp(params: { figmaVar: IFigmaVar, cssToken: TUuiCssToken, ctx: FigmaScriptsContext }) {
    const { figmaVar, cssToken, ctx } = params;
    const isIgnoredByConvention = figmaVar.name.indexOf('core/') !== 0;
    const isIgnoredByConfig = ctx.config.tokens[cssToken]?.isSupportedByUUiApp === false;
    return !isIgnoredByConvention && !isIgnoredByConfig;
}

function extractCssTokenFromVar(params: { figmaVar: IFigmaVar, ctx: FigmaScriptsContext }) {
    const { figmaVar, ctx } = params;
    const { name } = figmaVar;
    const tokens = name.split('/');
    const lastToken = tokens[tokens.length - 1];
    const cssToken: TUuiCssToken = `--uui-${lastToken}`;
    const cssVar = `var(${cssToken})`;
    const isSupported = isSupportedByUuiApp({ figmaVar, cssToken, ctx });
    return { cssVar, isSupported, cssToken };
}
