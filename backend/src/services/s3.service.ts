import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Simplified file upload - uses memory storage for now
// In production, integrate proper AWS S3 v3 SDK
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('비디오 파일만 업로드 가능합니다.'));
        }
    }
});

export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
    // Mock upload - returns a fake URL for development
    // In production, replace with actual S3 upload logic
    console.log(`[Mock S3] 파일 업로드: ${file.originalname}`);
    return `https://mock-s3.example.com/swings/${Date.now()}_${file.originalname}`;
};

export default upload;

