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
                                 problem_data['MaxDistance'])
        elif problem_type == "CVRP":
            result = routing.cvrp(problem_data['Locations'], 
                                  problem_data['Demands'],
                                  problem_data['NumVehicles'],
                                  problem_data['VehicleCapacities'],
                                  problem_data['Depot'], 
                                  problem_data['MaxDistance'])
        elif problem_type == "VRPTW":
            result = routing.vrptw(problem_data['Locations'], 
                                   problem_data['TimeWindows'],
                                   problem_data['Speed'],
                                   problem_data['NumVehicles'],
                                   problem_data['Depot'],
                                   problem_data['MaxTime'],
                                   problem_data['TimeSlack'])
        elif problem_type == "MaxFlow":
            result = flows.maxflow(problem_data["StartNodes"],
                                   problem_data["EndNodes"],
                                   problem_data["Capacities"],
                                   problem_data["Source"],
                                   problem_data["Sink"])
        elif problem_type == "MinCostFlow":
            result = flows.mincostflow(problem_data["StartNodes"],
                                       problem_data["EndNodes"],
                                       problem_data["Capacities"],
                                       problem_data["UnitCosts"],
                                       problem_data["Supplies"])
        elif problem_type == "EmpSch":
            result = scheduling.employee_scheduling(problem_data["NumEmployees"],
                                                    problem_data["NumShifts"],
                                                    problem_data["NumDays"],
                                                    problem_data["ShiftRequests"],
                                                    problem_data["MinShiftsPerEmployee"],
                                                    problem_data["MaxShiftsPerEmployee"])
        elif problem_type == "JobShop":
            result = scheduling.job_shop(problem_data["JobsData"])
    except KeyError:
        result = "Error: Wrong arguments provided."
    except Exception as e:
        result = f"Error: {e}"
    print(result)
    exit(0)

if __name__ == "__main__":
    main()