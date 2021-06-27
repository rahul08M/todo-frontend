import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

// login form fields
export class loginFields {
  public username: string;
  public password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent  {

  // variables
  formClass = new loginFields();

  usernameError = "";
  passwordError = "";

  isValid = true;   // flag to check login form is validated or not

  constructor(
      public http: HttpClient,        // to get api related access
      private toastr: ToastrService,  // to get toaster
      private router: Router          // to get router
  ) { }

  // login form submit method
  onSubmit(form) {

    var formValue = form.value;
    this.isValid = true;

    this.passwordError = "";
    this.usernameError = "";

    // basic form validations
    if(!formValue.username){
      this.isValid = false;
      this.usernameError = "*Please enter username.";
    }
    if(!formValue.password){
      this.isValid = false;
      this.passwordError = "*Please enter password.";
    }

    if(this.isValid){

        // api call
        let headers = new HttpHeaders( { 'content-type': 'application/json', } );
        let options = { headers: headers };
        let api_body = JSON.stringify( { 'username': formValue.username, 'password': formValue.password } )

        this.http.post( environment.API_URL + '/api/v0/auth/login/', api_body, options )
        .subscribe(
          (res) => {
            localStorage.setItem("user", JSON.stringify(res));
            this.toastr.success("Login successful");
            setTimeout(function () {
            this.router.navigateByUrl("/dashboard");
          }.bind(this), 1000);
          },
          (err) => {
            this.toastr.error('Invalid login details.');
          }
        );
    }

  }

}
