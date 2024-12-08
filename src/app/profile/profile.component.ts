import { HttpClient } from '@angular/common/http';
import { Component, inject, input, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';
import {
  injectMutation,
  injectQuery,
  QueryClient
} from '@tanstack/angular-query-experimental'
import { lastValueFrom, Subscription } from 'rxjs';
import moment from 'moment';
import { HlmCardContentDirective, HlmCardDirective, HlmCardFooterDirective, HlmCardHeaderDirective } from '@spartan-ng/ui-card-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HlmButtonDirective, HlmCardDirective,HlmCardHeaderDirective,HlmCardContentDirective, HlmCardFooterDirective, RouterLink, HlmAvatarComponent, HlmAvatarImageDirective, HlmAvatarFallbackDirective],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  id = input.required({
    transform: numberAttribute,
  })
  
  queryClient = inject(QueryClient)
  moment:any = moment




  constructor(private route: ActivatedRoute, private http: HttpClient, private socketService: SocketService){

  }



  query = injectQuery(() => ({
    queryKey: ['user', this.id()],
    queryFn: () => {
      console.log("fetching")
      return lastValueFrom(this.http.get<any>(`api/users/${this.id()}`))

    },
    staleTime: 0
  }))


}
