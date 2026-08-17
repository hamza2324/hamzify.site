import { PolicyPage, policyMetadata } from "@/components/content/policy-page";

export const metadata = policyMetadata("affiliate-disclosure");

export default function Page() {
  return <PolicyPage slug="affiliate-disclosure" />;
}
