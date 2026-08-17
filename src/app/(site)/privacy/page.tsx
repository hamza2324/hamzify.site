import { PolicyPage, policyMetadata } from "@/components/content/policy-page";

export const metadata = policyMetadata("privacy");

export default function Page() {
  return <PolicyPage slug="privacy" />;
}
