import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective } from '@spartan-ng/ui-avatar-helm';
import { HlmCarouselComponent, HlmCarouselContentComponent, HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent} from '@spartan-ng/ui-carousel-helm';
import moment from 'moment'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [RouterLink, HlmSkeletonComponent, HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCarouselComponent, HlmCarouselContentComponent,HlmCarouselItemComponent,HlmCarouselNextComponent,HlmCarouselPreviousComponent, HlmButtonDirective, HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent {
  courses: any
  moment: any = moment
  
  

  constructor(private http: HttpClient){

  }

  ngOnInit(){
    this.http.get("/api/courses").subscribe((res) => {
      this.courses = res
    })
  }
}
