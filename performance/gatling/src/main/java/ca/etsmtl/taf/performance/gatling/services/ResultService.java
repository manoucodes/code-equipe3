package ca.etsmtl.taf.performance.gatling.services;

import ca.etsmtl.taf.performance.gatling.model.GatlingTestDocument;
import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequest;
import ca.etsmtl.taf.performance.gatling.model.GatlingTestResponse;
import ca.etsmtl.taf.performance.gatling.repositories.GatlingTestsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class ResultService {

    private static final Logger logger = LoggerFactory.getLogger(ResultService.class);

    @Autowired
    private GatlingTestsRepository gatlingRepository;

    public void saveTestResults(GatlingTestRequest gatlingTestRequest, GatlingTestResponse gatlingTestResponse) {
        GatlingTestDocument results = GatlingTestDocument.builder()
                .testRequest(gatlingTestRequest)
                .testResult(gatlingTestResponse)
                .build();
        try {
            gatlingRepository.save(results);
        } catch (Exception e) {
            logger.error("Mongo error: ", e);
        }
    }
}
