import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, combineLatest, first, from, interval, map, of, retry, switchMap, take, tap } from 'rxjs';
import { Book } from 'src/app/shared/interfaces/book';
import { AbstractService } from '../abstract.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  apiUrl = 'http://localhost:3000/';
  enpdoint = 'utilisateurs';
  serviceEndpoint = 'services';
  url = this.apiUrl + this.enpdoint;
  serviceUrl = this.apiUrl + this.serviceEndpoint;
  exObservable$ = from('whqvhqwd');
  ex2$ = of(Promise.resolve());
  reactiveInterval$ = interval(2000).pipe(
    tap((x) => console.log('before', x)),
    map((x) => x + 1),
    take(1)
  );
  user = localStorage.getItem('user');
  constructor(
    private httpClient: HttpClient,
    private abstract:AbstractService,
    private matSnackbar: MatSnackBar
  ) { }

  // getPaginatedBooks(options?: PaginationOptions): Observable<Book[]> {
  //   let params = new HttpParams();
  //   if (options) {
  //     params = params.set('_page', options.pageNumber.toString());
  //     params = params.set('_limit', options.pageSize.toString());
  //   }

  //   return this.httpClient.get<Book[]>(this.url, {params}).pipe(
  //     tap(books => console.log(books)),
  //     first(),
  //     retry(3),
  //     catchError((error) => {
  //       this.handleError(error);
  //       return of([]);
  //     })
  //   );
  // }

  getAllBooks(id:number): Observable<any[]> {
    return this.httpClient.get<Book[]>(this.url+"/"+id+"/books").pipe(
      tap(books => console.log(books)),
      first(),
      retry(3),
      catchError((error) => {
        this.handleError(error);
        return of([]);
      })
    );
  }

  getBookById(id: string) {
    return this.httpClient.get<Book>(this.url + '/' + id+'/books').pipe(
      tap(books => console.log(books)),
      first(),
      retry(3),
      catchError((error) => {
        this.handleError(error);
        return of(null);
      })
    );
  }

  postBook(id:number,book: Book) {
    return this.abstract.envoi(`utilisateurs/${id}/books`,  book)
  }
  
  patchBook(id: string, book: any) {
    return this.httpClient.patch(this.url + '/' + id, book).pipe(
      tap(console.log),
      catchError((error) => {
        this.handleError(error);
        return of(null);
      })
    )
  }

  deleteBook(id: string) {
    return this.httpClient.delete(this.url + '/' + id).pipe(
      tap(books => console.log(books)),
      first(),
    )
  }

  getMyService() {
    return this.httpClient.get<Book[]>(this.url).pipe(
      tap(books => console.log("before", books)),
      switchMap((books) => this.httpClient.get(this.serviceUrl + "/" + books[0].id)),
      tap(books => console.log("after", books)),
    );
  }

  getbooksEtServices() {
    combineLatest([
      this.httpClient.get<Book[]>(this.url),
      this.httpClient.get<any[]>(this.apiUrl + this.serviceEndpoint)
    ]).pipe().subscribe((data) => {
      const prod = data[0]
      const services = data[1];
    })
  }

  private handleError(error: any) {
    console.error(error);
    this.matSnackbar.open("Erreur! " + error?.message + " " + error?.status);
  }
}
