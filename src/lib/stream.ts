// 더미 Stream 클라이언트 구현
// 실제 Stream 서비스에 연결하지 않고 더미 응답을 제공합니다.

const streamServerClient = {
  // 사용자 생성/업데이트
  upsertUser: async ({ id, username, name }: { id: string; username: string; name: string }) => {
    console.log(`[DUMMY] Stream upsertUser called for ${username}`);
    return { id, name, username };
  },
  
  // 사용자 부분 업데이트
  partialUpdateUser: async ({ id, set }: { id: string; set: any }) => {
    console.log(`[DUMMY] Stream partialUpdateUser called for ${id}`);
    return { id, ...set };
  },
  
  // 토큰 생성
  createToken: (userId: string, expiresAt: number, issuedAt: number) => {
    console.log(`[DUMMY] Stream createToken called for ${userId}`);
    return "dummy_stream_token";
  },
  
  // 읽지 않은 메시지 수 가져오기
  getUnreadCount: async (userId: string) => {
    console.log(`[DUMMY] Stream getUnreadCount called for ${userId}`);
    return { total_unread_count: 0 };
  }
};

export default streamServerClient; 