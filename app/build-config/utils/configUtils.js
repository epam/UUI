const path = require('path');

module.exports = {
    changeRuleByTestAttr,
    changePluginByName,
    removeRuleByTestAttr,
    makeSlashesPlatformSpecific,
};

function makeSlashesPlatformSpecific(pathStr) { return pathStr.replace(/\//g, path.sep); }

function changePluginByName(config, pluginName, changerFn) {
    config.plugins.forEach((p) => {
        if (p.constructor.name === pluginName) {
            changerFn(p);
        }
    });
}

function removeRuleByTestAttr(config, test) {
    const conditionFn = (r) => testAttrCondition(r.test, test);
    const changerFn = () => undefined;
    const baseArr = config.module.rules[1];
    mutateArrItemByCondition({ arr: baseArr.oneOf, conditionFn, changerFn });
}

function changeRuleByTestAttr(config, test, changerFn) {
    const allRules = config.module.rules;
    if (allRules[0].test && testAttrCondition(allRules[0].test, test)) {
        // mutate array item here
        allRules[0] = changerFn(allRules[0]);
    } else {
        const baseArr = allRules[1];
        baseArr.oneOf.forEach((r, i) => {
            if (testAttrCondition(r.test, test)) {
                // mutate array item here
                baseArr.oneOf[i] = changerFn(r);
            }
        });
    }
}

//

function mutateArrItemByCondition({ arr, conditionFn, changerFn }) {
    const newArr = arr.reduce((acc, oneOfR) => {
        if (conditionFn(oneOfR)) {
            const newOneOfR = changerFn(oneOfR);
            newOneOfR && acc.push(newOneOfR);
        } else {
            acc.push(oneOfR);
        }
        return acc;
    }, []);

    // need to mutate existing array.
    arr.length = 0;
    arr.push(...newArr);
}

function testAttrCondition(test1, test2) {
    if (test1 && test2) {
        return test1.toString() === test2.toString();
    }
}
