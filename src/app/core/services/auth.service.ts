import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AbstractService } from './abstract.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private abstractService:AbstractService ) {
  }
  loginStatus$ = new BehaviorSubject(false);

  getStatus() {
    return this.loginStatus$.asObservable();
  }

  private setStatus(stat: boolean) {
    this.loginStatus$.next(stat);
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    console.log('Guard appele', !!user);
    this.setStatus(true);
    return !!user;
  }

  login(data:any) {
   return this.abstractService.envoi('utilisateurs/login', data)
  }

  logout() {
    localStorage.clear();
    this.setStatus(false);
    this.router.navigate(['/login']);
  }
}
