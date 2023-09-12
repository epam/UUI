import { TypeChecker, Node } from 'ts-morph';
import { Converter } from './converter';
import { Union } from './union';
import { ConverterContext } from './converterContext';

export function convertType(typeNode: Node, typeChecker: TypeChecker) {
    const context = new ConverterContext(typeChecker);
    context.registerConverter(Union);
    context.registerConverter(Converter); // generic converter always goes last
    return context.convert(typeNode);
}
