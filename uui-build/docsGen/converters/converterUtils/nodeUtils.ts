import { EmitHint, Node, Symbol, SyntaxKind, ts } from 'ts-morph';
import { getUuiModuleNameFromPath, isExternalFile, makeRelativeToUuiRoot } from '../../utils/fileUtils';
// eslint-disable-next-line import/no-cycle
import { SymbolUtils } from './symbolUtils';
import { TypeUtils } from './typeUtils';
import { TTypeRef, TTypeValue } from '../../types/docsGenSharedTypes';
import { IConverterContext } from '../../types/types';

export class NodeUtils {
    static getRelativeSource(typeNode: Node) {
        const src = typeNode.getSourceFile();
        const fullPath = src.getFilePath();
        return makeRelativeToUuiRoot(fullPath);
    }

    static unWrapTypeNodeFromUtility(typeNode: Node): Node | undefined {
        const typeRef = typeNode.getChildren().find(Node.isTypeReference);
        const name = typeRef?.getTypeName().getText() || '';
        // TODO: tests, Record is missed.
        if (['Omit', 'Pick', 'Partial', 'Awaited', 'Required', 'Readonly'].indexOf(name) !== -1) {
            const t = typeRef?.getTypeArguments();
            return t?.[0];
        }
    }

    static printNode(node: Node): string[] {
        const printer = ts.createPrinter();
        function removeLeadingExportKw(s: string) {
            return s.replace(/^(export\s+)(type|interface|enum)(.*)$/g, '$2$3');
        }
        return printer.printNode(EmitHint.Unspecified, node.compilerNode, node.getSourceFile().compilerNode)
            .split('\n')
            .map(removeLeadingExportKw);
    }

    static getCommentFromNode(prop: Node): string[] | undefined {
        const ranges = prop.getLeadingCommentRanges();
        if (ranges.length > 0) {
            const closestDoc = ranges[ranges.length - 1].getText().trim();
            const isTsDoc = closestDoc.indexOf('/**') === 0;
            if (isTsDoc) {
                const LF = '\n';
                return closestDoc.split(LF).map(cleanAsteriks).join(LF).trim()
                    .split(LF);
            }
        }
        function cleanAsteriks(line: string): string {
            const regex1 = /^([\s]*\/[*]{1,2})(.*)$/; // leading /* or /**
            const regex2 = /^(.*)([\s]*[*]{1,2}\/)$/; // trailing */ or **/
            const regex3 = /^([\s]*[*]{1,1})(.*)$/; // leading *
            return line.replace(regex1, '$2').replace(regex2, '$1').replace(regex3, '$2');
        }
    }

    static getTypeParentRef(typeNode: Node, parentNode?: Node): TTypeRef | undefined {
        const anc = typeNode.getAncestors().filter((a) => {
            return a !== parentNode;
        });
        const mapped = NodeUtils.mapAncestorsToRefs(anc);
        return mapped?.[0];
    }

    private static mapAncestorsToRefs(ancParam: Node[]): TTypeRef[] | undefined {
        const anc = ancParam.filter((a) => {
            return (Node.isTypeAliasDeclaration(a) || Node.isInterfaceDeclaration(a) || Node.isClassDeclaration(a));
        });
        if (anc.length === 0) {
            return undefined;
        }
        return anc.map((ta) => {
            return NodeUtils.getTypeRef(ta);
        });
    }

    static getTypeRef(typeNode: Node): TTypeRef {
        const module = getUuiModuleNameFromPath(typeNode.getSourceFile().compilerNode.fileName);
        const typeName = SymbolUtils.getTypeName(typeNode.getSymbol());
        const src = NodeUtils.getRelativeSource(typeNode);
        return {
            module,
            typeName,
            src,
        };
    }

    static isInternalTypeNodeWrappedInUtility(typeNode: Node): boolean {
        const typeNodeUnwrapped = NodeUtils.unWrapTypeNodeFromUtility(typeNode);
        if (typeNodeUnwrapped) {
            return !NodeUtils.isExternalNode(typeNodeUnwrapped);
        }
        return false;
    }

    static getTypeFromNode(typeNode: Node) {
        const symbol = typeNode.getSymbol();
        if (symbol) {
            const symbolDecls = symbol.getDeclarations();
            return symbolDecls[0].getType();
        }
        return typeNode.getType();
    }

    static isExternalNode(typeNode: Node): boolean {
        const type = NodeUtils.getTypeFromNode(typeNode);
        const symbol = TypeUtils.getSymbolFromType(type);
        if (!symbol) {
            return false;
        }
        if (NodeUtils.isInternalTypeNodeWrappedInUtility(typeNode)) {
            return false;
        }
        return (symbol.getDeclarations() || []).some((d) => {
            const filePath = d.getSourceFile().compilerNode.fileName;
            return isExternalFile(filePath);
        });
    }

    static isDirectExportFromFile(typeNode: Node) {
        const ancs = typeNode.getAncestors();
        return ancs?.length === 1 && ancs[0].isKind(SyntaxKind.SourceFile);
    }

    static getTypeValueFromNode(typeNode: Node, print?: boolean): TTypeValue {
        const type = typeNode.getType();
        const result: TTypeValue = {
            raw: TypeUtils.getCompilerTypeText(type),
        };
        if (print) {
            result.print = NodeUtils.printNode(typeNode);
        }
        return result;
    }

    static getPropertySymbolRawType(propertySymbol: Symbol, context: IConverterContext): string {
        const node = SymbolUtils.getNodeFromSymbol(propertySymbol);
        const name = NodeUtils.getPropertyNodeName(node);
        if (Node.isGetAccessorDeclaration(node)) {
            const returnType = node.getStructure().returnType;
            return `${name}(): ${returnType}`;
        } else if (Node.isSetAccessorDeclaration(node)) {
            const structureParams = node.getStructure().parameters?.[0];
            if (structureParams) {
                return `${name}(${structureParams.name}: ${structureParams.type})`;
            }
        } else if (Node.isIndexSignatureDeclaration(node)) {
            return TypeUtils.getCompilerTypeText(node.getReturnType());
        }
        const conv = context.convertProp(propertySymbol);
        return conv.raw;
    }

    static getPropertyNodeName(propertyNode: Node): string {
        if (Node.isPropertyNamed(propertyNode)) {
            const name = propertyNode.getName();
            if (Node.isGetAccessorDeclaration(propertyNode)) {
                return `get ${name}`;
            } else if (Node.isSetAccessorDeclaration(propertyNode)) {
                return `set ${name}`;
            }
            return name;
        } else if (Node.isIndexSignatureDeclaration(propertyNode)) {
            const kName = propertyNode.getKeyName();
            const kType = propertyNode.getKeyType();
            const kTypeText = TypeUtils.getCompilerTypeText(kType);
            return `[${kName}: ${kTypeText}]`;
        }
        return '';
    }

    static isPropertyNodeRequired(propertyNode: Node): boolean {
        const hasQuestionToken = Node.isQuestionTokenable(propertyNode) ? propertyNode.hasQuestionToken() : false;
        const typeNode = Node.isTypeAliasDeclaration(propertyNode) ? propertyNode.getTypeNode() : propertyNode;
        return !(NodeUtils.getTypeFromNode(typeNode).isNullable() || hasQuestionToken);
    }
}
