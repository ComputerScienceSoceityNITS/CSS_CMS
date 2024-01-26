const Gallery = require("../models/gallery");
const cloudinary = require("cloudinary");
const { catchAsync, AppError } = require("../utils/errorHandler");

exports.getImages = catchAsync(async (req, res, next) => {
  const images = await Gallery.find();
  return res.status(201).json({
    status: "success",
    gallery: images,
  });
});

exports.uploadImage = catchAsync(async (req, res, next) => {
  const { title, image } = req.body;
  if (!(title && image)) {
    return res.status(400).json({
      status: "fail",
      message: "please provide all required fields",
    });
  }

  let myCloud = {
    public_id: null,
    url: null,
  };

  myCloud = await cloudinary.v2.uploader.upload(image, {
    folder: "gallery",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME,
  });

  const Image = await Gallery({
    title,
    image:  {
      public_id: myCloud.public_id,
      url: myCloud.url,
    },
  }).save();

  return res.status(200).json({
    status: "success",
    message: "Image succesfully uploaded",
    image: Image,
  });
});

exports.deleteImage = catchAsync(async (req, res, next) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({
      status: "fail",
      message: "please provide all required fields",
    });
  }
  const imageId = image?.public_id;
  if (imageId) {
    await cloudinary.v2.uploader.destroy(imageId);
  }
  await Gallery.findOneAndDelete({ 'image.url': image.url });

  return res.status(200).json({
    status: "success",
    message: "successfully deleted",
  });
});
