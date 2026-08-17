import { PolicyPage, policyMetadata } from "@/components/content/policy-page";

export const metadata = policyMetadata("corrections-policy");

export default function Page() {
  return <PolicyPage slug="corrections-policy" />;
}
