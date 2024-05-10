import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/utils/local-storage.service';
import { phoneNumberValidator } from 'src/app/shared/validators/phone';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm = new FormGroup({
    phone: new FormControl('', [Validators.required, phoneNumberValidator(/^(77|78|75|70|76)[0-9]{7}$/)]),
    password: new FormControl('', [Validators.required])
  });

  formMaker = [
    { name: 'Numéro de téléphone', key: 'phone', type: 'text', control: this.loginForm.get('phone') as FormControl },
    { name: 'Mot de passe', key: 'password', type: 'password', control: this.loginForm.get('password') as FormControl }
  ];

  constructor(private authService: AuthService, private localStorageService: LocalStorageService,
    private matSnackbar: MatSnackBar,
    private router: Router,) {

  }
  submit() {
    console.log("djsjgzsdghhg")

    const formData = this.loginForm.value
    const _champs = ['phone', 'password']
    const getFormDataValue = (field: string) => formData[field as keyof typeof formData] || '';
    const _champManquante = _champs.filter(field => !getFormDataValue(field));

    if (_champManquante.length > 0) {
      this.matSnackbar.open('Remplir tous les champs.', 'Fermer', {
        duration: 3000,
      });
      return;
    }
    let data = {
      phone: formData.phone,
      password: formData.password
    }

    this.authService.login(data).pipe(
      tap((response: any) => {
        this.localStorageService.setItem('user', JSON.stringify(response));
        console.log(response)
        this.router.navigate(['/books']);
      }),
      catchError((error) => {
        this.matSnackbar.open('Numéro de téléphone et/ou mot de passe incorrecte.', 'Fermer', {
          duration: 3000,
        });
        return throwError(error);
      })
    ).subscribe();
  }
}
