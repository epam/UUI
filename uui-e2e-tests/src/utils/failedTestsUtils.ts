import { outputJsonFile } from '../../playwright.config';
import fs from 'node:fs';

type TJsonReport = {
    suites: {
        specs: { ok: boolean, title: string }[]
    }[]
};

export function getFailedTestNamesFromLastRun(): Set<string> {
    const set = new Set<string>();
    if (fs.existsSync(outputJsonFile)) {
        const parsed: TJsonReport = JSON.parse(fs.readFileSync(outputJsonFile).toString());
        parsed.suites.forEach(({ specs }) => {
            specs.forEach((sp) => {
                if (!sp.ok) {
                    set.add(sp.title);
                }
            });
        });
    }
    return set;
}
