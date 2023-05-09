export class UserSettingsContext {
    get<TValue>(key: any, initial?: TValue): TValue {
        if (!key) {
            return initial || null;
        }

        const keyStr = JSON.stringify(key);

        const json = window.localStorage.getItem(keyStr);
        if (!json) {
            return initial;
        }
        return JSON.parse(json);
    }

    set<TValue>(key: any, value: TValue) {
        const keyStr = JSON.stringify(key);

        if (key) {
            window.localStorage.setItem(keyStr, JSON.stringify(value));
        }
    }
}
