import { MockExam } from "@/components/glass/MockExam";

export const metadata = { title: "Mock Exam · Accountrix" };

export default function ExamPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <MockExam />
    </div>
  );
}
