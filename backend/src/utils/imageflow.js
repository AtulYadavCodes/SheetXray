import {imageflowuploadfunction} from "./imageflowsdk-backend/imageflowuploadfunction.js";
const imageflow = async (file, apikey, foldername) => {
  try {
    const result = await imageflowuploadfunction(file, apikey, foldername);
    return result;
  } catch (error) {
    console.error("Error in imageflow function:", error);
    throw error;
  }
};

export default imageflow;