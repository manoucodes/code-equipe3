import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JMeterHttpRequest } from '../performance-test-api/jmeter-api/jmeter-http-request';
import { JMeterFTPRequest } from '../performance-test-api/jmeter-api/jmeter-ftp-request';

import { GatlingRequest } from '../performance-test-api/gatling-api/gatling-request';
import { GatlingWsRequest } from '../performance-test-api/gatling-api/gatling-websocket-persistance-request';

const GATLING_API = `${environment.apiUrl}/api/performance/gatling/runSimulation`;
const GATLING_PERSISTANCE_API = `${environment.mongodbServiceUrl}/api`;
const LATEST_REPORT_API = `${environment.apiUrl}/api/performance/gatling/latest-report`;
const JMeter_HttpRequest_API = `${environment.apiUrl}/api/performance/jmeter/http`;
const JMeter_FtpRequest_API = `${environment.apiUrl}/api/performance/jmeter/ftp`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PerformanceTestApiService {
  constructor(private http: HttpClient) { }

  sendGatlingRequest(request: GatlingRequest | GatlingWsRequest): Observable<any> {
    const url = `${GATLING_API}`;
    console.log(request)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const response = this.http.post(url, request, httpOptions);
    return response;
  }

  sendGatlingPersistanceRequest(request: GatlingRequest): Observable<any> {
    const url = `${GATLING_PERSISTANCE_API}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const response = this.http.post(url, request, httpOptions);
    return response;
  }

  sendGatlingWsPersistanceRequest(request: GatlingWsRequest): Observable<any> {
    const url = `${GATLING_PERSISTANCE_API}/websocket`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const response = this.http.post(url, request, httpOptions);
    return response;
  }

  getLatestReportUrl(): URL {
    // Appelle l'API pour récupérer le contenu du dernier rapport Gatling
    return new URL(LATEST_REPORT_API);
  }

  sendHttpJMeterRequest(
    jmeter_http_request: JMeterHttpRequest
  ): Observable<any> {
    const url = `${JMeter_HttpRequest_API}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(url, jmeter_http_request, httpOptions);
  }

  sendFtpJMeterRequest(jmeter_ftp_request: JMeterFTPRequest): Observable<any> {
    const url = `${JMeter_FtpRequest_API}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(url, jmeter_ftp_request, httpOptions);
  }
}
