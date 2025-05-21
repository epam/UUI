import express from 'express';

const router = express.Router();

let idCounter = 0;

router.post('/uploadFileMock', function uploadFileMock(req: any, res: any) {
    const file = req.files.file;

    let fileType = 'attachment';
    const pdfFileRegex = /pdf$/i;
    const fiveMBLimit = 5000000;
    if (file.size > fiveMBLimit) {
        return res.status(413).json({
            error: {
                message: 'The file is too large.',
            },
        });
    }

    if (file.name.search(pdfFileRegex) > -1) {
        fileType = 'iframe';
    }
    const imageRegex = /svg|png|jpg|jpeg|heic|avif$/i;
    if (file.name.search(imageRegex) > -1) {
        fileType = 'image';
    }

    const newId = idCounter;
    idCounter += 1;

    res.send({
        path: '/static/uploads/blue-orange.jpg',
        name: req.files.file.name,
        size: req.files.file.size,
        id: newId,
        type: fileType,
        extension: req.files.file.name.split('.').pop(),
    });
});

export default router;
