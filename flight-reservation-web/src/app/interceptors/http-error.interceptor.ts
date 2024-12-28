import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  snackbar = inject(MatSnackBar);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err)
        if (err.error[0].errorMessage) {
          // validation error
          this.snackbar.open(err.error[0].errorMessage)
        } else {
          this.snackbar.open("Nieznany błąd")
        }
        throw err;
      })
    )
  }
}
