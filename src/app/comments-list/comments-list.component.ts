import { Component, input } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [CommentComponent],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.css'
})
export class CommentsListComponent {
  comments: any = input([])
  allComments: any = input()
}
