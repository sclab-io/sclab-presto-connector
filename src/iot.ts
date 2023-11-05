import { MQTT_CLIENT_ID, MQTT_HOST, MQTT_ID, MQTT_PASSWORD, MQTT_TOPIC, QueryItem, QueryItems, QueryType } from './config';
import { Routes } from './interfaces/routes.interface';
import { IOTItem } from './iotItem';
import APIRoute from './routes/api_route';
import { logger } from './utils/logger';
import mqtt from 'mqtt';

export class IOT {
  client?: mqtt.MqttClient;
  isStarted: boolean = false;

  init() {
    if (!(MQTT_HOST && MQTT_ID && MQTT_PASSWORD && MQTT_TOPIC && MQTT_CLIENT_ID)) {
      logger.info('MQTT service did not start. Environment variables are empty.');
      return;
    }

    const options: any = {
      clientId: MQTT_CLIENT_ID,
      rejectUnauthorized: false,
      username: MQTT_ID,
      password: MQTT_PASSWORD,
      keepAlive: 60,
      reconnectPeriod: 10 * 1000,
      connectTimeout: 30 * 1000,
      clean: true,
    };
    this.client = mqtt.connect(process.env.MQTT_HOST, options);
    this.client.on('connect', () => {
      logger.info('MQTT Server connected');
      if (this.isStarted) {
        return;
      }
      this.isStarted = true;
      this.start();
    });

    this.client.on('close', () => {
      logger.info('MQTT Service close');
    });

    this.client.on('disconnect', () => {
      logger.info('MQTT Service disconnect');
    });

    this.client.on('offline', () => {
      logger.info('MQTT Service offline');
    });

    this.client.on('error', err => {
      console.error(err);
    });
  }

  start() {
    logger.info('Start MQTT');

    for (let i: number = 0; i < QueryItems.length; i++) {
      const queryItem: QueryItem = QueryItems[i];
      if (queryItem.type === QueryType.MQTT) {
        const iotItem: IOTItem = new IOTItem();
        iotItem.init(this.client!, queryItem);
      }
    }
  }
}
