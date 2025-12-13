import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI 클라이언트
function getOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not set');
    }
    return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json();

        if (!message) {
            return NextResponse.json({ error: '메시지를 입력해주세요.' }, { status: 400 });
        }

        const openai = getOpenAI();

        const systemPrompt = `당신은 전문 골프 코치 AI입니다. 이름은 "AI 골프 코치"입니다.
        
당신의 역할:
- 골프 스윙, 자세, 그립, 장비에 대한 전문적인 조언 제공
- 초보자부터 프로까지 모든 수준에 맞는 맞춤형 피드백
- 부상 예방 및 효과적인 연습 방법 안내
- 친절하고 격려하는 톤으로 대화

응답 시:
- 구체적이고 실행 가능한 조언 제공
- 필요시 단계별 설명
- 한국어로 답변
- 200자 이내로 간결하게`;

        const messages: any[] = [
            { role: 'system', content: systemPrompt }
        ];

        // 이전 대화 히스토리 추가
        if (history && Array.isArray(history)) {
            history.forEach((h: any) => {
                messages.push({
                    role: h.role === 'ai' ? 'assistant' : 'user',
                    content: h.content
                });
            });
        }

        messages.push({ role: 'user', content: message });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: 300
        });

        const aiResponse = completion.choices[0].message.content;

        return NextResponse.json({
            message: aiResponse,
            role: 'ai'
        });
    } catch (error: any) {
        console.error('Coach API error:', error);

        // 에러 시 기본 응답
        const fallbackResponses = [
            '좋은 질문입니다! 백스윙에서 가장 중요한 것은 어깨 회전입니다. 어깨가 90도 이상 회전해야 파워가 생깁니다.',
            '드라이버 비거리를 늘리려면 체중 이동이 핵심입니다. 백스윙 시 오른발에 70% 체중을 실고, 다운스윙 시 왼발로 이동하세요.',
            '일관된 스윙을 위해서는 템포가 중요합니다. 백스윙 3, 다운스윙 1의 리듬을 유지해보세요.'
        ];

        return NextResponse.json({
            message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
            role: 'ai'
        });
    }
}
