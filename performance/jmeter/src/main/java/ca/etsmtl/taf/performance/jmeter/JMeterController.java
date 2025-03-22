package ca.etsmtl.taf.performance.jmeter;
import ca.etsmtl.taf.performance.jmeter.model.*;
import ca.etsmtl.taf.performance.jmeter.repository.JMeterTestsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ca.etsmtl.taf.performance.jmeter.utils.JMeterRunner;


@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/performance/jmeter")
public class JMeterController {

  @Autowired private JMeterTestsRepository jMeterTestsRepository;

  private ResponseEntity<JMeterResponse> executeTestPlan(TestPlanBase testPlan) {

    JMeterResponse jMeterResponse = new JMeterResponse("", "", null, null);

    /*
    Save test request and test results to MongoDB
    Should be in a service layer, but for now keeping with the architecture

    Could also save async since no immediate interaction with the user

    Test result dto format tbd
     */
    JMeterTestDocument testDocument = JMeterTestDocument.builder()
            .testRequest(testPlan)
            .build();
    try {
      jMeterTestsRepository.save(testDocument);
    } catch (Exception e) {
      System.err.println("Mongo error: " + e.getMessage());
    }



    try {
      jMeterResponse = JMeterRunner.executeTestPlanAndGenerateReport(testPlan);
      jMeterResponse.setStatus("success");
      jMeterResponse.setMessage("Test plan executed successfully"); 
      return ResponseEntity.ok().body(jMeterResponse);
    } catch (JMeterRunnerException e) {
      jMeterResponse.setStatus("failure");
      jMeterResponse.setMessage(e.getMessage());
      return ResponseEntity.badRequest().body(jMeterResponse);
    } catch (RuntimeException e) {
      jMeterResponse.setStatus("failure");
      jMeterResponse.setMessage(e.getMessage());
      return ResponseEntity.internalServerError().body(jMeterResponse);
    }
  }

  @PostMapping("/http")
  public ResponseEntity<JMeterResponse> getHttpTestPlan(@RequestBody HttpTestPlan jmeterTestPlan) {
    if (jmeterTestPlan.getProtocol() == null) {
      jmeterTestPlan.setProtocol("http");
    }
    if (jmeterTestPlan.getPort() == null) {
      jmeterTestPlan.setPort("");
      
    }
    if (jmeterTestPlan.getDuration() == null) {
      jmeterTestPlan.setDuration("");
    }
    if (jmeterTestPlan.getData() == null) {
      jmeterTestPlan.setData("");
    }
    return executeTestPlan(jmeterTestPlan);
  }

  @PostMapping("/ftp")
  public ResponseEntity<JMeterResponse> getFtpTestplan(@RequestBody FTPTestPlan ftpTestPlan) {
    return executeTestPlan(ftpTestPlan);
  }
}
