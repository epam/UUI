module.exports = {
    extends: require.resolve('../.eslintrc.js'),
    rules: {
        // in the future, this rule will be enabled globally (not only in "app")
        'react-hooks/exhaustive-deps': 1,
    },
};
