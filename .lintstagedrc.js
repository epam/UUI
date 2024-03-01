module.exports = {
    '!((templates/**)|(next-app/**))*.{js,ts,tsx}': ['eslint --fix'],
    '!((templates/**)|(next-app/**))*.scss': ['stylelint'],
};
