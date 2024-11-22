import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HlmSkeletonComponent, HlmIconComponent, ReactiveFormsModule, HlmInputDirective, HlmButtonDirective, RouterOutlet, HlmLabelDirective],
  providers: [provideIcons({ lucideLoaderCircle })],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  error: string = ""
  courses: any
  laoding: boolean = false

  constructor(private http: HttpClient, private router: Router){

  }

  userData = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),

  })
  ngOnInit(): void {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    this.http.get("/api/randomCourse").subscribe((res) => {
      console.log(res)
      this.courses = res
    })
    
  }

  login(){
    this.laoding = true
    let data = this.userData.value
    this.http.post('/api/auth/login', data, { withCredentials: true, observe: 'response' }).subscribe(res => {
      console.log(res)
      if(res.ok){
        console.log("logged in")
        window.location.href = window.location.protocol + '//' + window.location.host;
      }
    }, (error) => {
      if(!error.ok){
        this.error = "False Info"
        this.laoding = false
      }
      console.log(error)
    })
  }

  googleAuth(data: any){
    console.log(data)
  }

}
