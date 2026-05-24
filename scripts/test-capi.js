const API_VERSION = 'v20.0';
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';
const FB_CAPI_ACCESS_TOKEN = process.env.FB_CAPI_ACCESS_TOKEN || '';
const TEST_CODE = 'TEST35052';

const payload = {
  data: [
    {
      event_name: 'PageView',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data: {
        client_ip_address: '127.0.0.1',
        client_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      custom_data: {}
    }
  ],
  test_event_code: TEST_CODE
};

fetch(`https://graph.facebook.com/${API_VERSION}/${FB_PIXEL_ID}/events?access_token=${FB_CAPI_ACCESS_TOKEN}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => {
  console.log('Response from Facebook:', data);
})
.catch(err => {
  console.error('Error:', err);
});
