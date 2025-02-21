import { ITaskConfig, TTaskParams } from '../../utils/taskUtils';
import { readFigmaVarCollection, writeFileSync } from '../themeTokensGen/utils/fileUtils';
import { IFigmaVarCollection, IFigmaVarRaw } from '../themeTokensGen/types/sourceTypes';
import isEqual from 'react-fast-compare';
import deepmerge from 'deepmerge';

const ARGS = {
    // source collection JSON (UX designers should provide it)
    BASE_JSON: '--base',
    CHANGED_JSON: '--changed',
    NEW_JSON: '--new',
    // output folder for SCSS mixins
    OUT: '--out',
};

interface DiffElement {
    type: 'added' | 'modified';
    name: string;
    diff: any;
}

export const taskConfig: ITaskConfig = {
    main,
    cliArgs: {
        [ARGS.BASE_JSON]: { format: 'NameValue', required: true },
        [ARGS.CHANGED_JSON]: { format: 'NameValue', required: true },
        [ARGS.NEW_JSON]: { format: 'NameValue', required: true },
        [ARGS.OUT]: { format: 'NameValue', required: true },
    },
};

async function main(params: TTaskParams) {
    const {
        [ARGS.BASE_JSON]: { value: baseJsonPath },
        [ARGS.CHANGED_JSON]: { value: changedJsonPath },
        [ARGS.NEW_JSON]: { value: newVersionJsomPath },
        [ARGS.OUT]: { value: outPath },
    } = params.cliArgs;

    const baseJson = readFigmaVarCollection(baseJsonPath!);
    const changedJson = readFigmaVarCollection(changedJsonPath!);
    const newVersionJson = readFigmaVarCollection(newVersionJsomPath!);

    const diff = calculateDiff(baseJson, changedJson);
    writeFileSync(`${outPath}/diff.json`, JSON.stringify(diff, null, 2));

    const { newJson, warnings } = applyChanges(newVersionJson, diff);
    writeFileSync(`${outPath}/newTheme.json`, JSON.stringify(newJson, null, 2));
    writeFileSync(`${outPath}/warnings.json`, JSON.stringify(warnings, null, 2));
}

function calculateDiff(oldData: IFigmaVarCollection, newData: IFigmaVarCollection): Record<string, DiffElement> {
    const changes: Record<string, DiffElement> = {};

    for (const newItem of newData.variables) {
        const oldItem = oldData.variables.find((item) => item.id === newItem.id);

        if (!oldItem) {
            changes[newItem.id] = { type: 'added', name: newItem.name, diff: newItem };
        } else {
            const diff: DiffElement = { type: 'modified', name: newItem.name, diff: {} as IFigmaVarRaw };

            Object.keys(newItem).forEach((key) => {
                const typedKey = key as keyof IFigmaVarRaw;

                if (typedKey === 'valuesByMode') {
                    Object.keys(newItem.valuesByMode).forEach((mode) => {
                        if (!isEqual(newItem.valuesByMode[mode], oldItem.valuesByMode[mode])) {
                            diff.diff.valuesByMode = { ...diff.diff.valuesByMode || {}, [mode]: newItem.valuesByMode[mode] };
                        }
                    });
                } else if (typedKey === 'resolvedValuesByMode') {
                    Object.keys(newItem.resolvedValuesByMode).forEach((mode) => {
                        if (!isEqual(newItem.resolvedValuesByMode[mode], oldItem.resolvedValuesByMode[mode])) {
                            diff.diff.resolvedValuesByMode = { ...diff.diff.resolvedValuesByMode || {}, [mode]: newItem.resolvedValuesByMode[mode] };
                        }
                    });
                }
            });

            if (Object.keys(diff.diff).length > 0) {
                changes[newItem.id] = diff;
            }
        }
    }

    if (!isEqual(oldData.modes, newData.modes)) {
        changes['modes'] = { type: 'modified', name: 'modes', diff: { modes: newData.modes } };
    }

    return changes;
}

function applyChanges(data: IFigmaVarCollection, changes: Record<string, DiffElement>): { newJson: IFigmaVarCollection, warnings: string[] } {
    const newJson: IFigmaVarCollection = { ...data };
    const warningsList: string[] = [];

    if (changes['modes']) {
        if (!Object.keys(data.modes).some((mode) => Object.keys(newJson.modes).includes(mode))) {
            console.error('There is no the same theme_id in the new json to apply changes. Check the ids of themes, probably it is needed to change them manually');
            throw new Error('There is no the same theme id(mods array) in the new json to apply changes. Check the ids of themes, probably it is needed to change them manually');
        }

        newJson.modes = changes['modes'].diff.modes;
    }

    newJson.variables = newJson.variables.map((item) => {
        const change = changes[item.id];
        if (change && change.type === 'modified') {
            return deepmerge(item, change.diff);
        }
        return item;
    });

    Object.keys(changes).forEach((id) => {
        const change = changes[id];
        if (change.type === 'added' && !newJson.variables.find((item) => item.id === id)) {
            newJson.variables.push(changes[id].diff as IFigmaVarRaw);
            newJson.variableIds.push(id);
        }

        if (change.type === 'modified' && id !== 'modes' && !newJson.variables.find((item) => item.id === id)) {
            warningsList.push(`Variable with id: '${id}' and name: '${change.name}' was changed and not found in new version JSON. Probably it was removed, please check changelog.`);
        }
    });

    return { newJson: newJson, warnings: warningsList };
}
