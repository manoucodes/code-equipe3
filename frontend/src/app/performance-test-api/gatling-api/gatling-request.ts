export class GatlingRequest {
  simulationStrategy: string;
  testBaseUrl: string;
  testScenarioName: string;
  testRequestName: string;
  testUri: string;
  testRequestBody: string;
  testMethodType: string;
  testUsersNumber: Number;
  testRampUpDuration: Number;
  testUsersAtOnce: Number;
  testUserRampUpPerSecondMin: Number;
  testUserRampUpPerSecondMax: Number;
  testUserRampUpPerSecondDuration: Number;
  testConstantUsers: Number;
  testConstantUsersDuration: Number;
  testNothingFor: Number;
  assertionMeanResponseTime: Number;
  assertionFailedRequestsPercent: Number;
  assertionsResponseTimePerPercentile: ResponseTimePerPercentile[];

  constructor({
                simulationStrategy = 'DEFAULT',
                testBaseUrl = '',
                testScenarioName = '',
                testRequestName = '',
                testUri = '',
                testRequestBody = '',
                testMethodType = '',
                testUsersNumber = 0,
                testRampUpDuration = 0,
                testUsersAtOnce = 0,
                testUserRampUpPerSecondMin = 0,
                testUserRampUpPerSecondMax = 0,
                testUserRampUpPerSecondDuration = 0,
                testConstantUsers = 0,
                testConstantUsersDuration = 0,
                testNothingFor = 0,
                assertionMeanResponseTime = -1,
                assertionFailedRequestsPercent = -1,
                assertionsResponseTimePerPercentile = [],
              }: {
                simulationStrategy?: string;
                testBaseUrl?: string;
                testScenarioName?: string;
                testRequestName?: string;
                testUri?: string;
                testRequestBody?: string;
                testMethodType?: string;
                testUsersNumber?: Number;
                testRampUpDuration?: Number;
                testUsersAtOnce?: Number;
                testUserRampUpPerSecondMin?: Number;
                testUserRampUpPerSecondMax?: Number;
                testUserRampUpPerSecondDuration?: Number;
                testConstantUsers?: Number;
                testConstantUsersDuration?: Number;
                testNothingFor?: Number;
                assertionMeanResponseTime?: Number;
                assertionFailedRequestsPercent?: Number;
                assertionsResponseTimePerPercentile?: ResponseTimePerPercentile[];
              }
  ) {
    this.simulationStrategy = simulationStrategy;
    this.testBaseUrl = testBaseUrl;
    this.testScenarioName = testScenarioName;
    this.testRequestName = testRequestName;
    this.testUri = testUri;
    this.testRequestBody = testRequestBody;
    this.testMethodType = testMethodType;
    this.testUsersNumber = testUsersNumber;
    this.testRampUpDuration = testRampUpDuration;
    this.testUsersAtOnce = testUsersAtOnce;
    this.testUserRampUpPerSecondMin = testUserRampUpPerSecondMin;
    this.testUserRampUpPerSecondMax = testUserRampUpPerSecondMax;
    this.testUserRampUpPerSecondDuration = testUserRampUpPerSecondDuration;
    this.testConstantUsers = testConstantUsers;
    this.testConstantUsersDuration = testConstantUsersDuration;
    this.testNothingFor = testNothingFor;
    this.assertionMeanResponseTime = assertionMeanResponseTime;
    this.assertionFailedRequestsPercent = assertionFailedRequestsPercent;
    this.assertionsResponseTimePerPercentile = assertionsResponseTimePerPercentile;
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
