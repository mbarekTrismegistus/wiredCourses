import { CurrencyPipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from "@spartan-ng/ui-button-helm";


@Component({
    selector: "hello",
    standalone: true,
    imports: [RouterOutlet, CurrencyPipe, HlmButtonDirective],
    templateUrl: './hello.component.html',
})


export class Hello{
    title = "hello";
    setTitle(e: any){
        this.title = e.target.value;
    }

    isFinished = false;
    total = 124

    updateTitle(newTitle: string){
        this.title = newTitle;
    }

    @Input() prop = 0;
}