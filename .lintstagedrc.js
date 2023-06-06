module.exports = {
    '!(templates/**)*.{js,ts,tsx}': ['eslint --fix'],
    '!(templates/**)*.{less,scss}': ['stylelint --fix'],
};
