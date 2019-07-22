#include <WiFi101.h>
#define PubNub_BASE_CLIENT WiFiClient
#include <PubNub.h>
 
const static char ssid[] = "Sensor Network";
const static char pass[] = "sens0rpassw0rd"; 

void setup() {
    Serial.begin(9600);
    pinMode(9, INPUT_PULLUP);
    if(WiFi.begin(ssid, pass) != WL_CONNECTED) { // Connect to WiFi.
       Serial.println("Can't connect to WiFi.");
       while(1) delay(100);
    }
    else {
      //Serial.print("Connected to SSID: ");
      //Serial.println(ssid);
      PubNub.begin("pub-c-5e98b32b-48a6-4616-881f-4e3770ed58eb", "sub-c-0a38b39c-7373-11e9-912a-e2e853b4b660"); // Start PubNub.
      Serial.println("PubNub connected.");
    }
}
 
void loop() {
    if (digitalRead(9) == HIGH) {
      Serial.println("Button pressed.");
      char msg[] = "{\"event\":{\"button\":\"pressed\"},\"pn_apns\":{\"aps\":{\"alert\":\"Someone is at the door.\"}},\"pn_gcm\":{\"notification\":{\"body\":\"Someone is at the door.\"}}}";
      //char msg[] = "{\"event\":{\"button\":\"pressed\"}}";
      WiFiClient* client = PubNub.publish("smart_buttons", msg); // Publish message.
      if (0 == client) {
          Serial.println("Error publishing message.");
          delay(1000);
          return;
      }
      client->stop();
      delay(1000);
    }
    delay(100);
 }
