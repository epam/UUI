import { ExportedDeclarations, Project, Node, SyntaxKind } from 'ts-morph';

type TRef = {
    module?: string,
    name: string,
};

export type TType = {
    kind: string;
    name: string;
    value: string;
    valuePrint: string[];
    comment?: string[];
    props?: TTypeProp[];
};
export type TTypeProp = {
    kind: string;
    name: string;
    value: string;
    comment?: string[];
    required: boolean;
    from?: TRef;
};

export type TUuiModuleFormattedExport = Record<string, TType>;
type TExportName = string;
type TModuleName = string;
export type TExportedDeclarations = Record<TExportName, { entry: ExportedDeclarations[]; kind: SyntaxKind }>;
export type TUuiModulesExports = Record<TModuleName, { project: Project, exportedDeclarations: TExportedDeclarations }>;

export interface IConverterConstructor {
    new (context: IConverterContext): IConverter;
}
export interface IConverter {
    isSupported(typeNode: Node): boolean;
    convert(typeNode: Node): TType
}
export interface IConverterContext {
    project: Project
    convert(typeNode: Node): TType
}
