import numpy as np
from ortools.graph.python import max_flow, min_cost_flow


def maxflow(start_nodes, end_nodes, capacities, source, sink):
    """
    Solves max flow problem
    start_nodes: starting node for each arc
    end_nodes: ending node for each arc
    capacities: capacity of each arc
    source: source node
    sink: sink node
    """
    try:
        # Initialize data
        start_nodes = np.array(start_nodes)
        end_nodes = np.array(end_nodes)
        capacities = np.array(capacities)

        # Instantiate a SimpleMaxFlow solver.
        smf = max_flow.SimpleMaxFlow()

        # Add arcs.
        all_arcs = smf.add_arcs_with_capacity(start_nodes, end_nodes, capacities)

        # Find the maximum flow between source and sink.
        solution = smf.solve(source, sink)

        # Return results
        if solution == smf.INFEASIBLE:
            return {"Result": "Success", "Solution": "Infeasible"}
        if solution == smf.OPTIMAL or solution == smf.FEASIBLE:
            return {
                "Result": "Success",
                "Optimal": solution == smf.OPTIMAL,
                "MaxFlow": smf.optimal_flow(),
                "ArcFlows": smf.flows(all_arcs).tolist(),
                "SourceSideMinCut": smf.get_source_side_min_cut(),
                "SinkSideMinCut": smf.get_sink_side_min_cut()
            }
        return {"Result": "Failure"}
        
    except Exception as e:
        return {"Result": "Error", "Message": str(e)}
    

def mincostflow(start_nodes, end_nodes, capacities, unit_costs, supplies):
    '''
    Solves min cost flow problem.
    start_nodes: starting node for each arc
    end_nodes: ending node for each arc
    capacities: capacity of each arc
    unit_costs: unit cost of each arc
    supplies: supplies and demands of nodes. A negative value refers to a demand.
    '''
    try:
        # Instantiate a SimpleMinCostFlow solver.
        smcf = min_cost_flow.SimpleMinCostFlow()

        # Initialize data
        start_nodes = np.array(start_nodes)
        end_nodes = np.array(end_nodes)
        capacities = np.array(capacities)
        unit_costs = np.array(unit_costs)

        # Add arcs, capacities and costs in bulk using numpy.
        all_arcs = smcf.add_arcs_with_capacity_and_unit_cost(
            start_nodes, end_nodes, capacities, unit_costs
        )

        # Add supply for each nodes.
        smcf.set_nodes_supplies(np.arange(0, len(supplies)), supplies)

        # Find the min cost flow.
        solution = smcf.solve()

        # Return results
        if solution == smcf.INFEASIBLE:
            return {"Result": "Success", "Solution": "Infeasible"}
        if solution == smcf.OPTIMAL or solution == smcf.FEASIBLE:
            return {
                "Result": "Success",
                "Optimal": solution == smcf.OPTIMAL,
                "MinCost": smcf.optimal_cost(),
                "ArcFlows": smcf.flows(all_arcs).tolist(),
                "ArcCosts": smcf.flows(all_arcs).tolist()*unit_costs
            }
        
        return {"Result": "Failure"}
    except Exception as e:
        return {"Result": "Error", "Message": str(e)}