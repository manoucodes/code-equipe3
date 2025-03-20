export interface GatlingTestResult {
  simulation: string;
  simulationId: string;
  start: number;
  description: string;
  scenarios: string[];
  assertions: GatlingAssertionResult[];
}

export interface GatlingAssertionResult {
  message: string;
  path: string;
  target: string;
  condition: string;
  result: boolean; // True = Passed, False = Failed
  actualValue: number[];
  expectedValues: number[];
}

export interface ApiResponse {
  message: string;
  testResult: GatlingTestResult;
}
