"use client";

import { AppleLogo } from "@flakeforge/sf-icons/react";

export default function Comp() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Client Component</h1>
      <AppleLogo size={128} />
    </main>
  );
}
