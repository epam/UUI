module.exports = {
    '!(templates/**)*.{js,ts,tsx}': ['eslint --fix'],
    '!(templates/**)*.scss': ['stylelint'],
};
