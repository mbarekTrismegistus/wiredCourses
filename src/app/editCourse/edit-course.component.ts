import { supabase } from './../utils/supabase';
import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { v4 as uuidv4 } from 'uuid';
import * as tus from 'tus-js-client';
import { environment } from '../../environments/environment';
import { provideIcons } from '@ng-icons/core';
import { lucideImage, lucideLoaderCircle } from '@ng-icons/lucide';
import { lucideVideo } from '@ng-icons/lucide';
import { lucideTrash } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { title } from 'process';
import { JsonPipe, NgIf } from '@angular/common';



@Component({
  selector: 'edit-add-course',
  standalone: true,
  imports: [JsonPipe, HlmSkeletonComponent, RouterOutlet, HlmInputDirective, HlmButtonDirective, HlmIconComponent, HlmLabelDirective, HlmSeparatorDirective, BrnSeparatorComponent],
  templateUrl: './edit-course.component.html',
  providers: [provideIcons({lucideVideo, lucideImage, lucideTrash, lucideLoaderCircle})],
})




export class EditCourseComponent {

  id = input()
  loading:boolean = false
  supabase: any = supabase
  file: Array<any> = []
  filesName: Array<any> = []
  progress: any
  thumbnail: string = ""
  session: any
  errorMsg = ""
  isValidate = true
  isValid = {
    course: {
        title: {
          isEmpty: false,
          msg: ""
        },
        description: {
          isEmpty: false,
          msg: ""
        }, 
        thumbnail: {
          isEmpty: false,
          msg: ""
        },
        duration: {
          isEmpty: false,
          msg: ""
        }
      },
      videos: {
        media: {
          isEmpty: false,
          msg: ""
        }
  }}
  isDeletingVid: boolean = false
  queryClient = inject(QueryClient)


  constructor(private http: HttpClient, private router: Router){
    this.http.get("/api/auth/session", { withCredentials: true }).subscribe(res => {
      this.session = res
  })
  }

  query = injectQuery(() => ({
    queryKey: ['course', this.id()],
    queryFn: async() => {
      let data = await lastValueFrom(this.http.get<any>(`/api/courses/${this.id()}`))
      this.file = data.videos
      this.filesName = data.videos
      this.thumbnail = data.thumbnail
      console.log(data.videos)
      return data
    }
  }))

  async handleUpload(event: any){


    let fileuuid = uuidv4()

    const avatarFile = event.target.files[0]
    


    return new Promise<void>((resolve, reject) => {
      var upload = new tus.Upload(avatarFile, {
          endpoint: `https://bqnwxzdqfkmujzqgkyvq.supabase.co/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
              authorization: `Bearer ${environment.SERVICEROLEKEY}`,
              'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
          metadata: {
              bucketName: "wiredcourses",
              objectName: `public/${fileuuid}.${avatarFile.name.split('.').pop()}`,
              contentType: avatarFile.type,
              cacheControl: "3600",
          },
          chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
          onError: function (error) {
              console.log('Failed because: ' + error)
              reject(error)
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
            this.progress = percentage
          },
          onSuccess: () => {
              console.log('Download %s from %s', upload.url)
              if(event.target.name === "media"){
                var video = document.createElement('video');
                video.preload = 'metadata';
            
                video.onloadedmetadata = () => {
                  window.URL.revokeObjectURL(video.src);
                  var duration = video.duration;
                  this.file.push({
                    duration: duration * 1000,
                    title: `${avatarFile.name}`,
                    size: avatarFile.size,
                    url: `https://bqnwxzdqfkmujzqgkyvq.supabase.co/storage/v1/object/public/wiredcourses/public/${fileuuid}.${avatarFile.name.split('.').pop()}`
                  })
                  console.log(this.file)
                }
                video.src = URL.createObjectURL(avatarFile);
                this.isValid.videos.media.isEmpty = false
              }
              else if(event.target.name === "thumbnail"){
                this.thumbnail = `https://bqnwxzdqfkmujzqgkyvq.supabase.co/storage/v1/object/public/wiredcourses/public/${fileuuid}.${avatarFile.name.split('.').pop()}`
              }
              this.progress = null
              resolve()
          },
      })


      // Check if there are any previous uploads to continue.
      return upload.findPreviousUploads().then(function (previousUploads) {
          // Found previous uploads so we select the first one.
          if (previousUploads.length) {
              upload.resumeFromPreviousUpload(previousUploads[0])
          }

          // Start the upload
          upload.start()
        
      })
    })
    

  }

  deleteVid = injectMutation(() => ({
    mutationFn: async (param: any) => {
      const { data, error } = await supabase
      .storage
      .from('wiredcourses')
      .remove([`public/${param.url.split("/").pop()}`])
      let res = await lastValueFrom(this.http.post("/api/deleteVid", {id: param.id}, {withCredentials: true}))
      return {res: res, param: param}
    },
    onSuccess: (data) => {
      console.log(data)
      this.file = this.file.filter((f) => {
        return f.url != data.param.url
      })
    }
  }))

  editCourse(title: string, des: string){
    
    if(title == ""){
      this.isValid.course.title.isEmpty = true
      this.isValid.course.title.msg = "Enter a title"
    }
    else{
      this.isValid.course.title.isEmpty = false
      this.isValid.course.title.msg = ""
    }
    if(des == ""){
      this.isValid.course.description.isEmpty = true
      this.isValid.course.description.msg = "Enter a description"
    }
    else{
      this.isValid.course.description.isEmpty = false
      this.isValid.course.description.msg = ""
    }
    if(this.thumbnail == ""){
      this.isValid.course.thumbnail.isEmpty = true
      this.isValid.course.thumbnail.msg = "Add A thumbnail"
    }
    else{
      this.isValid.course.thumbnail.isEmpty = false
      this.isValid.course.description.msg = ""
    }
    if(this.file.length == 0){
      this.isValid.videos.media.isEmpty = true
      this.isValid.videos.media.msg = "Add at least one video"
    }
    else{
      this.isValid.videos.media.isEmpty = false
      this.isValid.videos.media.msg = ""
    }
    if(!this.isValid.course.title.isEmpty && !this.isValid.course.description.isEmpty && !this.isValid.course.thumbnail.isEmpty && !this.isValid.videos.media.isEmpty){
      this.loading = true
      let duration = 0
      this.file.forEach((e:any) => {
        duration += e.duration
      })
  
      this.http.post<any>("/api/editCourse", {
        course:{
          id: Number(this.id()),
          title: title,
          description: des, 
          thumbnail: this.thumbnail,
          duration: duration
        },
        videos: {
          media: this.file
        }
      }, {withCredentials: true}).subscribe(res => {
        if(res){
          this.loading = false
          this.router.navigate([`/courses/${res.course[0].id}`])
        }
      })
    }

  }
}
