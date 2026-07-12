import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads a local temp file to Cloudinary and always cleans up the temp file,
// whether the upload succeeds or fails.
export const uploadToCloudinary = async (localFilePath, folder = 'civicpulse/issues') => {
  if (!localFilePath) return null;
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: 'image',
      transformation: [{ width: 1600, crop: 'limit', quality: 'auto:good' }],
    });
    return response;
  } catch (err) {
    console.error('Cloudinary upload failed:', err.message);
    return null;
  } finally {
    fs.unlink(localFilePath, () => {});
  }
};

export default cloudinary;
