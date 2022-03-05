docker run --init --rm -it -p 1883:1883 --name mosquitto -v $(pwd)/mosquitto/config:/mosquitto/config -v $(pwd)/mosquitto/log:/mosquitto/log -v $(pwd)/mosquitto/data/:/mosquitto/data eclipse-mosquitto


