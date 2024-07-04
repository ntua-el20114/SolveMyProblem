#!/bin/bash

# Define base Kafka configurations
KAFKA_CONFIG="KAFKA_BROKER=kafka1:9092 # Use Docker service name for Kafka broker\nKAFKAJS_NO_PARTITIONER_WARNING=1"

# Define base database configurations
DB_CONFIG="DB_USER=tery\nDB_PASSWORD=tery\nDB_HOST=db\nDB_DIALECT=mysql"

# Define specific configurations for each microservice
declare -A microservices_configs
microservices_configs[ms_analytics]="$KAFKA_CONFIG\n$DB_CONFIG\nDB_NAME=analytics_DB"
microservices_configs[ms_frontend]="PORT=3000"
microservices_configs[ms_results]="$KAFKA_CONFIG\n$DB_CONFIG\nDB_NAME=results_DB"
microservices_configs[ms_problem_list]="$KAFKA_CONFIG\n$DB_CONFIG\nDB_NAME=problem_list_DB"
microservices_configs[ms_solver]="$KAFKA_CONFIG"
microservices_configs[ms_data_input]="$KAFKA_CONFIG"
microservices_configs[ms_choreographer]="$KAFKA_CONFIG"

# Loop through each microservice and create the .env file
for ms in "${!microservices_configs[@]}"; do
  if [ -d "$ms" ]; then
    echo -e "${microservices_configs[$ms]}" > "$ms/.env"
    echo "Created $ms/.env"
  else
    echo "Directory $ms does not exist. Skipping."
  fi
done

echo "All .env files have been created successfully."