"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

export type AuthState = { error?: string; message?: string };

function Fields({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return <fieldset disabled={pending} className="min-w-0 disabled:opacity-60">{children}{pending && <p role="status" className="mt-4 text-sm">Please wait…</p>}</fieldset>;
}

export function AuthForm({ action, children, className }: {
  action: (state: AuthState, data: FormData) => Promise<AuthState>;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, {});
  return <form action={formAction} className={className}>
    <Fields>{children}</Fields>
    {state.error && <p role="alert" className="mt-4 text-sm text-red-700">{state.error}</p>}
    {state.message && <p role="status" className="mt-4 text-sm text-green-800">{state.message}</p>}
  </form>;
}
