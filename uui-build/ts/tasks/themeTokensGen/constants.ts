export const getHiddenFromPublishingVarPlaceholder = (cssVar: string) => {
    return `/* UUI internal variable '${cssVar}' */`;
};

export const UNDEFINED_ALIASES = {
    // If any variable refers (directly or indirectly) to this alias,
    // then it will be excluded from the corresponding mode.
    COLOR: 'core/internal/undefined-color',
};
