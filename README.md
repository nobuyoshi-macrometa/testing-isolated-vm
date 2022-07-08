# `isolated-vm` testing
This repository contains scripts and additional notes related to the test scenarios described below.

## Test Scenarios
### Scenario 1
- Create 100 isolates using `isolated-vm` in a Node.js worker pool. Use 128MB for each isolate.
- Measure total memory consumed by Node.js after all isolates are instatiated.

### Scenario 2
- Create 100 isolates using `isolated-vm` in a Node.js worker pool. Use 128MB for each isolate.
- In each isolate `compileScriptSync` a JS script. Use the following [function](https://developers.cloudflare.com/workers/examples/geolocation-app-weather/).
- Measure the maximum memory consumed by Node.js after all isolates compile the scripts.

### Scenario 3
- Create 100 isolates using `isolated-vm` in a Node.js worker pool. Use 128MB for each isolate.
- In each isolate `compileScriptSync` a JS script. Use the following [function](https://developers.cloudflare.com/workers/examples/geolocation-app-weather/).
- In each isolate, run the compiled script. 
- Automatically terminate an isolate if execution takes more than 50ms. 
- Measure maximum memory consumed by Node.js in the entire operation.

## How to install and use `pm2` monitor

- Signup for https://app.pm2.io
- Create new bucket for testing 
- On top right, click on "connect" button 
- Follow the steps mentioned under the "connect" tab up to step 2
- Once you link to the `pm2` (step 2), run the following command in your terminal:  
  ```
  pm2 start scenario-3 --fresh --no-autorestart
  ```
  Instead of `scenario-3` you can use any other scenario
- Now you can see the live monitoring for your script in `pm2` dashboard!
​
## Test Results 

### Scenario 1 [:link:](./scenario-1/main.js)
Total memory used by Node.js: **48 MB**
![scenario-1](./images/scenario-1.png)
​
### Scenario 2 [:link:](./scenario-2/main.js)
Total memory used: **153 MB**
![scenario-2](./images/scenario-2.png)
​
### Scenario 3 [:link:](./scenario-3/main.js)
Total memory used: **196 MB**  
![scenario-3](./images/scenario-3.png)

### Scenario 4 [:link:](./scenario-4/main.js)
| Step | Max CPU | Max Memory |
| --- | --- | --- |
|Initial state (Node.js + `isolated-vm` loaded) | 22% | 47 MB |  
|Step-A (creating 100 Isolates) | 28% | 133 MB |
|Step-B (compiling codes in each Isolate) | 13% | 152 MB |
|Step-C (running scripts in each Isolate) | 42% | 168 MB |


Initial State
![scenario-4](./images/scenario-4-initial-state.png)

Step-A (creating 100 Isolates)
![scenario-4A](./images/scenario-4A-isolate-instances.png)

Step-B (compiling codes in each Isolate)
![scenario-4B](./images/scenario-4B-compiled-functions.png)

Step-C (running scripts in each Isolate)
![scenario-4C](./images/scenario-4C-run-scripts.png)