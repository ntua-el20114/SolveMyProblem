#!/bin/bash

# Define an array of microservice directories
MICROSERVICES=("ms_analytics" "ms_choreographer" "ms_data_input" "ms_frontend" "ms_problem_list" "ms_results" "ms_solver")

# Loop through each microservice and install dependencies
for MS in "${MICROSERVICES[@]}"; do
  echo "Installing Node modules for $MS..."
  cd "$MS" && npm install
  cd - > /dev/null
done

echo "All necessary Node modules have been installed."

echo "Installing ortools python module..."
pip install ortools

echo "ortools python module has been installed."