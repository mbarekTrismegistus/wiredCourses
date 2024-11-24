import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective } from '@spartan-ng/ui-avatar-helm';
import moment from 'moment';
import {
  injectMutation,
  injectQuery,
  QueryClient
} from '@tanstack/angular-query-experimental'
import { lastValueFrom } from 'rxjs';
import { CommentsListComponent } from '../comments-list/comments-list.component';

interface Todo {
  id: string
  title: string
}

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [RouterLink, CommentsListComponent, HlmSkeletonComponent, HlmInputDirective, HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective, HlmSeparatorDirective, HlmButtonDirective, BrnSeparatorComponent, HlmScrollAreaComponent, RouterOutlet, VgBufferingModule, VgCoreModule, VgControlsModule, VgOverlayPlayModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {

  courseId: any
  course: any
  coursePlaylistindex: number = 0
  videoFileContainer: any;
  moment: any = moment
  session: any
  comments: any
  queryClient = inject(QueryClient)

  Commentgroup:any = {}

  constructor(private route: ActivatedRoute, private http: HttpClient){
    this.http.get("/api/auth/session", { withCredentials: true }).subscribe(res => {
      this.session = res
    })
  }

  query = injectQuery(() => ({
    queryKey: ['course'],
    queryFn: async() => {
      this.courseId = Number(this.route.snapshot.paramMap.get('id'));
      let data = await lastValueFrom(this.http.get<any>(`/api/courses/${this.courseId}`))
      this.Commentgroup = {}
      data.comments.forEach((c: any) => {
        this.Commentgroup[c.parrentId] ||= []
        this.Commentgroup[c.parrentId].push(c)
      })
      return data
      
    }
  }))


  


  changeIndex(index: number){
    this.coursePlaylistindex = index
    this.videoFileContainer.nativeElement.load();
    this.videoFileContainer.nativeElement.play()
  }

  mutation = injectMutation(() => ({
    mutationFn: (data: any) => {
      return lastValueFrom(this.http.post(`/api/comment`, data))
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['course'] })
    },
  }))


}
