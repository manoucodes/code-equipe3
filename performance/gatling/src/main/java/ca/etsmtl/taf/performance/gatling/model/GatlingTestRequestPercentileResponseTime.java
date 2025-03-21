package ca.etsmtl.taf.performance.gatling.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GatlingTestRequestPercentileResponseTime {
    @JsonAlias("percentile")
    private double percentile;
    @JsonAlias("responseTime")
    private int responseTime;
}