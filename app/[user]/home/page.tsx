import Home from "./HomePage";

export const dynamic = "force-static";

// This stays on the server/build-process
export async function generateStaticParams() {
  return [{ user: "manas" }, { user: "guest" }];
}

interface PageProps {
  params: Promise<{ user: string }>;
}

export default async function Page() {
  // Pass the data to your Client Component
  return <Home />;
}
