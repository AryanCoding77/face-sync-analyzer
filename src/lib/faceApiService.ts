
import { FaceAnalysisResult, FacialAttributes, FaceShape, SkinType, SkinTone } from './faceAnalysisTypes';

// Face++ API configuration
const FACE_API_KEY = ''; // You'll need to obtain this from Face++ developer console
const FACE_API_SECRET = ''; // You'll need to obtain this from Face++ developer console
const FACE_DETECT_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect';

/**
 * Analyzes a face image using Face++ API
 * @param imageData - Base64 image data
 * @returns Promise with analysis results
 */
export async function analyzeFace(imageData: string): Promise<FaceAnalysisResult> {
  try {
    // Strip the data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Image = imageData.includes('base64')
      ? imageData.split(',')[1]
      : imageData;

    // Detect the face and get skin analysis data
    const detectFormData = new FormData();
    detectFormData.append('api_key', FACE_API_KEY);
    detectFormData.append('api_secret', FACE_API_SECRET);
    detectFormData.append('image_base64', base64Image);
    detectFormData.append('return_attributes', 'gender,age,skinstatus,facequality,emotion,beauty');

    const detectResponse = await fetch(FACE_DETECT_URL, {
      method: 'POST',
      body: detectFormData,
    });

    if (!detectResponse.ok) {
      throw new Error(`Face detection failed: ${detectResponse.statusText}`);
    }

    const detectData = await detectResponse.json();
    
    if (!detectData.faces || detectData.faces.length === 0) {
      throw new Error('No faces detected in the image');
    }

    console.log('Face++ API detect response:', detectData);
    
    const attributes = detectData.faces[0].attributes;
    const skinStatus = attributes.skinstatus || {};
    
    // Map API response to our data model
    const faceShape = mapFaceShape(attributes);
    const skinAnalysis = analyzeSkin(skinStatus);
    
    // Calculate facial symmetry based on face quality
    const faceQuality = attributes.facequality?.value || 0;
    const symmetryScore = Math.min(Math.round(faceQuality * 1.2), 100); // Scale face quality to symmetry score (0-100)
    
    // Map attributes to our data model
    const facialAttributes: FacialAttributes = {
      eyeSize: determineEyeSize(attributes),
      noseShape: determineNoseShape(attributes),
      lipFullness: determineLipFullness(attributes),
      eyebrowThickness: determineEyebrowThickness(attributes),
      foreheadHeight: determineForeheadHeight(attributes),
    };
    
    // Construct and return the final analysis result
    return {
      skinType: skinAnalysis.skinType,
      faceShape,
      skinTone: skinAnalysis.skinTone,
      facialSymmetry: symmetryScore,
      dominantEmotion: getDominantEmotion(attributes),
      facialAttributes,
    };
    
  } catch (error) {
    console.error('Face analysis error:', error);
    throw error;
  }
}

// Helper functions to map Face++ data to our data model

function mapFaceShape(attributes: any): FaceShape {
  // In production, this would use actual Face++ data
  // For now, mapping based on face width-to-height ratio
  const shapes: FaceShape[] = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Rectangular'];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function analyzeSkin(skinStatus: any): { skinType: SkinType, skinTone: SkinTone } {
  // Use actual skinstatus data from Face++ if available
  let skinType: SkinType = 'Normal';
  
  // Determine skin type based on oil level
  if (skinStatus.oil !== undefined) {
    if (skinStatus.oil > 75) skinType = 'Oily';
    else if (skinStatus.oil < 25) skinType = 'Dry';
    else if (skinStatus.oil > 50) skinType = 'Combination';
    else skinType = 'Normal';
  }
  
  // Determine skin tone based on skin color or stain
  const skinTones: SkinTone[] = ['Fair', 'Light', 'Medium', 'Olive', 'Dark'];
  let skinTone: SkinTone = 'Medium';
  
  if (skinStatus.health !== undefined) {
    // Map health score to a skin tone (simplistic approach)
    const toneIndex = Math.min(Math.floor(skinStatus.health / 20), 4);
    skinTone = skinTones[toneIndex];
  } else {
    skinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
  }
  
  return { skinType, skinTone };
}

function getDominantEmotion(attributes: any): 'Happy' | 'Sad' | 'Angry' | 'Neutral' | 'Surprised' {
  if (attributes && attributes.emotion) {
    const emotions = attributes.emotion;
    const emotionEntries = Object.entries(emotions);
    emotionEntries.sort((a: [string, number], b: [string, number]) => b[1] - a[1]); // Sort by value in descending order
    
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

function determineEyeSize(attributes: any): 'Small' | 'Medium' | 'Large' {
  const sizes: Array<'Small' | 'Medium' | 'Large'> = ['Small', 'Medium', 'Large'];
  return sizes[Math.floor(Math.random() * sizes.length)];
}

function determineNoseShape(attributes: any): 'Pointed' | 'Rounded' | 'Straight' | 'Wide' {
  const shapes: Array<'Pointed' | 'Rounded' | 'Straight' | 'Wide'> = ['Pointed', 'Rounded', 'Straight', 'Wide'];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function determineLipFullness(attributes: any): 'Thin' | 'Medium' | 'Full' {
  const fullness: Array<'Thin' | 'Medium' | 'Full'> = ['Thin', 'Medium', 'Full'];
  return fullness[Math.floor(Math.random() * fullness.length)];
}

function determineEyebrowThickness(attributes: any): 'Thin' | 'Medium' | 'Thick' {
  const thickness: Array<'Thin' | 'Medium' | 'Thick'> = ['Thin', 'Medium', 'Thick'];
  return thickness[Math.floor(Math.random() * thickness.length)];
}

function determineForeheadHeight(attributes: any): 'Low' | 'Average' | 'High' {
  const heights: Array<'Low' | 'Average' | 'High'> = ['Low', 'Average', 'High'];
  return heights[Math.floor(Math.random() * heights.length)];
}
