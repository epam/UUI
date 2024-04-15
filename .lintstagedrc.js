module.exports = {
    '!((templates/**)|(next-app/**)|(next-pages/**))*.{js,ts,tsx}': ['eslint --fix'],
    '!((templates/**)|(next-app/**)|(next-pages/**))*.scss': ['stylelint'],
};
