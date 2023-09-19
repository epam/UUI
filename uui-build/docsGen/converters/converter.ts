import {
    Node,
    SyntaxKind,
    Type,
} from 'ts-morph';
import { sortProps } from '../utils';
import { IConverter, IConverterContext, TType, TTypeProp, TTypeValue } from '../types';
import { ConverterUtils } from './converterUtils';

export class Converter implements IConverter {
    constructor(public readonly context: IConverterContext) {}

    protected getTypeValue(typeNode: Node, print?: boolean): TTypeValue {
        return ConverterUtils.getTypeValueFromNode(typeNode, print);
    }

    protected isPropsSupported(typeNode: Node) {
        return ConverterUtils.isPropsSupported(typeNode);
    }

    public isSupported(typeNode: Node) {
        return !!typeNode;
    }

    public convert(typeNode: Node): TType {
        const type = ConverterUtils.getTypeFromNode(typeNode);
        const kind = ConverterUtils.getSyntaxKindNameFromNode(typeNode);
        const typeRef = ConverterUtils.getTypeRef(typeNode);
        const typeValue = this.getTypeValue(typeNode, true);
        const comment = ConverterUtils.getCommentFromNode(typeNode);
        const props = this.isPropsSupported(typeNode) ? extractMembers(typeNode, type, this.context) : undefined;
        const res: TType = {
            kind,
            typeRef,
            typeValue,
            comment,
            props,
        };
        this.context.stats.checkConvertedExport(res, ConverterUtils.isDirectExportFromFile(typeNode));

        return res;
    }
}

function mapSingleMember(originTypeNode: Node, node: Node, context: IConverterContext): TTypeProp {
    let prop: TTypeProp = undefined;
    const nKind = node.getKind();
    const isSupported = [
        SyntaxKind.PropertySignature,
        SyntaxKind.MethodSignature,
        SyntaxKind.GetAccessor,
        SyntaxKind.SetAccessor,
        SyntaxKind.MethodDeclaration,
        SyntaxKind.PropertyDeclaration,
    ].indexOf(nKind) !== -1;

    if (isSupported) {
        const comment = ConverterUtils.getCommentFromNode(node);
        const from = ConverterUtils.getTypeParentRef(node, originTypeNode);
        let name = Node.isPropertyNamed(node) ? node.getName() : '';
        const typeNode = Node.isTypeAliasDeclaration(node) ? node.getTypeNode() : node;
        const converted = context.convert(typeNode);
        let { raw } = converted.typeValue;
        if (Node.isGetAccessorDeclaration(node)) {
            const returnType = node.getStructure().returnType;
            name = `get ${name}`;
            raw = `${name}(): ${returnType}`;
        } else if (Node.isSetAccessorDeclaration(node)) {
            const params = node.getStructure().parameters[0];
            name = `set ${name}`;
            raw = `${name}(${params.name}: ${params.type})`;
        }
        const kind = ConverterUtils.getSyntaxKindNameFromNode(typeNode);
        const hasQuestionToken = Node.isQuestionTokenable(node) ? node.hasQuestionToken() : false;
        const required = !(ConverterUtils.getTypeFromNode(typeNode).isNullable() || hasQuestionToken);
        prop = {
            kind,
            name,
            comment,
            typeValue: { raw },
            from,
            required,
        };
    } else {
        console.warn(`[Converter.mapSingleMember] Unsupported kind=${nKind}`);
    }
    return prop;
}

function extractMembers(originTypeNode: Node, type: Type, context: IConverterContext): TTypeProp[] | undefined {
    const props = type.getProperties();
    if (props.length > 0) {
        const propsUnsorted: TTypeProp[] = props.map((symb) => {
            const decls = symb.getDeclarations();
            const node = decls[0];
            return mapSingleMember(originTypeNode, node, context);
        });
        return sortProps(propsUnsorted);
    }
}
