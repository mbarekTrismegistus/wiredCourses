import { Component, forwardRef, input } from '@angular/core';
import { CommentsListComponent } from '../comments-list/comments-list.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    forwardRef(() => CommentsListComponent)
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  comment: any = input({})
  allComments: any = input([])

  
}
