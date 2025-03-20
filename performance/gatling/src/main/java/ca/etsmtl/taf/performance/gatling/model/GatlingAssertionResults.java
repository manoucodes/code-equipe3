package ca.etsmtl.taf.performance.gatling.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GatlingAssertionResults {
    private String message;
    private String path;
    private String target;
    private String condition;
    private boolean result;
    private List<Double> actualValue;
    private List<Double> expectedValues;
}
