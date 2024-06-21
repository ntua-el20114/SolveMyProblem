from typing import Union

from ortools.sat.python import cp_model

def convert_requests(shift_requests, num_employees, num_days, num_shifts):
    """Converts the shift requests from user input format to the format used by the solver."""
    if shift_requests is None:
        return None
    
    shift_requests_converted = [[[0 for s in range(num_shifts)] for d in range(num_days)] for e in range(num_employees)]
    for e, d, s in shift_requests:
        shift_requests_converted[e][d][s] = 1

    return shift_requests_converted

def daily_shifts(shifts, solver, num_employees, num_days, num_shifts):
    """
    Returns a list of the daily shifts
    The index of the list corresponds to the day
    The index of the day list corresponds to the shift
    The value of the shift corresponds to the employee assigned to it
    So in [[3,0], [1, 2]] employee #1 is assigned to the first shift of the second day
    """
    daily_shifts = []
    for d in range(num_days):
        daily_shifts.append([])
        for s in range(num_shifts):
            for e in range(num_employees):
                if solver.Value(shifts[(e, d, s)]) == 1:
                    daily_shifts[d].append(e)
                    break
    return daily_shifts

def employee_scheduling(num_employees, num_shifts, num_days, shift_requests=None):
    """
    Tries to find an optimal assignment of employees to shifts.
    The work load should be evenly distributed among the employees.
    Each employee can request to be assigned to specific shifts.
    The optimal assignment maximizes the number of fulfilled shift requests.
    """
    all_employees = range(num_employees)
    all_shifts = range(num_shifts)
    all_days = range(num_days)

    try:
        # Convert shift requests
        shift_requests = convert_requests(shift_requests, num_employees, num_days, num_shifts)

        # Creates the model.
        model = cp_model.CpModel()

        # Creates shift variables.
        # shifts[(e, d, s)]: employee 'e' works shift 's' on day 'd'.
        shifts = {}
        for e in all_employees:
            for d in all_days:
                for s in all_shifts:
                    shifts[(e, d, s)] = model.new_bool_var(f"shift_n{e}_d{d}_s{s}")

        # Each shift is assigned to exactly one employee.
        for d in all_days:
            for s in all_shifts:
                model.add_exactly_one(shifts[(e, d, s)] for e in all_employees)

        # Each employee works at most one shift per day.
        for e in all_employees:
            for d in all_days:
                model.add_at_most_one(shifts[(e, d, s)] for s in all_shifts)

        # Try to distribute the shifts evenly, so that each employee works
        # min_shifts_per_employee shifts. If this is not possible, because the total
        # number of shifts is not divisible by the number of employees, some employees will
        # be assigned one more shift.
        min_shifts_per_employee = (num_shifts * num_days) // num_employees
        if num_shifts * num_days % num_employees == 0:
            max_shifts_per_employee = min_shifts_per_employee
        else:
            max_shifts_per_employee = min_shifts_per_employee + 1
        for e in all_employees:
            num_shifts_worked: Union[cp_model.LinearExpr, int] = 0
            for d in all_days:
                for s in all_shifts:
                    num_shifts_worked += shifts[(e, d, s)]
            model.add(min_shifts_per_employee <= num_shifts_worked)
            model.add(num_shifts_worked <= max_shifts_per_employee)

        model.maximize(
            sum(
                shift_requests[e][d][s] * shifts[(e, d, s)]
                for e in all_employees
                for d in all_days
                for s in all_shifts
            )
        )

        # Create the solver and solve.
        solver = cp_model.CpSolver()
        status = solver.solve(model)

        if status == cp_model.MODEL_INVALID:
            return {"Result": "Error",
                    "Message": solver.ValidateCpModel(model)}
        if status == cp_model.INFEASIBLE:
            return {"Result": "Success",
                    "Solution": "Infeasible"}
        if status == cp_model.UNKNOWN:
            return {"Result": "Failure"}
        
        return{"Result": "Success",
                "Optimal": status==cp_model.OPTIMAL,
                "Solution": daily_shifts(shifts, solver, num_employees, num_days, num_shifts),
                "RequestsMet": solver.objective_value,
                "Conflicts": solver.NumConflicts(), # Times the solver tried to assign a value to a variable, that would violate a castraint. Portrays the complexity of the problem.
                "Branches": solver.NumBranches()
                }
    
    except Exception as e:
        return {"Result": "Error",
                "Message": str(e)}