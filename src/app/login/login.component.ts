import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HlmInputDirective, HlmButtonDirective, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  error: string = ""

  constructor(private http: HttpClient, private router: Router){

  }

  userData = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),

  })

  login(){
    let data = this.userData.value
    this.http.post('http://localhost:1515/auth/login', data, { withCredentials: true, observe: 'response' }).subscribe(res => {
      if(res.ok){
        console.log("logged in")
        window.location.href = window.location.protocol + '//' + window.location.host;
      }
    }, (error) => {
      if(!error.ok){
        this.error = "error"
      }
      console.log(error)
    })
  }

}
