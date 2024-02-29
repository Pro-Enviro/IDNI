import {Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-local-decab-multi-tpl',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    JsonPipe
  ],
  templateUrl: './local-decab-multi-tpl.component.html',
  styleUrl: './local-decab-multi-tpl.component.scss'
})
export class LocalDecabMultiTplComponent {
  @Input('content') content: any;


  getArticle = (id: number) => {
    console.log('magic');
  }
}
