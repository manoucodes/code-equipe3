package ca.etsmtl.taf.performance.gatling.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "gatling_test_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GatlingTestDocument {
    @Id
    private ObjectId id;

    private GatlingTestRequest testRequest;
    private GatlingTestResponse testResult;

}
