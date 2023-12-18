import { EmitHint, Node, Symbol, ts } from 'ts-morph';
import { resolveModuleName, isExternalFile, makeRelativeToUuiRoot } from '../../utils/fileUtils';
// eslint-disable-next-line import/no-cycle
import { SymbolUtils } from './symbolUtils';
import { TypeUtils } from './typeUtils';
import { TComment, TTypeSummary, TTypeValue } from '../../types/sharedTypes';
import { IConverterContext } from '../../types/types';
import { TsDocUtils } from '../../tsdoc/tsDocUtils';

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

    static getCommentFromNode(prop: Node): TComment | undefined {
        const ranges = prop.getLeadingCommentRanges();
        if (ranges.length > 0) {
            const closestDoc = ranges[ranges.length - 1].getText().trim();
            return TsDocUtils.parseComment(closestDoc);
        }
    }

    static getPropertyNodeParent(propertyNode: Node, containerNode?: Node): Node | undefined {
        const anc = propertyNode.getAncestors().filter((a) => {
            return a !== containerNode;
        });
        const ancFiltered = anc.filter((a) => {
            return (Node.isTypeAliasDeclaration(a) || Node.isInterfaceDeclaration(a) || Node.isClassDeclaration(a));
        });
        if (ancFiltered.length > 0) {
            return ancFiltered[0];
        }
    }

    static getTypeSummary(typeNode: Node): TTypeSummary {
        const fileName = typeNode.getSourceFile().compilerNode.fileName;
        const module = resolveModuleName(fileName);
        const typeName = SymbolUtils.getTypeName(typeNode.getSymbol());
        const src = NodeUtils.getRelativeSource(typeNode);
        const comment = NodeUtils.getCommentFromNode(typeNode);
        return {
            module,
            typeName,
            src,
            comment,
            exported: false, // on this level, we don't know whether it's exported or not, so this value may be changed later.
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

    static getTypeValueFromNode(params: { typeNode: Node, print: boolean }): TTypeValue {
        const {
            typeNode,
            print,
        } = params;
        const type = typeNode.getType();
        const result: TTypeValue = {
            raw: TypeUtils.getCompilerTypeText(type),
        };
        if (print) {
            result.print = NodeUtils.printNode(typeNode);
        }
        return result;
    }

    static getPropertySymbolTypeValue(propertySymbol: Symbol, context: IConverterContext): TTypeValue {
        const node = SymbolUtils.getNodeFromSymbol(propertySymbol);
        const name = NodeUtils.getPropertyNodeName(node);
        if (Node.isGetAccessorDeclaration(node)) {
            const returnType = node.getStructure().returnType;
            return {
                raw: `${name}(): ${returnType}`,
            };
        } else if (Node.isSetAccessorDeclaration(node)) {
            const structureParams = node.getStructure().parameters?.[0];
            if (structureParams) {
                return {
                    raw: `${name}(${structureParams.name}: ${structureParams.type})`,
                };
            }
        } else if (Node.isIndexSignatureDeclaration(node)) {
            return {
                raw: TypeUtils.getCompilerTypeText(node.getReturnType()),
            };
        }
        const conv = context.convertToTypeValue({ convertable: propertySymbol, isProperty: true });
        return conv;
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
        return !(NodeUtils.getTypeFromNode(typeNode as Node).isNullable() || hasQuestionToken);
    }
}
