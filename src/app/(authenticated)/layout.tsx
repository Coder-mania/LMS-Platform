import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
