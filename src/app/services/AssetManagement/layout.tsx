import { pageMetadata } from "@/lib/search";
import ServiceSchema from "@/components/SEO/ServiceSchema";

export const metadata = pageMetadata("/services/AssetManagement");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><ServiceSchema path="/services/AssetManagement" />{children}</>;
}
