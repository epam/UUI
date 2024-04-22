import { Type } from 'ts-morph';
import { TOneOfItemType, TPropEditor, TPropEditorType } from '../../types/sharedTypes';

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
        const map = {
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
        const keys = Object.keys(map) as (keyof typeof map)[];
        const found = keys.find((key) => map[key].condition(type));
        if (found) {
            if (found === TPropEditorType.oneOf) {
                const args = map[found];
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
            const isAllLiterals = arrNorm.every((t) => t.isLiteral());
            if (isAllLiterals) {
                if (arrNorm.length === 2 && arrNorm[0].isBooleanLiteral() && arrNorm[1].isBooleanLiteral()) {
                    return {
                        type: TPropEditorType.bool,
                    };
                }
                const options = arrNorm.reduce<TOneOfItemType[]>((acc, t) => {
                    const v = PropEditorUtils.getLiteralValueFromType(t);
                    if (v !== undefined) {
                        acc.push(v);
                    }
                    return acc;
                }, []);
                if (canBeNull) {
                    options.push(null);
                }
                return {
                    type: TPropEditorType.oneOf,
                    options: sortOptions(options),
                };
            } else if (arrNorm.length === 1) {
                return PropEditorUtils.getPropEditorByType(arrNorm[0]);
            }
        }
    }
}

//
function sortOptions(options: TOneOfItemType[]): TOneOfItemType[] {
    const isNumeric = (opt: any) => typeof opt === 'number';
    const isStrNumeric = (opt: any) => typeof opt === 'string' && !isNaN(+opt);
    const isStrNumericOrNumeric = (opt: any) => isNumeric(opt) || isStrNumeric(opt);
    //
    const sortedOptions = [...options];
    sortedOptions.sort((a: any, b: any) => {
        if (isNumeric(a) && isNumeric(b)) {
            return a - b; // Asc. E.g.: 1, 2, 3
        }
        if (isStrNumeric(a) && isStrNumeric(b)) {
            return +a - +b; // Asc. E.g.: '1', '2', '3'
        }
        if (isStrNumericOrNumeric(a) && isStrNumericOrNumeric(b)) {
            return (typeof a).localeCompare(typeof b); // Numbers go before strings. E.g: 1, 2, 3, '1', '2', '3'
        }
        return +isStrNumericOrNumeric(b) - +isStrNumericOrNumeric(a); // str and strNumeric go first, everything else go last
    });
    return sortedOptions;
}
