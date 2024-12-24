import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
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
  injectInfiniteQuery,
  injectMutation,
  injectQuery,
  QueryClient
} from '@tanstack/angular-query-experimental'
import { lastValueFrom } from 'rxjs';
import { CommentsListComponent } from '../comments-list/comments-list.component';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideEye, lucideOption, lucideTrash, lucidePencilLine, lucideLoaderCircle, lucideStar } from '@ng-icons/lucide';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';



@Component({
  selector: 'app-course',
  standalone: true,
  imports: [ReactiveFormsModule, BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective, HlmAlertDialogActionButtonDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogContentComponent,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogTitleDirective, JsonPipe, BrnMenuTriggerDirective, HlmMenuItemDirective, HlmMenuLabelComponent, HlmMenuGroupComponent, HlmMenuSeparatorComponent, HlmMenuComponent, HlmIconComponent, RouterLink, CommentsListComponent, HlmSkeletonComponent, HlmInputDirective, HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective, HlmSeparatorDirective, HlmButtonDirective, BrnSeparatorComponent, HlmScrollAreaComponent, RouterOutlet, VgBufferingModule, VgCoreModule, VgControlsModule, VgOverlayPlayModule],
  providers: [provideIcons({lucideEye, lucideStar, lucideEllipsis, lucideTrash, lucidePencilLine, lucideLoaderCircle})],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {

  id = input()
  
  course: any
  coursePlaylistindex: number = 0
  videoFileContainer: any;
  moment: any = moment
  session: any
  comments: any
  queryClient = inject(QueryClient)
  viewCounted: boolean = false

  Commentgroup:any = {}

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router){
    this.http.get("/api/auth/session", { withCredentials: true }).subscribe(res => {
      this.session = res
    })
    
  }

  commentContent = new FormControl('')


  query = injectQuery(() => ({
    queryKey: ['course', this.id()],
    queryFn: async() => {
      let data = await lastValueFrom(this.http.get<any>(`/api/courses/${this.id()}`))
      return data
      
    }
  }))


  getRating = injectQuery(() => ({
    queryKey: ['rating', this.id()],
    queryFn: async() => {
      let data = await lastValueFrom(this.http.get<any>(`/api/getRating/${this.id()}/${this.session.id}`))
      return data
      
    }
  }))

  commentsList = injectInfiniteQuery(() => ({
    queryKey: ['comments', this.id()],
    queryFn: async({ pageParam }) => {
      let data = await lastValueFrom(this.http.get<any>(`/api/courses/comments/${this.id()}?cursor=${pageParam}`))
      this.Commentgroup = {}
      data.data.forEach((c: any) => {
        this.Commentgroup[c.parrentId] ||= []
        this.Commentgroup[c.parrentId].push(c)
      })
      return {data: this.Commentgroup, nextCursor: data.nextCursor}
      
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      console.log(lastPage.nextCursor)
      return lastPage.nextCursor ?? undefined
    },

    

  }))
  fetchNextPage() {
    // Do nothing if already fetching
    if (this.commentsList.isFetching()) return
    this.commentsList.fetchNextPage()
  }

  nextButtonDisabled = computed(
    () => !this.#hasNextPage() || this.#isFetchingNextPage(),
  )
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Loading more...'
      : this.#hasNextPage()
        ? 'Load newer'
        : 'Nothing more to load',
  )

  #hasNextPage = this.commentsList.hasNextPage
  #isFetchingNextPage = this.commentsList.isFetchingNextPage


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
      this.commentContent.setValue('')
      this.queryClient.invalidateQueries({ queryKey: ['comments'] })
      
    },

  }))

  rateCourse = injectMutation(() => ({
    mutationFn: (data: any) => {
      return lastValueFrom(this.http.post(`/api/rateCourse`, data, {withCredentials: true}))
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['rating'] })
    },

  }))



  countView = injectMutation(() => ({
    mutationFn: () => {
      return lastValueFrom(this.http.post(`/api/courses/countView`, {id: Number(this.id())}, {withCredentials: true}))
    },
    onSuccess: () => {
      this.viewCounted = true
    },
  }))

  deleteCourse = injectMutation(() => ({
    mutationFn: (data: any) => {
      return lastValueFrom(this.http.post(`/api/deleteCourse`, {id: data, userId: this.session.id}, {withCredentials: true}))
    },
    onSuccess: () => {
      this.router.navigate([`/discover`])
    },
  }))



}
