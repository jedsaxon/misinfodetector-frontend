import type { ReactNode } from "react";

export default function Header({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl flex items-center gap-x-2">{children}</h1>;
}
