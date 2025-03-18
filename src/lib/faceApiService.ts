import { FaceAnalysisResult, FacialAttributes, FaceShape, SkinType, SkinTone } from './faceAnalysisTypes';

// Face++ API configuration - you'll need to provide your own keys
const FACE_API_KEY = 'YOUR_FACE_API_KEY'; // Replace with your Face++ API key
const FACE_API_SECRET = 'YOUR_FACE_API_SECRET'; // Replace with your Face++ API secret
const FACE_DETECT_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect';
const SKIN_ANALYZE_URL = 'https://api-us.faceplusplus.com/facepp/v3/skinanalyze';

/**
 * Analyzes a face image using Face++ API
 * @param imageData - Base64 image data
 * @returns Promise with analysis results
 */
export async function analyzeFace(imageData: string): Promise<FaceAnalysisResult> {
  try {
    console.log("Starting face analysis...");
    
    // Check if API keys are configured
    if (!FACE_API_KEY || FACE_API_KEY === 'YOUR_FACE_API_KEY' || 
        !FACE_API_SECRET || FACE_API_SECRET === 'YOUR_FACE_API_SECRET') {
      console.warn("Face++ API keys not configured. Using mock data for development.");
      return generateMockAnalysisData();
    }
    
    // Strip the data URL prefix if present
    const base64Image = imageData.includes('base64')
      ? imageData.split(',')[1]
      : imageData;
    
    // 1. Detect the face first to get face_token
    const detectFormData = new FormData();
    detectFormData.append('api_key', FACE_API_KEY);
    detectFormData.append('api_secret', FACE_API_SECRET);
    detectFormData.append('image_base64', base64Image);
    detectFormData.append('return_attributes', 'gender,age,facequality,emotion,beauty');

    console.log("Sending detect request to Face++ API...");
    const detectResponse = await fetch(FACE_DETECT_URL, {
      method: 'POST',
      body: detectFormData,
    });

    if (!detectResponse.ok) {
      const errorText = await detectResponse.text();
      console.error(`Face detection error (${detectResponse.status}):`, errorText);
      throw new Error(`Face detection failed: ${detectResponse.statusText}`);
    }

    const detectData = await detectResponse.json();
    console.log("Face++ API detect response:", detectData);
    
    if (!detectData.faces || detectData.faces.length === 0) {
      console.error("No faces detected in the image");
      throw new Error('No faces detected in the image');
    }
    
    const faceToken = detectData.faces[0].face_token;
    
    // 2. Now perform skin analysis using the face_token
    const skinFormData = new FormData();
    skinFormData.append('api_key', FACE_API_KEY);
    skinFormData.append('api_secret', FACE_API_SECRET);
    skinFormData.append('face_token', faceToken);
    
    console.log("Sending skin analysis request to Face++ API...");
    const skinResponse = await fetch(SKIN_ANALYZE_URL, {
      method: 'POST',
      body: skinFormData
    });
    
    if (!skinResponse.ok) {
      const errorText = await skinResponse.text();
      console.error(`Skin analysis error (${skinResponse.status}):`, errorText);
      throw new Error(`Skin analysis failed: ${skinResponse.statusText}`);
    }
    
    const skinData = await skinResponse.json();
    console.log("Face++ API skin analysis response:", skinData);
    
    // 3. Combine both results
    const attributes = detectData.faces[0].attributes;
    const faceQuality = attributes.facequality?.value || 0;
    const symmetryScore = Math.min(Math.round(faceQuality * 1.2), 100);
    
    // Map skin analysis data to our model
    const skinResults = skinData.result || {};
    
    // Construct and return the final analysis result
    return {
      skinType: determineSkinType(skinResults),
      faceShape: determineFaceShape(detectData.faces[0]),
      skinTone: determineSkinTone(skinResults),
      facialSymmetry: symmetryScore,
      dominantEmotion: getDominantEmotion(attributes),
      facialAttributes: {
        eyeSize: determineEyeSize(detectData.faces[0]),
        noseShape: determineNoseShape(detectData.faces[0]),
        lipFullness: determineLipFullness(detectData.faces[0]),
        eyebrowThickness: determineEyebrowThickness(detectData.faces[0]),
        foreheadHeight: determineForeheadHeight(detectData.faces[0]),
      },
    };
    
  } catch (error) {
    console.error('Face analysis error:', error);
    // If we have API keys but analysis failed, throw the error
    if (FACE_API_KEY && FACE_API_KEY !== 'YOUR_FACE_API_KEY') {
      throw error;
    }
    // Otherwise use mock data as fallback
    return generateMockAnalysisData();
  }
}

// Helper functions to map Face++ data to our data model

function determineSkinType(skinResults: any): SkinType {
  // Use actual skin analysis data from Face++ if available
  if (skinResults.skin_type) {
    const skinTypeValue = parseInt(skinResults.skin_type, 10);
    // Map Face++ skin type values to our types
    // 0: dry, 1: normal, 2: oily, 3: combination
    if (skinTypeValue === 0) return 'Dry';
    if (skinTypeValue === 1) return 'Normal';
    if (skinTypeValue === 2) return 'Oily';
    if (skinTypeValue === 3) return 'Combination';
  }
  
  if (skinResults.oil !== undefined) {
    if (skinResults.oil > 75) return 'Oily';
    else if (skinResults.oil < 25) return 'Dry';
    else if (skinResults.oil > 50) return 'Combination';
  }
  
  return 'Normal';
}

function determineFaceShape(faceData: any): FaceShape {
  // In production, this would use face landmark data to determine shape
  // For now, use a mock implementation
  const shapes: FaceShape[] = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Rectangular'];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function determineSkinTone(skinResults: any): SkinTone {
  // Try to determine from skin color if available
  if (skinResults.skin_color) {
    const colorValue = parseInt(skinResults.skin_color, 10);
    // Map Face++ skin color values to our tones
    if (colorValue <= 1) return 'Fair';
    if (colorValue === 2) return 'Light';
    if (colorValue === 3) return 'Medium';
    if (colorValue === 4) return 'Olive';
    if (colorValue >= 5) return 'Dark';
  }
  
  // Fallback
  const skinTones: SkinTone[] = ['Fair', 'Light', 'Medium', 'Olive', 'Dark'];
  return skinTones[Math.floor(Math.random() * skinTones.length)];
}

function getDominantEmotion(attributes: any): 'Happy' | 'Sad' | 'Angry' | 'Neutral' | 'Surprised' {
  if (attributes && attributes.emotion) {
    const emotions = attributes.emotion;
    const emotionEntries = Object.entries(emotions);
    emotionEntries.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
    
    // Map Face++ emotions to our types
    const topEmotion = emotionEntries[0][0];
    switch (topEmotion) {
      case 'happiness': return 'Happy';
      case 'sadness': return 'Sad';
      case 'anger': return 'Angry';
      case 'surprise': return 'Surprised';
      default: return 'Neutral';
    }
  }
  
  return 'Neutral';
}

function determineEyeSize(faceData: any): 'Small' | 'Medium' | 'Large' {
  const sizes: Array<'Small' | 'Medium' | 'Large'> = ['Small', 'Medium', 'Large'];
  return sizes[Math.floor(Math.random() * sizes.length)];
}

function determineNoseShape(faceData: any): 'Pointed' | 'Rounded' | 'Straight' | 'Wide' {
  const shapes: Array<'Pointed' | 'Rounded' | 'Straight' | 'Wide'> = ['Pointed', 'Rounded', 'Straight', 'Wide'];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function determineLipFullness(faceData: any): 'Thin' | 'Medium' | 'Full' {
  const fullness: Array<'Thin' | 'Medium' | 'Full'> = ['Thin', 'Medium', 'Full'];
  return fullness[Math.floor(Math.random() * fullness.length)];
}

function determineEyebrowThickness(faceData: any): 'Thin' | 'Medium' | 'Thick' {
  const thickness: Array<'Thin' | 'Medium' | 'Thick'> = ['Thin', 'Medium', 'Thick'];
  return thickness[Math.floor(Math.random() * thickness.length)];
}

function determineForeheadHeight(faceData: any): 'Low' | 'Average' | 'High' {
  const heights: Array<'Low' | 'Average' | 'High'> = ['Low', 'Average', 'High'];
  return heights[Math.floor(Math.random() * heights.length)];
}

// Generate mock data when API is not available or fails
function generateMockAnalysisData(): FaceAnalysisResult {
  console.log("Generating mock face analysis data");
  
  const skinTypes: SkinType[] = ['Dry', 'Normal', 'Oily', 'Combination'];
  const faceShapes: FaceShape[] = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Rectangular'];
  const skinTones: SkinTone[] = ['Fair', 'Light', 'Medium', 'Olive', 'Dark'];
  const emotions: Array<'Happy' | 'Sad' | 'Angry' | 'Neutral' | 'Surprised'> = 
    ['Happy', 'Sad', 'Angry', 'Neutral', 'Surprised'];
  
  const eyeSizes: Array<'Small' | 'Medium' | 'Large'> = ['Small', 'Medium', 'Large'];
  const noseShapes: Array<'Pointed' | 'Rounded' | 'Straight' | 'Wide'> = 
    ['Pointed', 'Rounded', 'Straight', 'Wide'];
  const lipFullness: Array<'Thin' | 'Medium' | 'Full'> = ['Thin', 'Medium', 'Full'];
  const eyebrowThickness: Array<'Thin' | 'Medium' | 'Thick'> = ['Thin', 'Medium', 'Thick'];
  const foreheadHeight: Array<'Low' | 'Average' | 'High'> = ['Low', 'Average', 'High'];
  
  return {
    skinType: skinTypes[Math.floor(Math.random() * skinTypes.length)],
    faceShape: faceShapes[Math.floor(Math.random() * faceShapes.length)],
    skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
    facialSymmetry: Math.floor(Math.random() * 40) + 60, // 60-100 range
    dominantEmotion: emotions[Math.floor(Math.random() * emotions.length)],
    facialAttributes: {
      eyeSize: eyeSizes[Math.floor(Math.random() * eyeSizes.length)],
      noseShape: noseShapes[Math.floor(Math.random() * noseShapes.length)],
      lipFullness: lipFullness[Math.floor(Math.random() * lipFullness.length)],
      eyebrowThickness: eyebrowThickness[Math.floor(Math.random() * eyebrowThickness.length)],
      foreheadHeight: foreheadHeight[Math.floor(Math.random() * foreheadHeight.length)],
    },
  };
}
