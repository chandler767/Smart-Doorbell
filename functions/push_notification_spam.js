const store = require('kvstore');

export default (request) => {
    // Limit push notifications to one every 30 seconds.
    const duration = 30;  

    // Get the time and compare to the last time a notification was sent. 
    const currentTime = Math.round(Date.now() / 1000);

    return store.get('anti_spam').then((value) => {
        // Get the last time a message was sent with push notifications.
        const lastMessageTime = value.last_message_time;
        
        // Edit message if duplicate.
        if ((currentTime - lastMessageTime) < duration) {
            // Modify the message to remove push keys.
            console.log("Duplicate push notification removed.");
            request.message = { "event": { "button": "pressed" }};
        } else {
            // Allow full message and record time.
            store.set('anti_spam', {
                last_message_time: currentTime
            });
        }

        return request.ok();
    })
    .catch((e) => {
        console.error(e);
    });
}