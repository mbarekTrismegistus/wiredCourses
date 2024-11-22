import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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


@Component({
  selector: 'app-course',
  standalone: true,
  imports: [HlmSkeletonComponent, HlmInputDirective, HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective, HlmSeparatorDirective, HlmButtonDirective, BrnSeparatorComponent, HlmScrollAreaComponent, RouterOutlet, VgBufferingModule, VgCoreModule, VgControlsModule, VgOverlayPlayModule],
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

  constructor(private route: ActivatedRoute, private http: HttpClient){
    this.http.get("/api/auth/session", { withCredentials: true }).subscribe(res => {
      this.session = res
    })
  }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get(`/api/courses/${this.courseId}`).subscribe((res) => {
      console.log(res)
      this.course = res
      
    })
        
  }

  changeIndex(index: number){
    this.coursePlaylistindex = index
    this.videoFileContainer.nativeElement.load();
    this.videoFileContainer.nativeElement.play()
  }

  comment(content: string, courseId: any){
    let data = {
      content: content,
      userId: this.session.id,
      courseId: courseId
    }
    this.http.post(`/api/comment`, data).subscribe((res) => {
      console.log(res)
      
    })

  }
}
