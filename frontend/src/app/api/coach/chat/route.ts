import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { message, coachName, specialty } = await request.json();

        if (!message) {
            return NextResponse.json({ error: '메시지가 필요합니다.' }, { status: 400 });
        }

        const systemPrompt = `당신은 ${coachName}라는 이름의 전문 골프 코치입니다.
전문 분야: ${specialty}
경력: 10년 이상의 프로 코칭 경험

당신의 역할:
- 친근하고 전문적인 톤으로 대화
- 골프 기술에 대한 구체적인 조언 제공
- 학생의 수준에 맞춘 맞춤형 피드백
- 동기 부여와 격려
- 실용적이고 실행 가능한 팁 제공

응답 규칙:
- 한국어로 자연스럽게 대화
- 2-3문장 정도로 간결하게 답변
- 필요시 연습 방법 제안
- 긍정적이고 격려하는 톤 유지`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const response = completion.choices[0]?.message?.content || '죄송합니다, 잠시 후 다시 시도해주세요.';

        return NextResponse.json({ response });

    } catch (error: any) {
        console.error('Coach chat error:', error);
        return NextResponse.json(
            { error: error.message || '채팅 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
