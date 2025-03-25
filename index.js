require('dotenv').config();
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

app.use(express.static('views'));

app.post('/upload', upload.single('file'), (req, res) => {
    const fileContent = fs.readFileSync(req.file.path);
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: req.file.originalname,
        Body: fileContent
    };

    s3.upload(params, (err, data) => {
        if (err) return res.status(500).send(err);
        res.send(`File uploaded successfully! ${data.Location}`);
    });
});

app.listen(3000, () => console.log('Server berjalan di port 3000'));
