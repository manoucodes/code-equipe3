export class GatlingWsRequest {
    testBaseUrl: string;
    testCriteria: string;
    testUsersNumber: number;
    threshold: number;
    constructor({
                  testBaseUrl = '',
                  testCriteria = '',
                  testUsersNumber = 0,
                  threshold = 0
                }: {
                    testBaseUrl?: string;
                    testCriteria?: string;
                    testUsersNumber?: number;
                    threshold?: number;
                }
    ) {
      this.testBaseUrl = testBaseUrl;
      this.testCriteria = testCriteria;
      this.testUsersNumber = testUsersNumber;
      this.threshold = threshold;
    }
  }