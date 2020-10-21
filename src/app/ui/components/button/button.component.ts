import { Component, Input } from '@angular/core';

@Component({
    selector: 'spiff-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

    @Input() disabled: boolean;
    @Input() showProgress: boolean;
    @Input() theme: 'primary' | 'warning' = 'primary';
    @Input() action: () => void = () => { };

}
