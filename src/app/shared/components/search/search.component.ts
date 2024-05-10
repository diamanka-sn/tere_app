import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-search',
    template: `
        <input type="text" [placeholder]="placeholderMessage" class="form-control" (keyup)="searchChanged($event)">
    `,
    styles: [``]
})
export class SearchComponent implements OnInit {
    @Input() placeholderMessage!: string;
    @Output() searched: EventEmitter<string> = new EventEmitter();
    constructor() { }

    ngOnInit(): void { } 

    searchChanged(ev: any) {
        const text: string = ev.target.value;
        this.searched.emit(text);
    }
}