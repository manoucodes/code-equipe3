


@Service
public class WebSocketSimulationService {
    private static final Logger logger = LoggerFactory.getLogger(SimulationService.class);
    public String runWebSocketSimulation(GatlingWsTestRequest, gatlingRequest) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String testRequest = objectMapper.writeValueAsString(gatlingRequest);

            ExecutorService executor = Executors.newSingleThreadExecutor();
            PipedOutputStream pipedOut = new PipedOutputStream();
            PipedInputStream pipedIn = new PipedInputStream(pipedOut);
            BufferedReader reader = new BufferedReader(new InputStreamReader(pipedIn));

            Future<?> future = executor.submit(() -> {
                try {
                    PrintStream originalOut = System.out;
                    System.setOut(new PrintStream(pipedOut));
                    try {
                        logger.info("Executing Gatling Simulation: {} with request: {}", simulationClass, testRequest);
                        System.setProperty("requestJson", testRequest);
                        GatlingPropertiesBuilder props = new GatlingPropertiesBuilder();
                        props.resultsDirectory(GatlingConfigurator.getGatlingResultsFolder());
                        props.simulationClass(simulationClass);
                        Gatling.fromMap(props.build());
                    } finally {
                        System.setOut(originalOut);
                        pipedOut.close();
                    }
                } catch (Exception e) {
                    logger.error("Error executing Gatling", e);
                }
            });

            // Create a file writer
            File logFile = new File("gatling_output.log");
            FileWriter fileWriter = new FileWriter(logFile, true); // Append mode
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                // Write line to file
                bufferedWriter.write(line);
                bufferedWriter.newLine();
                output.append(line).append("\n");
            }

            // Close file writer
            bufferedWriter.close();
            reader.close();
            if (logFile.exists()) {
                logFile.delete();
            }

            return runGatling(future, output.toString(), gatlingRequest);

        } catch (IOException e) {
            return new ResponseEntity<>(new MessageResponse(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}