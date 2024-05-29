import json
import os
import sys
from solver import *

def main():
    """Selects suitable solver and runs it."""
    problem_type = sys.argv[1]
    problem_data = json.loads(sys.argv[2])
    print("Problem type:", problem_type)

    try:
        if problem_type == "VRP":
            result = routing.vrp(problem_data['Locations'], 
                                 problem_data['NumVehicles'], 
                                 problem_data['Depot'], 
                                 problem_data['MaxDistance'],
                                 problem_data['DistanceSlack'])
        elif problem_type == "CVRP":
            result = routing.cvrp(problem_data['Locations'], 
                                  problem_data['Demands'],
                                  problem_data['NumVehicles'],
                                  problem_data['VehicleCapacities'],
                                  problem_data['Depot'], 
                                  problem_data['MaxDistance'],
                                  problem_data["DistanceSlack"])
    except KeyError:
        result = "Error: Wrong arguments provided."
    print(result)

if __name__ == "__main__":
    main()