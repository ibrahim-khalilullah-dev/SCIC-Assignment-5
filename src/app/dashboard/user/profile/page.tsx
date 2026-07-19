import React from "react";

export default function UserProfilePage(): React.JSX.Element {
  return (
    <main className="p-8 space-y-4 min-h-screen dark:bg-zinc-950 dark:text-white">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">
        User Profile
      </h1>
      <p className="text-sm text-zinc-500">
        Manage your subscription levels and personal credential profiles.
      </p>

      <div className="bg-[#0b0b0f] border border-white/5 p-6 rounded-2xl max-w-xl">
        <p className="text-zinc-400 text-xs leading-relaxed">
          The interactive configuration options are loading. Check back shortly.
        </p>
      </div>
    </main>
  );
}
