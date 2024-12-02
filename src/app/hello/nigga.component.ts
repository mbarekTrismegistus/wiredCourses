import { CurrencyPipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterLink, RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from "@spartan-ng/ui-button-helm";


@Component({
    selector: "hello",
    standalone: true,
    imports: [RouterOutlet, CurrencyPipe, HlmButtonDirective, RouterLink],
    templateUrl: './hello.component.html',
})


export class Hello{
    title = "hello";
    

}