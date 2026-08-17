import { PolicyPage, policyMetadata } from "@/components/content/policy-page";

export const metadata = policyMetadata("terms");

export default function Page() {
  return <PolicyPage slug="terms" />;
}
