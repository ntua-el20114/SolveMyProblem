from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from math import radians, sin, cos, sqrt, atan2

def test():
    print("Hello from routing.py")

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

def create_data_model(locations, num_vehicles, depot, demands=None):
    """Stores the data for the problem."""
    data = {}
    data["distance_matrix"] = calculate_distance_matrix(locations)
    data["num_vehicles"] = num_vehicles
    data["depot"] = depot
    return data

def solution_data(data, manager, routing, solution):
    """Returns solution data in dictionary format."""
    print("Data: ", data)

    solution_data = {"Result": "Success",
                     "ObjectiveValue": solution.ObjectiveValue()}
    
    # Store vehicle routes and distances
    routes = []
    max_route_distance = 0
    for vehicle_id in range(data["num_vehicles"]):
        index = routing.Start(vehicle_id)
        # plan_output = f"Route for vehicle {vehicle_id}:\n"
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
    solution_data["Routes"] = routes
    solution_data["MaxRouteDistance"] = max_route_distance
    
    return solution_data

def add_constraints(routing, constraints, transit_callback_index):
    """Add constraints to the routing model."""

    # Add Distance constraint.
    if constraints["MaxDistance"] is not None:
        max_distance = constraints["MaxDistance"]
        dimension_name = "Distance"
        routing.AddDimension(
            transit_callback_index,
            0,  # no slack
            max_distance,  # vehicle maximum travel distance
            True,  # start cumul to zero
            dimension_name,
        )
        distance_dimension = routing.GetDimensionOrDie(dimension_name)
        distance_dimension.SetGlobalSpanCostCoefficient(100)

def solve(locations, num_vehicles, depot, constraints):
    """
    Entry point of the module.
    locations, num_vehicles and depot are nessary arguments.
    The suitable problem constrains are applied accoding to the constraints dictionary.
    If demands are provided, calculates demands callback.
    """

    try:
        # Instantiate the problem data.
        data = create_data_model(locations, num_vehicles, depot)

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

        # Add given constraints.
        add_constraints(routing, constraints, transit_callback_index)

        # Setting first solution heuristic.
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )

        # Solve the problem.
        solution = routing.SolveWithParameters(search_parameters)

        # Print solution on console.
        if solution:
            return solution_data({**data, **constraints}, manager, routing, solution)
        else:
            return {"Result": "Failure"}
        
    except Exception as e:
            result = {"Result": "Error", "Message": str(e)}