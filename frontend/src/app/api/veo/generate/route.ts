import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { swingType, viewAngle, swingData } = await request.json();

        const VEO_API_KEY = process.env.VEO_API_KEY;

        if (!VEO_API_KEY) {
            // Return mock data if API key not set
            return NextResponse.json({
                success: true,
                videoUrl: null,
                simulation: {
                    swingType,
                    viewAngle,
                    angle: swingData?.angle || 45,
                    speed: swingData?.speed || 100,
                    trajectory: swingData?.trajectory || 'straight',
                    estimatedDistance: Math.round((swingData?.speed || 100) * 2.5),
                    message: '3D 시뮬레이션이 생성되었습니다.'
                }
            });
        }

        // Call Google Veo 3.1 API
        const prompt = `Generate a professional golf swing animation:
- Club type: ${swingType}
- View angle: ${viewAngle}
- Swing angle: ${swingData?.angle}°
- Speed: ${swingData?.speed}%
- Ball trajectory: ${swingData?.trajectory}

Create a smooth, realistic 3D golf swing demonstration.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-001:predictVideo?key=${VEO_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    instances: [{
                        prompt: prompt
                    }],
                    parameters: {
                        aspectRatio: '16:9',
                        durationSeconds: 5,
                        personGeneration: 'allow_adult',
                    }
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('Veo API error:', error);

            // Return simulation data even if API fails
            return NextResponse.json({
                success: true,
                videoUrl: null,
                simulation: {
                    swingType,
                    viewAngle,
                    angle: swingData?.angle || 45,
                    speed: swingData?.speed || 100,
                    trajectory: swingData?.trajectory || 'straight',
                    estimatedDistance: Math.round((swingData?.speed || 100) * 2.5),
                    message: '3D 시뮬레이션이 생성되었습니다. (데모 모드)'
                }
            });
        }

        const result = await response.json();

        return NextResponse.json({
            success: true,
            videoUrl: result.predictions?.[0]?.video || null,
            simulation: {
                swingType,
                viewAngle,
                angle: swingData?.angle || 45,
                speed: swingData?.speed || 100,
                trajectory: swingData?.trajectory || 'straight',
                estimatedDistance: Math.round((swingData?.speed || 100) * 2.5),
                message: '3D 시뮬레이션이 생성되었습니다.'
            }
        });

    } catch (error: any) {
        console.error('Veo 3D generation error:', error);
        return NextResponse.json(
            { error: error.message || '3D 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
