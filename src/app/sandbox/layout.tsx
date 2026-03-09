import { SectionLayout } from "@/components/journey";

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectionLayout sectionId="sandbox">{children}</SectionLayout>;
}
