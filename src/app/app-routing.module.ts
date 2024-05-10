import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LoginComponent } from './features/login/login.component';

const routes: Routes = [
  
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'books',
    loadChildren: () => import('./features/book/book.module').then(m => m.BookModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
