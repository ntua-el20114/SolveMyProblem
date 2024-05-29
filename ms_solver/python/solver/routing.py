from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from math import radians, sin, cos, sqrt, atan2

MAX_SOLUTIONS = 100 # Maximum number of solutions to find

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate the great-circle distance between two points on the Earth's surface."""
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = 6371 * c  # Earth radius in kilometers
    return int(round(1000 * distance))

def calculate_distance_matrix(locations):
    """Calculate distance matrix based on Manhattan distance."""
    num_locations = len(locations)
    distance_matrix = [[0]*num_locations for _ in range(num_locations)]

    for i in range(num_locations):
        for j in range(num_locations):
            lat1, lon1 = locations[i]['Latitude'], locations[i]['Longitude']
            lat2, lon2 = locations[j]['Latitude'], locations[j]['Longitude']
            distance_matrix[i][j] = haversine_distance(lat1, lon1, lat2, lon2)
    return distance_matrix

def solution_data(data, manager, routing, solution):
    """Returns solution data in dictionary format."""

    solution_data = {"Result": "Success",
                     "ObjectiveValue": solution.ObjectiveValue()}
    
    # Store vehicle routes and distances
    routes = []
    max_route_distance = 0
    total_distance = 0
    for vehicle_id in range(data["num_vehicles"]):
        index = routing.Start(vehicle_id)
        vehicle = vehicle_id
        route = []
        route_distance = 0
        while not routing.IsEnd(index):
            route.append(manager.IndexToNode(index))
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(
                previous_index, index, vehicle_id
            )
        route.append(manager.IndexToNode(index))
        
        routes.append({"Vehicle": vehicle, "Route": route, "Distance": route_distance})
        max_route_distance = max(route_distance, max_route_distance)
        total_distance += route_distance
    solution_data["Routes"] = routes
    solution_data["MaxRouteDistance"] = max_route_distance
    solution_data["TotalDistance"] = total_distance

    # If CVRP, store route loads
    if "demands" in data:
        max_route_load = 0
        total_load = 0
        for vehicle_id in range(data["num_vehicles"]):
            index = routing.Start(vehicle_id)
            load = 0
            while not routing.IsEnd(index):
                node_index = manager.IndexToNode(index)
                load += data["demands"][node_index]
                previous_index = index
                index = solution.Value(routing.NextVar(index))
            node_index = manager.IndexToNode(index)
            load += data["demands"][node_index]
            solution_data["Routes"][vehicle_id]["Load"] = load
            max_route_load = max(load, max_route_load)
            total_load += load
        solution_data["MaxRouteLoad"] = max_route_load
        solution_data["TotalLoad"] = total_load

    return solution_data

def vrp(locations, num_vehicles, depot, max_distance=None, dis_slack=None):
    """
    Solves the Vehicle Routing Problem.
    """
    # Initialize optional variables
    if max_distance is None: max_distance = int(2**63-1) # max int value
    if dis_slack is None: dis_slack = 0

    # Set max solutions limit
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.solution_limit = MAX_SOLUTIONS

    try:
        # Instantiate the problem data.
        data = {}
        data["distance_matrix"] = calculate_distance_matrix(locations)
        data["num_vehicles"] = num_vehicles
        data["depot"] = depot

        # Create the routing index manager.
        manager = pywrapcp.RoutingIndexManager(
            len(data["distance_matrix"]), data["num_vehicles"], data["depot"]
        )

        # Create Routing Model.
        routing = pywrapcp.RoutingModel(manager)

        # Create and register a transit callback.
        def distance_callback(from_index, to_index):
            """Returns the distance between the two nodes."""
            # Convert from routing variable Index to distance matrix NodeIndex.
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return data["distance_matrix"][from_node][to_node]
        transit_callback_index = routing.RegisterTransitCallback(distance_callback)

        # Define cost of each arc.
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        # Add distance constraint.
        print("Max distance: ", max_distance)
        dimension_name = "Distance"
        routing.AddDimension(
            transit_callback_index,
            dis_slack,  # slack
            max_distance,  # vehicle maximum travel distance
            True,  # start cumul to zero
            dimension_name,
        )
        distance_dimension = routing.GetDimensionOrDie(dimension_name)
        distance_dimension.SetGlobalSpanCostCoefficient(100)

        # Setting first solution heuristic.
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )

        # Solve the problem.
        solution = routing.SolveWithParameters(search_parameters)

        # Return solution.
        if solution:
            return solution_data(data, manager, routing, solution)
        else:
            return {"Result": "Failure"}
        
    except Exception as e:
            return {"Result": "Error", "Message": str(e)}
    
def cvrp(locations, demands, num_vehicles, capacities, depot, max_distance=None, dis_slack=None):
    """
    Solves the Capacitated Vehicle Routing Problem.
    locations: list of dictionaries with keys 'Latitude' and 'Longitude' of each location
    demands: list of demands for each location !WARNING: the depot must have demand 0
    num_vehicles: number of vehicles
    capacities: list of vehicle capacities
    depot: depot location index
    max_distance: maximum distance that a vehicle can travel (optional)
    dis_slack: slack for distance constraint (optional)
    """
    # Initialize optional variables
    if max_distance is None: max_distance = int(2**63-1) # max int value
    if dis_slack is None: dis_slack = 0
    if cap_slack is None: cap_slack = 0

    # Set max solutions limit
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.solution_limit = MAX_SOLUTIONS

    try:
        # Instantiate the problem data.
        data = {}
        data["distance_matrix"] = calculate_distance_matrix(locations)
        data["demands"] = demands
        data["vehicle_capacities"] = capacities
        data["num_vehicles"] = num_vehicles
        data["depot"] = depot

        # Create the routing index manager.
        manager = pywrapcp.RoutingIndexManager(
            len(data["distance_matrix"]), data["num_vehicles"], data["depot"]
        )

        # Create Routing Model.
        routing = pywrapcp.RoutingModel(manager)

        # Create and register a transit callback.
        def distance_callback(from_index, to_index):
            """Returns the distance between the two nodes."""
            # Convert from routing variable Index to distance matrix NodeIndex.
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return data["distance_matrix"][from_node][to_node]
        transit_callback_index = routing.RegisterTransitCallback(distance_callback)

        # Define cost of each arc.
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        # Add Capacity constraint.
        def demand_callback(from_index):
            """Returns the demand of the node."""
            # Convert from routing variable Index to demands NodeIndex.
            from_node = manager.IndexToNode(from_index)
            return data["demands"][from_node]
        demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
        routing.AddDimensionWithVehicleCapacity(
            demand_callback_index,
            0,  # null capacity slack
            data["vehicle_capacities"],  # vehicle maximum capacities
            True,  # start cumul to zero
            "Capacity",
    )

        # Add distance constraint.
        dimension_name = "Distance"
        routing.AddDimension(
            transit_callback_index,
            0,  # slack
            max_distance,  # vehicle maximum travel distance
            True,  # start cumul to zero
            dimension_name,
        )
        distance_dimension = routing.GetDimensionOrDie(dimension_name)
        distance_dimension.SetGlobalSpanCostCoefficient(100)

        # Setting first solution heuristic.
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        search_parameters.time_limit.FromSeconds(1)


        # Solve the problem.
        solution = routing.SolveWithParameters(search_parameters)

        # Return solution.
        if solution:
            return solution_data(data, manager, routing, solution)
        else:
            return {"Result": "Failure"}
        
    except Exception as e:
            return {"Result": "Error", "Message": str(e)}