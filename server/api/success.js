const express = require('express');
const router = express.Router();

router.post('/success/validate-form', (req, res) => {
    const existingName = 'Ivan_Ivanov@epam.com';

    if (req.body.email === existingName) {
        res.status(200).json({
            error: {
                name: 'user-exists',
                message: 'User with the same name already exists',
            },
        });
        return;
    }

    res.status(200).json({
        form: {
            ...req.body,
            id: 1,
        },
    });
});

module.exports = router;
