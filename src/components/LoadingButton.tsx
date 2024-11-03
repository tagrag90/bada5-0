import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

// LoadingButton 컴포넌트의 props 타입 정의
// 기존 ButtonProps를 확장하여 loading prop 추가
interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

// LoadingButton 컴포넌트: 로딩 상태를 표시할 수 있는 버튼
// loading: 로딩 상태 여부
// disabled: 버튼 비활성화 여부
// className: 추가 스타일 클래스
// ...props: 나머지 ButtonProps 속성들
export default function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      // 로딩 중이거나 disabled prop이 true일 때 버튼 비활성화
      disabled={loading || disabled}
      // 기본 스타일과 사용자 정의 className을 결합
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {/* 로딩 중일 때 스피너 아이콘 표시 */}
      {loading && <Loader2 className="size-5 animate-spin" />}
      {/* 버튼 내부 콘텐츠 */}
      {props.children}
    </Button>
  );
}
