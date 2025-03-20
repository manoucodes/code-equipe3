// performance-test.model.ts
import { GatlingRequest } from "./gatling-api/gatling-request";
import { JMeterHttpRequest } from "./jmeter-api/jmeter-http-request";

export type TestStatus = 'Success' | 'Failed' | 'Pending' | 'Running' | 'Completed';

export abstract class PerformanceTestBase {
    abstract readonly type: 'JMeter' | 'Gatling';

    static fromJSON(json: string): PerformanceTest {
        const raw = JSON.parse(json);
        return this.parseRaw(raw);
    }

    static parseRaw(raw: any): PerformanceTest {
        switch (raw.type) {
            case 'JMeter':
                return JMeterPerformanceTest.fromRaw(raw);
            case 'Gatling':
                return GatlingPerformanceTest.fromRaw(raw);
            default:
                throw new Error(`Unknown test type: ${raw.type}`);
        }
    }
}

export class JMeterPerformanceTest extends PerformanceTestBase {
    readonly type = 'JMeter';

    constructor(
        public name: string,
        public description: string,
        public configuration: JMeterHttpRequest,
        public status?: TestStatus
    ) {
        super();
    }

    static fromRaw(raw: any): JMeterPerformanceTest {
        return new JMeterPerformanceTest(
            raw.name,
            raw.description,
            new JMeterHttpRequest(
                raw.configuration.nbThreads,
                raw.configuration.rampTime,
                raw.configuration.duration,
                raw.configuration.domain,
                raw.configuration.port,
                raw.configuration.protocol,
                raw.configuration.path,
                raw.configuration.method,
                raw.configuration.loop,
                raw.configuration.data
            ),
            raw.status
        );
    }
}

export class GatlingPerformanceTest extends PerformanceTestBase {
    readonly type = 'Gatling';

    constructor(
        public name: string,
        public description: string,
        public configuration: GatlingRequest,
        public status?: TestStatus
    ) {
        super();
    }

    static fromRaw(raw: any): GatlingPerformanceTest {
        return new GatlingPerformanceTest(
            raw.name,
            raw.description,
            {
                testBaseUrl: raw.configuration.testBaseUrl,
                testScenarioName: raw.configuration.testScenarioName,
                testRequestName: raw.configuration.testRequestName,
                testUri: raw.configuration.testUri,
                testRequestBody: raw.configuration.testRequestBody,
                testMethodType: raw.configuration.testMethodType,
                testUsersNumber: raw.configuration.testUsersNumber
            },
            raw.status
        );
    }
}

export type PerformanceTest = JMeterPerformanceTest | GatlingPerformanceTest;