import { NavBar } from './navbar/navbar.component';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, RouterModule, NavBar],
  template: `<div><navbar/></div>`
})
export class AppComponent {
  

}
