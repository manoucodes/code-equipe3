package ca.etsmtl.taf.entity;

import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Getter;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Table(name = "t_test_suite")
public class TestSuite {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private TestPlan testPlan;
    
    private String name;
    
    private String description;
	
	@Column(name = "created_date", nullable = false, updatable = false)
    @CreatedDate
    private Date createdDate;
	
	@Column(name = "created_by")
    @CreatedBy
    private String createdBy;
    
	// Priorité ?
	// Statut : En cours, Succès, Échec, Pas commencé.

}
