import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'grid-cell-edit-component',
    template: `<input [(ngModel)]="model[value]" (blur)=onBlur($event) setFocus />`,
})
export class GridCellEditComponent {
    @Input()
    @Output()
    model: any;

    @Output()
    editCompleted = new EventEmitter<void>();

    @Input()
    value: string;
    onBlur() {
        this.editCompleted.emit();
    }
}
