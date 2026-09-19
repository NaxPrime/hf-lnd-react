import { pageMetadata } from "@/lib/search";
import ServiceSchema from "@/components/SEO/ServiceSchema";

export const metadata = pageMetadata("/services/AdhocConsultation");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><ServiceSchema path="/services/AdhocConsultation" />{children}</>;
}
