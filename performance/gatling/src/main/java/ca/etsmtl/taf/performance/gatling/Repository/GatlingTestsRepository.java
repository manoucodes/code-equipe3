package ca.etsmtl.taf.performance.gatling.Repository;

import ca.etsmtl.taf.performance.gatling.entity.GatlingTestDocument;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GatlingTestsRepository extends MongoRepository<GatlingTestDocument, ObjectId> {
}
