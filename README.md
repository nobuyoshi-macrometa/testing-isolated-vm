# Testing `isolated-vm`
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
