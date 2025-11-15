import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import IntegratedHeader from "./IntegratedHeader";

export default async function IntegratedHeaderServer() {
  const { user } = await validateRequest();

  if (!user) {
    return <IntegratedHeader unreadNotificationsCount={0} />;
  }

  const unreadNotificationsCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return <IntegratedHeader unreadNotificationsCount={unreadNotificationsCount} />;
}

