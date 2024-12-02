import { HttpClient } from '@angular/common/http';
import { Component, inject, input, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import moment from "moment"
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [HlmButtonDirective, RouterLink, HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective, HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  keywords = input.required()

  moment:any = moment

  constructor(private http: HttpClient){

  }

  queryClient = inject(QueryClient)

  query = injectQuery(() => ({
    queryKey: ['search', this.keywords()],
    queryFn: (data:any) => {
      return lastValueFrom(this.http.get<any>(`/api/search?keywords=${this.keywords()}`, { withCredentials: true }))
    }
  }))

}
