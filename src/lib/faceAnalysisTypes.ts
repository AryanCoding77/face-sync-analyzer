
export interface FacialAttributes {
  eyeSize: 'Small' | 'Medium' | 'Large';
  noseShape: 'Pointed' | 'Rounded' | 'Straight' | 'Wide';
  lipFullness: 'Thin' | 'Medium' | 'Full';
  eyebrowThickness: 'Thin' | 'Medium' | 'Thick';
  foreheadHeight: 'Low' | 'Average' | 'High';
}

export type SkinType = 'Dry' | 'Normal' | 'Oily' | 'Combination';
export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond' | 'Rectangular';
export type SkinTone = 'Fair' | 'Light' | 'Medium' | 'Olive' | 'Dark';
export type DominantEmotion = 'Happy' | 'Sad' | 'Angry' | 'Neutral' | 'Surprised';

export interface FaceAnalysisResult {
  skinType: SkinType;
  faceShape: FaceShape;
  skinTone: SkinTone;
  facialSymmetry: number; // 0-100 percentage
  dominantEmotion: DominantEmotion;
  facialAttributes: FacialAttributes;
}

export interface AnalysisRequest {
  imageData: string;
  userId?: string; // Optional for non-authenticated users
}

export interface CompareAIUser {
  userId: string;
  username: string;
  profileImage?: string;
  isConnected: boolean;
}
