package ca.etsmtl.taf.performance.gatling.services;

import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequest;
import ca.etsmtl.taf.performance.gatling.model.MessageResponse;

public interface GatlingFacade {
    MessageResponse runSimulation(GatlingTestRequest gatlingRequest);
    String getLatestReportPath();
}
