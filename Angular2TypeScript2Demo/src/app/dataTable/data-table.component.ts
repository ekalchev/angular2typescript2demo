import {
    Component,
    Input,
    QueryList,
    ContentChildren,
    AfterViewInit,
    ChangeDetectorRef,
    Directive,
    OnInit,
    Attribute,
    ViewContainerRef,
    ViewChild,
    ReflectiveInjector,
    ComponentFactoryResolver,
    EventEmitter,
    ComponentRef,
    ViewChildren,
    Injector,
    Output
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx'

@Component({
    selector: 'column-definition',
    template: ``
})
export class DataTableColumnDefinition {
    constructor(
        @Attribute('field') public field: string,
        @Attribute('title') public title: string,
        @Attribute('data-type') public dataType: string,
        @Attribute('editable') public editable: string,
        @Attribute('command') public command: string,
        @Attribute('width') public width: string) {
    }

    @Input()
    @Output()
    onDelete: EventEmitter<any> = new EventEmitter();
}

enum DynamicComponentEventType {
    Closed,
    Canceled,
}

class DynamicComponentEventArgs {
    eventType: DynamicComponentEventType;
    value: any;
}

class DynamicComponentCreationArgs {
    component: any;
    inputs: {
        eventChannel?: Subject<DynamicComponentEventArgs>;
        value: any;
    }
}

class DynamicComponent {
    protected parentNotification: Subject<DynamicComponentEventArgs>;
    protected value: any;
    protected closing: Boolean = false;

    constructor(protected injector: Injector) {
        this.parentNotification = this.injector.get('eventChannel');
        this.value = this.injector.get('value');
    }

    onEditCompleted() {
        if (this.parentNotification && !this.closing) {
            this.closing = true;
            this.parentNotification.next({ eventType: DynamicComponentEventType.Closed, value: this.value });
        }
    }

    onEditCanceled() {
        if (this.parentNotification && !this.closing) {
            this.closing = true;
            this.parentNotification.next({ eventType: DynamicComponentEventType.Canceled, value: this.value });
        }
    }
}

@Component({
    selector: 'date-cell',
    template: `<input type="date" [(ngModel)]="value" (blur)="onEditCompleted()" (keyup.escape)="onEditCanceled()" (keyup.enter)="onEditCompleted()" setFocus />`
})
export class DateComponent extends DynamicComponent {
    constructor(protected injector: Injector) {
        super(injector);
    }
}

@Component({
    selector: 'textbox-cell',
    template: `<input (keyup.enter)="onEditCompleted()" (blur)="onEditCompleted()" (keyup.escape)="onEditCanceled()" [(ngModel)]="value" class="form-control" setFocus />`
})
export class TexboxCellComponent extends DynamicComponent {
    constructor(protected injector: Injector) {
        super(injector);
    }
}

@Component({
    selector: 'data-table-cell',
    entryComponents: [TexboxCellComponent, DateComponent], // Reference to the components must be here in order to dynamically create them
    template: `<div (click)="onCellClicked($event)" *ngIf="!isInEditMode && !isCommandColumn" class="display-cell">{{ index(dataItem, field) }}</div>
                <div #editableCellContainer></div><button class="btn" *ngIf="isCommandColumn" (click)="onDeleteClicked()">Delete</button>`
})
export class DataTableCellComponent {
    @ViewChild('editableCellContainer', { read: ViewContainerRef }) editableCellContainer: ViewContainerRef;
    currentComponent: ComponentRef<any> = null;

    @Input()
    dataItem: any;

    @Input()
    field: string;

    @Input()
    dataType: string;

    @Input()
    command: string;

    @Input()
    width: string;

    @Input()
    @Output()
    onDelete: EventEmitter<any>;

    ngAfterViewInit() {
        var a = 1;
    }

    get isCommandColumn(): Boolean {
        return this.command != null && this.command.toLowerCase() === "delete";
    }

    onDeleteClicked() {
        this.onDelete.emit(this.dataItem);
    }

    dynamicComponentEventChannel: Subject<DynamicComponentEventArgs> = new Subject();

    constructor(private resolver: ComponentFactoryResolver) {
        this.dynamicComponentEventChannel.subscribe((eventArgs: DynamicComponentEventArgs) => {
            if (eventArgs.eventType === DynamicComponentEventType.Closed
                || eventArgs.eventType === DynamicComponentEventType.Canceled) {
                setTimeout(() => this.currentComponent.destroy());
                this.editMode = false;
            }

            if (eventArgs.eventType !== DynamicComponentEventType.Canceled) {
                this.index(this.dataItem, this.field, eventArgs.value);
            }
        });
    }

    ngOnDestroy() {
        this.dynamicComponentEventChannel.unsubscribe();
    }

    onCellClicked(event: MouseEvent) {
        if (this.editable === "true") {
            this.editMode = true;
            if (this.currentComponent) {
                this.currentComponent.destroy();
            }

            let componentType: any = TexboxCellComponent;
            if (this.dataType && this.dataType === "date") {
                componentType = DateComponent;
            }

            this.createDynamicComponent({
                component: componentType, inputs: {
                    eventChannel: this.dynamicComponentEventChannel,
                    value: this.index(this.dataItem, this.field)
                }
            });
        }
    }

    private editMode: Boolean = false;
    @Input()
    private editable: string;
    get isInEditMode() {
        return this.editable === "true" && this.editMode;
    }

    // component: Class for the component you want to create
    // inputs: An object with key/value pairs mapped to input name/input value
    private createDynamicComponent(data: DynamicComponentCreationArgs) {
        if (!data) {
            return;
        }

        // Inputs need to be in the following format to be resolved properly
        let inputProviders = Object.keys(data.inputs).map((inputName) => { return { provide: inputName, useValue: data.inputs[inputName] }; });
        let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

        // We create an injector out of the data we want to pass down and this components injector
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.editableCellContainer.parentInjector);

        // We create a factory out of the component we want to create
        let factory = this.resolver.resolveComponentFactory(data.component);

        // We create the component using the factory and the injector
        let component = factory.create(injector);

        // We insert the component into the dom container
        this.editableCellContainer.insert(component.hostView);

        // We can destroy the old component is we like by calling destroy
        if (this.currentComponent) {
            this.currentComponent.destroy();
        }

        this.currentComponent = component;
    }

    private index(obj: any, is: any, value?: any): any {
        if (typeof obj === 'undefined') {
            return undefined;
        }

        if (typeof is == 'string')
            return this.index(obj, is.split('.'), value);
        else if (is.length == 1 && value !== undefined)
            return obj[is[0]] = value;
        else if (is.length == 0)
            return obj;
        else {
            // if we are setting value and the property is missing create one
            if (value !== undefined && typeof obj[is[0]] === 'undefined' && is.length > 1) {
                obj[is[0]] = {}
            }
            return this.index(obj[is[0]], is.slice(1), value);
        }
    }
}

@Component({
    selector: '[data-table-row]',
    template: `
            <td *ngFor="let column of columns" [style.width.%]="column.width">
                <data-table-cell [dataItem]="dataItem"
                                 [field]="column.field"
                                 [dataType]="column.dataType"
                                 [editable]="column.editable"
                                 [command]="column.command"
                                 [onDelete]="column.onDelete"
                                 >
                </data-table-cell>
            </td>`
})
export class DataTableRowComponent {
    @Input()
    dataItem: any;

    @Input()
    columns: DataTableColumnDefinition[];

    @Input()
    dataTableContext: DataTableContext;

    selected: Boolean = false;

    onClick() {
        this.dataTableContext.onRowSelected.next(this);
    }
}

class DataTableContext {
    onRowSelected: Subject<DataTableRowComponent> = new Subject();
}

@Component({
    selector: 'data-table',
    templateUrl: "app/dataTable/data-table.component.html"
})
export class DataTableComponent {
    @Input()
    data: Observable<any[]>;
    context: DataTableContext = new DataTableContext();

    @ContentChildren(DataTableColumnDefinition) columnsDefinitions: QueryList<DataTableColumnDefinition>;
    @ViewChildren(DataTableRowComponent) dataTableRows: QueryList<DataTableRowComponent>;

    columns: any[] = [];

    ngAfterViewChecked() {
        this.columns = this.columnsDefinitions.toArray();
        this.context.onRowSelected.subscribe((selectedRow: DataTableRowComponent) => {
            this.dataTableRows.forEach((row) => {
                row.selected = false
            });
            selectedRow.selected = true;
        });
    }

    ngOnDestroy() {
        this.context.onRowSelected.unsubscribe();
    }
}


