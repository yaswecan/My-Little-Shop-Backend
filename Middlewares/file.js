//Packages
const {parse, join} = require("path");
const {createWriteStream} = require("fs");
const fs = require("fs");
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

//Single file read
module.exports.readFile = async (file, folder) => {
    if (file) {
        const {createReadStream} = await file;
        const fileStream = createReadStream();
        return new Promise((resolve, reject) => {
            const cloudStream = cloudinary.v2.uploader.upload_stream({folder: `Ebuy/${folder}`}, function (
                err,
                fileUploaded
            ) {
                if (err) {
                    rejet(err);
                }
                resolve(fileUploaded);
            });
            fileStream.pipe(cloudStream);
        });
    }
}
//Single file delete
module.exports.deleteFile = async (fileUrl) => {
    if (fileUrl) {
        cloudinary.uploader.destroy(fileUrl);
    }
}
//Multiple file read
module.exports.multipleReadFile = async (images, folder) => {
    let fileUrl = [];
    if (images) {
        for (let i = 0; i < images.length; i++) {
            const {createReadStream} = await images[i].file;
            const fileStream = createReadStream();
            const fileInfo = await new Promise((resolve, reject) => {
                const cloudStream = cloudinary.v2.uploader.upload_stream({folder: `Ebuy/${folder}`}, function (
                    err,
                    fileUploaded
                ) {
                    if (err) {
                        rejet(err);
                    }
                    resolve(fileUploaded);
                });
                fileStream.pipe(cloudStream);
            });
            fileUrl.push({
                url: fileInfo.secure_url,
                color: images[i].color,
                imageId: fileInfo.public_id
            })
        }
    }
    return fileUrl;
}
//Multiple file delete
module.exports.multipleFileDelete = async (fileUrl) => {
    if (fileUrl.length > 0) {
        for (let i = 0; i < fileUrl.length; i++) {
            cloudinary.uploader.destroy(fileUrl[i].imageId);
        }
    }
}