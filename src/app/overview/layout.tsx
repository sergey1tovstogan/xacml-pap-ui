import { SectionLayout } from "@/components/journey";

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectionLayout sectionId="overview">{children}</SectionLayout>;
}
