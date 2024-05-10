import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListComponent } from './book-list/book-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const bookRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: BookListComponent,
      }
    ]
  }
]

@NgModule({
  declarations: [
    BookListComponent
  ],
  imports: [
    RouterModule.forChild(bookRoutes),
    CommonModule,
    SharedModule
  ]
})
export class BookModule { }
