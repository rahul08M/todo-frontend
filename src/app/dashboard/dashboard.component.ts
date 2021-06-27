import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import $ from 'jquery';


export class noteFields {
  public noteTitle: string;
  public noteDetails: string;
  public noteColor: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  formClass = new noteFields();
  token = "";
  isToggled = false;
  isValid = true;
  updateId = "";

  titleError = "";
  detailsError = "";
  noteList = [];

  constructor(
    public http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(){
    if(JSON.parse(localStorage.getItem("user"))){
      this.token = JSON.parse(localStorage.getItem("user"))['token']
      if(!this.token){
        this.toastr.error("Invalid request.");
        this.router.navigateByUrl("/login");
      }
    }else{
      this.toastr.error("Invalid request.");
        this.router.navigateByUrl("/login");
    }
    this.getNotes();
  }

  //  toggle method
  toggle_details_area(bool){
    if(bool){
      this.isToggled = true;
    }
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }

  // get notes
  getNotes(){
    // headers
      let headers = new HttpHeaders(
        {
          'content-type': 'application/json',
          'Authorization': 'Token ' + JSON.parse(localStorage.getItem("user"))['token'],
        }
      );
      let options = { headers: headers };
    // headers
    this.http.get(environment.API_URL +'/api/v0/note/note/', options).
      subscribe(
          (res: any) => {
              if (res){
                  this.noteList = res;
              }
          },
          (err) => {
              // internal server error
          }
      )
  }
  // get notes

  // edit note
  edit_note(id, title, description, content){
    this.formClass.noteTitle = title;
    this.formClass.noteDetails = description;
    this.updateId = id;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }

  // edit form
  onEdit(form, updateId){
    var formValue = form.value;
    this.isValid = true;
    this.titleError = "";
    this.detailsError = "";
    if(!formValue.noteTitle){
      this.isValid = false;
      this.titleError = "*Please enter title.";
    }
    if(!formValue.noteDetails){
      this.isValid = false;
      this.detailsError = "*Please enter details.";
    }

    if(this.isValid){
      // headers
      let headers = new HttpHeaders(
          {
            'content-type': 'application/json',
            'Authorization': 'Token ' + JSON.parse(localStorage.getItem("user"))['token'],
          }
        );
        let options = { headers: headers };
         let api_body = JSON.stringify(
        {
          'color': formValue.color,
          'title': formValue.noteTitle,
          'description': formValue.noteDetails,

        }
      )
      form.reset();
      this.http.patch(
          environment.API_URL + '/api/v0/note/note/'+updateId+'/',
          api_body,
          options
        )
        .subscribe(
          (res) => {
          this.toastr.success('Updated successfully.');
          this.modalService.dismissAll();
          this.ngOnInit();

          },
          (err) => {
            this.toastr.error('Something went wrong.');
          }
        );
    }

  }

  // delete note
  delete_note(id){
    // headers
      let headers = new HttpHeaders(
        {
          'content-type': 'application/json',
          'Authorization': 'Token ' + JSON.parse(localStorage.getItem("user"))['token'],
        }
      );
      let options = { headers: headers };
    // headers
    this.http.delete(environment.API_URL +'/api/v0/note/note/'+id, options).
      subscribe(
          (res: any) => {
              this.toastr.success('Deleted successfully.');
              this.ngOnInit();
          },
          (err) => {
            this.toastr.error('Something went wrong.');
          }
      )
  }
  // delete note

   onSubmit(form) {

    var formValue = form.value;
    this.isValid = true;
    this.titleError = "";
    this.detailsError = "";
    if(!formValue.noteTitle){
      this.isValid = false;
      this.titleError = "*Please enter title.";
    }
    if(!formValue.noteDetails){
      this.isValid = false;
      this.detailsError = "*Please enter details.";
    }

    if(this.isValid){
      // headers
      let headers = new HttpHeaders(
          {
            'content-type': 'application/json',
            'Authorization': 'Token ' + JSON.parse(localStorage.getItem("user"))['token'],
          }
        );
        let options = { headers: headers };
      // headers
      // body
      let api_body = JSON.stringify(
        {
          'color': formValue.color,
          'title': formValue.noteTitle,
          'description': formValue.noteDetails,

        }
      )
      form.reset();
      // body
      this.http.post(
          environment.API_URL + '/api/v0/note/note/',
          api_body,
          options
        )
        .subscribe(
          (res) => {
          this.toastr.success('Saved successfully.');
          this.modalService.dismissAll();
          this.ngOnInit();

          },
          (err) => {
            this.toastr.error('Something went wrong.');
          }
        );
    }

    }

}
