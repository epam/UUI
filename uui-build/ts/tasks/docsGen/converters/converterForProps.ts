import { Node, Symbol, SyntaxKind, Type } from 'ts-morph';
import { IConverterContext, TConvertable, TTypePropsConverted } from '../types/types';
import { SymbolUtils } from './converterUtils/symbolUtils';
import { NodeUtils } from './converterUtils/nodeUtils';
import { TypeUtils } from './converterUtils/typeUtils';
import { TTypeProp, TTypeRef, TTypeValue } from '../types/sharedTypes';
import { getTypeRefFromTypeSummary } from './converterUtils/converterUtils';
import { ConvertableUtils } from './converterUtils/convertableUtils';
import { highlight, languages } from 'prismjs';
// @ts-ignore
import loadLanguages from 'prismjs/components/index';

loadLanguages(['typescript']);

function highlightTsCode(raw: any) {
    if (typeof raw !== 'undefined') {
        return highlight(raw, languages.typescript, 'typescript');
    }
    return raw;
}

function isPropsSupported(node: Node) {
    const type = node.getType();
    const isExternalType = NodeUtils.isExternalNode(node);
    return TypeUtils.isPropsSupportedByType({ type, isExternalType });
}

export function convertTypeProps(nodeOrSymbol: TConvertable, context: IConverterContext): TTypePropsConverted | undefined {
    const typeNode = ConvertableUtils.getNode(nodeOrSymbol);
    if (!isPropsSupported(typeNode)) {
        return;
    }
    const type = NodeUtils.getTypeFromNode(typeNode);
    const idGen = new SimpleIdGen();
    if (type.isUnion()) {
        const unionTypes = type.getUnionTypes();
        const props = extractPropsFromNonUnionTypeArr(unionTypes, typeNode, context, idGen);
        if (props) {
            return {
                props,
                propsFromUnion: true,
            };
        }
    } else {
        const props = extractPropsFromNonUnionType({ parentNode: typeNode, type, context, idGen });
        if (props) {
            return {
                props,
                propsFromUnion: false,
            };
        }
    }
}

function extractPropsFromNonUnionTypeArr(typeArr: Type[], parentNode: Node, context: IConverterContext, idGen: SimpleIdGen) {
    const allSupportProps = typeArr.every((singleType) => {
        const typeNode = TypeUtils.getNodeFromType(singleType);
        /*
         * If node isn't available for this type, then we treat it as internal.
         * I hope it's OK - in the worst case, the end user will see a bunch of props from the external type.
         */
        const isExternalType = typeNode ? NodeUtils.isExternalNode(typeNode) : false;
        return TypeUtils.isPropsSupportedByType({ type: singleType, isExternalType });
    });
    if (allSupportProps) {
        const allPropsSets = typeArr.reduce<PropsSet[]>((acc, singleType) => {
            const utProps = extractPropsFromNonUnionType({ parentNode, type: singleType, context, idGen });
            if (utProps) {
                acc.push(PropsSet.fromArray(utProps));
            }
            return acc;
        }, []);
        return PropsSet.concat(allPropsSets);
    }
}

function extractPropsFromNonUnionType(params: { parentNode: Node, type: Type, context: IConverterContext, idGen: SimpleIdGen }): TTypeProp[] | undefined {
    const { parentNode, type, context, idGen } = params;
    const propsOnly = type.getProperties();
    const indexSigns = TypeUtils.getIndexSignature(type);
    const props = indexSigns.concat(propsOnly);
    if (props.length > 0) {
        return props.reduce<TTypeProp[]>((acc, propertySymbol) => {
            const mapped = mapSingleMember({ parentNode, propertySymbol, context, idGen });
            if (mapped) {
                acc.push(mapped);
            }
            return acc;
        }, []);
    }
}

function prettyPrintTypeValue(typeValue: TTypeValue) {
    if (typeValue) {
        const res: any = {};
        if (typeValue.print) {
            res.print = highlightTsCode(typeValue.print.join('\n'))?.split('\n');
        }
        if (typeValue.raw) {
            res.html = highlightTsCode(typeValue.raw);
        }
        return {
            ...typeValue,
            ...res,
        };
    }
    return typeValue;
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
        SyntaxKind.IndexSignature,
    ].indexOf(nKind) !== -1;

    if (isSupported) {
        const tv = NodeUtils.getPropertySymbolTypeValue(propertySymbol, context);
        if (!tv) {
            return;
        }
        const prettyPrintedTypeValue = prettyPrintTypeValue(tv);
        const comment = NodeUtils.getCommentFromNode(propertyNode);
        let fromRef;
        const propParent = NodeUtils.getPropertyNodeParent(propertyNode, parentNode);
        if (propParent) {
            const fromSummary = context.convertTypeSummary({ convertable: propParent });
            fromRef = getTypeRefFromTypeSummary(fromSummary);
        }
        const name = NodeUtils.getPropertyNodeName(propertyNode);
        const required = NodeUtils.isPropertyNodeRequired(propertyNode) && !propertySymbol.isOptional();
        const uid = idGen.getNextId(name);
        prop = {
            // "uid" property is needed because we may have unions where there are props with same name but different type
            uid,
            name,
            comment,
            typeValue: prettyPrintedTypeValue,
            typeValueRef: getPropertyTypeValueRef({ propertySymbol, context }),
            editor: context.convertPropEditor({ convertable: propertySymbol }),
            from: fromRef,
            required,
        };
    } else {
        console.error(`New SyntaxKind was found: ${nKind}. Please add it to the list and check that it's processed correctly.`);
    }
    return prop;
}

function getPropertyTypeValueRef(params: { propertySymbol: Symbol, context: IConverterContext }): TTypeRef | undefined {
    const { propertySymbol, context } = params;
    const valueDeclNode = propertySymbol.getValueDeclaration();
    if (valueDeclNode) {
        const aliasSymbol = valueDeclNode.getType().getAliasSymbol();
        if (aliasSymbol) {
            // I.e. the property refers some type which is declared in another place (I.e. it's not inline type declaration).
            const valueTypeSummary = context.convertTypeSummary({ convertable: aliasSymbol });
            return `${valueTypeSummary.module}:${valueTypeSummary.typeName.name}`;
        }
    }
}

class PropsSet {
    private _propsMap = new Map<string, TTypeProp>();

    add(p: TTypeProp) {
        const id = PropsSet.buildId(p);
        if (!this._propsMap.has(id)) {
            // we want to keep the first unique type rather than the last one,
            // because "uid" in unions are less likely contain index in such case - as a result the output JSON is cleaner.
            this._propsMap.set(id, p);
        }
    }

    addAll(pa: TTypeProp[]) {
        pa.forEach((p) => {
            this.add(p);
        });
    }

    has(p: TTypeProp): boolean {
        const id = PropsSet.buildId(p);
        return this._propsMap.has(id);
    }

    toArray(): TTypeProp[] {
        return [...this._propsMap.values()];
    }

    static concat(psa: PropsSet[]): TTypeProp[] {
        const tempPs = psa.reduce<PropsSet>((acc, ps) => {
            acc.addAll(ps.toArray());
            return acc;
        }, new PropsSet());
        return tempPs.toArray();
    }

    static fromArray(pa: TTypeProp[]): PropsSet {
        const ps = new PropsSet();
        pa.forEach((p) => {
            ps.add(p);
        });
        return ps;
    }

    static buildId(p: TTypeProp) {
        // we don't use uniqueId property because we need to eliminate duplicates which come from same type (it's possible in union types)
        return `${p.from}:${p.name}:${p.typeValue.raw.replace(/[\n\s]/g, '')}`;
    }
}

class SimpleIdGen {
    private _usedIds = new Map<string, number>();

    getNextId = (name: string) => {
        const prevIndex = this._usedIds.get(name);
        if (prevIndex === undefined) {
            this._usedIds.set(name, 1);
            return name;
        }
        this._usedIds.set(name, prevIndex + 1);
        return `${name}_${prevIndex + 1}`;
    };
}
