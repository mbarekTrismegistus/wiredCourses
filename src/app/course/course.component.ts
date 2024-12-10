import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HttpClient } from '@angular/common/http';
import { Component, inject, input, numberAttribute } from '@angular/core';
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
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideEye, lucideOption, lucideTrash, lucidePencilLine } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmMenuComponent, HlmMenuGroupComponent, HlmMenuItemDirective, HlmMenuLabelComponent, HlmMenuSeparatorComponent } from '@spartan-ng/ui-menu-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui-alertdialog-helm';
import { BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective } from '@spartan-ng/ui-alertdialog-brain';
import { createClient } from '@supabase/supabase-js';

interface Todo {
  id: string
  title: string
}

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective, HlmAlertDialogActionButtonDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogContentComponent,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogTitleDirective,BrnMenuTriggerDirective, HlmMenuItemDirective, HlmMenuLabelComponent, HlmMenuGroupComponent, HlmMenuSeparatorComponent, HlmMenuComponent, HlmIconComponent, RouterLink, CommentsListComponent, HlmSkeletonComponent, HlmInputDirective, HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective, HlmSeparatorDirective, HlmButtonDirective, BrnSeparatorComponent, HlmScrollAreaComponent, RouterOutlet, VgBufferingModule, VgCoreModule, VgControlsModule, VgOverlayPlayModule],
  providers: [provideIcons({lucideEye, lucideEllipsis, lucideTrash, lucidePencilLine})],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {

  id = input()
  
  course: any
  supabase: any
  coursePlaylistindex: number = 0
  videoFileContainer: any;
  moment: any = moment
  session: any
  comments: any
  queryClient = inject(QueryClient)
  viewCounted: boolean = false

  Commentgroup:any = {}

  constructor(private route: ActivatedRoute, private http: HttpClient){
    this.http.get("/api/auth/session", { withCredentials: true }).subscribe(res => {
      this.session = res
    })
    
    this.supabase = createClient("https://ruwfyzzkwvwtombvswpa.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1d2Z5enprd3Z3dG9tYnZzd3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1OTM3NTEsImV4cCI6MjA0NzE2OTc1MX0.LS_PWRczbZdHtBDzHF5HqpzZspxHMS_-AUnv_e1l8IM")
        this.supabase
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            {
            event: 'INSERT',
            schema: 'public',
            },
            (payload: any) => {
                console.log("listening", payload)
                this.queryClient.invalidateQueries({queryKey: ['comments']})

            }
            )
            .subscribe()
        
  }


  query = injectQuery(() => ({
    queryKey: ['course', this.id()],
    queryFn: async() => {
      let data = await lastValueFrom(this.http.get<any>(`/api/courses/${this.id()}`))
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

      return lastValueFrom(this.http.post(`/api/comment`, data, {withCredentials: true}))
    },
    onSuccess: () => {
      
      this.queryClient.invalidateQueries({ queryKey: ['course'] })
    },
  }))

  countView = injectMutation(() => ({
    mutationFn: () => {
      console.log("hello")
      return lastValueFrom(this.http.post(`/api/courses/countView`, {id: Number(this.id())}, {withCredentials: true}))
    },
    onSuccess: () => {
      this.viewCounted = true
    },
  }))



}
