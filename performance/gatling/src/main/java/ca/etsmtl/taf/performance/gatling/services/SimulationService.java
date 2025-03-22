package ca.etsmtl.taf.performance.gatling.services;

import ca.etsmtl.taf.performance.gatling.config.GatlingConfigurator;
import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequest;
import ca.etsmtl.taf.performance.gatling.simulation.LoadTestSimulation;
import ca.etsmtl.taf.performance.gatling.simulation.SimulationFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.gatling.app.Gatling;
import io.gatling.core.config.GatlingPropertiesBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SimulationService {

    private static final Logger logger = LoggerFactory.getLogger(SimulationService.class);

    public String runSimulation(GatlingTestRequest gatlingRequest) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String testRequest = objectMapper.writeValueAsString(gatlingRequest);
        PipedOutputStream pipedOut = new PipedOutputStream();
        PipedInputStream pipedIn = new PipedInputStream(pipedOut);
        BufferedReader reader = new BufferedReader(new InputStreamReader(pipedIn));

        // Run Gatling simulation in a separate thread
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<?> future = executor.submit(() -> {
            try {
                @SuppressWarnings("java:S106")
                PrintStream originalOut = System.out;
                System.setOut(new PrintStream(pipedOut));
                try {
                    logger.info("Executing Gatling with request: {}", testRequest);
                    System.setProperty("requestJson", testRequest);
                    GatlingPropertiesBuilder props = new GatlingPropertiesBuilder();
                    props.resultsDirectory(GatlingConfigurator.getGatlingResultsFolder());
                    props.simulationClass(new SimulationFactory().getSimulationName(gatlingRequest.getSimulationStrategy()));
                    Gatling.fromMap(props.build());
                } finally {
                    System.setOut(originalOut);
                    pipedOut.close();
                }
            } catch (Exception e) {
                logger.error("Error happened executing Gatling", e);
            }
        });

        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }

        reader.close();
        executor.shutdown();

        return output.toString();
    }


    public String parseOutput(String output) {
        StringBuilder returnString = new StringBuilder("---- Global Information --------------------------------------------------------\n");
        String startPattern = "---- Global Information --------------------------------------------------------";
        String endPattern = "---- Response Time Distribution ------------------------------------------------";
        Pattern pattern = Pattern.compile(startPattern + "(.*?)" + endPattern, Pattern.DOTALL);
        Matcher matcher = pattern.matcher(output);
        if (matcher.find()) {
            returnString.append(matcher.group(1).trim()).append("\n");
        } else {
            returnString.append("Not found in Gatling output.");
        }

        returnString.append("---- Generated Report ------------------------------------------------------\n");

        String regex = "Please open the following file: (file:///[^\\s]+|https?://[^\\s]+)";

        pattern = Pattern.compile(regex, Pattern.MULTILINE);
        matcher = pattern.matcher(output);

        if (matcher.find()) {
            for (int i = 1; i <= matcher.groupCount(); i++) {
                returnString.append(matcher.group(i).trim());
            }
        } else {
            returnString.append("Not found in Gatling output.");
        }

        return returnString.toString();
    }
}