import type { Metadata } from "next";
import MainLayout from "@/components/layout/main-layout";
import DataTableExample from "@/components/data-table-example";

// Metadados estáticos para SEO
export const metadata: Metadata = {
  title: "Dashboard | Bitcoin",
  description:
    "Dashboard da plataforma Bitcoin com interface moderna e responsiva.",
  openGraph: {
    title: "Dashboard | Bitcoin",
    description:
      "Dashboard da plataforma Bitcoin com interface moderna e responsiva.",
    type: "website",
    siteName: "Dashboard Bitcoin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard Bitcoin",
    description:
      "Dashboard da plataforma Bitcoin com interface moderna e responsiva.",
  },
};

export default function Home() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-stone-100 dark:bg-background">
        <div className="container mx-auto px-4">
          {/* Tabela de dados */}
          <DataTableExample />
        </div>
      </div>
    </MainLayout>
  );
}
