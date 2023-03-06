SCLAB Presto/Trino Connector
==============================

# Introduction
This connector provides functionality for retrieving data using Presto/Trino in SCLAB Studio.

## Features
- Automatic generation of API endpoint
- API security using JWT token
- Automatic MQTT connection and message transmission
- Processing of data into JSON format

By adding a query in the format of "QUERY_1=mqtt;query;topic;interval ms" to the .env file, SQL is automatically executed to connect and retrieve data from SCLAB.

Two methods are supported: MQTT and API, each with a different variable format:

## mqtt method format:
QUERY_#=mqtt;SQL Query;topic;interval MS

## api method format:
QUERY_#=api;SQL Query;Endpoint URL

# usage

## clone source
~~~bash
$ git clone https://github.com/sclab-io/sclab-presto-connector
~~~

## create JWT key file for API
~~~bash
$ mkdir jwt
$ ssh-keygen -t rsa -b 4096 -m PEM -f ./jwt/jwtRS256.key
# empty passphrase - just press enter
$ openssl rsa -in ./jwt/jwtRS256.key -pubout -outform PEM -out ./jwt/jwtRS256.key.pub
~~~

## create .env.production.local
~~~bash
$ vi .env.production.local

# Presto/Trino Connection
PRESTO_HOST=trino
PRESTO_PORT=8080
PRESTO_USER=sclab-trino-client

# BASIC AUTH
PRESTO_AUTH=BASIC
PRESTO_BASIC_USER=user
#PRESTO_BASIC_PASSWORD=password

# CUSTOM AUTH
#PRESTO_AUTH=CUSTOM
#PRESTO_CUSTOM_AUTH=Sets HTTP Authorization header with the provided string.

# SCLAB IoT (Remove this environment if you do not need to use MQTT)
MQTT_TOPIC=yourtopic/
MQTT_HOST=yourhost
MQTT_CLIENT_ID=your-client-id/1
MQTT_ID=your-id
MQTT_PASSWORD=your-password

# QUERY_#=mqtt;query;topic;interval ms
# QUERY_#=api;query;endPoint
QUERY_0=mqtt;SELECT ROUND( RAND() * 100 ) AS value, NOW() AS datetime;test0;1000
QUERY_1=mqtt;SELECT ROUND( RAND() * 1000 ) AS value, NOW() AS datetime;test1;5000
QUERY_2=api;SELECT ROUND( RAND() * 100 ) AS value, NOW() AS datetime;/api/1
QUERY_3=api;SELECT ROUND( RAND() * 1000 ) AS value, NOW() AS datetime;/api/2

# PORT
PORT=3000

# TOKEN
SECRET_KEY=secretKey
JWT_PRIVATE_KEY_PATH=./jwt/jwtRS256.key
JWT_PUBLIC_KEY_PATH=./jwt/jwtRS256.key.pub

# LOG
LOG_FORMAT=combined
LOG_DIR=../logs

# CORS
ORIGIN=your.domain.com
CREDENTIALS=true
~~~

## start
~~~bash
# docker compose
$ ./run.sh

# nodejs
$ npm run start

# pm2
$ npm run deploy:prod
~~~

## stop
~~~bash
# docker compose
$ ./stop.sh

# pm2
$ ./node_modules/pm2/bin/pm2 stop 0
~~~

## logs
~~~bash
$ ./logs.sh
~~~

## access API end point
To access the API, you need to include authorization information in the Request Header in the following format:

~~~
authorization: JWT yourkey
~~~

You can find your key information through the logs.