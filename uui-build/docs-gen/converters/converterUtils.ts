import { EmitHint, Node, Symbol, SyntaxKind, ts, Type } from 'ts-morph';
import { isExternalFile } from '../utils';
import { getUuiModuleNameFromPath, SYNTAX_KIND_NAMES } from '../constants';
import { TTypeName, TTypeRef, TTypeValue } from '../types';

function isInternalWithUtility(typeNode: Node): boolean {
    const typeRef = typeNode.getChildren().find(Node.isTypeReference);
    const name = typeRef?.getTypeName().getText();
    // TODO: tests, Record is missed.
    if (['Omit', 'Pick', 'Partial', 'Awaited', 'Required', 'Readonly'].indexOf(name) !== -1) {
        const [t] = typeRef.getTypeArguments();
        return !ConverterUtils.isExternalNode(t);
    }
}

export class ConverterUtils {
    static isExternalNode(typeNode: Node): boolean {
        const type = ConverterUtils.getTypeFromNode(typeNode);
        const symbol = ConverterUtils.getSymbolFromType(type);
        if (!symbol) {
            return false;
        }
        if (isInternalWithUtility(typeNode)) {
            return false;
        }
        return (symbol.getDeclarations() || []).some((d) => {
            const filePath = d.getSourceFile().compilerNode.fileName;
            return isExternalFile(filePath);
        });
    }

    static getTypeValueFromNode(typeNode: Node, print?: boolean): TTypeValue {
        const result: TTypeValue = {
            raw: ConverterUtils.getTypeTextFromNode(typeNode),
        };
        if (print) {
            result.print = ConverterUtils.printNode(typeNode);
        }
        return result;
    }

    static getTypeTextFromNode(typeNode: Node) {
        const type = ConverterUtils.getTypeFromNode(typeNode);
        return ConverterUtils.getCompilerTypeText(type);
    }

    static getTypeFromNode(typeNode: Node) {
        const symbol = typeNode.getSymbol();
        if (symbol) {
            const symbolDecls = symbol.getDeclarations();
            return symbolDecls[0].getType();
        }
        return typeNode.getType();
    }

    static getSyntaxKindNameFromNode(node: Node): string {
        const kind = node.getKind();
        return SYNTAX_KIND_NAMES[kind] || String(kind);
    }

    static kindToString(kind: SyntaxKind): string {
        return SYNTAX_KIND_NAMES[kind];
    }

    static getSymbolFromType(type: Type) {
        return type.getSymbol() || type.getAliasSymbol();
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

    static getTypeName(typeSymbol: Symbol): TTypeName {
        const result: TTypeName = { name: '', nameFull: '' };
        if (typeSymbol) {
            result.name = typeSymbol.getEscapedName();
            const declared = typeSymbol.getDeclaredType();
            const ta = declared.getTypeArguments();
            const ata = declared.getAliasTypeArguments();
            const argsArr = ta.length > 0 ? ta : ata;
            if (argsArr.length > 0) {
                const params = argsArr.map((a) => {
                    const s = a.getSymbol();
                    if (s) {
                        return s.getEscapedName();
                    }
                    return ConverterUtils.getCompilerTypeText(a); // need to check that the output isn't too big in such case
                }).join(', ');
                result.nameFull = `${result.name}<${params}>`;
            } else {
                result.nameFull = result.name;
            }
        }
        return result;
    }

    static getTypeParentRef(typeNode: Node, originTypeNode: Node): TTypeRef | undefined {
        const anc = typeNode.getAncestors().filter((a) => {
            return a !== originTypeNode;
        });
        const mapped = ConverterUtils.mapAncestorsToRefs(anc);
        return mapped?.[0];
    }

    private static mapAncestorsToRefs(ancParam: Node[]): TTypeRef[] {
        const anc = ancParam.filter((a) => {
            return (Node.isTypeAliasDeclaration(a) || Node.isInterfaceDeclaration(a) || Node.isClassDeclaration(a));
        });
        if (anc.length === 0) {
            return;
        }
        return anc.map((ta) => {
            const symbol = ta.getSymbol();
            const module = getUuiModuleNameFromPath(ta.getSourceFile().compilerNode.fileName);
            const typeName = ConverterUtils.getTypeName(symbol);
            return {
                module,
                typeName,
            };
        });
    }

    static getCompilerTypeText(type: Type): string {
        return type.getText().replace(/import.*"\)\.*/g, '').replace(/"/g, "'");
    }

    static getCommentFromNode(prop: Node): string[] {
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
}
