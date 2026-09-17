import { AppleLogo } from "@flakeforge/sf-icons/react";
import Comp from "./comp";

export default function RootPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Server Component</h1>
      <AppleLogo size={128} />

      <Comp />
    </main>
  );
}
