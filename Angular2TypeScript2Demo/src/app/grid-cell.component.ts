import { Component, Input, Output } from '@angular/core';

@Component({
    selector: 'grid-cell-component',
    template: `<div (click)="onClick($event)">
                <div *ngIf="!editMode" class="display-cell">{{ model[value] }}</div>
                <grid-cell-edit-component *ngIf="editMode" (editCompleted)=editCompleted($event) [model]="model" [value]="value"></grid-cell-edit-component>
               </div>`,
})
export class GridCellComponent {
    @Input()
    @Output()
    model: any;

    @Input()
    value: string;

    @Input()
    enableEditMode: boolean = false;

    editMode: boolean = false;
    onClick(event: MouseEvent) {
        if (this.enableEditMode) {
            this.editMode = true;
        }
    }

    editCompleted() {
        this.editMode = false;
    }
}
