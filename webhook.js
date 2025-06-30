async function sendOrderToWebhook(orderData) {
    const webhookUrl = 'https://webhook.newstargeted.com/api/webhooks/1389009922288648292/wdSG09rKlvwXBaWS_zxICNeYA05vBPiUHeqw6Slj7tbK1h4iBFcJKzMdzOl1Jg7AZ8N8';
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Failed to send webhook');
        }
        
        console.log('Order data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending webhook:', error);
    }
}

// Export the function for use in other files
window.sendOrderToWebhook = sendOrderToWebhook;
