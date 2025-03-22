package ca.etsmtl.taf.performance.jmeter.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "jmeter_tests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JMeterTestDocument {
    @Id
    private ObjectId id;

    private TestPlanBase testRequest;
    // TODO: test results
}
