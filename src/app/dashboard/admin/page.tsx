import React from "react";

interface AdminPageProps {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: AdminPageProps): Promise<{ title: string; description: string }> {
  await params;
  return {
    title: "AdminPage - Page",
    description: "Description for AdminPage page",
  };
}

export default async function AdminPage({
  params,
  searchParams,
}: AdminPageProps): Promise<React.JSX.Element> {
  await params;
  await searchParams;

  return (
    <main className="p-8 space-y-4 min-h-screen dark:bg-zinc-950 dark:text-white">
      <h1 className="text-3xl font-bold leading-10 extrabold italic tracking-tight select-none">
        AdminPage
      </h1>
      <section className="content-area"></section>
    </main>
  );
}
