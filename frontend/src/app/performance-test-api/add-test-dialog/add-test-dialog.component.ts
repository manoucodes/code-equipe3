import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { JMeterHttpRequest } from '../jmeter-api/jmeter-http-request';
import { JMeterPerformanceTest } from '../performance-test.model';

@Component({
    selector: 'app-add-test-dialog',
    templateUrl: './add-test-dialog.component.html',
    styleUrls: []
})
export class AddTestDialogComponent {
    configForm: FormGroup;
    testParameters: any;

    constructor(public dialogRef: MatDialogRef<AddTestDialogComponent>) {
        this.configForm = new FormGroup({
            provider: new FormControl('jmeter', Validators.required),
            testType: new FormControl('http', Validators.required),
            name: new FormControl('', Validators.required)
        });

        this.configForm.get('provider')?.valueChanges.subscribe(provider => {
            const testTypeControl = this.configForm.get('testType');
            if (provider === 'jmeter') {
                testTypeControl?.setValidators(Validators.required);
                testTypeControl?.enable();
            } else {
                testTypeControl?.clearValidators();
                testTypeControl?.disable();
                testTypeControl?.reset();
            }
            testTypeControl?.updateValueAndValidity();
        });
    }

    get requiresParameters() {
        return this.configForm.value.provider === 'jmeter' &&
            this.configForm.value.testType === 'http';
    }

    markFormAsTouched() {
        this.configForm.markAllAsTouched();
    }

    onTestParametersReceived(params: any) {
        console.log('params received', params);
        this.testParameters = params;
    }

    onSubmit() {
        console.log("on submit save test");

        if (this.configForm.valid) {
            const formValue = this.configForm.value;

            console.log(this.testParameters);
            const testConfig: JMeterPerformanceTest = {
                name: formValue.name,
                type: 'JMeter',
                description: formValue.description || '',
                status: 'Pending',
                configuration: this.testParameters
            };

            this.dialogRef.close(testConfig);
        }
    }
    getTooltipMessage() {
        if (!this.configForm.valid) return 'Please fill all required fields';
        if (this.requiresParameters && !this.testParameters) return 'JMeter HTTP parameters required';
        return '';
    }
}