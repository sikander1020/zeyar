export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

declare global {
  interface Window {
    fbq: any;
  }
}

export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const event = (name: string, options = {}, eventID?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (eventID) {
      window.fbq('track', name, options, { eventID });
    } else {
      window.fbq('track', name, options);
    }
  }
};
