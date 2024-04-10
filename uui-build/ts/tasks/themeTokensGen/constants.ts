export const getHiddenFromPublishingVarPlaceholder = (cssVar: string) => {
    return `/* UUI internal variable '${cssVar}' */`;
};

export const PATH = {
    FIGMA_VARS_COLLECTION_SRC: 'public/docs/figmaTokensGen/Theme.json',
    FIGMA_VARS_COLLECTION_OUT: 'public/docs/figmaTokensGen/ThemeOutput.json',
    FIGMA_VARS_COLLECTION_OUT_TOKENS: 'public/docs/figmaTokensGen/ThemeTokens.json',
};

export const UNDEFINED_ALIASES = {
    // If any variable refers (directly or indirectly) to this alias,
    // then it will be excluded from the corresponding mode.
    COLOR: 'core/internal/undefined-color',
};
