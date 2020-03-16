const int sensorPin = A0;
const float baselineTemp = 20.0f;

int prevTemp;

void setup() {
  Serial.begin(9600);

}

void loop() {
  int sensorVal = analogRead(sensorPin);
 
  if (prevTemp > sensorVal + 15 || prevTemp < sensorVal - 15)
  {
    float voltage = (sensorVal/1024.0) * 5.0;
    float temp = (voltage - .5) * 100;
    Serial.println(temp);
  }

  prevTemp = sensorVal;
}
