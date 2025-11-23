"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 데이터가 신선하다고 간주되는 시간 (5분)
            // 이 시간 동안은 리페칭하지 않음
            staleTime: 5 * 60 * 1000, // 5분
            // 캐시에 유지되는 시간 (10분)
            // 이 시간 동안은 캐시에서 데이터를 제공
            gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
            // 창 포커스 시 자동 리페칭 비활성화
            // 불필요한 네트워크 요청 방지
            refetchOnWindowFocus: false,
            // 마운트 시 리페칭 (필요한 경우에만)
            refetchOnMount: true,
            // 재연결 시 리페칭
            refetchOnReconnect: true,
            // 실패 시 재시도 횟수 (1회만)
            retry: 1,
            // 재시도 지연 시간 (지수 백오프)
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // 뮤테이션 실패 시 재시도 비활성화
            // 뮤테이션은 보통 즉시 피드백이 필요하므로 재시도하지 않음
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
