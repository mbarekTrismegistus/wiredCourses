import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective } from '@spartan-ng/ui-avatar-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { lucideHouse } from '@ng-icons/lucide';
import { lucideBookPlus } from '@ng-icons/lucide';
import { lucideLogOut } from '@ng-icons/lucide';

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




@Component({
    selector: "navbar",
    standalone: true,
    imports: [HlmInputDirective, HlmIconComponent, HlmAvatarImageDirective, HlmIconComponent,BrnMenuTriggerDirective,HlmMenuComponent,HlmMenuGroupComponent,HlmMenuItemDirective,HlmMenuItemIconDirective,HlmMenuItemSubIndicatorComponent,HlmMenuLabelComponent,HlmMenuSeparatorComponent,HlmMenuShortcutComponent,HlmSubMenuComponent,RouterOutlet, HlmButtonDirective,RouterLink, RouterOutlet, RouterModule, HlmAvatarComponent, HlmAvatarFallbackDirective, HlmButtonDirective],
    providers: [provideIcons({lucideUser, lucideHouse, lucideBookPlus, lucideLogOut, lucideSearch})],
    template: `
        <nav class="flex px-5 py-3 sticky top-0 z-10 backdrop-blur-3xl">
            <p class="text-3xl self-start flex-1">Logo</p>
            <form class="flex gap-0 items-center me-3">
                <input type="text" class="rounded-l-full border-r-0 dark:border-zinc-400 focus-visible:ring-0 border-zinc-700 focus-visible: outline-0 focus-visible:ring-offset-0" placeholder="Search" hlmInput/>
                <button type="submit" hlmBtn size="icon" variant="outline" class="border-r border-t border-b border-l-0 border-zinc-700 dark:border-zinc-400 rounded-r-full">
                    <hlm-icon name="lucideSearch" size="22" class=""/>
                </button>
            </form>
            <div class="flex gap-3 self-end">
                @if (session) {
                    <hlm-avatar [brnMenuTriggerFor]="menu">
                        <img src='{{ session.picture }}' hlmAvatarImage />
                        <span class='text-white bg-zinc-500' hlmAvatarFallback>RG</span>
                        <ng-template #menu>
                            <hlm-menu class="w-56">
                                <hlm-menu-label class="font-bold">{{session.firstname + " " + session.lastname}}</hlm-menu-label>
                                <hlm-menu-separator />
                                <hlm-menu-group>
                                    <button hlmMenuItem>
                                        <hlm-icon name="lucideUser" hlmMenuIcon />
                                        <a routerLink="/profile">Profile</a>
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
    session: any;

    constructor(private http: HttpClient){ 
        this.http.get("http://localhost:1515/auth/session", { withCredentials: true }).subscribe(res => {
            this.session = res
        })
    }

    logout(){
        this.http.post("http://localhost:1515/auth/logout", {}, { withCredentials: true }).subscribe(res => {
            if(res){
                window.location.href = window.location.protocol + '//' + window.location.host;
            }
        })
    }


    


        
    

    



}