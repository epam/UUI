module.exports = {
    '!(templates/**)*.{js,ts,tsx}': ['eslint --fix --max-warnings 0'],
    '!(templates/**)*.{less,scss}': ['stylelint --fix'],
};
