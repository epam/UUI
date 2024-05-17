module.exports = {
    '!((templates/**)|(next-demo/**))*.{js,ts,tsx}': ['eslint --fix'],
    '!((templates/**)|(next-demo/**))*.scss': ['stylelint'],
};
