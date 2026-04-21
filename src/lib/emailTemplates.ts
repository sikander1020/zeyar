export function getOrderConfirmationEmail(orderId: string, customerName: string, items: any[], total: number) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #efeae6;">
        <p style="margin: 0; font-family: 'Playfair Display', serif; font-size: 16px; color: #3a2e2a;">${item.name}</p>
        <p style="margin: 4px 0 0; font-size: 12px; color: #8a7a72;">Size: ${item.size} | Color: ${item.color} | Qty: ${item.qty}</p>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #efeae6; text-align: right; font-weight: bold; color: #3a2e2a;">
        Rs ${item.price.toLocaleString()}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
          body { font-family: 'Inter', Arial, sans-serif; background-color: #fcfbfa; margin: 0; padding: 0; color: #3a2e2a; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #efeae6; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(58,46,42,0.05); }
          .header { text-align: center; padding: 40px 20px; background-color: #fcfbfa; border-bottom: 1px solid #efeae6; }
          .logo { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: bold; letter-spacing: 4px; background: linear-gradient(135deg, #dfa290, #c48b7b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
          .content { padding: 40px; }
          .footer { text-align: center; padding: 30px; background-color: #3a2e2a; color: #fcfbfa; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ZAYBAASH</h1>
            <p style="margin-top: 10px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #8a7a72;">Order Confirmation</p>
          </div>
          
          <div class="content">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: normal; margin-top: 0;">Thank you for your purchase, ${customerName}.</h2>
            <p style="color: #6a5a52; line-height: 1.6; margin-bottom: 30px;">
              We have received your order #<strong>${orderId}</strong> and are preparing it for shipment. We will notify you again once your package is on the way.
            </p>
            
            <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8a7a72; border-bottom: 1px solid #efeae6; padding-bottom: 10px; margin-bottom: 0;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              ${itemsHtml}
              <tr>
                <td style="padding: 20px 0 0; text-align: right; color: #8a7a72; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Total</td>
                <td style="padding: 20px 0 0; text-align: right; font-family: 'Playfair Display', serif; font-size: 22px; color: #dfa290;">Rs ${total.toLocaleString()}</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://www.zaybaash.com/account" style="display: inline-block; padding: 14px 32px; background-color: #3a2e2a; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">View Order Status</a>
            </div>
          </div>
          
          <div class="footer">
            © ${new Date().getFullYear()} ZAYBAASH. Beauty with Style.
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getOrderShippedEmail(orderId: string, customerName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
          body { font-family: 'Inter', Arial, sans-serif; background-color: #fcfbfa; margin: 0; padding: 0; color: #3a2e2a; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #efeae6; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(58,46,42,0.05); }
          .header { text-align: center; padding: 40px 20px; background-color: #fcfbfa; border-bottom: 1px solid #efeae6; }
          .logo { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #3a2e2a; margin: 0; }
          .content { padding: 40px; }
          .footer { text-align: center; padding: 30px; background-color: #dfa290; color: #ffffff; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ZAYBAASH</h1>
            <p style="margin-top: 10px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #8a7a72;">Shipment Update</p>
          </div>
          
          <div class="content">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: normal; margin-top: 0;">Great News, ${customerName}!</h2>
            <div style="background-color: #fcfbfa; border: 1px solid #efeae6; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #3a2e2a; font-size: 16px;">Order #<strong>${orderId}</strong> is officially on its way.</p>
            </div>
            <p style="color: #6a5a52; line-height: 1.6; margin-bottom: 30px; text-align: center;">
              Your luxury pieces have been wrapped, packaged, and handed over to our courier partner. You can expect delivery within the next 2-4 business days.
            </p>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://www.zaybaash.com/account" style="display: inline-block; padding: 14px 32px; background-color: #dfa290; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Track Package</a>
            </div>
          </div>
          
          <div class="footer">
            © ${new Date().getFullYear()} ZAYBAASH. Beauty with Style.
          </div>
        </div>
      </body>
    </html>
  `;
}
