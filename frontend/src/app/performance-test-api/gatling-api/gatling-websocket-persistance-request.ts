export class GatlingWsRequest {
    protocol: string;
    simulationStrategy: string;
    testBaseUrl: string;
    testUsersNumber: number;
    testScenarioName: string;
    testRequestName: string;
    testRequestBody: string;
    assertionMeanResponseTime: number;
    assertionFailedRequestsPercent: number;
    assertionsResponseTimePerPercentile: ResponseTimePerPercentile[];
    threshold: number;
    constructor({
                  protocol = '',
                  simulationStrategy = '',
                  testBaseUrl = '',
                  testUsersNumber = 0,
                  testScenarioName = '',
                  testRequestName = '',
                  testRequestBody = '',
                  assertionMeanResponseTime = 0,
                  assertionFailedRequestsPercent = 0,
                  assertionsResponseTimePerPercentile = [],
                  threshold = 0
                }: {
                    protocol?: string;
                    simulationStrategy?: string;
                    testBaseUrl?: string;
                    testUsersNumber?: number;
                    testScenarioName?: string;
                    testRequestName?: string;
                    testRequestBody?: string;
                    assertionMeanResponseTime?: number;
                    assertionFailedRequestsPercent?: number;
                    threshold?: number;
                    assertionsResponseTimePerPercentile?: ResponseTimePerPercentile[];
                }
    ) {
      this.protocol = protocol;
      this.simulationStrategy = simulationStrategy;
      this.testBaseUrl = testBaseUrl;
      this.testUsersNumber = testUsersNumber;
      this.testScenarioName = testScenarioName;
      this.testRequestName = testRequestName;
      this.testRequestBody = testRequestBody;
      this.assertionMeanResponseTime = assertionMeanResponseTime;
      this.assertionFailedRequestsPercent = assertionFailedRequestsPercent;
      this.assertionsResponseTimePerPercentile = assertionsResponseTimePerPercentile;
      this.threshold = threshold;
    }
  }

  export class ResponseTimePerPercentile {
    percentile: Number;
    responseTime: Number;
  
    constructor(percentile: Number, responseTime: Number) {
      this.percentile = percentile;
      this.responseTime = responseTime;
    }
  }