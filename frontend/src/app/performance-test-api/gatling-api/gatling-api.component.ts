import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {PerformanceTestApiService} from 'src/app/_services/performance-test-api.service';
import Swal from 'sweetalert2';
import {GatlingRequest, ResponseTimePerPercentile} from './gatling-request';
import {GatlingWsRequest} from './gatling-websocket-persistance-request';
import {ApiResponse, GatlingAssertionResult, GatlingTestResult} from "../../models/gatlingTestResult";
import {GATLING_SCENARIOS} from "../../models/gatling-scenarios";


enum SIMULATION_STRATEGY
{
  DEFAULT="DEFAULT",
  SMOKE_TEST="SMOKE_TEST",
  LOAD_TEST="LOAD_TEST",
  STRESS_TEST="STRESS_TEST",
  SPIKE_TEST="SPIKE_TEST",
}

@Component({
  selector: 'app-gatling-api',
  templateUrl: './gatling-api.component.html',
  styleUrls: ['./gatling-api.component.css']
})
export class GatlingApiComponent implements OnInit {
  modal: HTMLElement | null = null;
  reportModal: HTMLElement | null = null;
  span: HTMLElement | null = null;
  testResult: any;

  gatlingTestResult: GatlingTestResult | null = null

  percentiles: number[] = [50, 75, 90, 95, 99, 99.9];
  newPercentile: number = 0;
  newResponseTime: number = 0;
  
  testLog: string = "";
  latestReportContent: SafeHtml | null = null; // Contenu du dernier rapport de test

  busy: Subscription | undefined;

  request: GatlingRequest = new GatlingRequest({});

  
  strategies: string[] = Object.keys(SIMULATION_STRATEGY).filter(k => isNaN(Number(k)));
  strategiesEnum = SIMULATION_STRATEGY;
  selectedStrategy: string | null = null;

  isFirstOption: boolean = true;
  isSecondOption: boolean = false;
  isThirdOption: boolean = false;
  get connections(): Number {
    return this.request.testUsersAtOnce;
  }

  set connections(value: Number) {
    this.request.testUsersAtOnce = value;
    this.request.testUsersNumber = value;
  }
  
  constructor(
    private readonly performanceTestApiService: PerformanceTestApiService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.modal = document.getElementById("myModal");
    this.reportModal = document.getElementById("reportModal"); // Initialisation de la modal du rapport
    this.span = document.getElementsByClassName("close")[0] as HTMLElement;
  }

  validateForm(): boolean {
    let isValid = true;
    const requiredFields = [
      {element: 'testScenarioName', errorMessage: 'Veuillez entrer une valeur'},
      {element: 'testBaseUrl', errorMessage: 'Veuillez entrer une valeur'},
      {element: 'testUri', errorMessage: 'Veuillez entrer une valeur'},
      {element: 'testMethodType', errorMessage: 'Veuillez sélectionner un type de requête'},
      {element: 'userNumber', errorMessage: 'Veuillez entrer ou sélectionner une valeur'}
    ];

    requiredFields.forEach(field => {
      const inputElement = document.getElementsByName(field.element)[0] as HTMLInputElement | null;
      const errorDiv = document.createElement('div');
      errorDiv.className = 'text-danger';

      if (inputElement?.nextElementSibling) {
        inputElement.nextElementSibling.remove();
      }
      if (inputElement && inputElement.value.trim() === '') {
        isValid = false;
        inputElement.classList.add('is-invalid');
        errorDiv.innerText = field.errorMessage;
        inputElement.insertAdjacentElement('afterend', errorDiv);
      } else {
        inputElement?.classList.remove('is-invalid');
      }
    });

    return isValid;
  }

  onSubmit() {

    if (!this.validateForm()) {
      return;
    }

    console.log(this.request);

    this.busy = this.performanceTestApiService.sendGatlingRequest({...this.request, protocol: this.isFirstOption ? "HTTP" : "WebSocket"})
      .subscribe((response: any) => {
        this.modal!.style.display = "block";

        // Extraction des messages de la réponse de l'API
        const pattern = /(.+)\n?/g;
        const matches: string[] = Array.from(response.message?.matchAll(pattern));
        const arrayOfStrings = matches.map(match => match[0]);

        // Filtrer les messages pour ne conserver que ceux indiquant le succès ou l'échec global
        const successMessage = arrayOfStrings.find(message => message.includes('request count'));
        const reportGeneratedMessage = arrayOfStrings.find(message => message.includes('Generated Report'));

        // Détermination du succès ou de l'échec global
        this.testResult = [{
          success: !!successMessage
        }];

        this.testResult = (response as ApiResponse).testResult

        // Ajouter un message indiquant que le rapport a été généré
        if (reportGeneratedMessage) {
          this.testResult.push({
            message: 'Le rapport a été généré avec succès.',
            success: true
          });
        }

      }, (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Le test a échoué, révisez votre configuration de test",
        })
      });
  }

  //  Afficher le dernier rapport
  showLatestReport() {
    const reportWindow = window.open(this.performanceTestApiService.getLatestReportUrl().toString(), '_blank');
  }

  openReportModal() {
    if (this.reportModal) {
      this.reportModal.style.display = "block"; // Affiche la modal du rapport
      console.log("Report modal opened"); // Ajout de log pour vérifier l'ouverture du modal
    } else {
      console.error("reportModal is not initialized");
    }
  }

  onCheckboxChange(selected: 'first' | 'second' | 'third') {
    if (selected === 'first') {
      this.isFirstOption = true;
      this.isSecondOption = false;
      this.isThirdOption = false;
    } else if (selected === 'second') {
      this.isFirstOption = false;
      this.isSecondOption = true;
      this.isThirdOption = false;
    } else if (selected === 'third') {
      this.isFirstOption = false;
      this.isSecondOption = false;
      this.isThirdOption = true;
    }
  }

  closeReportModal() {
    if (this.reportModal) {
      this.reportModal.style.display = "none"; // Ferme la modal du rapport
      this.latestReportContent = null;
      console.log("Report modal closed"); // Ajout de log pour vérifier la fermeture du modal
    } else {
      console.error("reportModal is not initialized");
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.style.display = "none";
      this.latestReportContent = null;
      console.log("Modal closed"); // Ajout de log pour vérifier la fermeture du modal
    } else {
      console.error("modal is not initialized");
    }
  }

  newTest() {
    this.request = new GatlingRequest({});
    this.closeModal();
  }

  isSuccessfull(): boolean {
    const failures = this.testResult.assertions.filter((assertion: GatlingAssertionResult) => assertion.result == false);
    console.log("Failures" + failures)
    return failures.length == 0;
  }

  onStrategySelect() {
    if(this.selectedStrategy == null)
      this.selectedStrategy = SIMULATION_STRATEGY.DEFAULT.valueOf()

    if(this.strategies.includes(this.selectedStrategy))
      this.request = GATLING_SCENARIOS.filter(scenario => scenario.name == this.selectedStrategy).map(it => it.config)[0]
  }

  addPercentile(): void {
    
    if (this.newPercentile && this.newResponseTime) {

      const newAssertion = new ResponseTimePerPercentile(Number(this.newPercentile), this.newResponseTime);
      console.log("assertion:" + newAssertion.percentile + "% - " + newAssertion.responseTime + "ms")
      this.request.assertionsResponseTimePerPercentile.push(newAssertion);

      // Reset les champs
      this.newResponseTime = 0;
    }
  }

  

  removePercentile(index: number): void {
    this.request.assertionsResponseTimePerPercentile.splice(index, 1);
  }

  

  persistTest(): void {
    const percentileAssertions = [...this.request.assertionsResponseTimePerPercentile];

    if (this.newPercentile > 0 && this.newResponseTime > 0) {
      percentileAssertions.push(
        new ResponseTimePerPercentile(Number(this.newPercentile), this.newResponseTime)
      );
    }

    const newRequest = new GatlingRequest({
      protocol: "HTTP",
      simulationStrategy: this.selectedStrategy ?? 'DEFAULT',
      testScenarioName: this.request.testScenarioName,
      testRequestName: this.request.testRequestName,
      testBaseUrl: this.request.testBaseUrl,
      testUri: this.request.testUri,
      testRequestBody: this.request.testRequestBody,
      testMethodType: this.request.testMethodType,
      testUsersNumber: this.request.testUsersNumber,
      testRampUpDuration: this.request.testRampUpDuration,
      testUsersAtOnce: this.request.testUsersAtOnce,
      testUserRampUpPerSecondMin: this.request.testUserRampUpPerSecondMin,
      testUserRampUpPerSecondMax: this.request.testUserRampUpPerSecondMax,
      testUserRampUpPerSecondDuration: this.request.testUserRampUpPerSecondDuration,
      testConstantUsers: this.request.testConstantUsers,
      testConstantUsersDuration: this.request.testConstantUsersDuration,
      testNothingFor: this.request.testNothingFor ?? 0,
      assertionMeanResponseTime: this.request.assertionMeanResponseTime,
      assertionFailedRequestsPercent: this.request.assertionFailedRequestsPercent,
      assertionsResponseTimePerPercentile: percentileAssertions
    });

    this.busy = this.performanceTestApiService.sendGatlingPersistanceRequest(newRequest)
      .subscribe((response: any) => {
        alert("Saved")

      }, (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Le test a échoué, révisez votre configuration de test",
        })
      });
  }

  persistWsTest(): void {
    /* const newRequest = new GatlingWsRequest({
      protocol: "HTTP",
      testBaseUrl: this.request.testBaseUrl,
      testUsersNumber: this.request.testUsersNumber,
    })
    this.busy = this.performanceTestApiService.sendGatlingWsPersistanceRequest(newRequest)
      .subscribe((response: any) => {
        alert("Saved")

      }, (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Le test a échoué, révisez votre configuration de test",
        })
      }); */
  }
}


