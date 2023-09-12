import {
    Node,
    SyntaxKind,
    Type,
} from 'ts-morph';
import { sortProps } from '../utils';
import { IConverter, IConverterContext, TType, TTypeProp } from '../types';
import { ConverterUtils } from './converterUtils';

export class Converter implements IConverter {
    constructor(public readonly context: IConverterContext) {}

    protected getTypeString(typeNode: Node): string {
        return ConverterUtils.getTypeTextFromNode(typeNode);
    }

    protected isPropsSupported(typeNode: Node) {
        const type = ConverterUtils.getTypeFromNode(typeNode);
        return type.isClassOrInterface() || type.isIntersection();
    }

    public isSupported(typeNode: Node) {
        return !!typeNode;
    }

    public convert(typeNode: Node): TType {
        const type = ConverterUtils.getTypeFromNode(typeNode);
        const typeSymbol = ConverterUtils.getSymbolFromType(type);
        //
        const kind = ConverterUtils.getSyntaxKindNameFromNode(typeNode);
        const name = ConverterUtils.getTypeName(typeSymbol);
        const value = this.getTypeString(typeNode);
        const comment = ConverterUtils.getCommentFromNode(typeNode);
        const props = this.isPropsSupported(typeNode) ? extractMembers(name, type, this.context) : undefined;
        return {
            kind,
            name,
            value,
            comment,
            props,
        };
    }
}

function mapSingleMember(originName: string, node: Node, context: IConverterContext): TTypeProp {
    let prop: TTypeProp = undefined;
    const isSupported = [
        SyntaxKind.PropertySignature,
        SyntaxKind.MethodSignature,
        SyntaxKind.GetAccessor,
        SyntaxKind.SetAccessor,
        SyntaxKind.MethodDeclaration,
        SyntaxKind.PropertyDeclaration,
    ].indexOf(node.getKind()) !== -1;

    if (isSupported) {
        const comment = ConverterUtils.getCommentFromNode(node);
        const inheritedFrom = ConverterUtils.getTypeName(node.getParent().getSymbol());
        let name = Node.isPropertyNamed(node) ? node.getName() : '';
        const typeNode = Node.isTypeAliasDeclaration(node) ? node.getTypeNode() : node;
        let value = context.convert(typeNode).value;
        if (Node.isGetAccessorDeclaration(node)) {
            const returnType = node.getStructure().returnType;
            name = `get ${name}`;
            value = `${name}(): ${returnType}`;
        } else if (Node.isSetAccessorDeclaration(node)) {
            const params = node.getStructure().parameters[0];
            name = `set ${name}`;
            value = `${name}(${params.name}: ${params.type})`;
        }
        const kind = ConverterUtils.getSyntaxKindNameFromNode(typeNode);
        const hasQuestionToken = Node.isQuestionTokenable(node) ? node.hasQuestionToken() : false;
        prop = {
            kind,
            name,
            comment,
            value,
            inheritedFrom: inheritedFrom === originName ? undefined : inheritedFrom,
            optional: ConverterUtils.getTypeFromNode(typeNode).isNullable() || hasQuestionToken,
        };
    } else {
        console.warn(`[Converter.mapSingleMember] Unsupported kind=${node.getKind()}`);
    }
    return prop;
}

function extractMembers(originName: string, type: Type, context: IConverterContext): TTypeProp[] | undefined {
    const props = type.getProperties();
    if (props.length > 0) {
        const propsUnsorted: TTypeProp[] = props.map((symb) => {
            const decls = symb.getDeclarations();
            const node = decls[0];
            return mapSingleMember(originName, node, context);
        });
        return sortProps(propsUnsorted);
    }
}
