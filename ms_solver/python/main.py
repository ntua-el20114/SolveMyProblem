import json
import os
import sys
from solver import *

def main():
    """Selects suitable solver and runs it."""
    problem_type = sys.argv[1]
    problem_data = json.loads(sys.argv[2])
    print("Problem type:", problem_type)

    if problem_type == "routing":
        try:
            result = routing.solve(problem_data['Locations'], 
                        problem_data['NumVehicles'], 
                        problem_data['Depot'], 
                        problem_data['MaxDistance'])
        except KeyError:
            print("Error: Wrong arguments provided.")
            sys.exit(1)
        print(result)

if __name__ == "__main__":
    main()