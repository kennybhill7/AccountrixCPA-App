"use client";

/**
 * Ledger — real practice books, not graded single-scenario exercises.
 * Create a company, it seeds a standard construction chart of accounts, add
 * or remove accounts to fit the scenario the same way you would on a real
 * job, then post journal entries against a live ledger.
 */
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { useLedgerBooks } from "@/lib/store";
import standardCoa from "@/data/coa/standard-construction-coa.json";
import type { Account } from "@/components/ChartOfAccountsBuilder";

export default function LedgerHomePage() {
  const books = useLedgerBooks((s) => s.books);
  const createBook = useLedgerBooks((s) => s.createBook);
  const deleteBook = useLedgerBooks((s) => s.deleteBook);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const bookList = Object.values(books).sort((a, b) => b.createdAt - a.createdAt);

  function handleCreate() {
    if (!name.trim() || !company.trim()) return;
    const seed = (standardCoa.accounts as Account[]).map((a) => ({ ...a }));
    createBook(name.trim(), company.trim(), seed);
    setName("");
    setCompany("");
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Ledger</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real double-entry practice. Every book is a fictional company with its own chart of
          accounts and its own posted history — nothing here is a stored answer key.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">New practice book</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Book name
            </label>
            <Input
              placeholder="e.g. Q1 practice"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Fictional company
            </label>
            <Input
              placeholder="e.g. Ridgeline Contracting LLC"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || !company.trim()}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" /> Create, seeded with the standard COA
          </Button>
        </CardContent>
      </Card>

      {bookList.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No books yet"
          description="Create one above — it starts from a standard construction chart of accounts you can then add to, rename, or trim, exactly like setting up a real job."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {bookList.map((book) => (
            <Card key={book.id} className="group relative">
              <Link href={`/ledger/${book.id}`} className="block">
                <CardHeader>
                  <CardTitle className="text-base">{book.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{book.company}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {book.chartOfAccounts.length} accounts · {book.entries.length} entries posted
                  </p>
                </CardContent>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Delete ${book.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm(`Delete "${book.name}"? This cannot be undone.`)) deleteBook(book.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
