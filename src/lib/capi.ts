import { headers } from 'next/headers';
import { createHash } from 'crypto';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const FB_CAPI_ACCESS_TOKEN = process.env.FB_CAPI_ACCESS_TOKEN;
const API_VERSION = 'v20.0';

function hashData(value: any): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

export async function sendServerEvent(
  eventName: string,
  eventData: Record<string, any> = {},
  userData: Record<string, any> = {},
  eventID?: string
) {
  if (!FB_PIXEL_ID || !FB_CAPI_ACCESS_TOKEN) {
    console.warn('Facebook Conversions API missing Pixel ID or Access Token');
    return;
  }

  const reqHeaders = await headers();
  const clientIpAddress = reqHeaders.get('x-forwarded-for') || reqHeaders.get('x-real-ip');
  const clientUserAgent = reqHeaders.get('user-agent');
  const requestUrl = reqHeaders.get('referer');

  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Hash required PII fields automatically
  const hashedUserData: Record<string, any> = {};
  const hashableFields = ['em', 'ph', 'fn', 'ln', 'ge', 'db', 'ct', 'st', 'zp', 'country'];
  
  for (const [key, val] of Object.entries(userData)) {
    if (hashableFields.includes(key)) {
      const hashed = hashData(val);
      if (hashed) hashedUserData[key] = hashed;
    } else {
      hashedUserData[key] = val;
    }
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: currentTimestamp,
        event_id: eventID, // Used for deduplication with browser pixel
        event_source_url: requestUrl,
        action_source: 'website',
        user_data: {
          client_ip_address: clientIpAddress,
          client_user_agent: clientUserAgent,
          ...hashedUserData,
        },
        custom_data: {
          ...eventData
        }
      }
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${FB_PIXEL_ID}/events?access_token=${FB_CAPI_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();
    if (!response.ok) {
      console.error('Facebook CAPI Error:', result);
    } else {
      console.log(`CAPI Event [${eventName}] sent successfully.`);
    }
    return result;
  } catch (error) {
    console.error('Facebook CAPI Fetch Error:', error);
  }
}
