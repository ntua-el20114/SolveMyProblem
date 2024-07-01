# NTUA ECE SAAS 2024 PROJECT SolveMyProblem
  
## TEAM (40)

| Name | Α.Μ. |
| --- | --- |
| Mike | 03120114 |
| Nick | 03120014 |
| Tereza | 03120403 |


### Dependencies:

- Nodejs 20.15.0+
- Java (for kafka)
- kafka 2.13-3.7.0
- Python latest version
- mysql server

To run the app you need to:
- Start mysql server
- Start Zookeeper and Kafka server (commands below)
- run ```./install_deps.sh``` to install node and python modules
- Start all microservices
- Visit localhost:3000 to interact with the frontend

inside: /kafka_2.13-3.7.0, do: (in separate terminals)

```console
bin/zookeeper-server-start.sh config/zookeeper.properties
```
```console
bin/kafka-server-start.sh config/server.properties
```