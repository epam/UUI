import { Type } from 'ts-morph';
import { TOneOfItemType, TPropEditor, TPropEditorType } from '../../types/sharedTypes';

const PE_MAP = {
    [TPropEditorType.oneOf]: {
        condition: (t: Type) => t.isLiteral(),
        paramsBuilder: (t: Type): TOneOfItemType[] => {
            const v = PropEditorUtils.getLiteralValueFromType(t);
            if (v !== undefined) {
                return [v];
            }
            return [];
        },
    },
    [TPropEditorType.string]: {
        condition: (t: Type) => t.isString(),
    },
    [TPropEditorType.number]: {
        condition: (t: Type) => t.isNumber(),
    },
    [TPropEditorType.bool]: {
        condition: (t: Type) => t.isBoolean(),
    },
    [TPropEditorType.component]: {
        condition: (t: Type) => {
            const sign = t.getCallSignatures();
            if (sign?.length === 1) {
                const first = sign[0];
                const returnTypeText = first.getReturnType().getText();
                const returnsNode = returnTypeText.startsWith('React.ReactNode') || returnTypeText.startsWith('React.ReactElement');
                const hasOneOrZeroParams = first.getParameters().length <= 2;
                return returnsNode && hasOneOrZeroParams;
            }
            const text = t.getText();
            const isReactFC = /^React\.FC<.+>$/.test(text);
            return isReactFC;
        },
    },
    [TPropEditorType.func]: {
        condition: (t: Type) => {
            const sign = t.getCallSignatures();
            return sign?.length > 0;
        },
    },
};

export class PropEditorUtils {
    static getLiteralValueFromType(type: Type): TOneOfItemType | undefined {
        if (type.isLiteral()) {
            if (type.isBooleanLiteral()) {
                return type.getText() === 'true';
            }
            return type.getLiteralValue();
        }
    }

    static getPropEditorByType(type: Type): TPropEditor | undefined {
        const PE_MAP_KEYS = Object.keys(PE_MAP) as (keyof typeof PE_MAP)[];
        const found = PE_MAP_KEYS.find((key) => PE_MAP[key].condition(type));
        if (found) {
            if (found === TPropEditorType.oneOf) {
                const args = PE_MAP[found];
                return {
                    type: found,
                    options: args.paramsBuilder(type),
                };
            }
            return {
                type: found,
            };
        }
    }

    static getPropEditorByUnionType(unionType: Type): TPropEditor | undefined {
        const typeArr = unionType.getUnionTypes();
        let canBeNull = false;
        const arrNorm = typeArr.reduce<Type[]>((acc, ta) => {
            if (ta.isUndefined()) {
                return acc;
            } else if (ta.isNull()) {
                canBeNull = true;
                return acc;
            }
            acc.push(ta);
            return acc;
        }, []);

        if (arrNorm.length > 0) {
            const arrNormSplit = arrNorm.reduce<{
                scalars: (
                TPropEditorType.string | TPropEditorType.number
                )[],
                literals: Type[],
                etc: Type[]
            }>(
                    (acc, t) => {
                        if (t.isLiteral()) {
                            acc.literals.push(t);
                        } else if (t.isString()) {
                            acc.scalars.push(TPropEditorType.string);
                        } else if (t.isNumber()) {
                            acc.scalars.push(TPropEditorType.number);
                        } else {
                            acc.etc.push(t);
                        }
                        return acc;
                    },
                    { scalars: [], literals: [], etc: [] },
                    );

            const isMaybeOneOf = arrNormSplit.scalars.length <= 1 && arrNormSplit.literals.length > 0 && arrNormSplit.etc.length === 0;
            if (isMaybeOneOf) {
                if (
                    arrNormSplit.literals.length === 2
                    && arrNormSplit.literals[0].isBooleanLiteral()
                    && arrNormSplit.literals[1].isBooleanLiteral()
                ) {
                    return {
                        type: TPropEditorType.bool,
                    };
                }
                const options = arrNormSplit.literals.reduce<TOneOfItemType[]>((acc, t) => {
                    const v = PropEditorUtils.getLiteralValueFromType(t);
                    if (v !== undefined) {
                        acc.push(v);
                    }
                    return acc;
                }, []);
                if (canBeNull) {
                    options.push(null);
                }
                const res: TPropEditor = {
                    type: TPropEditorType.oneOf,
                    options: sortOptions(options),
                };
                if (arrNormSplit.scalars[0]) {
                    res.scalarTypeOption = arrNormSplit.scalars[0];
                }
                return res;
            } else if (arrNorm.length === 1) {
                return PropEditorUtils.getPropEditorByType(arrNorm[0]);
            } else if (!canBeNull && arrNormSplit.scalars.length > 1 && arrNormSplit.etc.length === 0 && arrNormSplit.literals.length === 0) {
                // List of types can be extended in the future
                const TYPES_SUPPORTED_IN_ONE_OF_TYPE = [TPropEditorType.number, TPropEditorType.string];
                if (arrNormSplit.scalars.every((item) => TYPES_SUPPORTED_IN_ONE_OF_TYPE.includes(item))) {
                    return {
                        type: TPropEditorType.oneOfType,
                        options: arrNormSplit.scalars,
                    };
                }
            }
        }
    }
}

const numericAscComparator = (a: number, b: number) => a - b;
const strNumericAscComparator = (a: string, b: string) => {
    return +a - +b;
};
const isNumeric = (opt: any) => typeof opt === 'number';
const isStrNumeric = (opt: any) => typeof opt === 'string' && !isNaN(+opt);
//
function sortOptions(options: TOneOfItemType[]): TOneOfItemType[] {
    const containsNumeric = options.some(isNumeric);
    if (containsNumeric) {
        const numericPart = options.filter(isNumeric);
        const nonNumericPart = options.filter((opt) => !isNumeric(opt));
        (numericPart as number[]).sort(numericAscComparator);
        return numericPart.concat(nonNumericPart);
    }
    const containsStringNumeric = options.some(isStrNumeric);
    if (containsStringNumeric) {
        const numericPart = options.filter(isStrNumeric);
        const nonNumericPart = options.filter((opt) => !isStrNumeric(opt));
        (numericPart as string[]).sort(strNumericAscComparator);
        return numericPart.concat(nonNumericPart);
    }
    return options;
}
