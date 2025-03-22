import {GatlingRequest, ResponseTimePerPercentile} from "../performance-test-api/gatling-api/gatling-request";

export const GATLING_SCENARIOS = [
  {
    name: "DEFAULT",
    config: new GatlingRequest(
      {
        simulationStrategy: "DEFAULT",
        testScenarioName: "",
        testUsersNumber: 3,
        testRampUpDuration: 60,
        assertionMeanResponseTime: 100,
        assertionFailedRequestsPercent: 1,
        assertionsResponseTimePerPercentile: [new ResponseTimePerPercentile(99, 250), new ResponseTimePerPercentile(95, 200)],
      })
  },
  {
    name: "SMOKE_TEST",
    config: new GatlingRequest(
      {
        simulationStrategy: "SMOKE_TEST",
        testScenarioName: "Smoke test",
        testUsersAtOnce: 1,
        assertionMeanResponseTime: 100,
        assertionFailedRequestsPercent: 0,
        assertionsResponseTimePerPercentile: [new ResponseTimePerPercentile(99, 250), new ResponseTimePerPercentile(95, 200)],
      })
  },
  {
    name: "LOAD_TEST",
    config: new GatlingRequest(
      {
        simulationStrategy: "LOAD_TEST",
        testScenarioName: "Load test",
        testUsersNumber: 1000,
        testRampUpDuration: 60,
        assertionMeanResponseTime: 300,
        assertionFailedRequestsPercent: 5,
        assertionsResponseTimePerPercentile: [new ResponseTimePerPercentile(99, 250), new ResponseTimePerPercentile(95, 200)],
      })
  },
  {
    name: "STRESS_TEST",
    config: new GatlingRequest(
      {
        simulationStrategy: "STRESS_TEST",
        testScenarioName: "Stress test",
        testUserRampUpPerSecondMin: 10,
        testUserRampUpPerSecondMax: 300,
        testUserRampUpPerSecondDuration: 150,
        assertionMeanResponseTime: 300,
        assertionFailedRequestsPercent: 5,
        assertionsResponseTimePerPercentile: [new ResponseTimePerPercentile(99, 250), new ResponseTimePerPercentile(95, 200)],
      })
  },
  {
    name: "SPIKE_TEST",
    config: new GatlingRequest(
      {
        simulationStrategy: "SPIKE_TEST",
        testScenarioName: "Spike test",
        testConstantUsers: 100,
        testConstantUsersDuration: 120,
        testUsersAtOnce: 500,
        assertionMeanResponseTime: 200,
        assertionFailedRequestsPercent: 5,
        assertionsResponseTimePerPercentile: [new ResponseTimePerPercentile(99, 250), new ResponseTimePerPercentile(95, 200)],
      })
  }
];
