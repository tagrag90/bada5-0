/**
 * API 라우트 공통 에러 핸들러
 */
import { NextResponse } from "next/server";
import { logger } from "./logger";

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
}

export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "AppError";
  }
}

/**
 * API 에러를 처리하고 표준 응답을 반환
 */
export function handleApiError(error: unknown, context?: string): NextResponse {
  const errorContext = context ? `API Error in ${context}` : "API Error";
  
  // AppError 인스턴스인 경우
  if (error instanceof AppError) {
    logger.error(errorContext + ":", {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // 일반 Error 인스턴스인 경우
  if (error instanceof Error) {
    logger.error(errorContext + ":", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }

  // 알 수 없는 에러
  logger.error(errorContext + " (Unknown):", error);
  return NextResponse.json(
    {
      error: "Internal server error",
    },
    { status: 500 }
  );
}

/**
 * API 라우트 래퍼 - 에러 핸들링 자동화
 */
export function withErrorHandler(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return async (req: Request, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

