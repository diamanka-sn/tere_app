import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'environment';
@Injectable({
  providedIn: 'root'
})
export class AbstractService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP error:', error);
    return throwError(error);
  }

  envoi<T>(lien: string, donnees: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/${lien}`, donnees)
      .pipe(catchError(this.handleError));
  }

  recuperer<T>(lien: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/${lien}`)
  }

  modifier<T>(lien: string, donnees: any): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}/${lien}`, donnees)
      .pipe(catchError(this.handleError));
  }

  supprimer<T>(lien: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}/${lien}`)
      .pipe(catchError(this.handleError));
  }
}
