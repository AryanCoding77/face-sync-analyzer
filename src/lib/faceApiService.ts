
import { FaceAnalysisResult, FacialAttributes, FaceShape, SkinType, SkinTone } from './faceAnalysisTypes';

// Face++ API configuration
const FACE_API_KEY = ''; // You'll need to obtain this from Face++ developer console
const FACE_API_SECRET = ''; // You'll need to obtain this from Face++ developer console
const FACE_DETECT_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect';
const FACE_ANALYZE_URL = 'https://api-us.faceplusplus.com/facepp/v3/face/analyze';
const FACE_COMPARE_URL = 'https://api-us.faceplusplus.com/facepp/v3/compare';

// Celebrity face database - simplified for demo
const CELEBRITIES = [
  { name: 'Ryan Gosling', faceToken: 'celebrity_face_token_1' },
  { name: 'Emma Stone', faceToken: 'celebrity_face_token_2' },
  { name: 'Idris Elba', faceToken: 'celebrity_face_token_3' },
  { name: 'Zendaya', faceToken: 'celebrity_face_token_4' },
  { name: 'Chris Hemsworth', faceToken: 'celebrity_face_token_5' },
  { name: 'Lupita Nyong\'o', faceToken: 'celebrity_face_token_6' },
];

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

    // Step 1: Detect the face and get face_token
    const detectFormData = new FormData();
    detectFormData.append('api_key', FACE_API_KEY);
    detectFormData.append('api_secret', FACE_API_SECRET);
    detectFormData.append('image_base64', base64Image);
    detectFormData.append('return_attributes', 'gender,age,smiling,emotion,beauty,skinstatus,facequality');

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
    
    const faceToken = detectData.faces[0].face_token;
    const attributes = detectData.faces[0].attributes;
    
    // Step 2: Find celebrity resemblance (simplified for demo)
    // In a real implementation, we would compare with a database of celebrities
    // Using the face compare API endpoint
    
    // Simulate celebrity comparison (in production, use Face++ compare API)
    const randomCelebrity = CELEBRITIES[Math.floor(Math.random() * CELEBRITIES.length)];
    const similarityScore = Math.floor(Math.random() * 30) + 60; // 60-90% similarity
    
    // Step 3: Map API response to our data model
    const faceShape = mapFaceShape(attributes);
    const skinAnalysis = analyzeSkin(attributes);
    
    // Calculate facial symmetry (would require specific Face++ API calls in production)
    const symmetryScore = Math.floor(Math.random() * 20) + 70; // 70-90% symmetry
    
    // Map attributes to our data model
    const facialAttributes: FacialAttributes = {
      eyeSize: getEyeSize(attributes),
      noseShape: getNoseShape(attributes),
      lipFullness: getLipFullness(attributes),
      eyebrowThickness: getEyebrowThickness(attributes),
      foreheadHeight: getForeheadHeight(attributes),
    };
    
    // Construct and return the final analysis result
    return {
      facialResemblance: {
        celebrity: randomCelebrity.name,
        similarityScore,
      },
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
// These would be more detailed with actual Face++ API responses

function mapFaceShape(attributes: any): FaceShape {
  // In production, this would use actual Face++ data
  // For demo, randomly select a face shape
  const shapes: FaceShape[] = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Rectangular'];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function analyzeSkin(attributes: any): { skinType: SkinType, skinTone: SkinTone } {
  // This would use actual skinstatus data from Face++ in production
  const skinTypes: SkinType[] = ['Dry', 'Normal', 'Oily', 'Combination'];
  const skinTones: SkinTone[] = ['Fair', 'Light', 'Medium', 'Olive', 'Dark'];
  
  return {
    skinType: skinTypes[Math.floor(Math.random() * skinTypes.length)],
    skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
  };
}

function getDominantEmotion(attributes: any): 'Happy' | 'Sad' | 'Angry' | 'Neutral' | 'Surprised' {
  // In production, use the emotion data from Face++
  if (attributes && attributes.emotion) {
    const emotions = attributes.emotion;
    const emotionEntries = Object.entries(emotions);
    emotionEntries.sort((a, b) => b[1] - a[1]); // Sort by value in descending order
    
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

function getEyeSize(attributes: any): 'Small' | 'Medium' | 'Large' {
  const sizes = ['Small', 'Medium', 'Large'];
  return sizes[Math.floor(Math.random() * sizes.length)];
}

function getNoseShape(attributes: any): 'Pointed' | 'Rounded' | 'Straight' | 'Wide' {
  const shapes = ['Pointed', 'Rounded', 'Straight', 'Wide'];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function getLipFullness(attributes: any): 'Thin' | 'Medium' | 'Full' {
  const fullness = ['Thin', 'Medium', 'Full'];
  return fullness[Math.floor(Math.random() * fullness.length)];
}

function getEyebrowThickness(attributes: any): 'Thin' | 'Medium' | 'Thick' {
  const thickness = ['Thin', 'Medium', 'Thick'];
  return thickness[Math.floor(Math.random() * thickness.length)];
}

function getForeheadHeight(attributes: any): 'Low' | 'Average' | 'High' {
  const heights = ['Low', 'Average', 'High'];
  return heights[Math.floor(Math.random() * heights.length)];
}
