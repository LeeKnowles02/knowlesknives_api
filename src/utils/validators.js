const validateImages = (images) => {
  if (!Array.isArray(images) || images.length < 1) {
    return 'At least 1 image is required';
  }
  if (images.length > 4) {
    return 'Maximum 4 images allowed';
  }
  for (const img of images) {
    if (!img?.imageUrl) {
      return 'Each image must have an imageUrl';
    }
  }
  return null;
};

const validatePrice = (price) => {
  const value = Number(price);
  if (Number.isNaN(value) || value < 0) {
    return 'Price must be a valid positive number';
  }
  return null;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

module.exports = { validateImages, validatePrice, normalizeEmail };
