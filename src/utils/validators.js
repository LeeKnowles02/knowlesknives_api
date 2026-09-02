const validateImages = (images) => {
  if (images === undefined || images === null) {
    return null;
  }
  if (!Array.isArray(images)) {
    return 'Images must be an array';
  }
  if (images.length === 0) {
    return null;
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
  if (price === undefined || price === null || price === '') {
    return null;
  }
  const value = Number(price);
  if (Number.isNaN(value) || value < 0) {
    return 'Price must be a valid positive number';
  }
  return null;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

module.exports = { validateImages, validatePrice, normalizeEmail };
