import { Request, Response } from 'express';
import { uploadToS3 } from '../services/s3.service';
import { pool } from '../config/database';
import { analyzeSwing } from '../services/analysis.service';

export const uploadSwing = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '업로드된 파일이 없습니다.' });
        }

        const userId = (req as any).user?.id || 1;
        const videoUrl = await uploadToS3(req.file);

        // Save to DB
        const result = await pool.query(
            'INSERT INTO swing_videos (user_id, video_url, upload_status) VALUES ($1, $2, $3) RETURNING id',
            [userId, videoUrl, 'completed']
        );

        res.status(201).json({
            message: '스윙 영상이 성공적으로 업로드되었습니다.',
            videoId: result.rows[0].id,
            videoUrl
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '업로드에 실패했습니다.' });
    }
};

export const requestAnalysis = async (req: Request, res: Response) => {
    try {
        const { videoId, keypoints } = req.body;

        // Run Analysis
        const analysisResult = await analyzeSwing(keypoints);

        // Save Analysis
        await pool.query(
            `INSERT INTO swing_analyses 
            (video_id, score_total, score_stability, score_path, score_impact, score_weight_transfer, score_release, score_consistency, diagnosis_problems, diagnosis_good_point, injury_risk_warning, keypoints_json)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
                videoId,
                analysisResult.score_total,
                analysisResult.score_stability,
                analysisResult.score_path,
                analysisResult.score_impact,
                analysisResult.score_weight_transfer,
                analysisResult.score_release,
                analysisResult.score_consistency,
                JSON.stringify(analysisResult.diagnosis_problems),
                analysisResult.diagnosis_good_point,
                analysisResult.injury_risk_warning,
                JSON.stringify(keypoints)
            ]
        );

        res.status(200).json({ message: '분석이 완료되었습니다.', result: analysisResult });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '분석 중 오류가 발생했습니다.' });
    }
};
