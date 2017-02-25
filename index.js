// Sonoff-Tasmota Temperature Sensor Accessory plugin for HomeBridge
//
// Remember to add accessory to config.json. Example:
/* 	"accessories": [
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

	}]
*/
// When you attempt to add a device, it will ask for a "PIN code".
// The default code for all HomeBridge accessories is 031-45-154.

var Service, Characteristic;
var mqtt    = require('mqtt');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-mqtt-temperature-tasmota-tasmota", "mqtt-temperature-tasmota", TemperatureTasmotaAccessory);
}

function TemperatureTasmotaAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
    this.manufacturer = config['manufacturer'];
 	this.model = config['model'];
	this.serialNumberMAC = config['serialNumberMAC'];

  this.url = config['url'];
  this.topic = config['topic'];
	if (config["activityTopic"] !== undefined) {
		this.activityTopic = config["activityTopic"];
		this.activityParameter = config["activityParameter"];
	}
	else {
		this.activityTopic = "";
		this.activityParameter = "";
	}

  this.client_Id 		= 'mqttjs_' + Math.random().toString(16).substr(2, 8);7
  this.options = {
    keepalive: 10,
    clientId: this.client_Id,
		protocolId: 'MQTT',
    	protocolVersion: 4,
		clean: true,
		reconnectPeriod: 1000,
		connectTimeout: 30 * 1000,
		will: {
			topic: 'WillMsg',
			payload: 'Connection Closed abnormally..!',
			qos: 0,
			retain: false
		},
		username: config["username"],
		password: config["password"],
		rejectUnauthorized: false
	};

  this.service = new Service.TemperatureSensor(this.name);
   	if(this.activityTopic !== "") {
		this.service.addOptionalCharacteristic(Characteristic.StatusActive);
	}

  this.client  = mqtt.connect(this.url, this.options);
  
  	this.client.on('error', function () {
		that.log('Error event on MQTT');
	});

  // Eksperyment z wymuszaniem statusu
	this.client.on('connect', function () {
		if (config["startCmd"] !== undefined) {
			that.client.publish(config["startCmd"], config["startParameter"] !== undefined ? config["startParameter"] : "");
		}
	});

  	var that = this;
    this.client.subscribe(this.topic);
	if(this.activityTopic !== ""){
		this.client.subscribe(this.activityTopic);
 	}

  	this.client.on('message', function (topic, message) {
		if (topic == that.topic) {
			data = JSON.parse(message);
			if (data === null) {return null}
			if (data.hasOwnProperty("DS18B20")) {
				that.temperature = parseFloat(parseFloat(data.DS18B20.Temperature));
			 }
			 else  if (data.hasOwnProperty("DHT")) { 
				that.temperature = parseFloat(parseFloat(data.DHT.Temperature));
			}
			that.service.setCharacteristic(Characteristic.CurrentTemperature, that.temperature);
		} else if (topic == that.activityTopic) {
			var status = message.toString(); 	
			that.activeStat = (status == that.activityParameter) ;
			that.service.setCharacteristic(Characteristic.StatusActive, that.activeStat);
		}
	});

	this.service
    	.getCharacteristic(Characteristic.CurrentTemperature)
    	.on('get', this.getState.bind(this));
		
	this.service
		.getCharacteristic(Characteristic.CurrentTemperature)
		.setProps({minValue: -50});
                                                
	this.service
		.getCharacteristic(Characteristic.CurrentTemperature)
		.setProps({maxValue: 125});
		
    if(this.activityTopic !== "") {
		this.service
			.getCharacteristic(Characteristic.StatusActive)
			.on('get', this.getStatusActive.bind(this));
    }
}

TemperatureTasmotaAccessory.prototype.getState = function(callback) {
    callback(null, this.temperature);
}

TemperatureTasmotaAccessory.prototype.getStatusActive = function(callback) {
    callback(null, this.activeStat);
}

TemperatureTasmotaAccessory.prototype.getServices = function() {

	var informationService = new Service.AccessoryInformation();

	informationService
		.setCharacteristic(Characteristic.Name, this.name)
		.setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
		.setCharacteristic(Characteristic.Model, this.model)
		.setCharacteristic(Characteristic.SerialNumber, this.serialNumberMAC);

	return [informationService, this.service];
}