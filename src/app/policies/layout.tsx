import { SectionLayout } from "@/components/journey";

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectionLayout sectionId="policies">{children}</SectionLayout>;
}
