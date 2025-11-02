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
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Prisma Client에 projectNode 모델과 emoji 필드가 있는지 확인
if (process.env.NODE_ENV === "development") {
  const testNode = (prisma as any).projectNode;
  if (!testNode) {
    // 기존 인스턴스를 무효화하고 새로 생성
    globalThis.prismaGlobal = undefined;
    const newPrisma = prismaClientSingleton();
    globalThis.prismaGlobal = newPrisma;
    console.log("Prisma Client regenerated - projectNode model missing");
  }
}

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
