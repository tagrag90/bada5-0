import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/auth';

// OpenAI API 키는 환경변수에서 가져옵니다
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 로컬 프롬프트 파싱 함수 (OpenAI API 없이도 기본 기능 제공)
function parsePromptLocally(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  
  // 게시물 작성 명령어 감지
  if (lowerPrompt.includes('게시물 작성') || lowerPrompt.includes('포스트 작성') || lowerPrompt.includes('써줘')) {
    const content = prompt.replace(/게시물 작성해줘|포스트 작성해줘|게시물 써줘|써줘/gi, '').trim();
    if (content) {
      return {
        type: 'action',
        action: 'CREATE_POST',
        data: { content },
        message: `"${content}" 내용으로 게시물을 작성하시겠습니까?`
      };
    }
  }
  
  // 검색 명령어 감지
  if (lowerPrompt.includes('검색해줘') || lowerPrompt.includes('찾아줘') || lowerPrompt.includes('검색')) {
    const searchTerm = prompt.replace(/검색해줘|찾아줘|검색/gi, '').trim();
    if (searchTerm) {
      return {
        type: 'action',
        action: 'SEARCH',
        data: { query: searchTerm },
        message: `"${searchTerm}"를 검색하시겠습니까?`
      };
    }
  }
  
  // 트렌딩 명령어 감지
  if (lowerPrompt.includes('트렌딩') || lowerPrompt.includes('인기') || lowerPrompt.includes('hot')) {
    return {
      type: 'action',
      action: 'GET_TRENDING',
      data: {},
      message: '현재 인기 콘텐츠를 확인하시겠습니까?'
    };
  }
  
  // 프로필 이동 명령어 감지
  if (lowerPrompt.includes('프로필') || lowerPrompt.includes('내 프로필') || lowerPrompt.includes('마이페이지')) {
    return {
      type: 'action',
      action: 'GO_TO_PROFILE',
      data: {},
      message: '내 프로필 페이지로 이동하시겠습니까?'
    };
  }
  
  // 홈 이동 명령어 감지
  if (lowerPrompt.includes('홈으로') || lowerPrompt.includes('홈 이동') || lowerPrompt.includes('메인으로') || lowerPrompt.includes('home')) {
    return {
      type: 'action',
      action: 'GO_TO_HOME',
      data: {},
      message: '홈 페이지로 이동하시겠습니까?'
    };
  }
  
  // 좋아요 명령어 감지
  if (lowerPrompt.includes('좋아요') && (lowerPrompt.includes('눌러') || lowerPrompt.includes('해줘') || lowerPrompt.includes('누르'))) {
    return {
      type: 'action',
      action: 'LIKE_POST',
      data: {},
      message: '최근 게시물에 좋아요를 누르시겠습니까?'
    };
  }
  
  // 북마크 명령어 감지
  if (lowerPrompt.includes('북마크') && (lowerPrompt.includes('해줘') || lowerPrompt.includes('저장'))) {
    return {
      type: 'action',
      action: 'BOOKMARK_POST',
      data: {},
      message: '최근 게시물을 북마크하시겠습니까?'
    };
  }
  
  // 알림 조회 명령어 감지
  if (lowerPrompt.includes('알림') && (lowerPrompt.includes('보여') || lowerPrompt.includes('확인') || lowerPrompt.includes('체크'))) {
    return {
      type: 'action',
      action: 'VIEW_NOTIFICATIONS',
      data: {},
      message: '알림 페이지로 이동하시겠습니까?'
    };
  }
  
  // 팔로우 명령어 감지
  if (lowerPrompt.includes('팔로우') && !lowerPrompt.includes('언팔로우')) {
    const username = prompt.match(/@?(\w+)\s*팔로우|팔로우.*?(@?\w+)/i);
    if (username && username[1]) {
      return {
        type: 'action',
        action: 'FOLLOW',
        data: { username: username[1] },
        message: `@${username[1]} 사용자를 팔로우하시겠습니까?`
      };
    } else {
      return {
        type: 'chat',
        message: '어떤 사용자를 팔로우하시겠습니까? 사용자명을 알려주세요.'
      };
    }
  }
  
  // 인사말
  if (lowerPrompt.includes('안녕') || lowerPrompt.includes('hi') || lowerPrompt.includes('hello')) {
    return {
      type: 'chat',
      message: `안녕하세요! 😊 Bada AI Assistant입니다.

다음과 같은 작업을 도와드릴 수 있습니다:

📝 **게시물 작성**
- "게시물 작성해줘 [내용]"
- "오늘 날씨 좋다고 써줘"

🔍 **검색 기능**  
- "[키워드] 검색해줘"
- "K-pop 찾아줘"

🔥 **트렌딩 조회**
- "트렌딩 보여줘"
- "인기 콘텐츠 알려줘"

👥 **팔로우 관리**
- "[사용자명] 팔로우해줘"

무엇을 도와드릴까요?`
    };
  }
  
  // 기본 응답
  return {
    type: 'chat',
    message: `죄송합니다. 현재 OpenAI API 할당량 문제로 기본 명령어 파싱을 사용중입니다.

**사용 가능한 명령어:**

📝 **게시물 작성**
- "게시물 작성해줘 [내용]"
- "오늘 기분 좋다고 써줘"

🔍 **검색**
- "[키워드] 검색해줘"  
- "뉴진스 찾아줘"

🔥 **트렌딩**
- "트렌딩 보여줘"

👥 **팔로우**  
- "[사용자명] 팔로우해줘"

현재 요청: "${prompt}"`
  };
}

export async function POST(request: NextRequest) {
  let prompt = '';
  
  try {
    console.log('AI Chat API called');
    
    // 사용자 인증 확인
    const { user } = await validateRequest();
    if (!user) {
      console.log('User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    prompt = body.prompt;
    console.log('Received prompt:', prompt);

    if (!prompt) {
      console.log('No prompt provided');
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      console.log('OpenAI API key not found in environment variables');
      // 환경변수가 없을 경우 임시 응답 제공
      return NextResponse.json({
        response: {
          type: 'chat',
          message: `죄송합니다. AI 서비스 설정이 완료되지 않았습니다.

환경변수 설정이 필요합니다:
1. .env.local 파일에 OPENAI_API_KEY 추가
2. 서버 재시작

현재 요청하신 내용: "${prompt}"

임시로 다음과 같은 명령어를 사용해보세요:
📝 "게시물 작성해줘 [내용]"
🔍 "[키워드] 검색해줘"`
        }
      });
    }

    console.log('API Key exists, making OpenAI request...');

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `당신은 Bada 엔터테인먼트 플랫폼의 AI 어시스턴트입니다.
Bada는 크리에이터와 팬을 직접 연결하는 플랫폼으로, 소속사 없이도 크리에이터가 주도권을 가지고 활동하며 팬들과 매끄럽게 소통할 수 있도록 돕습니다.
            
다음과 같은 작업을 도와줄 수 있습니다:
- 게시물 및 스튜디오 콘텐츠 작성 도움
- 크리에이터 발견 및 팔로우 관리
- 검색 및 탐색
- 콘텐츠 추천

사용자의 요청을 분석하여 다음 형식으로 응답해주세요:

1. 일반 대화인 경우: 친근하게 답변
2. 특정 액션이 필요한 경우: 액션 타입과 데이터를 포함한 JSON 형식으로 응답

액션 타입:
- CREATE_POST: 게시물 작성
- SEARCH: 검색
- FOLLOW: 팔로우
- GET_TRENDING: 트렌딩 조회

예시:
{
  "type": "action",
  "action": "CREATE_POST",
  "data": { "content": "게시물 내용" },
  "message": "게시물을 작성하시겠습니까?"
}

또는:
{
  "type": "chat",
  "message": "일반 대화 응답"
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('OpenAI API error:', response.status, response.statusText, errorText);
      
      // 할당량 초과나 기타 API 에러 시 로컬 파싱으로 폴백
      if (response.status === 429 || response.status >= 400) {
        console.log('Falling back to local parsing due to API error');
        return NextResponse.json({
          response: parsePromptLocally(prompt)
        });
      }
      
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);
    const aiResponse = data.choices[0]?.message?.content || '';

    // AI 응답을 파싱하여 액션이 있는지 확인
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      // JSON이 아닌 경우 일반 텍스트 응답으로 처리
      parsedResponse = {
        type: 'chat',
        message: aiResponse
      };
    }

    return NextResponse.json({
      response: parsedResponse,
      usage: data.usage
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    // 에러 발생 시에도 로컬 파싱으로 폴백
    if (prompt) {
      console.log('Using local parsing fallback due to error');
      return NextResponse.json({
        response: parsePromptLocally(prompt)
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
