# homebridge-mqtt-temperature-tasmota

Plugin to HomeBridge optimized for work with Itead Sonoff and Electrodragon Relay Board hardware and firmware [Sonoff-Tasmota](https://github.com/arendst/Sonoff-Tasmota) via MQTT. It acts as a themperature monitor for DS18B20, DHT22, DHT11, AM2301, AM2302 sensors.

Like this? Please buy me a beer (or coffee) ;-) <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=CK56Q7SFHEHSW"><img src="http://macwyznawca.pl/donate-paypal2.png" alt="Donate a coder" data-canonical-src="http://macwyznawca.pl/donate-paypal.svg" style="max-width:100%;"></a>

[MacWyznawca.pl](http://macwyznawca.pl) Jaromir Kopp

Installation
--------------------
    sudo npm install -g homebridge-mqtt-temperature-tasmota

Sample HomeBridge Configuration (complete)
--------------------

{
	
    "bridge": {
        "name": "Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "031-45-154"
    },
    
    "description": "This is an example configuration file. You can use this as a template for creating your own configuration file.",

    "platforms": [],
	
	"accessories": [
		{
			"accessory": "mqtt-temperature-tasmota",

			"name": "NAME OF THIS ACCESSORY",
	
			"url": "mqtt://MQTT-ADDRESS",
			"username": "MQTT USER NAME",
			"password": "MQTT PASSWORD",

			"topic": "tele/sonoff/SENSOR",

			"activityTopic": "tele/sonoff/LWT",
			"activityParameter": "Online",

			"startCmd": "cmnd/sonoff/TelePeriod",
			"startParameter": "120",

			"manufacturer": "ITEAD",
			"model": "Sonoff TH",
			"serialNumberMAC": "MAC OR SERIAL NUMBER"

		}
	]
}

Sample HomeBridge Configuration (minimal)
--------------------

{
	
    "bridge": {
        "name": "Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "031-45-154"
    },
    
    "description": "This is an example minimal configuration file. You can use this as a template for creating your own configuration file.",

    "platforms": [],
	
	"accessories": [
		{
			"accessory": "mqtt-temperature-tasmota",

			"name": "NAME OF THIS ACCESSORY",
	
			"url": "mqtt://MQTT-ADDRESS",
			"username": "MQTT USER NAME",
			"password": "MQTT PASSWORD",

			"topic": "tele/sonoff/SENSOR"

		}
	]
}

# Description of the configuration file.

**sonoff** in topic - topics name of Your Sonoff switch.

**"topic"** - telemetry topic (for sensors data)

**"activityTopic": "tele/sonoff/LWT"** - last will topic for check online state.

**"activityParameter": "Online"** - last will payload for online state.

**"startCmd": "cmnd/sonoff/TelePeriod"** -  command sent after the connection.

**"startParameter": "60"** - payload for **startCmd**.

