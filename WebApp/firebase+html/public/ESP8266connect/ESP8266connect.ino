#include "DHT.h"
#define DHTPIN 2 
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
DHT dht(DHTPIN, DHTTYPE);

#include <FirebaseArduino.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

#define FIREBASE_HOST "humidibot-8a6ff.firebaseio.com"
#define FIREBASE_AUTH "E5upxJETRui3YOp2bXhyla7iSwF5bHwBTcvo1lPi"
#define WIFI_SSID "OMEGALUL-2.4G"
#define WIFI_PASSWORD "micro842"

String myString;

void setup(void) {
  //Setup
  dht.begin();
  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  
  Firebase.begin(FIREBASE_HOST);
  
}

void loop(void) {
   String currentUser = Firebase.getString("currentUser");
   if (Firebase.failed()) {
        Serial.print("setting /getString failed:");
        Serial.println(Firebase.error());
        return;
  }
   String humidPath = "users/" + currentUser + "/rooms/latestHumid";
   String tempPath = "users/" + currentUser + "/rooms/latestTemp";
   float c = dht.readTemperature();// Read temperature as Celsius (the default)
   float h = dht.readHumidity();// Reading humidity 
   float f = dht.readTemperature(true);// Read temperature as Fahrenheit (isFahrenheit = true)
    if (isnan(h) || isnan(f)) {
      Serial.println("Readings Error");
      delay(2000);
      return;
   }
    
  String humidity = String(h);
  String temperature = String(f); 
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" *F Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
  Firebase.setString(humidPath,humidity);
  Firebase.setString(tempPath,temperature);
  

  
  
  delay(2000);

  
}
 