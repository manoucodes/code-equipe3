package ca.etsmtl.taf.performance.gatling.model;


import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {

    private String message;
    @Nullable
    private GatlingTestResult testResult;
}