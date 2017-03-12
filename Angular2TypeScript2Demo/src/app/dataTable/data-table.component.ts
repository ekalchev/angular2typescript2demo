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
    Injector
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
        @Attribute('data-type') public dataType: string) {
    }
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

    onEditCompleted() {
        if (this.parentNotification && !this.closing) {
            this.closing = true;
            this.parentNotification.next({ eventType: DynamicComponentEventType.Closed, value: this.value });
        }
    }

    onEditCancel() {
        if (this.parentNotification && !this.closing) {
            this.closing = true;
            this.parentNotification.next({ eventType: DynamicComponentEventType.Canceled, value: this.value });
        }
    }
}

@Component({
    selector: 'date-cell',
    template: `<input type="date" [(ngModel)]="value" (blur)="onEditCompleted()" (keyup.escape)="onEditCancel()" (keyup.enter)="onEditCompleted()" setFocus />`
})
export class DateComponent extends DynamicComponent {
    constructor(protected injector: Injector) {
        super();
        this.parentNotification = this.injector.get('eventChannel');
        this.value = this.injector.get('value');
    }
}

@Component({
    selector: 'textbox-cell',
    template: `<input (keyup.enter)="onEditCompleted()" (blur)="onEditCompleted()" (keyup.escape)="onEditCancel()" [(ngModel)]="value" class="form-control" setFocus />`
})
export class TexboxCellComponent extends DynamicComponent {
    constructor(protected injector: Injector) {
        super();
        this.parentNotification = this.injector.get('eventChannel');
        this.value = this.injector.get('value');
    }
}

@Component({
    selector: 'data-table-cell',
    entryComponents: [TexboxCellComponent, DateComponent], // Reference to the components must be here in order to dynamically create them
    template: `<div (click)="onCellClicked($event)" *ngIf="!isInEditMode" class="display-cell">{{ dataItem[field] }}</div>
                <div #editableCellContainer></div>`
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

    dynamicComponentEventChannel: Subject<DynamicComponentEventArgs> = new Subject();

    constructor(private resolver: ComponentFactoryResolver) {
        this.dynamicComponentEventChannel.subscribe((eventArgs: DynamicComponentEventArgs) => {
            if (eventArgs.eventType === DynamicComponentEventType.Closed
                || eventArgs.eventType === DynamicComponentEventType.Canceled) {
                setTimeout(() => this.currentComponent.destroy());
                this.editMode = false;
            }
            
            if (eventArgs.eventType !== DynamicComponentEventType.Canceled) {
                this.dataItem[this.field] = eventArgs.value;
            }
        });
    }

    ngOnDestroy() {
        this.dynamicComponentEventChannel.unsubscribe();
    }

    onCellClicked(event: MouseEvent) {
        this.editMode = true;
        if (this.currentComponent) {
            this.currentComponent.destroy();
        }

        let componentType:any = TexboxCellComponent;
        if (this.dataType && this.dataType === "date") {
            componentType = DateComponent;
        }

        this.createDynamicComponent({
            component: componentType, inputs: {
                eventChannel: this.dynamicComponentEventChannel,
                value: this.dataItem[this.field]
            }
        });
    }

    private editMode: Boolean = false;
    private allowEdit: Boolean = true;
    get isInEditMode() {
        return this.allowEdit && this.editMode;
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
}

@Component({
    selector: 'data-table',
    templateUrl: "app/dataTable/data-table.component.html"
})
export class DataTableComponent implements AfterViewInit {
    @Input()
    data: Observable<any[]>;
    @ContentChildren(DataTableColumnDefinition) columnsDefinitions: QueryList<DataTableColumnDefinition>;
    columns: any[] = [];

    ngAfterViewInit() {
        this.columns = this.columnsDefinitions.toArray();
    }
}


