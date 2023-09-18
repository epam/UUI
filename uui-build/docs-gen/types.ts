import { ExportedDeclarations, Project, Node, SyntaxKind } from 'ts-morph';

export type TTypeName = {
    name: string;
    nameFull: string;
};
export type TTypeValue = {
    raw: string;
    print?: string[];
};
export type TTypeRef = {
    module?: string,
    typeName: TTypeName,
};
export type TType = {
    kind: string;
    typeName: TTypeName;
    typeValue: TTypeValue;
    comment?: string[];
    source?: string;
    props?: TTypeProp[];
};
export type TTypeProp = {
    kind: string;
    name: string;
    typeValue: TTypeValue;
    comment?: string[];
    required: boolean;
    from?: TTypeRef;
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
