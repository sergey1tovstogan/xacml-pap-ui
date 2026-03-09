import { SectionLayout } from "@/components/journey";

export default function IntegrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectionLayout sectionId="integration">{children}</SectionLayout>;
}
