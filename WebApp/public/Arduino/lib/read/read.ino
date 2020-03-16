int button = 10;
int LED = 11;


void setup() 
{
  Serial.begin(9600);
  pinMode(button, INPUT);
  pinMode(LED, OUTPUT);

}

void loop() 
{
  int state = digitalRead(button);
  Serial.print(state);
  if (state == 1)
  {
    digitalWrite(LED, HIGH);  
  }
  else
    digitalWrite(LED, LOW);
}
