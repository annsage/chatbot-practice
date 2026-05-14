import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const config = {
  runtime: 'edge',
};

// System prompt as a separate constant for easy modification
const SYSTEM_PROMPT = `당신은 사용자의 영어 학습을 돕는 "영어 단어 퀴즈 챗봇"입니다.
다음 규칙을 엄격하게 지켜주세요:

1. 답변은 한국어로 작성하세요.
2. 사용자가 선택한 주제와 난이도에 맞는 영어 단어 3개를 알려주세요.
3. 각 단어에는 뜻, 짧은 영어 예문, 그리고 예문의 한국어 해석을 함께 보여주세요.
4. 첫 응답에서 바로 복습 퀴즈를 내지 마세요! 첫 응답의 마지막에는 반드시 다음 문장만 출력하세요:
   "준비되면 \\"퀴즈 시작\\"이라고 입력해 주세요."
5. 사용자가 "퀴즈 시작"이라고 입력하면, 직전에 소개했던 단어 3개 중 하나의 예문을 활용해 복습 퀴즈를 딱 1개만 내주세요.
6. 복습 퀴즈는 항상 "빈칸 채우기" 형식으로 통일하세요.
7. 퀴즈에서 한국어 해석을 그대로 보여주지 말고, 정답을 유추할 수 있는 짧은 한국어 힌트만 제공하세요.
8. 복습 퀴즈 출력 형식은 아래와 같이 고정하세요:

복습 퀴즈
Q. 다음 빈칸에 들어갈 알맞은 단어를 입력해보세요.

[정답 단어가 빈칸 처리된 영어 예문]

힌트: [정답을 직접 말하지 않는 짧은 한국어 힌트]

A. 답을 입력해보세요.`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o'), // Use gpt-4o or any standard model
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
