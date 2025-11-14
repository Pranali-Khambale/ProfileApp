

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
 
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
};

export const validateCoordinate = (value, type) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;

  if (type === "lat") {
    return num >= -90 && num <= 90;
  } else if (type === "lng") {
    return num >= -180 && num <= 180;
  }
  return false;
};

export const validateProfileForm = (formData) => {
  const errors = {};

  
  if (!formData.name || !formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!formData.description || !formData.description.trim()) {
    errors.description = "Description is required";
  } else if (formData.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  
  if (!formData.address || !formData.address.trim()) {
    errors.address = "Address is required";
  }

 
  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Invalid email format";
  }

  
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = "Phone is required";
  } else if (!validatePhone(formData.phone)) {
    errors.phone = "Invalid phone format";
  }

  if (!formData.lat || formData.lat === "") {
    errors.lat = "Latitude is required";
  } else if (!validateCoordinate(formData.lat, "lat")) {
    errors.lat = "Invalid latitude (must be between -90 and 90)";
  }


  if (!formData.lng || formData.lng === "") {
    errors.lng = "Longitude is required";
  } else if (!validateCoordinate(formData.lng, "lng")) {
    errors.lng = "Invalid longitude (must be between -180 and 180)";
  }

  return errors;
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
 
  return input.trim().replace(/[<>]/g, "");
};
