package ca.etsmtl.taf.performance.jmeter.model;

import java.io.File;

import ca.etsmtl.taf.performance.jmeter.config.JMeterConfigurator;
import lombok.*;
import lombok.experimental.SuperBuilder;


@AllArgsConstructor
@Data
@ToString(callSuper = true)
@SuperBuilder
public class FTPTestPlan extends TestPlanBase {
  private String remoteFile;
  private String localFile;
  private String username;
  private String password;

  @Override
  public void generateTestPlan() {
    replaceAndSaveVariables(new File(JMeterConfigurator.getJmeterTemplatesFolder(),"FTPSamplerTemplate.jmx").getAbsolutePath(),
    new File(JMeterConfigurator.getJmeterTemplatesFolder(),"TestPlan.jmx").getAbsolutePath(),
            "FTPSamplerTemplate");
  }

  @Override
  protected String replaceVariables(String xmlContent, String templateKey) {
    xmlContent = xmlContent.replace("$NB_THREADS$", nbThreads)
            .replace("$RAMP_TIME$", rampTime)
            .replace("$DURATION$", duration)
            .replace("$DOMAIN$", domain)
            .replace("$PORT$", port)
            .replace("$REMOTEFILE$", remoteFile)
            .replace("$LOCALFILE$", localFile)
            .replace("$METHOD$", getFtpMethod())
            .replace("$USERNAME$", username)
            .replace("$PASSWORD$", password)
            .replace("$LOOP_COUNTER$", loop);

    return xmlContent;
  }
  private  String getFtpMethod() {
    return getMethod().equals("Retrieve") ?  "false" : "true";
  }

}
