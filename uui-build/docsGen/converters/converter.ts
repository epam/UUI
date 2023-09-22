import { Node, SyntaxKind, Type } from 'ts-morph';
import { PropsSet, SimpleIdGen, sortProps } from '../utils';
import { IConverter, IConverterContext, TType, TTypeProp, TTypeValue } from '../types';
import { ConverterUtils } from './converterUtils';

export class Converter implements IConverter {
    constructor(public readonly context: IConverterContext) {}

    protected getTypeValue(typeNode: Node, print?: boolean): TTypeValue {
        return ConverterUtils.getTypeValueFromNode(typeNode, print);
    }

    protected isPropsSupported(typeNode: Node) {
        const type = typeNode.getType();
        const isExternalType = ConverterUtils.isExternalNode(typeNode);
        return ConverterUtils.isPropsSupportedByType({ type, isExternalType });
    }

    public isSupported(typeNode: Node) {
        return !!typeNode;
    }

    public convert(typeNode: Node): TType {
        const kind = ConverterUtils.getSyntaxKindNameFromNode(typeNode);
        const typeRef = ConverterUtils.getTypeRef(typeNode);
        const typeValue = this.getTypeValue(typeNode, true);
        const comment = ConverterUtils.getCommentFromNode(typeNode);
        const props = this.isPropsSupported(typeNode) ? extractProps(typeNode, this.context) : undefined;
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

function mapSingleMember(params: { parentNode?: Node, propertyNode: Node, context: IConverterContext, idGen: SimpleIdGen }): TTypeProp | undefined {
    const { parentNode, propertyNode, context, idGen } = params;
    let prop: TTypeProp | undefined = undefined;
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
        const comment = ConverterUtils.getCommentFromNode(propertyNode);
        const from = ConverterUtils.getTypeParentRef(propertyNode, parentNode);
        let name = Node.isPropertyNamed(propertyNode) ? propertyNode.getName() : '';
        const typeNode = Node.isTypeAliasDeclaration(propertyNode) ? propertyNode.getTypeNode() : propertyNode;
        if (!typeNode) {
            return;
        }
        const converted = context.convert(typeNode);
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
        const kind = ConverterUtils.getSyntaxKindNameFromNode(typeNode);
        const hasQuestionToken = Node.isQuestionTokenable(propertyNode) ? propertyNode.hasQuestionToken() : false;
        const required = !(ConverterUtils.getTypeFromNode(typeNode).isNullable() || hasQuestionToken);
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

function extractProps(parentNode: Node, context: IConverterContext): TTypeProp[] | undefined {
    const type = ConverterUtils.getTypeFromNode(parentNode);
    const idGen = new SimpleIdGen();
    if (type.isUnion()) {
        const unionTypes = type.getUnionTypes();
        const allSupportProps = unionTypes.every((singleUnionType) => {
            const typeNode = ConverterUtils.getNodeFromType(singleUnionType);
            /*
             * If node isn't available for this type, then we treat it as internal.
             * I hope it's OK - in the worst case, the end user will see a bunch of props from the external type.
             */
            const isExternalType = typeNode ? ConverterUtils.isExternalNode(typeNode) : false;
            return ConverterUtils.isPropsSupportedByType({ type: singleUnionType, isExternalType });
        });
        if (allSupportProps) {
            const allPropsSets = unionTypes.reduce<PropsSet[]>((acc, unionTypeItem) => {
                const utProps = extractPropsFromNonUnionType({ parentNode, type: unionTypeItem, context, idGen });
                acc.push(PropsSet.fromArray(utProps));
                return acc;
            }, []);
            return PropsSet.concatAndSort(allPropsSets);
        }
    } else {
        return extractPropsFromNonUnionType({ parentNode, type, context, sort: true, idGen });
    }
}

function extractPropsFromNonUnionType(params: { parentNode: Node, type: Type, context: IConverterContext, sort?: boolean, idGen: SimpleIdGen }): TTypeProp[] | undefined {
    const { parentNode, type, context, sort, idGen } = params;
    const props = type.getProperties();
    if (props.length > 0) {
        const propsUnsorted = props.reduce<TTypeProp[]>((acc, symb) => {
            const decls = symb.getDeclarations();
            const propertyNode = decls[0];
            const mapped = mapSingleMember({ parentNode, propertyNode, context, idGen });
            if (mapped) {
                acc.push(mapped);
            }
            return acc;
        }, []);
        if (sort) {
            return sortProps(propsUnsorted);
        }
        return propsUnsorted;
    }
}
