import { Component, forwardRef, inject, input } from '@angular/core';
import { CommentsListComponent } from '../comments-list/comments-list.component';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    forwardRef(() => CommentsListComponent),
    HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective, HlmInputDirective, HlmButtonDirective
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  comment: any = input({})
  allComments: any = input([])
  hidden:boolean = true
  inputHidden: boolean = true
  queryClient = inject(QueryClient)
  session:any
  userId: any = input([])

  constructor(private http: HttpClient){
    this.http.get("/api/auth/session", { withCredentials: true }).subscribe(res => {
      this.session = res
    })
  }

  toggleReplies(){
    this.hidden = !this.hidden
  }

  toggleInput(){
    this.inputHidden = !this.inputHidden
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
