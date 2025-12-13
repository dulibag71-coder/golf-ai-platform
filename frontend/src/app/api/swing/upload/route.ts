import { NextRequest, NextResponse } from 'next/server';

// 영상 업로드 API (임시 - 실제로는 S3 등 사용)
export async function POST(request: NextRequest) {
    try {
        // FormData 처리
        const formData = await request.formData();
        const video = formData.get('video');

        if (!video) {
            return NextResponse.json({ error: '영상 파일이 필요합니다.' }, { status: 400 });
        }

        // 임시 비디오 ID 생성 (실제로는 S3에 업로드 후 URL 반환)
        const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return NextResponse.json({
            message: '업로드 완료',
            videoId,
            url: `/uploads/${videoId}`
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: '업로드 실패: ' + error.message }, { status: 500 });
    }
}
