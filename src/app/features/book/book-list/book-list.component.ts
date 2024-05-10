import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, first, lastValueFrom, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { BookService } from 'src/app/core/services/book/book.service';
import { LocalStorageService } from 'src/app/core/services/utils/local-storage.service';
import { Book } from 'src/app/shared/interfaces/book';
import { FormMaker, FormOptions } from 'src/app/shared/interfaces/form-maker';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {

  @Input() data!: Book;
  books!: Book[];
  destroy$ = new Subject();
  searchMessage: string = "Rechercher un livre"
  utilisateur!: any
  bookForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required])
  });

  formMaker: FormMaker[] = [
    { name: "Titre", key: "title", type: "text", control: this.bookForm.get('title') as FormControl },
    { name: "Auteur", key: "author", type: "text", control: this.bookForm.get('author') as FormControl },
    { name: "Description", key: "description", type: "textarea", control: this.bookForm.get('description') as FormControl },
    { name: "Status", key: "status", type: "select", control: this.bookForm.get('status') as FormControl },
  ]

  statusType: FormOptions[] = [
    {
      name: 'Attente',
      value: 'waiting'
    },
    {
      name: 'En cours',
      value: 'inProgress'
    }, {
      name: 'Terminé',
      value: 'completed'
    }
  ]

  constructor(private bookService: BookService, private authService: AuthService, private localSercice: LocalStorageService) {

  }

  ngOnInit(): void {
    this.getUser()
    this.getProds();

    this.bookService.reactiveInterval$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((e) => {
        console.log(e);
      });

    this.authService.getStatus().pipe(
      takeUntil(this.destroy$),
      tap((x) => console.log('status', x))
    ).subscribe();
  }

  getUser() {
    this.utilisateur = this.authService.getUser()
  }

  onSubmit() {
    if (this.bookForm.valid) {

      const formData = this.bookForm.value
      let data: Book = {
        title: formData.title?.trim()!,
        author: formData.author?.trim()!,
        description: formData.description?.trim()!,
        status: formData.status!
      }
      this.bookService.postBook(this.utilisateur.id, data).subscribe((res:any) => {
        if(res.length>0){
          this.getProds()
          this.bookForm.reset()
        }
      })
    }
  }

  async getProds() {
    try {
      this.books = await lastValueFrom(
        this.bookService.getAllBooks(this.utilisateur.id)
          .pipe(
            takeUntil(this.destroy$),
            first(),
          )
      );
    } catch (error) {
      console.error(error)

    }
  }

  getOptions(ctrl: FormMaker): FormOptions[] {
    if (ctrl.type === 'select') {
      if (ctrl.key === 'status') {
        return this.statusType;
      }
    }
    return [];
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
