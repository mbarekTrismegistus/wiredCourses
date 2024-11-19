import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [ReactiveFormsModule, HlmInputDirective, RouterOutlet, HlmButtonDirective, HlmIconComponent],
  providers: [provideIcons({lucideLoader, lucidePlus})],
  templateUrl: './registre.component.html',
  styleUrl: './registre.component.css'
})
export class RegistreComponent {

  loading: Boolean = false

  constructor(private http: HttpClient){

  }
  


  userData = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    age: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')

  })

  registre(){
    this.loading = true
    console.log(this.loading)
    let data = {
      ...this.userData.value,
      age: Number(this.userData.value.age),
    }
    this.http.post('/api/auth/registre', data, { withCredentials: true }).subscribe(res => {
      this.loading = false
      window.location.href = window.location.protocol + '//' + window.location.host;
      return res
    })

  }
}
