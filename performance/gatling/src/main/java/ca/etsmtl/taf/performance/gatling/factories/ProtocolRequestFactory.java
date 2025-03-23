package ca.etsmtl.taf.performance.gatling.factories;

import io.gatling.javaapi.core.ChainBuilder;
import io.gatling.javaapi.http.HttpRequestActionBuilder;
import static io.gatling.javaapi.http.HttpDsl.http;
import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequest;
import static io.gatling.javaapi.http.HttpDsl.status;
import static io.gatling.javaapi.core.CoreDsl.*;

public class ProtocolRequestFactory {
    
    public static ChainBuilder createRequest(GatlingTestRequest gatlingTestRequest) {
        switch (gatlingTestRequest.getProtocol()) {
            case "HTTP":
                return createHttpRequest(gatlingTestRequest);
            default:
                throw new IllegalArgumentException("Invalid protocol: " + gatlingTestRequest.getProtocol());
        }
    }

    private static ChainBuilder createHttpRequest(GatlingTestRequest gatlingTestRequest) {
        String methodType = gatlingTestRequest.getMethodType();
        HttpRequestActionBuilder httpRequestBuilder;

        switch (methodType.toUpperCase()) {
            case "GET":
                httpRequestBuilder = http(gatlingTestRequest.getRequestName())
                        .get(gatlingTestRequest.getUri());
                break;
            case "POST":
                httpRequestBuilder = http(gatlingTestRequest.getRequestName())
                        .post(gatlingTestRequest.getUri())
                        .body(StringBody(gatlingTestRequest.getRequestBody()));
                break;
            case "PUT":
                httpRequestBuilder = http(gatlingTestRequest.getRequestName())
                        .put(gatlingTestRequest.getUri())
                        .body(StringBody(gatlingTestRequest.getRequestBody()));
                break;
            case "DELETE":
                httpRequestBuilder = http(gatlingTestRequest.getRequestName())
                        .delete(gatlingTestRequest.getUri());
                break;
            default:
                throw new IllegalArgumentException("Invalid HttpRequestMethod: " + methodType.toUpperCase());
        }

        return exec(httpRequestBuilder
                .check(status().not(404), status().not(500)));
    }

    //private static ChainBuilder createWsRequest() {}
}