export async function sendDiscordOrderNotification(order: any) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1496170136720379975/KjsfT-doi5Ef5sF4c5chsezTNtO6sMTgg3b1m4Lph3rr54dRd4-7wLpB3Y3mg02nadIs";
    if (!webhookUrl) {
      console.warn('Webhook URL not configured');
      return;
    }

    // Determine color based on payment method. Gold for COD, Blue for Card, Green for Bank.
    const embedColor = order.paymentMethod === 'COD' ? 0xdfa290 : order.paymentMethod === 'card' ? 0x4a90e2 : 0x6b8e6b;

    const itemCount = order.items.reduce((sum: number, item: any) => sum + item.qty, 0);

    const embed = {
      title: `🛍️ New Order: #${order.orderId}`,
      description: `**${order.customer.firstName} ${order.customer.lastName}** just placed a new order for ${itemCount} item(s)!`,
      color: embedColor,
      fields: [
        {
          name: "💰 Total Amount",
          value: `**Rs ${order.total.toLocaleString()}**`,
          inline: true
        },
        {
          name: "💳 Payment Method",
          value: `${order.paymentMethod.toUpperCase()}`,
          inline: true
        },
        {
          name: "📍 City",
          value: `${order.customer.city}`,
          inline: true
        }
      ],
      footer: {
        text: "Zaybaash Online Store",
      },
      timestamp: new Date().toISOString()
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });

    if (!response.ok) {
      console.error('Failed to send Discord notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}
