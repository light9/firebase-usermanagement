import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { AuthenticationService } from '../../../services/auth.service';

@Component({
  selector: 'ng-login-google',
  templateUrl: '../login-google/login-google.component.html',
  styleUrls: ['../login-google/login-google.component.css'],
})
export class LoginGoogleComponent{

  @Input('googleProviderConfig') config: string;
  @Input('redirectOnSucces') redirectOnSucces: string;
  
  @Output('onSucces') onSuccess: EventEmitter<auth.UserCredential> = new EventEmitter();
  @Output('onFailed') onFailed: EventEmitter<string> = new EventEmitter();

  googleProvider: auth.GoogleAuthProvider;
  
  constructor(
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router
    ) {

    this.googleProvider = new auth.GoogleAuthProvider();
    this.googleProvider.addScope('profile');
    this.googleProvider.addScope('email');

    // Using a redirect.
    this.authService.AngularFireAuth.auth.getRedirectResult().then((result) => {
      this.resultHandler(result);
    }).catch(error => this.errorHandler(error));
  }

  loginWithGoogle(){
    if (this.config === "redirect") this.signInWithRedirect();
    else this.signInWithPopup()
  }

  // Start a sign in process for an unauthenticated user.
  // with redirect to google login service
  signInWithRedirect(){
    this.authService.AngularFireAuth.auth.signInWithRedirect(this.googleProvider)
    .catch(error => this.errorHandler(error));
  }

  // Using a popup.
  signInWithPopup(){
    this.authService.AngularFireAuth.auth.signInWithPopup(this.googleProvider)
    .then((Credential) => this.resultHandler(Credential))
    .catch(error => this.errorHandler(error));
  }

  private resultHandler(result: auth.UserCredential): auth.UserCredential{
    //Check if we have a user
    if (result.user) {
      this.snackBar.open('welcome', '', { duration: 2000 });
      this.onSuccess.next(result);

      if (this.redirectOnSucces != null) {
        this.router.navigate([this.redirectOnSucces])
      }
    }
    return result;
  }

  private errorHandler(error: any): void {
    this.onFailed.next(error);
    this.snackBar.open(error.message, '', { duration: 2000 });
  }
}
