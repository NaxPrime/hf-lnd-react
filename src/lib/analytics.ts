/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/analytics.ts

/**
 * Pushes data to Google Tag Manager's dataLayer
 */
export const pushToDataLayer = (name: string, data: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: name,
      ...data,
    });
  }
};

/**
 * Core function to track an event across all platforms
 */
export const trackCustomEvent = (eventName: string, params: Record<string, any> = {}) => {
  const w = window as any;
  
  // 1. Send to GTM dataLayer
  pushToDataLayer(eventName, params);

  // 2. Send to GA4 / Google Ads (if initialized via gtag directly instead of GTM)
  if (typeof window !== 'undefined' && typeof w.gtag === 'function') {
    w.gtag('event', eventName, params);
  }

  // 3. Send to Meta Pixel
  if (typeof window !== 'undefined' && typeof w.fbq === 'function') {
    w.fbq('trackCustom', eventName, params);
  }
};

export const trackPageView = (url: string) => {
  const w = window as any;
  
  // GTM DataLayer
  pushToDataLayer('page_view', { page_path: url });

  // GA4 natively handles page_view on history change when using next/third-parties,
  // but if you want explicit manual trigger:
  if (typeof window !== 'undefined' && typeof w.gtag === 'function') {
    w.gtag('event', 'page_view', { page_path: url });
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && typeof w.fbq === 'function') {
    w.fbq('track', 'PageView');
  }
};

export const trackLead = (value?: number, currency: string = 'USD') => {
  const w = window as any;
  const params = value ? { value, currency } : {};
  trackCustomEvent('generate_lead', params);
  
  // Explicit Meta Standard Event
  if (typeof window !== 'undefined' && typeof w.fbq === 'function') {
    w.fbq('track', 'Lead', params);
  }
};

export const trackButtonClick = (buttonName: string) => {
  trackCustomEvent('button_click', { button_name: buttonName });
};

export const trackFormSubmit = (formName: string) => {
  trackCustomEvent('form_submit', { form_name: formName });
};
