![alt text](logo.png)

# NTUA ECE SAAS 2024 PROJECT SolveMyProblem
[![License: MIT](https://img.shields.io/badge/License-MIT-brown.svg)](https://github.com/ntua/saas2024-40/blob/main/LICENSE)
![Docker](https://img.shields.io/badge/Docker-25.0.3-blue?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v20.15.0-green?logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-10.7.0-yellow?logo=npm&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.13-red?logo=python&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.4-purple?logo=mysql&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-3.7.1-black?logo=apachekafka&logoColor=white)

SolveMyProblem solves hard algorithmic problems, using efficient algorithms based on the OR Tools library.
Currently the system supports routing, graph flow and scheduling problems. Its multi-threaded architecture allows it to handle multiple problems simultaneously.
As a SolveMyProblem user, you can:

👉 Submit new problems to be solved.

👉 View all your previous problems, along with their solutions presented in a eye-pleasing, dark themed UI.

👉 View various statistics about the submitted problems, through comprehensive graphs.

To submit a new problem, you can choose between filling a form and uploading a json file (although the json file method is highly encouraged).
The solution values of the problem are presented through the UI and can be downloaded in a json format.

## TEAM (40)
| Name | Α.Μ. |
| --- | --- |
| Michael Raftopoulos | 03120114 |
| Nick Oikonomou | 03120014 |
| Tereza Vassiliou | 03120403 |


### Run the web app:
To run the app you need to:

- Clone the repo with `git clone https://github.com/ntua/saas2024-40/`
- Create **.env** files by running `./setup-env.sh` in project folder
- Make sure your local mysql server is down: `systemctl stop mysql`
- Start docker server: `systemctl start docker`
- Run `sudo docker compose up  --build `
- The application should automatically launch on your default browser
- If not, visit the frontend address that appears on your terminal (each time you launch the app, a different address is assigned)

### Input files
You can find templates for the input files in the *json_templates* directory.
For input file examples, you can go to *testing/input_files*.

## Documentation
You can view all UML diagrams and the vpp file, along with the microservices description in the *architecture* directory.

### Stress tests
To perform a stress test, run `jmeter -n -t SolveMyProblem.jmx` within the *jmeter* container by navigating to **/jmeter/testing/** directory.
All test result appear in *testing/results* directory, in the form of csv files.
You may also execute `python testing/plot_results.py` to generate a plot from the csv file results.


## Collaborators

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/ntua-el20114.png" width="50" height="50" alt="Mike Raftopoulos"/>
      <br>
      <a href="https://github.com/ntua-el20114"><b>Mike Raftopoulos</b></a>
    </td>
    <td align="center">
      <img src="https://github.com/ntua-el20403.png" width="50" height="50" alt="Tereza Vassiliou"/>
      <br>
      <a href="https://github.com/ntua-el20403"><b>Tereza Vassiliou</b></a>
    </td>
    <td align="center">
      <img src="https://github.com/ntua-el20014.png" width="50" height="50" alt="Nick Oikonomou"/>
      <br>
      <a href="https://github.com/ntua-el20014"><b>Nick Oikonomou</b></a>
    </td>
  </tr>
</table>
