import pandas as pd
from matplotlib import pyplot as plt

# Load CSV data
visit_page = pd.read_csv('results/VisitPage.csv')
data_requests = pd.read_csv('results/DataRequests.csv')
new_problem = pd.read_csv('results/NewProblem.csv')

# Convert timestamp to datetime
visit_page['timeStamp'] = pd.to_datetime(visit_page['timeStamp'], unit='ms')
data_requests['timeStamp'] = pd.to_datetime(data_requests['timeStamp'], unit='ms')
new_problem['timeStamp'] = pd.to_datetime(new_problem['timeStamp'], unit='ms')

# Calculate the number of failures for each dataset
visit_page_failures = visit_page[visit_page['success'] == False].shape[0]
data_requests_failures = data_requests[data_requests['success'] == False].shape[0]
new_problem_failures = new_problem[new_problem['success'] == False].shape[0]

# Plot response performance
plt.figure(figsize=(10, 6))
plt.title('Time Elapsed vs timestamp')
plt.scatter(visit_page['timeStamp'], visit_page['elapsed'], s=5.0, label = 'visit page')
plt.scatter(data_requests['timeStamp'], data_requests['elapsed'], s=5.0, label = 'data requests')
plt.scatter(new_problem['timeStamp'], new_problem['elapsed'], s=5.0, label = 'new problem')
plt.ylabel('Time Elapsed (ms)')
plt.xlabel('Timestamp')
plt.legend()

# Add text box with failure counts
textstr = '\n'.join((
    f'Visit Page Failures: {visit_page_failures}',
    f'Data Requests Failures: {data_requests_failures}',
    f'New Problem Failures: {new_problem_failures}',
))
plt.text(0.05, 0.95, textstr, transform=plt.gca().transAxes, fontsize=12,
         verticalalignment='top', bbox=dict(facecolor='white', alpha=0.5))

# Export plot image
plt.savefig('results/elapsed.png')