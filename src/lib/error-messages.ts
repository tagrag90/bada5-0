/**
 * 기술적 에러 메시지를 사용자 친화적 메시지로 변환하는 유틸리티
 */

export function getUserFriendlyMessage(error: string, context: string = 'general'): string {
  // 일반적인 에러 메시지들
  const commonErrors: Record<string, string> = {
    'NetworkError': '인터넷 연결이 불안정해요. 잠시 후 다시 시도해주세요 📶',
    'TimeoutError': '요청 시간이 초과되었어요. 다시 시도해주세요 ⏰',
    'AbortError': '작업이 중단되었어요. 다시 시도해주세요 ⏹️',
    'TypeError': '잘못된 형식의 데이터예요. 다시 확인해주세요 🔍',
    'ValidationError': '입력한 정보를 다시 확인해주세요 ✏️',
    'Unauthorized': '로그인이 필요해요. 다시 로그인해주세요 🔐',
    'Forbidden': '이 작업을 할 권한이 없어요 🚫',
    'Not Found': '찾으시는 내용이 없어요. 삭제되었거나 주소가 잘못되었을 수 있어요 🔍',
    'Internal Server Error': '서버에 일시적인 문제가 있어요. 잠시 후 다시 시도해주세요 🔧',
    'Bad Request': '요청에 문제가 있어요. 입력한 정보를 확인해주세요 📝',
    'Service Unavailable': '서비스가 일시적으로 사용할 수 없어요. 잠시 후 다시 시도해주세요 🛠️'
  };

  // 컨텍스트별 에러 메시지들
  const contextErrors: Record<string, Record<string, string>> = {
    upload: {
      'FileSizeMismatch': '사진이 너무 고화질이에요! 조금 더 작은 파일로 올려주세요 📸',
      'FileTypeNotSupported': '지원하지 않는 파일 형식이에요. 사진이나 동영상만 올릴 수 있어요 🎬',
      'FileTooLarge': '파일이 너무 커요. 더 작은 파일로 올려주세요 📦',
      'TooManyFiles': '한 번에 너무 많은 파일을 올리려고 해요. 개수를 줄여주세요 📂',
      'UploadFailed': '파일 업로드에 실패했어요. 파일을 확인하고 다시 시도해주세요 📤',
      'InvalidFileFormat': '파일 형식이 올바르지 않아요. 다른 파일을 선택해주세요 🗂️',
      'CorruptedFile': '파일이 손상되었을 수 있어요. 다른 파일을 시도해주세요 💿'
    },
    post: {
      'ContentTooLong': '글이 너무 길어요. 조금 줄여서 다시 시도해주세요 📝',
      'ContentEmpty': '내용을 입력해주세요 ✍️',
      'InvalidContent': '올바르지 않은 내용이 포함되어 있어요. 다시 확인해주세요 🔍',
      'DuplicatePost': '같은 내용의 글이 이미 있어요 📄',
      'SpamDetected': '스팸으로 감지되었어요. 잠시 후 다시 시도해주세요 🚫'
    },
    comment: {
      'CommentTooLong': '댓글이 너무 길어요. 조금 줄여서 다시 시도해주세요 💬',
      'CommentEmpty': '댓글 내용을 입력해주세요 ✍️',
      'CommentNotFound': '댓글을 찾을 수 없어요. 이미 삭제되었을 수 있어요 🔍'
    },
    user: {
      'UserNotFound': '사용자를 찾을 수 없어요 👤',
      'ProfileUpdateFailed': '프로필을 저장하지 못했어요. 입력한 정보를 확인해주세요 👤',
      'UsernameExists': '이미 사용 중인 사용자명이에요. 다른 이름을 선택해주세요 🏷️',
      'EmailExists': '이미 가입된 이메일이에요 📧'
    },
    like: {
      'AlreadyLiked': '이미 좋아요를 누르셨어요 ❤️',
      'LikeFailed': '좋아요를 누르지 못했어요. 다시 한 번 눌러주세요 ❤️'
    },
    follow: {
      'AlreadyFollowing': '이미 팔로우하고 있어요 👥',
      'FollowFailed': '팔로우하지 못했어요. 잠시 후 다시 시도해주세요 👥',
      'SelfFollow': '자기 자신은 팔로우할 수 없어요 🙂'
    },
    bookmark: {
      'AlreadyBookmarked': '이미 북마크에 저장되어 있어요 🔖',
      'BookmarkFailed': '북마크에 저장하지 못했어요. 다시 시도해주세요 🔖'
    }
  };

  // 1. 컨텍스트별 에러 메시지 우선 확인
  if (contextErrors[context] && contextErrors[context][error]) {
    return contextErrors[context][error];
  }

  // 2. 일반적인 에러 메시지 확인
  if (commonErrors[error]) {
    return commonErrors[error];
  }

  // 3. 부분 매칭으로 에러 타입 확인
  const lowerError = error.toLowerCase();
  
  if (lowerError.includes('network') || lowerError.includes('fetch')) {
    return '인터넷 연결이 불안정해요. 잠시 후 다시 시도해주세요 📶';
  }
  
  if (lowerError.includes('timeout') || lowerError.includes('시간')) {
    return '요청 시간이 초과되었어요. 다시 시도해주세요 ⏰';
  }
  
  if (lowerError.includes('unauthorized') || lowerError.includes('401')) {
    return '로그인이 필요해요. 다시 로그인해주세요 🔐';
  }
  
  if (lowerError.includes('forbidden') || lowerError.includes('403')) {
    return '이 작업을 할 권한이 없어요 🚫';
  }
  
  if (lowerError.includes('not found') || lowerError.includes('404')) {
    return '찾으시는 내용이 없어요. 삭제되었거나 주소가 잘못되었을 수 있어요 🔍';
  }
  
  if (lowerError.includes('server') || lowerError.includes('500')) {
    return '서버에 일시적인 문제가 있어요. 잠시 후 다시 시도해주세요 🔧';
  }

  if (lowerError.includes('size') || lowerError.includes('크기')) {
    return '파일 크기에 문제가 있어요. 더 작은 파일을 선택해주세요 📦';
  }

  // 4. 컨텍스트별 기본 메시지
  const contextDefaults: Record<string, string> = {
    upload: '파일을 올리는 중에 문제가 생겼어요. 다시 시도해주세요 📤',
    post: '글을 올리는 중에 문제가 생겼어요. 내용을 확인하고 다시 시도해주세요 ✍️',
    comment: '댓글을 처리하는 중에 문제가 생겼어요. 다시 시도해주세요 💬',
    user: '사용자 정보를 처리하는 중에 문제가 생겼어요. 다시 시도해주세요 👤',
    like: '좋아요를 처리하는 중에 문제가 생겼어요. 다시 시도해주세요 ❤️',
    follow: '팔로우를 처리하는 중에 문제가 생겼어요. 다시 시도해주세요 👥',
    bookmark: '북마크를 처리하는 중에 문제가 생겼어요. 다시 시도해주세요 🔖'
  };

  if (contextDefaults[context]) {
    return contextDefaults[context];
  }

  // 5. 최종 기본 메시지
  return '일시적인 문제가 발생했어요. 잠시 후 다시 시도해주세요 🔄';
}

/**
 * HTTP 상태 코드를 사용자 친화적 메시지로 변환
 */
export function getHttpErrorMessage(status: number): string {
  const statusMessages: Record<number, string> = {
    400: '요청에 문제가 있어요. 입력한 정보를 확인해주세요 📝',
    401: '로그인이 필요해요. 다시 로그인해주세요 🔐',
    403: '이 작업을 할 권한이 없어요 🚫',
    404: '찾으시는 내용이 없어요. 삭제되었거나 주소가 잘못되었을 수 있어요 🔍',
    409: '이미 존재하는 데이터예요. 다른 값을 시도해주세요 🔄',
    413: '파일이 너무 커요. 더 작은 파일로 올려주세요 📦',
    429: '너무 많은 요청을 보내고 있어요. 잠시 후 다시 시도해주세요 ⏳',
    500: '서버에 일시적인 문제가 있어요. 잠시 후 다시 시도해주세요 🔧',
    502: '서버 연결에 문제가 있어요. 잠시 후 다시 시도해주세요 🔌',
    503: '서비스가 일시적으로 사용할 수 없어요. 잠시 후 다시 시도해주세요 🛠️'
  };

  return statusMessages[status] || '일시적인 문제가 발생했어요. 잠시 후 다시 시도해주세요 🔄';
}

/**
 * 파일 크기 제한 상수
 */
export const FILE_SIZE_LIMITS = {
  AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  IMAGE_MAX_SIZE: 8 * 1024 * 1024,  // 8MB
  VIDEO_MAX_SIZE: 32 * 1024 * 1024, // 32MB
} as const;
