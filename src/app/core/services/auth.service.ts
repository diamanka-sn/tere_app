import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AbstractService } from './abstract.service';
import { LocalStorageService } from './utils/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private abstractService: AbstractService, private localSercice:LocalStorageService) {
  }
  loginStatus$ = new BehaviorSubject(false);

  getStatus() {
    return this.loginStatus$.asObservable();
  }

  private setStatus(stat: boolean) {
    this.loginStatus$.next(stat);
  }

  getUser(){
    return JSON.parse(this.localSercice.getItem("user"))
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    this.setStatus(true);
    return !!user;
  }

  login(data: any) {
    return this.abstractService.envoi('utilisateurs/login', data)
  }

  logout() {
    localStorage.clear();
    this.setStatus(false);
    this.router.navigate(['/login']);
  }
}
