import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PerformanceTestApiService } from 'src/app/_services/performance-test-api.service';
import Swal from 'sweetalert2';
import { GatlingRequest, ResponseTimePerPercentile } from './gatling-request';
import { GatlingWsRequest } from './gatling-websocket-persistance-request';
import { ApiResponse, GatlingAssertionResult, GatlingTestResult } from "../../models/gatlingTestResult";
import { GATLING_SCENARIOS } from "../../models/gatling-scenarios";

enum SIMULATION_STRATEGY {
  DEFAULT = "DEFAULT",
  SMOKE_TEST = "SMOKE_TEST",
  LOAD_TEST = "LOAD_TEST",
  STRESS_TEST = "STRESS_TEST",
  SPIKE_TEST = "SPIKE_TEST",
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
  gatlingTestResult: GatlingTestResult | null = null;

  percentiles: number[] = [50, 75, 90, 95, 99, 99.9];
  newPercentile: number = 0;
  newResponseTime: number = 0;

  testLog: string = "";
  latestReportContent: SafeHtml | null = null;
  busy: Subscription | undefined;
  request: GatlingRequest = new GatlingRequest({});

  strategies: string[] = Object.keys(SIMULATION_STRATEGY).filter(k => isNaN(Number(k)));
  strategiesEnum = SIMULATION_STRATEGY;
  selectedStrategy: string | null = null;

  // Added from first file
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
  ) { }

  ngOnInit(): void {
    this.modal = document.getElementById("myModal");
    this.reportModal = document.getElementById("reportModal");
    this.span = document.getElementsByClassName("close")[0] as HTMLElement;
  }

  validateForm(): boolean {
    let isValid = true;
    const requiredFields = [
      { element: 'testScenarioName', errorMessage: 'Veuillez entrer une valeur' },
      { element: 'testBaseUrl', errorMessage: 'Veuillez entrer une valeur' },
      { element: 'testUri', errorMessage: 'Veuillez entrer une valeur' },
      { element: 'testMethodType', errorMessage: 'Veuillez sélectionner un type de requête' },
      { element: 'userNumber', errorMessage: 'Veuillez entrer ou sélectionner une valeur' }
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
    if (!this.validateForm()) return;

    // Combined from both versions
    const requestToSend = this.isFirstOption
      ? { ...this.request, protocol: "HTTP" }
      : this.request;

    this.busy = this.performanceTestApiService.sendGatlingRequest(requestToSend)
      .subscribe((response: any) => {
        this.modal!.style.display = "block";
        const pattern = /(.+)\n?/g;
        const matches: string[] = Array.from(response.message?.matchAll(pattern));
        const arrayOfStrings = matches.map(match => match[0]);

        const successMessage = arrayOfStrings.find(message => message.includes('request count'));
        const reportGeneratedMessage = arrayOfStrings.find(message => message.includes('Generated Report'));

        this.testResult = (response as ApiResponse).testResult;

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
        });
      });
  }

  // UI Handling methods
  showLatestReport() {
    window.open(this.performanceTestApiService.getLatestReportUrl().toString(), '_blank');
  }

  openReportModal() {
    if (this.reportModal) {
      this.reportModal.style.display = "block";
      console.log("Report modal opened");
    }
  }

  closeReportModal() {
    if (this.reportModal) {
      this.reportModal.style.display = "none";
      this.latestReportContent = null;
      console.log("Report modal closed");
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.style.display = "none";
      this.latestReportContent = null;
      console.log("Modal closed");
    }
  }

  newTest() {
    this.request = new GatlingRequest({});
    this.closeModal();
  }

  isSuccessfull(): boolean {
    const failures = this.testResult.assertions.filter(
      (assertion: GatlingAssertionResult) => !assertion.result
    );
    return failures.length === 0;
  }

  onStrategySelect() {
    if (!this.selectedStrategy) {
      this.selectedStrategy = SIMULATION_STRATEGY.DEFAULT.valueOf();
    }
    if (this.strategies.includes(this.selectedStrategy)) {
      this.request = GATLING_SCENARIOS.find(
        scenario => scenario.name === this.selectedStrategy
      )?.config || new GatlingRequest({});
    }
  }

  // Percentile handling with combined logic
  addPercentile(): void {
    if (this.newPercentile && this.newResponseTime) {
      const newAssertion = new ResponseTimePerPercentile(
        Number(this.newPercentile),
        this.newResponseTime
      );
      this.request.assertionsResponseTimePerPercentile.push(newAssertion);
      this.newResponseTime = 0;
    }
  }

  removePercentile(index: number): void {
    this.request.assertionsResponseTimePerPercentile.splice(index, 1);
  }

  // Persistence methods from first file
  persistTest(): void {
    const newRequest = new GatlingRequest({
      ...this.request,
      protocol: "HTTP",
      simulationStrategy: this.selectedStrategy || 'DEFAULT',
    });

    this.busy = this.performanceTestApiService.sendGatlingPersistanceRequest(newRequest)
      .subscribe(() => {
        alert("Saved");
      }, (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Échec de la sauvegarde",
        });
      });
  }

  // WebSocket method from first file
  persistWsTest(): void {
    const newRequest = new GatlingWsRequest({
      protocol: "HTTP",
      testBaseUrl: this.request.testBaseUrl,
      testUsersNumber: Number(this.request.testUsersNumber),
    });

    this.busy = this.performanceTestApiService.sendGatlingWsPersistanceRequest(newRequest)
      .subscribe(() => {
        alert("Saved");
      }, (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Échec de la sauvegarde WebSocket",
        });
      });
  }

  // Checkbox handling from first file
  onCheckboxChange(selected: 'first' | 'second' | 'third') {
    this.isFirstOption = selected === 'first';
    this.isSecondOption = selected === 'second';
    this.isThirdOption = selected === 'third';
  }
}
