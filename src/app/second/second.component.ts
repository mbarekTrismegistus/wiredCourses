import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

interface Cat{
    id:string,
    url:string,
    width:number,
    height:number,
    breeds:Array<string>,
    favourite: Object

}

@Component({
  selector: 'app-second',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './second.component.html',
  styleUrl: './second.component.css'
})
export class SecondComponent implements OnInit {

  course!: SecondComponent;
  CourseId!: number;
  cat$!: Observable<Cat>;



  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient){
    
  }

  getCat(): Observable<Cat>{
    return this.http.get<Cat>('https://api.thecatapi.com/v1/images/0XYvRd7oD')
  }


  ngOnInit(): void {
    this.CourseId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.cat$ = this.getCat()
    
  }


  

  addUser(name: HTMLInputElement){
    console.log(name.value)
  }
  
  
  
}
