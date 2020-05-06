// written by: Alex Malynovsky
// tested by: Omar Faheem, Nathaniel Glikman
// debugged by: Gregory Giovannini

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
#define WIFI_SSID "SoftEng"
#define WIFI_PASSWORD "group9pw"

String wifissid = WIFI_SSID;
bool sensorBool;
int sensorNum;
String sensorBoolPath;
String sensorNumPath;
String macAdd = WiFi.macAddress();

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
  Serial.print("Printing for: ");
  Serial.println(WiFi.macAddress());
  sensorBoolPath = "/ssids/" + wifissid + "/" + macAdd + "/sensorBool";
  sensorNumPath = "/ssids/" + wifissid + "/sensorNum";
  sensorBool = Firebase.getBool(sensorBoolPath); 
  sensorNum = Firebase.getInt(sensorNumPath);
  
  if (sensorNum == 0) {
    Firebase.set(sensorNumPath,0);
    if (Firebase.failed())
      Serial.println("could not set");
  }//unnecessary bit of code, just for safety

  //appending to sensorNum, helping decide how many room nodes to make
  if (sensorBool == false) {
    Firebase.set(sensorBoolPath, true);
    sensorNum++;
    Firebase.set(sensorNumPath,sensorNum);
    if (Firebase.failed())
      Serial.println("could not set");
  }
}

void loop(void) {
  
   String humidPath = "ssids/" + wifissid + "/" + macAdd + "/latestHumid";
   String tempPath = "ssids/" + wifissid + "/" + macAdd + "/latestTemp";
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
 
