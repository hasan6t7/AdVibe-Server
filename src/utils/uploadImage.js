const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "db15bfjtq",
  api_key: "995113864112176",
  api_secret: "zZ52MAkd-dcUgbas6N6avUH6r2k",
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

module.exports = (image) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {     
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};
