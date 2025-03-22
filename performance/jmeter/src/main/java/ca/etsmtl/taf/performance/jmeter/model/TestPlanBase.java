package ca.etsmtl.taf.performance.jmeter.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class TestPlanBase {

    protected String nbThreads;
    protected String rampTime;
    protected String duration;
    protected String domain;
    protected String port;
    protected String method;
    protected String loop;

    public abstract void generateTestPlan();

    protected void replaceAndSaveVariables(String filePath, String target, String templateKey) {
        try {
            String xmlContent = Files.readString(Paths.get(filePath));
            xmlContent = replaceVariables(xmlContent, templateKey);
            Files.writeString(Paths.get(target), xmlContent);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    protected abstract String replaceVariables(String xmlContent, String templateKey);
}