import { Component, forwardRef, inject, input } from '@angular/core';
import { CommentsListComponent } from '../comments-list/comments-list.component';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideLoaderCircle, lucidePencilLine, lucideTrash } from '@ng-icons/lucide';
import { HlmMenuComponent, HlmMenuGroupComponent, HlmMenuItemDirective, HlmMenuItemIconDirective, HlmMenuLabelComponent, HlmMenuSeparatorComponent, HlmMenuShortcutComponent, HlmSubMenuComponent } from '@spartan-ng/ui-menu-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    forwardRef(() => CommentsListComponent),
    HlmAvatarComponent, HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuItemIconDirective,
    HlmMenuLabelComponent,
    BrnMenuTriggerDirective,
    HlmMenuSeparatorComponent,
    HlmMenuShortcutComponent,
    HlmSubMenuComponent, BrnSeparatorComponent, HlmIconComponent, HlmSeparatorDirective, ReactiveFormsModule, HlmAvatarFallbackDirective, HlmAvatarImageDirective, HlmInputDirective, HlmButtonDirective
  ],
  providers: [provideIcons({lucideTrash, lucidePencilLine, lucideLoaderCircle, lucideEllipsis})],
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

  commentContent = new FormControl('')

  toggleReplies(){
    this.hidden = !this.hidden
  }

  toggleInput(){
    this.inputHidden = !this.inputHidden
  }

  reply = injectMutation(() => ({
    mutationFn: (data: any) => {
      return lastValueFrom(this.http.post(`/api/comment`, data))
    },
    onSuccess: () => {
      this.commentContent.setValue('')

      this.queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  }))
  deleteComment = injectMutation(() => ({
    mutationFn: (data: any) => {
      return lastValueFrom(this.http.post(`/api/deleteComment`, data, {withCredentials: true}))
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  }))

  
}
