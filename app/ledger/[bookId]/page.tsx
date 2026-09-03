"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { BookOpen } from "lucide-react";
import { useLedgerBooks } from "@/lib/store";
import ChartOfAccountsBuilder from "@/components/ChartOfAccountsBuilder";
import { PostJournalEntry } from "@/components/PostJournalEntry";
import { LiveTrialBalance } from "@/components/LiveTrialBalance";
import { GeneralLedgerDetail } from "@/components/GeneralLedgerDetail";
import { FinancialStatementsLive } from "@/components/FinancialStatementsLive";
import type { Account } from "@/components/ChartOfAccountsBuilder";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function LedgerBookPage() {
  const params = useParams<{ bookId: string }>();
  const router = useRouter();
  const book = useLedgerBooks((s) => s.books[params.bookId]);
  const updateCoa = useLedgerBooks((s) => s.updateCoa);
  const post = useLedgerBooks((s) => s.post);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [tab, setTab] = useState("post");

  if (!book) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={BookOpen}
          title="Book not found"
          description="This practice book doesn't exist in this browser — it may have been deleted, or you're on a different device (books are stored locally, not synced)."
          action={<Button onClick={() => router.push("/ledger")}>Back to Ledger</Button>}
        />
      </div>
    );
  }

  const fiscalYearStart = `${book.entries[0]?.date.slice(0, 4) ?? new Date().getFullYear()}-01-01`;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/ledger"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All books
      </Link>
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{book.name}</h1>
          <p className="text-sm text-muted-foreground">{book.company}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          {book.chartOfAccounts.length} accounts · {book.entries.length} entries posted
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="post">Post entry</TabsTrigger>
          <TabsTrigger value="tb">Trial balance</TabsTrigger>
          <TabsTrigger value="statements">Financial statements</TabsTrigger>
          <TabsTrigger value="coa">Chart of accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="post" className="mt-4">
          <PostJournalEntry
            chartOfAccounts={book.chartOfAccounts}
            defaultDate={todayIso()}
            onPost={(draft) => post(book.id, draft)}
          />
        </TabsContent>

        <TabsContent value="tb" className="mt-4 space-y-4">
          <LiveTrialBalance
            chartOfAccounts={book.chartOfAccounts}
            entries={book.entries}
            onSelectAccount={setSelectedAccount}
          />
          {selectedAccount && (
            <GeneralLedgerDetail account={selectedAccount} entries={book.entries} />
          )}
        </TabsContent>

        <TabsContent value="statements" className="mt-4">
          <FinancialStatementsLive
            chartOfAccounts={book.chartOfAccounts}
            entries={book.entries}
            fiscalYearStart={fiscalYearStart}
            asOfDate={todayIso()}
          />
        </TabsContent>

        <TabsContent value="coa" className="mt-4">
          <ChartOfAccountsBuilder
            initialCOA={book.chartOfAccounts}
            onSave={(coa) => updateCoa(book.id, coa)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
