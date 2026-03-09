import { SectionLayout } from "@/components/journey";

export default function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectionLayout sectionId="architecture">{children}</SectionLayout>;
}
