import { JMeterHttpRequest } from '../performance-test-api/jmeter-api/jmeter-http-request';
import { JMeterFTPRequest } from '../performance-test-api/jmeter-api/jmeter-ftp-request'

export const JMETER_SCENARIOS = [

    {
        name: "HTTP Small Company Smoke Test",
        type: 'http',
        config: new JMeterHttpRequest(
            '20',
            '10',
            '300',
            '',
            '',
            '',
            '',
            '',
            '1',
            ''
        )
    },
    {
        name: "HTTP Small Company Load Test",
        type: 'http',
        config: new JMeterHttpRequest(
            '200',
            '20',
            '1200',
            '',
            '',
            'https',
            '',
            '',
            '5',
            ''
        )
    },
    {
        name: "FTP Test 1",
        type: 'ftp',
        config: new JMeterFTPRequest(
            '1',
            '1',
            '1',
            '1',
            '',
            '',
            '',
            '',
            '',
            '',
            '1'
        )
    },
    {
        name: "FTP Test 2",
        type: 'ftp',
        config: new JMeterFTPRequest(
            '1',
            '1',
            '1',
            '1',
            '',
            '',
            '',
            '',
            '',
            '',
            '1'
        )
    },

];