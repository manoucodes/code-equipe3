export class GatlingWsRequest {
    protocol: string;
    testBaseUrl: string;
    testCriteria: string;
    testUsersNumber: number;
    threshold: number;
    constructor({
                  protocol = '',
                  testBaseUrl = '',
                  testCriteria = '',
                  testUsersNumber = 0,
                  threshold = 0
                }: {
                    protocol?: string;
                    testBaseUrl?: string;
                    testCriteria?: string;
                    testUsersNumber?: number;
                    threshold?: number;
                }
    ) {
      this.protocol = protocol;
      this.testBaseUrl = testBaseUrl;
      this.testCriteria = testCriteria;
      this.testUsersNumber = testUsersNumber;
      this.threshold = threshold;
    }
  }