import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  QueryClient
} from '@tanstack/angular-query-experimental'
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  userId:any
  queryClient = inject(QueryClient)



  constructor(private route: ActivatedRoute, private http: HttpClient){

  }


  query = injectQuery(() => ({
    queryKey: ['user'],
    queryFn: async () => {
      this.userId = Number(this.route.snapshot.paramMap.get('id'));
      let data = await lastValueFrom(this.http.get<any>(`api/users/${this.userId}`))
      console.log(data)
      return data
    }
  }))


}
