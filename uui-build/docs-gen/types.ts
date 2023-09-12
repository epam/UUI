import { ExportedDeclarations, Project, Node, SyntaxKind, TypeChecker } from 'ts-morph';

export type TType = {
    kind: string;
    name: string;
    value: string;
    comment?: string[];
    props?: TTypeProp[];
};
export type TTypeProp = {
    kind: string;
    name: string;
    value: string;
    comment?: string[];
    optional?: boolean;
    inheritedFrom?: string;
};

export type TUuiModuleFormattedExport = Record<string, TType>;
type TExportName = string;
type TModuleName = string;
export type TExportedDeclarations = Record<TExportName, { entry: ExportedDeclarations[]; kind: SyntaxKind }>;
export type TUuiModulesExports = Record<TModuleName, { project: Project, typeChecker: TypeChecker, exportedDeclarations: TExportedDeclarations }>;

export interface IConverterConstructor {
    new (context: IConverterContext): IConverter;
}
export interface IConverter {
    isSupported(typeNode: Node): boolean;
    convert(typeNode: Node): TType
}
export interface IConverterContext {
    typeChecker: TypeChecker;
    convert(typeNode: Node): TType
}
