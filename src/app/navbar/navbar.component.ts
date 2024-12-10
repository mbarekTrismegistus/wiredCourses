import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective } from '@spartan-ng/ui-avatar-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { lucideHouse } from '@ng-icons/lucide';
import { lucideBookPlus } from '@ng-icons/lucide';
import { lucideLogOut } from '@ng-icons/lucide';
import { lucideBell } from '@ng-icons/lucide';
import { createClient } from '@supabase/supabase-js';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import {
    injectMutation,
    injectQuery,
    QueryClient
  } from '@tanstack/angular-query-experimental'
  import { lastValueFrom } from 'rxjs';

import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideUser } from '@ng-icons/lucide';
import { lucideSearch } from '@ng-icons/lucide';
import moment from 'moment';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';




@Component({
    selector: "navbar",
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, HlmScrollAreaComponent, HlmSkeletonComponent, HlmInputDirective, HlmIconComponent, HlmAvatarImageDirective, HlmIconComponent,BrnMenuTriggerDirective,HlmMenuComponent,HlmMenuGroupComponent,HlmMenuItemDirective,HlmMenuItemIconDirective,HlmMenuItemSubIndicatorComponent,HlmMenuLabelComponent,HlmMenuSeparatorComponent,HlmMenuShortcutComponent,HlmSubMenuComponent,RouterOutlet, HlmButtonDirective,RouterLink, RouterOutlet, RouterModule, HlmAvatarComponent, HlmAvatarFallbackDirective, HlmButtonDirective],
    providers: [provideIcons({lucideBell, lucideUser, lucideHouse, lucideBookPlus, lucideLogOut, lucideSearch})],
    template: `
        <nav class="flex px-5 py-3 sticky top-0 z-10 backdrop-blur-3xl">
            <p class="text-3xl self-start flex-1">Logo</p>
            <div class="flex gap-0 items-center me-3">
                <input type="text" class="rounded-l-full border-r-0 dark:border-zinc-400 focus-visible:ring-0 border-zinc-700 focus-visible: outline-0 focus-visible:ring-offset-0" placeholder="Search" #search hlmInput [formControl]="searchParams"/>
                <a routerLink="/search" [queryParams]="{keywords: searchParams.value}" (click)="search.value = ''">
                    
                    <button type="submit" hlmBtn size="icon" variant="outline" class="border-r border-t border-b border-l-0 border-zinc-700 dark:border-zinc-400 rounded-r-full">
                        <hlm-icon name="lucideSearch" size="22" class=""/>
                    </button>
                </a>
            </div>
            <div class="flex gap-3 self-end items-center">
                    @if(query.isLoading()){
                        <hlm-skeleton class="w-10 h-10 rounded-full"></hlm-skeleton>
                    }
                    @else{
                        @if(query.data()){
                            @if(countUnreadComments(query.data()) > 0){
                                <div class="absolute text-sm min-w-4 min-h-4 text-center rounded-full bg-red-600 top-3">
                                    <p class="leading-4">{{ countUnreadComments(query.data()) }}</p>
                                </div>
                            }
                            <hlm-icon size="30" name="lucideBell" [brnMenuTriggerFor]="notifications">
                                <ng-template #notifications>
                                    <hlm-menu class="">
                                        <div>
                                            <hlm-menu-label class="text-lg font-bold">Notifications</hlm-menu-label>
                                            <hlm-menu-separator />
                                            <hlm-menu-group class="h-[26rem] overflow-y-scroll custom-scrollbar overflow-x-hidden">
                                                <div class="flex flex-col justify-center">
                                                    @for (item of query.data(); track $index) {
                                                        <a class="max-w-[24rem]" (click)="item.isRead ? null : readNotif.mutate(item.id)" routerLink="{{ item.notifyLink }}">
                                                            <div  class="flex items-center gap-4 hover:bg-zinc-800 p-2 rounded-lg">
                                                                <hlm-avatar>
                                                                    <img src='{{ item.sender.picture }}' hlmAvatarImage />
                                                                    <span class='text-white bg-zinc-500' hlmAvatarFallback>RG</span>
                                                                </hlm-avatar>
                                                                <div class="truncate min-w-0">
                                                                    <p class="truncate">{{ item.content }}</p>
                                                                    <p class="text-zinc-400 text-md">{{ moment(item.notificationDate).fromNow() }}</p>
                                                                </div>
                                                                @if(!item.isRead){
                                                                    <div class="min-w-3 min-h-3 bg-violet-600 rounded-full ms-auto"></div>
                                                                }
                                                            </div>
                                                            <hlm-menu-separator />
                                                        </a>
        
                                                    }
                                                </div>
                                            </hlm-menu-group>
                                        </div>
                                    </hlm-menu>
                                </ng-template>
                            </hlm-icon>
                        }
                    }
                @if (querySession.data()) {
                    <hlm-avatar [brnMenuTriggerFor]="menu">
                        <img src='{{ querySession.data().picture }}' hlmAvatarImage />
                        <span class='text-white bg-zinc-500' hlmAvatarFallback>RG</span>
                        <ng-template #menu>
                            <hlm-menu class="w-56">
                                <hlm-menu-label class="font-bold">{{querySession.data().firstname + " " + querySession.data().lastname}}</hlm-menu-label>
                                <hlm-menu-separator />
                                <hlm-menu-group>
                                    <button hlmMenuItem>
                                        <hlm-icon name="lucideUser" hlmMenuIcon />
                                        <a routerLink="/profile/{{ querySession.data().id }}">Profile</a>
                                    </button>
                                    <button hlmMenuItem>
                                        <hlm-icon name="lucideHouse" hlmMenuIcon />
                                        <a routerLink="/">Home</a>
                                    </button>
                                    <button hlmMenuItem>
                                        <hlm-icon name="lucideBookPlus" hlmMenuIcon />
                                        <a routerLink="/addCourse">Add Course</a>
                                        <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
                                    </button>
                                    <hlm-menu-separator />
                                </hlm-menu-group>
                                <hlm-menu-group>
                                    <button (click)="logout()" hlmMenuItem class="dark:hover:bg-red-800/[0.5] hover:bg-red-400/[0.5]">
                                        <hlm-icon name="lucideLogOut" hlmMenuIcon />
                                        <a routerLink="/">Log Out</a>
                                    </button>
                                </hlm-menu-group>
                            </hlm-menu>
                        </ng-template>
                    </hlm-avatar>
                }
                @else if (querySession.isLoading()) {
                    <div class="flex gap-4">
                        <hlm-skeleton class="w-10 h-10 rounded-full"></hlm-skeleton>
                    </div>
                }
                @else {
                    <div class="flex gap-4">
                        <button hlmBtn>
                            <a routerLink="/registre">Sign Up</a>
                        </button>
                        <button hlmBtn variant="outline">
                            <a routerLink="/login">Login</a>
                        </button>
                    </div>
                }
            </div>
            
        </nav>
        <router-outlet />
    `

})

export class NavBar{

    title = "nav-bar";
    queryClient = inject(QueryClient)

    supabase: any
    channel:any
    moment = moment

    searchParams: any = new FormControl('');



    constructor(private http: HttpClient){ 
        
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
                this.queryClient.invalidateQueries({queryKey: ['notifications']})
                this.queryClient.invalidateQueries({queryKey: ['course']})

            }
            )
            .subscribe()
        }



    logout(){
        this.http.post("/api/auth/logout", {}, { withCredentials: true }).subscribe(res => {
            if(res){
                window.location.href = window.location.protocol + '//' + window.location.host;
            }
        })
    }

    query = injectQuery(() => ({
        queryKey: ['notifications'],
        queryFn: () => {
            console.log("fetching")
            return lastValueFrom(this.http.get<any>(`api/notifications`, {withCredentials: true}))

        },
        staleTime: 0
    }))

    querySession = injectQuery(() => ({
        queryKey: ['session'],
            queryFn: () => {
                return lastValueFrom(this.http.get<any>("/api/auth/session", { withCredentials: true }))

        },
        staleTime: 0
    }))

    countUnreadComments(array: any){
        return array.filter((e:any) => ! e.isRead).length
    }


    readNotif = injectMutation(() => ({
        mutationFn: (id: any) => {
            return lastValueFrom(this.http.post(`api/readNotif`, {id: Number(id)}, {withCredentials: true}))
        },
        onSuccess: () => {
            this.queryClient.invalidateQueries({queryKey: ['notifications']})
        }
    }))


    


        
    

    



}