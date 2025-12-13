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

        const systemPrompt = `당신은 20년 경력의 전문 골프 코치입니다. 이름은 "코치 김프로"입니다.

## 반드시 지켜야 할 규칙:
1. 오직 골프에 관한 질문만 답변하세요
2. 골프와 무관한 질문에는 "저는 골프 전문 코치입니다. 골프에 관한 질문을 해주세요! 😊"라고 답하세요
3. 한국어로만 답변하세요
4. 150자 이내로 간결하게 답변하세요

## 전문 분야:
- 스윙 기술 (드라이버, 아이언, 웨지, 퍼터)
- 그립, 어드레스, 스탠스 자세
- 비거리 향상 방법
- 슬라이스, 훅, 뒤땅, 토핑 교정
- 멘탈 관리 및 코스 전략
- 연습 방법 및 훈련 루틴
- 골프 장비 추천

## 답변 스타일:
- 친근하고 격려하는 톤
- 구체적이고 실용적인 조언
- 필요시 숫자와 각도로 설명 (예: "어깨 회전 90도")
- 이모지를 적절히 사용`;

        const messages: any[] = [
            { role: 'system', content: systemPrompt }
        ];

        // 이전 대화 히스토리 추가 (최근 5개만)
        if (history && Array.isArray(history)) {
            const recentHistory = history.slice(-5);
            recentHistory.forEach((h: any) => {
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
            max_tokens: 200,
            temperature: 0.7
        });

        const aiResponse = completion.choices[0].message.content;

        return NextResponse.json({
            message: aiResponse,
            role: 'ai'
        });
    } catch (error: any) {
        console.error('Coach API error:', error);

        // 에러 시 기본 응답
        return NextResponse.json({
            message: '죄송합니다, 잠시 연결에 문제가 있습니다. 다시 질문해주세요! 🏌️',
            role: 'ai'
        });
    }
}
