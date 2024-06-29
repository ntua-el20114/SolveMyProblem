# MICROSERVICE

## SOLVER

PORT: 3004

TODO: 
- Remove routes/dummy_data.json before release

NOTES:
- In routing, implementing timeout handling internally allows to return partial results. Maybe we should implement that.

INPUT:
- Allowed null values:
    - VRP:
        - MaxDistance
    - CVRP:
        - MaxDistance
    - VRPTW:
        - MaxTime
        - TimeSlack
    - MaxFlow:
        - none
    - MinCostFlow:
        - none
    - EmpSch:
        - ShiftRequests
        - MinShiftsPerEmployee
        - MaxShiftsPerEmployee
    - JobShop:
        - none

RESULTS:
- Success
    - The solver found an optimal or non-optimal solution.
    - The solver proved that the problem is infeasible.
- Failure
    - The solver did not encounter an error, but was still unable to solve the problem.
    - _Maybe the time-out error should be included here?_
- Error
    - The solver encountered an error. The error message is returned.
    - Time-out error is included.