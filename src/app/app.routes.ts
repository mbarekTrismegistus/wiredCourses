import { Routes } from '@angular/router';
import { SecondComponent } from './second/second.component';
import { Hello } from './hello/nigga.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { RegistreComponent } from './registre/registre.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: "",
        component: Hello
    },
    {
        path: "second/:id",
        component: SecondComponent
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
    }
];
