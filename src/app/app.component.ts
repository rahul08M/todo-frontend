import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'todo-app';
    constructor(
        private router: Router,
    ) {}

    ngOnInit(){
        if(JSON.parse(localStorage.getItem("user"))){
            this.router.navigateByUrl("/dashboard");
        }else{
          this.router.navigateByUrl("/login");
        }
    }

}
