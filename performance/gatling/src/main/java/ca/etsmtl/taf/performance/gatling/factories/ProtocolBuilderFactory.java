package ca.etsmtl.taf.performance.gatling.factories;

import io.gatling.javaapi.http.HttpProtocolBuilder;
import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequest;
import static io.gatling.javaapi.http.HttpDsl.http;

public class ProtocolBuilderFactory {
    public static HttpProtocolBuilder createHttpProtocolBuilder(GatlingTestRequest gatlingTestRequest) {
        return http.baseUrl(gatlingTestRequest.getBaseUrl())
            .acceptHeader("application/json")
            .contentTypeHeader("application/json");
    }

    public static HttpProtocolBuilder createWsProtocolBuilder(GatlingTestRequest gatlingTestRequest) {
        return http.baseUrl(gatlingTestRequest.getBaseUrl())
        .wsBaseUrl(gatlingTestRequest.getBaseUrl());
    }
}