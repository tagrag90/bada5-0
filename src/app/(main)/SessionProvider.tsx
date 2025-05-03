"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

interface SessionContext {
  user: User | null;
  session: Session | null;
  data?: {
    user: User | null;
    session: Session | null;
  };
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  const enhancedValue = {
    ...value,
    data: value.data || { user: value.user, session: value.session },
  };
  
  return (
    <SessionContext.Provider value={enhancedValue}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export function useOptionalUser() {
  const context = useContext(SessionContext);
  return context?.user || null;
}
