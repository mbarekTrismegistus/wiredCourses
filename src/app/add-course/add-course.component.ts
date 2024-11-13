import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { v4 as uuidv4 } from 'uuid';
import * as tus from 'tus-js-client';
import { environment } from '../../environments/environment';



@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [RouterOutlet, HlmInputDirective, HlmButtonDirective],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css'
})


export class AddCourseComponent {

  loading:boolean = false
  file: Array<String> = []
  progress: any


  constructor(private http: HttpClient){

  }

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
          onSuccess: function () {
              console.log('Download %s from %s', upload.url)
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

  addCourse(title: string, des: string, tId: string){
    this.loading = true
    this.http.post("http://localhost:1515/addCourse", {title: title, description: des, teacherId: Number(tId)}).subscribe(res => {
      if(res){
        this.loading = false
      }
    })

  }
}
