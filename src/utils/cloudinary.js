const env = require('../config/env');
const { v2: cloudinary } = require('cloudinary');

const isConfigured = () => env.cloudinary.isConfigured;

if (isConfigured()) {
  cloudinary.config({ secure: true });
}

const uploadBuffer = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    const ext = originalName.includes('.') ? originalName.split('.').pop() : 'jpg';
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'knowles-knives',
        resource_type: 'image',
        public_id: `kk-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        format: ext,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(buffer);
  });

module.exports = { isConfigured, uploadBuffer };
