import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const [imgUrls, setImgUrls] = useState([]); // Changed to an array for multiple images
  const showToast = useShowToast();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const newImgUrls = [];

    files.forEach((file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImgUrls.push(reader.result);
          if (newImgUrls.length === files.length) {
            setImgUrls((prev) => [...prev, ...newImgUrls]); // Update state with the new images
          }
        };
        reader.readAsDataURL(file);
      } else {
        showToast("Invalid file Type", "Please select an image file", "error");
      }
    });
  };

  const removeImage = (index) => {
    setImgUrls((prev) => prev.filter((_, i) => i !== index)); // Remove the selected image
  };

  return { handleImageChange, imgUrls, removeImage, setImgUrls };
};

export default usePreviewImg;
 