import { PolicyPage, policyMetadata } from "@/components/content/policy-page";

export const metadata = policyMetadata("editorial-policy");

export default function Page() {
  return <PolicyPage slug="editorial-policy" />;
}
