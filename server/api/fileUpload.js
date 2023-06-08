const express = require('express');

const router = express.Router();

let idCounter = 0;

router.post('/uploadFileMock', function uploadFileMock(req, res) {
    const file = req.files.file;

    let fileType = 'attachment';
    const pdfFileRegex = /pdf$/i;
    if (file.name.search(pdfFileRegex) > -1) {
        fileType = 'iframe';
    }
    const imageRegex = /svg|png|jpg|heic|avif$/i;
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
    // res.status(400).send({ error: {message: 'some error message'}});
});

// router.post("/uploadFile", function(req, res) {
//     // get file from request
//     const file = req.files.file;
//
//
//     let fileType = "attachment";
//     file.name.search(/pdf$/) > -1 ? fileType = "iframe" : null;
//     file.name.search(/svg|png|jpg$/) > -1 ? fileType = "image" : null;
//
//     let fullPath = path.join(uploadsPath, file.name);
//     !fs.existsSync(fullPath) && fs.writeFileSync(fullPath, file.data);
//
//     res.send({
//         path: "/static/uploads/" + file.name,
//         name: req.files.file.name,
//         size: req.files.file.size,
//         id: "100500",
//         type: fileType,
//     });
// });

module.exports = router;
