export interface ITokensDocGroup {
    id: string,
    title: string,
    description: string,
    children: ITokensDocGroup[] | ITokensDocItem[],
}
export interface ITokensDocItem {
    cssVar: string, // use it to render color rectangle
    description: string,
    useCases: string,
    value: string, // hex, for tooltip
}
