export class GatlingRequest {
  testBaseUrl: string;
  testScenarioName: string;
  testRequestName: string;
  testUri: string;
  testRequestBody: string;
  testMethodType: string;
  testUsersNumber: Number;
  assertionMeanResponseTime: Number;
  assertionFailedRequestsPercent: Number;

  constructor({
                testBaseUrl = '',
                testScenarioName = '',
                testRequestName = '',
                testUri = '',
                testRequestBody = '',
                testMethodType = '',
                testUsersNumber = 1,
                assertionMeanResponseTime = 0,
                assertionFailedRequestsPercent = 0,
              }
  ) {
    this.testBaseUrl = testBaseUrl;
    this.testScenarioName = testScenarioName;
    this.testRequestName = testRequestName;
    this.testUri = testUri;
    this.testRequestBody = testRequestBody;
    this.testMethodType = testMethodType;
    this.testUsersNumber = testUsersNumber;
    this.assertionMeanResponseTime = assertionMeanResponseTime;
    this.assertionFailedRequestsPercent = assertionFailedRequestsPercent;
  }
}
