import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy — Accountrix",
  description: "How Accountrix handles your data: local-first, stored in your browser.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-2 flex items-center gap-3">
        <ShieldCheck className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Privacy</h1>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Plain-language description of how the current version of Accountrix handles your data. This
        reflects how the app actually works today; have it reviewed by counsel before any public
        launch.
      </p>

      <div className="prose prose-sm max-w-none dark:prose-invert space-y-5 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold">Your data stays in your browser</h2>
          <p className="text-muted-foreground">
            Accountrix is local-first. Your progress, quiz and simulation attempts, spaced-repetition
            queue, notes, and study preferences are stored in your browser&apos;s local storage on
            your device. There is no account, and this data is not transmitted to or stored on a
            central server by the app.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">What we do not collect</h2>
          <p className="text-muted-foreground">
            The app does not require a name, email, or password, and does not sell or share personal
            data. Study content (lessons, questions, simulations) is fictional and contains no real
            company or personal financial data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Backups you control</h2>
          <p className="text-muted-foreground">
            You can export a backup of your local data to a file and import it yourself from the
            State page. Those files live wherever you save them; treat them as you would any personal
            file.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Optional AI tutor</h2>
          <p className="text-muted-foreground">
            The in-app tutor answers by searching the local lesson content. If a hosted AI provider
            is ever configured for richer answers, the questions you type would be sent to that
            provider to generate a response — this page will be updated to name the provider when
            that is enabled.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Hosting</h2>
          <p className="text-muted-foreground">
            When the app is hosted, the host may keep standard technical logs (such as IP address and
            request times) as part of normal operation. This does not include your study data, which
            remains in your browser.
          </p>
        </section>

        <p className="text-xs text-muted-foreground">
          Questions: <a className="text-primary underline" href="mailto:support@accountrix.app">support@accountrix.app</a>.
        </p>
      </div>
    </div>
  );
}
