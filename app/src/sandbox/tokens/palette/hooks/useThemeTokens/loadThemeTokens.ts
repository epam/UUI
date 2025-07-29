import { IThemeVar } from '../../types/sharedTypes';
import { svc } from '../../../../../services';
import { loadedTokensConverter } from './loadedTokensConverter';
import { IThemeVarUI, TLoadThemeTokensParams } from '../../types/types';
import { ThemeId } from '@epam/uui-docs';

const cache: { content: IThemeVar[] | undefined } = { content: undefined };
export async function loadThemeTokens(params: TLoadThemeTokensParams & { uuiTheme: ThemeId }): Promise<IThemeVarUI[]> {
    if (!svc.api) {
        throw new Error('svc.api not available');
    }
    if (!cache.content) {
        const { content } = await svc.api.getThemeTokens();
        cache.content = content;
    }

    return loadedTokensConverter({ ...params, rawTokens: cache.content });
}
