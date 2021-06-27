import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';


// login form fields
export class RegisterFields {
  public username: string;
  public password1: string;
  public password2: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // variables
  formClass = new RegisterFields();
  usernameError = "";
  password1Error = "";
  password2Error = "";
  isValid = true; // flag to check login form is validated or not

  constructor(
    public http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  usernameEvent($event){
    this.usernameError = "";
    if($event.length < 3){
      this.isValid = false;
      this.usernameError = "*Username must be minimum 3 character";
    }
  }

  password1Event($event){
    this.password1Error = "";
    if($event.length < 8){
      this.isValid = false;
      this.password1Error = "*Password must be minimum 8 character";
    }
  }

  password2Event($event){
    this.password2Error = "";
    if($event.length < 8){
      this.isValid = false;
      this.password2Error = "*Password must be minimum 8 character";
    }
  }

  onSubmit(form) {

    var formValue = form.value;
    this.isValid = true;

    this.password2Error = "";
    this.password1Error = "";
    this.usernameError = "";

    if(!formValue.username){
      this.isValid = false;
      this.usernameError = "*Please enter username.";
    }
    if(!formValue.password1){
      this.isValid = false;
      this.password1Error = "*Please enter password.";
    }
    if(!formValue.password2){
      this.isValid = false;
      this.password2Error = "*Please enter password.";
    }

    if(formValue.password1 && formValue.password2){
      if(formValue.password1 != formValue.password2){
        this.isValid = false;
        this.password2Error = "*Password and confirm password do not match";
      }
    }

    if(this.isValid){
        let headers = new HttpHeaders(
          {
            'content-type': 'application/json',
          }
        );
        let options = { headers: headers };
        let api_body = JSON.stringify(
        {
          'username': formValue.username,
          'password': formValue.password1
        }
        )
      this.http.post(
          environment.API_URL + '/api/v0/auth/register/',
          api_body,
          options
        )
        .subscribe(
          (res) => {
            this.toastr.success("Registration is successful");
            setTimeout(function () {
            this.router.navigateByUrl("/login");
          }.bind(this), 2000);
          },
          (err) => {
            if ("username" in err.error) {
              this.toastr.error(err.error.username[0]);
            }
          }
        );

    }

  }

}
