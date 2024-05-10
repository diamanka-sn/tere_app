import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  success: boolean = false
  error: boolean = false
  isloading: boolean = false
  message: string = ""
  mainMessage:string = ""
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

  constructor(private bookService: BookService, private matSnackbar: MatSnackBar, private authService: AuthService, private localSercice: LocalStorageService) {

  }

  ngOnInit(): void {
    this.getUser()
    this.getbooks();

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
    this.success = false
    this.error = false
    this.message = ""

    if (this.bookForm.valid) {
      this.isloading = true
      const formData = this.bookForm.value
      let data: Book = {
        title: formData.title?.trim()!,
        author: formData.author?.trim()!,
        description: formData.description?.trim()!,
        status: formData.status!
      }
      this.bookService.postBook(this.utilisateur.id, data).subscribe((res: any) => {
        console.log(res)
        if (res) {
          this.success = true
          this.message = "Livre ajouter avec success"
          this.getbooks()
          this.bookForm.reset()
          this.isloading = false
        } else {
          this.error = true
          this.message = "Livre ajouter avec success"
        }
      })
    }
  }

  async getbooks() {
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
  supprimer(b: Book) {
    const confirmation = window.confirm("Voulez vous vraiment supprimer le livre?");

    if (confirmation) {
      this.bookService.deleteBook(this.utilisateur?.id, Number(b.id)).subscribe((res: any) => {
        if(!res){
          this.matSnackbar.open('Livre supprimer avec succes.', 'Fermer', {
            duration: 3000,
          });
          this.getbooks()
        } else {
          this.matSnackbar.open('Erreur lors de la suppression.', 'Fermer', {
            duration: 3000,
          });
          return;
        }
       
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
