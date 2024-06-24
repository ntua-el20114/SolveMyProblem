from typing import Union
import collections
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

def assigned_jobs(jobs_data, solver, all_tasks, all_machines):
    """
    Returns a list of the machines.
    Each machine is a list of dictionaries.
    Each dictionary represents a task.
    """
    assigned_jobs = [[] for _ in all_machines]
    for job_id, job in enumerate(jobs_data):
        for task_id, task in enumerate(job):
            machine = task[0]
            assigned_jobs[machine].append(
                {
                    "start":solver.value(all_tasks[job_id, task_id].start),
                    "job":job_id,
                    "index":task_id,
                    "duration":task[1],
                }
            )
    return assigned_jobs

def employee_scheduling(num_employees, num_shifts, num_days, shift_requests=None,
                        min_shifts_per_employee=None, max_shifts_per_employee=None):
    """
    Tries to find an optimal assignment of employees to shifts.
    Each employee can request to be assigned to specific shifts.
    The optimal assignment maximizes the number of fulfilled shift requests.
    If no minimum and maximum number of shifts is given, they are spread evenly among employees.
    It is assumed that each employee can work at most one shift per day and that each shift is assigned to exactly one employee.

    Returns a list of the work days. Each day is a list of the shifts. Each shift is assigned to an employee's id.
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

        # If no min/max shifts per employee are given, try to distribute shifts evenly
        if min_shifts_per_employee is None:
            min_shifts_per_employee = (num_shifts * num_days) // num_employees
        
        if max_shifts_per_employee is None:
            if num_shifts * num_days % num_employees == 0:
                max_shifts_per_employee = min_shifts_per_employee
            else:
                max_shifts_per_employee = min_shifts_per_employee + 1

        # Add min/max shifts restriction
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
        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            return{"Result": "Success",
                    "Optimal": status==cp_model.OPTIMAL,
                    "Solution": daily_shifts(shifts, solver, num_employees, num_days, num_shifts),
                    "RequestsMet": solver.objective_value,
                    "Conflicts": solver.NumConflicts(), # Times the solver tried to assign a value to a variable, that would violate a castraint. Portrays the complexity of the problem.
                    "Branches": solver.NumBranches()
                    }
        return {"Result": "Failure"}
    
    except Exception as e:
        return {"Result": "Error",
                "Message": str(e)}
    

def job_shop(jobs_data):
    '''
    Solves the Job Shop scheduling problem.
    jobs_data: A list of jobs. Each job is a list of tasks. Each task is a tuple of (machine, duration).
    Each task must be executed after its previous task.
    Each machine can only work at one task at a time.
    The objective is to minimize the makespan, i.e. the time it takes to complete all jobs.

    Returns a list of the machines. Each machine is a list of dictionaries. Each dictionary represents a task.
    '''
    try:
        machines_count = 1 + max(task[0] for job in jobs_data for task in job)
        all_machines = range(machines_count)
        # Computes horizon dynamically as the sum of all durations.
        horizon = sum(task[1] for job in jobs_data for task in job)

        # Create the model.
        model = cp_model.CpModel()

        # Named tuple to store information about created variables.
        task_type = collections.namedtuple("task_type", "start end interval")

        # Creates job intervals and add to the corresponding machine lists.
        all_tasks = {}
        machine_to_intervals = collections.defaultdict(list)

        for job_id, job in enumerate(jobs_data):
            for task_id, task in enumerate(job):
                machine, duration = task
                suffix = f"_{job_id}_{task_id}"
                start_var = model.new_int_var(0, horizon, "start" + suffix)
                end_var = model.new_int_var(0, horizon, "end" + suffix)
                interval_var = model.new_interval_var(
                    start_var, duration, end_var, "interval" + suffix
                )
                all_tasks[job_id, task_id] = task_type(
                    start=start_var, end=end_var, interval=interval_var
                )
                machine_to_intervals[machine].append(interval_var)

        # Create and add disjunctive constraints.
        for machine in all_machines:
            model.add_no_overlap(machine_to_intervals[machine])

        # Precedences inside a job.
        for job_id, job in enumerate(jobs_data):
            for task_id in range(len(job) - 1):
                model.add(
                    all_tasks[job_id, task_id + 1].start >= all_tasks[job_id, task_id].end
                )

        # Makespan objective.
        obj_var = model.new_int_var(0, horizon, "makespan")
        model.add_max_equality(
            obj_var,
            [all_tasks[job_id, len(job) - 1].end for job_id, job in enumerate(jobs_data)],
        )
        model.minimize(obj_var)

        # Creates the solver and solve.
        solver = cp_model.CpSolver()
        status = solver.solve(model)

        # Return results
        if status == cp_model.MODEL_INVALID:
            return {"Result": "Error", "Message": solver.ValidateCpModel(model)}
        if status == cp_model.INFEASIBLE:
            return {"Result": "Success", "Solution": "Infeasible"}
        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            return {"Result": "Success",
                    "Optimal": status==cp_model.OPTIMAL,
                    "Solution": assigned_jobs(jobs_data, solver, all_tasks, all_machines),
                    "Makespan": solver.objective_value, # Total time to complete all jobs
                    "Conflicts": solver.NumConflicts(), # Times the solver tried to assign a value to a variable, that would violate a castraint. Portrays the complexity of the problem.
                    "Branches": solver.NumBranches()}
        else:
            return {"Result": "Failure"}
    
    except Exception as e:
        return {"Result": "Error", "Message": str(e)}