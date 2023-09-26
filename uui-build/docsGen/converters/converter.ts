import { Node, SyntaxKind, Type, Symbol, TypeChecker } from 'ts-morph';
import { PropsSet, SimpleIdGen } from '../utils';
import { IConverter, IConverterContext, TConvertable, TType, TTypeProp, TTypeValue } from '../types';
import { NodeUtils } from './converterUtils/nodeUtils';
import { TypeUtils } from './converterUtils/typeUtils';
import { SymbolUtils } from './converterUtils/symbolUtils';
import { ConvertableUtils } from './converterUtils/convertableUtils';

export class Converter implements IConverter {
    constructor(public readonly context: IConverterContext) {}

    convertToTypeValue(nodeOrSymbol: TConvertable, print: boolean): TTypeValue {
        if (Node.isNode(nodeOrSymbol)) {
            const node = ConvertableUtils.getNode(nodeOrSymbol);
            return NodeUtils.getTypeValueFromNode(node, print);
        }
        return SymbolUtils.getTypeValueFromNode(nodeOrSymbol, print);
    }

    isSupported(nodeOrSymbol: TConvertable) {
        return !!nodeOrSymbol;
    }

    convert(nodeOrSymbol: TConvertable): TType {
        const typeValue = this.convertToTypeValue(nodeOrSymbol, true);
        const node = ConvertableUtils.getNode(nodeOrSymbol);
        const kind = NodeUtils.getSyntaxKindNameFromNode(node);
        const typeRef = NodeUtils.getTypeRef(node);
        const comment = NodeUtils.getCommentFromNode(node);
        const propsGen = this.isPropsSupported(node) ? extractProps(node, this.context) : undefined;
        const res: TType = {
            kind,
            typeRef,
            typeValue,
            comment,
            props: propsGen?.props,
        };
        if (propsGen?.fromUnion) {
            res.propsFromUnion = true;
        }
        this.context.stats.checkConvertedExport(res, NodeUtils.isDirectExportFromFile(node));

        return res;
    }

    protected getTypeChecker(): TypeChecker {
        return this.context.project.getTypeChecker();
    }

    protected isPropsSupported(node: Node) {
        const type = node.getType();
        const isExternalType = NodeUtils.isExternalNode(node);
        return TypeUtils.isPropsSupportedByType({ type, isExternalType });
    }
}

function mapSingleMember(params: { parentNode?: Node, propertySymbol: Symbol, context: IConverterContext, idGen: SimpleIdGen }): TTypeProp | undefined {
    const { parentNode, propertySymbol, context, idGen } = params;
    let prop: TTypeProp | undefined = undefined;
    const propertyNode = SymbolUtils.getNodeFromSymbol(propertySymbol);
    const nKind = propertyNode.getKind();
    const isSupported = [
        SyntaxKind.PropertySignature,
        SyntaxKind.MethodSignature,
        SyntaxKind.GetAccessor,
        SyntaxKind.SetAccessor,
        SyntaxKind.MethodDeclaration,
        SyntaxKind.PropertyDeclaration,
    ].indexOf(nKind) !== -1;

    if (isSupported) {
        const comment = NodeUtils.getCommentFromNode(propertyNode);
        const from = NodeUtils.getTypeParentRef(propertyNode, parentNode);
        let name = Node.isPropertyNamed(propertyNode) ? propertyNode.getName() : '';
        const typeNode = Node.isTypeAliasDeclaration(propertyNode) ? propertyNode.getTypeNode() : propertyNode;
        if (!typeNode) {
            return;
        }
        const converted = context.convert({ nodeOrSymbol: propertySymbol, isTypeProp: true });
        if (!converted) {
            return;
        }
        let { raw } = converted.typeValue;
        if (Node.isGetAccessorDeclaration(propertyNode)) {
            const returnType = propertyNode.getStructure().returnType;
            name = `get ${name}`;
            raw = `${name}(): ${returnType}`;
        } else if (Node.isSetAccessorDeclaration(propertyNode)) {
            const structureParams = propertyNode.getStructure().parameters?.[0];
            if (structureParams) {
                name = `set ${name}`;
                raw = `${name}(${structureParams.name}: ${structureParams.type})`;
            }
        }
        const kind = NodeUtils.getSyntaxKindNameFromNode(typeNode);
        const hasQuestionToken = Node.isQuestionTokenable(propertyNode) ? propertyNode.hasQuestionToken() : false;
        const required = !(NodeUtils.getTypeFromNode(typeNode).isNullable() || hasQuestionToken);
        const uniqueId = idGen.getNextId();
        prop = {
            uniqueId,
            kind,
            name,
            comment,
            typeValue: { raw },
            from,
            required,
        };
    } else {
        console.error(`[Converter.mapSingleMember] Unsupported kind=${nKind}`);
    }
    return prop;
}

function extractProps(parentNode: Node, context: IConverterContext): {
    props: TTypeProp[],
    fromUnion: boolean
} | undefined {
    const type = NodeUtils.getTypeFromNode(parentNode);
    const idGen = new SimpleIdGen();
    if (type.isUnion()) {
        const unionTypes = type.getUnionTypes();
        const allSupportProps = unionTypes.every((singleUnionType) => {
            const typeNode = TypeUtils.getNodeFromType(singleUnionType);
            /*
             * If node isn't available for this type, then we treat it as internal.
             * I hope it's OK - in the worst case, the end user will see a bunch of props from the external type.
             */
            const isExternalType = typeNode ? NodeUtils.isExternalNode(typeNode) : false;
            return TypeUtils.isPropsSupportedByType({ type: singleUnionType, isExternalType });
        });
        if (allSupportProps) {
            const allPropsSets = unionTypes.reduce<PropsSet[]>((acc, unionTypeItem) => {
                const utProps = extractPropsFromNonUnionType({ parentNode, type: unionTypeItem, context, idGen });
                acc.push(PropsSet.fromArray(utProps));
                return acc;
            }, []);
            const props = PropsSet.concat(allPropsSets);
            return {
                props,
                fromUnion: true,
            };
        }
    } else {
        const props = extractPropsFromNonUnionType({ parentNode, type, context, idGen });
        return {
            props,
            fromUnion: false,
        };
    }
}

function extractPropsFromNonUnionType(params: { parentNode: Node, type: Type, context: IConverterContext, idGen: SimpleIdGen }): TTypeProp[] | undefined {
    const { parentNode, type, context, idGen } = params;
    const props = type.getProperties();
    if (props.length > 0) {
        const propsUnsorted = props.reduce<TTypeProp[]>((acc, propertySymbol) => {
            const mapped = mapSingleMember({ parentNode, propertySymbol, context, idGen });
            if (mapped) {
                acc.push(mapped);
            }
            return acc;
        }, []);
        return propsUnsorted;
    }
}
