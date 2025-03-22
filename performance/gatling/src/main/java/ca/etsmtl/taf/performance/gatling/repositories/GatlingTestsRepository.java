package ca.etsmtl.taf.performance.gatling.repositories;

import ca.etsmtl.taf.performance.gatling.model.GatlingTestDocument;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GatlingTestsRepository extends MongoRepository<GatlingTestDocument, ObjectId> {
}
