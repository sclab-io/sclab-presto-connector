import { MQTT_TOPIC, PrestoClient, QueryItem } from './config/index';
import mqtt from 'mqtt';
import { logger } from './utils/logger';

export class IOTItem {
  init(client: mqtt.Client, queryItem: QueryItem) {
    const topic: string = `${MQTT_TOPIC}${queryItem.topic}`;
    logger.info(`MQTT push query generated: ${topic}`);

    const func = async () => {
      let rows = [];
      PrestoClient.execute({
        query: queryItem.query,
        state: function (error, query_id, stats) {
          if (error) {
            return;
          }
          logger.debug({ message: 'status changed', id: query_id, stats: stats });
        },
        columns: function (error, data) {
          if (error) {
            return;
          }
          logger.debug(data);
        },
        data: function (error, data, columns, stats) {
          if (error) {
            return;
          }
          logger.debug(data);
          for (let i = 0; i < data.length; i++) {
            const obj = {};
            for (let j = 0; j < columns.length; j++) {
              obj[columns[j].name] = data[i][j];
            }

            rows.push(obj);
          }
        },
        success: function (error, stats) {
          if (error) {
            return;
          }
          logger.debug(stats);
          const data = JSON.stringify({
            rows,
          });
          client.publish(topic, Buffer.from(data, 'utf-8'));
          logger.info(`topic: ${topic}, data: ${data}`);
          rows = null;
        },
        error: function (error) {
          logger.error(error);
          rows = null;
        },
      });

      setTimeout(func, queryItem.interval);
    };

    setTimeout(func, queryItem.interval);
  }
}
