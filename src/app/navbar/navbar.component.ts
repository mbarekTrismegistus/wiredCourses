import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective } from '@spartan-ng/ui-avatar-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';



@Component({
    selector: "navbar",
    standalone: true,
    imports: [RouterLink, RouterOutlet, RouterModule, HlmAvatarComponent, HlmAvatarImageDirective, HlmAvatarFallbackDirective, HlmButtonDirective],
    template: `
        <nav class="flex px-5 py-3 sticky">
            <p class="text-3xl self-start flex-1">Logo</p>
            <div class="flex self-center flex-1 gap-4">
                <a routerLink="/">home</a>
                <a routerLink="/second">second</a>
                <a routerLink="/second/1">second</a>
                <a routerLink="/addCourse">add course</a>
                <a routerLink="/registre">sign up</a>
                
            </div>
            <div class="flex gap-3 self-end">
                @if (session) {
                    {{session?.firstname}}
                }
                @else {
                    "login in bitch"
                }
                <hlm-avatar>
                    <img src='/assets/avatar.png' alt='spartan logo. Resembling a spartanic shield' hlmAvatarImage />
                    <span class='text-white bg-zinc-500' hlmAvatarFallback>RG</span>
                </hlm-avatar>
            </div>
        </nav>
        <router-outlet />
    `

})

export class NavBar{

    title = "nav-bar";
    session: any;

    constructor(private http: HttpClient){
        this.http.get("http://localhost:1515/auth/session", { withCredentials: true }).subscribe(res => {
            this.session = res
        })
    }


    


        
    

    



}