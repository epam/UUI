import { Project } from 'ts-morph';
import { Converter } from './converter';
import { Union } from './union';
import { ConverterContext } from './converterContext';
import { stats } from '../stats';
import { TConvertable } from '../types';

export function convertType(nodeOrSymbol: TConvertable, project: Project) {
    const context = new ConverterContext(project, stats);
    context.registerConverter(Union);
    context.registerConverter(Converter); // generic converter always goes last
    return context.convert({ nodeOrSymbol, isTypeProp: false });
}
