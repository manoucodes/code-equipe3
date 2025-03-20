import {GatlingRequest} from "../performance-test-api/gatling-api/gatling-request";

export const GATLING_SCENARIOS = [

  {
    name: "HTTP Small Company Smoke Test",
    config: new GatlingRequest({ testScenarioName: "ScenarioName", testRequestName: "", testUsersNumber: 5})
  }

];
