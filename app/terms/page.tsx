import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms — Accountrix",
  description: "Plain-language terms of use for the Accountrix study tool.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-2 flex items-center gap-3">
        <FileText className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Terms of Use</h1>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        A plain-language summary of how Accountrix is intended to be used. This is not legal advice
        and should be replaced with counsel-reviewed terms before any public or commercial launch.
      </p>

      <div className="space-y-5 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold">Educational purpose</h2>
          <p className="text-muted-foreground">
            Accountrix is a study and practice tool for accounting and finance exams (CMA, CPA, and
            corporate finance) and related professional skills. It is meant to help you learn and
            self-assess; it is not accounting, tax, legal, or investment advice, and it is not a
            substitute for an official exam-review course or a licensed professional.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">No guarantee of results</h2>
          <p className="text-muted-foreground">
            Readiness scores, predicted-readiness figures, and study plans are estimates generated
            from your activity to help you focus. They do not guarantee a passing score or any
            particular exam outcome.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Content accuracy</h2>
          <p className="text-muted-foreground">
            Content is prepared carefully and tied out against worked examples, but standards, tax
            law, and exam blueprints change. Always confirm against the current authoritative source
            for your exam. All case companies and figures are fictional.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Your responsibility</h2>
          <p className="text-muted-foreground">
            Your data is stored locally in your browser; keeping backups is your responsibility (see
            the State page). Use the tool for your own study; do not rely on it as your sole
            preparation for a high-stakes exam.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">As-is</h2>
          <p className="text-muted-foreground">
            The tool is provided as-is, without warranties. To the extent permitted by law, the
            authors are not liable for losses arising from its use.
          </p>
        </section>

        <p className="text-xs text-muted-foreground">
          Questions: <a className="text-primary underline" href="mailto:support@accountrix.app">support@accountrix.app</a>.
        </p>
      </div>
    </div>
  );
}
