import { pageMetadata } from "@/lib/search";

export const metadata = pageMetadata("/terms-and-conditions");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
