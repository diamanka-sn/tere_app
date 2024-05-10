import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';

import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';

const MAT_COMPONENTS = [
  MatSelectModule,
  MatTableModule,
  MatSnackBarModule,
  MatPaginatorModule
]

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...MAT_COMPONENTS
  ], 
  exports:[
    FormsModule,
    ReactiveFormsModule,
    SearchComponent,
    HttpClientModule,
    ...MAT_COMPONENTS
  ]
})
export class SharedModule { }
