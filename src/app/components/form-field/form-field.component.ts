import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'spiff-form-field',
    templateUrl: './form-field.component.html',
    styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent implements OnInit {

    @Input() public inputType = 'text';
    @Input() public label = 'Form Field';
    @Input() public control = new FormControl();

    @Input() public errorStrategy: DisplayErrorStrategy = 'all';
    @Input() public errorPriority: string[];
    @Input() public errorMap = new Map<string, string>();

    public errors: string[] = [];

    constructor() { }

    ngOnInit(): void {
        if (!this.errorPriority) {
            throw new Error('Error strategy set to "Priority" but no errorPriority was provided!');
        }
    }

    public useErrorMap(error: string): string {
        return this.errorMap.has(error) ? this.errorMap.get(error) : `Error: ${error}`;
    }

    public hasErrors(): boolean {
        this.errors = [];
        switch (this.errorStrategy) {
            case 'none':
                return false;
            case 'all':
                if (this.control.errors) {
                    Object.keys(this.control.errors).forEach(error => this.errors.push(this.useErrorMap(error)));
                    return true;
                } else {
                    return false;
                }
            case 'priority':
                if (this.control.errors) {
                    let lastError: string;
                    for (const error of this.errorPriority) {
                        lastError = error;
                        if (this.control.errors[error] !== undefined) {
                            this.errors.push(this.useErrorMap(error));
                            return true;
                        }
                    }
                    throw new Error(`Error strategy set to priority but error "${lastError}" is not present in errorPriority!`);
                } else {
                    return false;
                }
        }
    }

}

type DisplayErrorStrategy = 'none' | 'all' | 'priority';
