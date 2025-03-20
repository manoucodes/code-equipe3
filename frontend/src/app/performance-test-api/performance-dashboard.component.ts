import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PerformanceTestApiService } from '../_services/performance-test-api.service';

import { GatlingPerformanceTest, JMeterPerformanceTest, PerformanceTest } from './performance-test.model';
import { AddTestDialogComponent } from './add-test-dialog/add-test-dialog.component';
import { finalize, lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { JMeterHttpRequest } from './jmeter-api/jmeter-http-request';

@Component({
    selector: 'app-performance-dashboard',
    templateUrl: './performance-dashboard.component.html',
    styleUrls: ['./performance-test-api.component.css']
})
export class PerformanceDashboardComponent implements OnInit {

    tests: PerformanceTest[] = [];
    displayedColumns: string[] = ['name', 'type', 'description', 'configuration', 'status', 'actions'];
    isProcessing = false;

    constructor(
        public dialog: MatDialog,
        private performanceTestApiService: PerformanceTestApiService,
    ) { }

    ngOnInit(): void {
        const savedTests = localStorage.getItem('performanceTests');
        this.tests = savedTests
            ? JSON.parse(savedTests).map((test: any) => {
                return test.type === 'JMeter'
                    ? JMeterPerformanceTest.fromRaw(test)
                    : GatlingPerformanceTest.fromRaw(test);
            })
            : [];
    }

    addTest() {
        const dialogRef = this.dialog.open(AddTestDialogComponent, {
            width: '800px'
        });

        dialogRef.afterClosed().subscribe((newTest: PerformanceTest) => {
            console.log("newTest", newTest)
            if (newTest) {
                this.tests = [...this.tests, newTest];
                this.saveTests();
            }
        });
    }

    removeTest(index: number): void {
        const confirmDelete = confirm('Are you sure you want to delete this test?');
        if (confirmDelete) {
            this.tests = [
                ...this.tests.slice(0, index),
                ...this.tests.slice(index + 1)
            ];
            this.saveTests();
        }
    }

    private saveTests(): void {
        localStorage.setItem('performanceTests', JSON.stringify(this.tests));
    }

    async runAllTests() {
        this.isProcessing = true;
        try {
            for (const test of this.tests) {
                try {
                    test.status = 'Running';

                    if (test.type === 'JMeter') {
                        console.log("test", test)
                        await this.runJMeterTest(test);
                    } else if (test.type === 'Gatling') {
                        // Handle Gatling tests similarly
                        await this.runGatlingTest(test);
                    }

                } catch (error) {
                    this.handleTestError(test, error);
                } finally {
                    this.saveTests();
                }
            }
        } finally {
            this.isProcessing = false;
        }
    }
    runGatlingTest(test: GatlingPerformanceTest) {
        throw new Error('Method not implemented.');
    }
    private handleTestError(test: PerformanceTest, error: any) {
        test.status = 'Failed';
        console.error('Test failed:', error);
        this.showErrorAlert();
    }

    private async runJMeterTest(test: JMeterPerformanceTest) {
        try {
            const response = await lastValueFrom(
                this.performanceTestApiService.sendHttpJMeterRequest(test.configuration)
            );

            // Use type-safe response handling
            const success = response?.length !== 0;
            test.status = success ? 'Completed' : 'Failed';
            //   test.details = response?.details;

            if (!success) {
                this.showErrorAlert();
            }
        } catch (error) {
            test.status = 'Failed';
            this.showErrorAlert();
            throw error;
        }
    }


    private showErrorAlert() {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Le test a échoué, révisez votre configuration de test",
        });
    }

}