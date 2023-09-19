import { Node, Project } from 'ts-morph';
import { Converter } from './converter';
import { Union } from './union';
import { ConverterContext } from './converterContext';
import { stats } from '../stats';

export function convertType(typeNode: Node, project: Project) {
    const context = new ConverterContext(project, stats);
    context.registerConverter(Union);
    context.registerConverter(Converter); // generic converter always goes last
    return context.convert(typeNode);
}
