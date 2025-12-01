import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import InvoicesTable from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { Lusitana } from "next/font/google";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchInvoicesPages } from "@/app/lib/data";

const lusitana = Lusitana({ weight: "400" });

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  // ✅ Unwrap searchParams (Next.js now returns a Promise)
  const params = await searchParams;

  // Extract values safely
  const query = params?.query ?? "";
  const currentPage = Number(params?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>

      <div className="mt-5 flex w-full items-center justify-between">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>

      <Suspense
        key={query + currentPage}
        fallback={<InvoicesTableSkeleton />}
      >
        <InvoicesTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
