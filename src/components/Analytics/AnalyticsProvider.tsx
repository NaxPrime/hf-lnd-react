"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { configureAnalytics, type AnalyticsConfig } from "@/lib/analytics";

export default function AnalyticsProvider({ config }: { config: AnalyticsConfig }) {
  const pathname = usePathname();
  const { isProduction, analyticsEnabled, gaMeasurementId, metaEnabled, metaPixelId } = config;

  useEffect(() => {
    configureAnalytics({ isProduction, analyticsEnabled, gaMeasurementId, metaEnabled, metaPixelId }, pathname || "/");
  }, [pathname, isProduction, analyticsEnabled, gaMeasurementId, metaEnabled, metaPixelId]);

  return null;
}
