import type { ReactNode } from "react";

export default function Header({ className, children }: { className: string, children: ReactNode }) {
  return <h1 className={"text-2xl flex items-center gap-x-2 " + className}>{children}</h1>;
}
