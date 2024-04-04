process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

const jest = require('jest');

process.on('unhandledRejection', (err) => {
    // Makes the script crash on unhandled rejections instead of silently
    // ignoring them. In the future, promise rejections that are not handled will
    // terminate the Node.js process with a non-zero exit code.
    throw err;
});

const argv = process.argv.slice(2);

jest.run(argv);
