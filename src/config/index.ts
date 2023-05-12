import { logger } from '@/utils/logger';
import { config } from 'dotenv';
import presto from 'presto-client';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  JWT_PRIVATE_KEY_PATH,
  JWT_PUBLIC_KEY_PATH,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  PRESTO_HOST,
  PRESTO_PORT,
  PRESTO_USER,
  PRESTO_AUTH,
  PRESTO_BASIC_USER,
  PRESTO_BASIC_PASSWORD,
  PRESTO_CUSTOM_AUTH,
  INTERVAL_MS,
  MQTT_TOPIC,
  MQTT_HOST,
  MQTT_CLIENT_ID,
  MQTT_ID,
  MQTT_PASSWORD,
  SQL_INJECTION,
} = process.env;

export interface QueryItem {
  type: string;
  query: string;
  topic?: string;
  interval?: number;
  endPoint?: string;
}

export const QueryItems: QueryItem[] = [];
export const QueryType: { API: string; MQTT: string } = { API: 'api', MQTT: 'mqtt' };
Object.keys(process.env).forEach(function (key) {
  if (!key.startsWith('QUERY_')) {
    return;
  }

  const queryInfo: Array<string> = process.env[key].split(';');
  const queryType: string = queryInfo[0].toLocaleLowerCase();
  let queryItem: QueryItem;
  switch (queryType) {
    case QueryType.MQTT: {
      queryItem = {
        type: queryType,
        query: queryInfo[1],
        topic: queryInfo[2],
        interval: parseInt(queryInfo[3]),
      };
      break;
    }

    case QueryType.API: {
      queryItem = {
        type: queryType,
        query: queryInfo[1],
        endPoint: queryInfo[2],
      };
      break;
    }
  }

  QueryItems.push(queryItem);
});

// BigInt bug fix to string
BigInt.prototype['toJSON'] = function () {
  if (this > Number.MAX_SAFE_INTEGER) {
    return this.toString();
  }
  return parseInt(this.toString(), 10);
};

let prestoOptions: any = {
  host: PRESTO_HOST,
  port: PRESTO_PORT,
  user: PRESTO_USER,
};

if (PRESTO_AUTH) {
  if (PRESTO_AUTH.toUpperCase() === 'BASIC') {
    prestoOptions.basic_auth = {
      user: PRESTO_BASIC_USER,
      password: PRESTO_BASIC_PASSWORD || '',
    };
  } else if (PRESTO_AUTH.toUpperCase() === 'CUSTOM') {
    prestoOptions.custom_auth = PRESTO_CUSTOM_AUTH || '';
  }
}

export const PrestoClient = new presto.Client(prestoOptions);
