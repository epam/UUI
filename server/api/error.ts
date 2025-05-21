import express from 'express';

const router = express.Router();

let serverStatus = null;

const setServerStatus = (status) => {
    serverStatus = status;
    setTimeout(() => {
        serverStatus = null;
    }, 5000);
};

router.post('/error/status/:status', function (req, res) {
    res.status(+req.params.status).json({
        errorMessage: `Respond from sever, object like - { errorMessage: "your message" },
            if your don't return it - you will see default notification message`,
    });
});

router.post('/error/auth-lost', function (req, res) {
    if (Math.random() < 0.5) {
        res.header('x-session-lost', 'true');
        res.sendStatus(401);
    } else {
        res.json({ ok: true });
    }
});

router.post('/error/set-server-status/:status', (req, res) => {
    setServerStatus(req.params.status);
    res.json({ ok: true });
});

router.get(['/auth/ping', '/error/mock'], function (req, res) {
    if (serverStatus != null) {
        res.sendStatus(serverStatus);
    } else {
        res.json({ ok: true });
    }
});

router.get('/auth/login', function (req, res) {
    res.send('<html><script>window.localStorage.setItem("uui-auth-recovery-success", "true"); window.close();</script></html>');
});

export default router;
