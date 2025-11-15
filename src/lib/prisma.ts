import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// 개발 모드에서도 최신 Prisma Client 사용하도록 강제
// Prisma Client 재생성 시 강제로 새 인스턴스 생성
let prisma: ReturnType<typeof prismaClientSingleton>;
if (process.env.NODE_ENV === "development") {
  // 개발 모드에서는 항상 새 인스턴스 생성 (핫 리로드 대응)
  prisma = prismaClientSingleton();
  globalThis.prismaGlobal = prisma;
} else {
  prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
  if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
  }
}

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
