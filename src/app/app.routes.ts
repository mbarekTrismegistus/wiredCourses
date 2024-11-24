import { Routes } from '@angular/router';
import { Hello } from './hello/nigga.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { RegistreComponent } from './registre/registre.component';
import { LoginComponent } from './login/login.component';
import { DiscoverComponent } from './discover/discover.component';
import { ProfileComponent } from './profile/profile.component';
import { CourseComponent } from './course/course.component';

export const routes: Routes = [
    {
        path: "",
        component: Hello
    },
    {
        path: "courses/:id",
        component: CourseComponent
    },
    {
        path: "addCourse",
        component: AddCourseComponent
    },
    {
        path: "registre",
        component: RegistreComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "discover",
        component: DiscoverComponent
    },
    {
        path: "profile/:id",
        component: ProfileComponent
    }
];
