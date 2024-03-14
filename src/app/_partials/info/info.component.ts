import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {AccordionModule} from "primeng/accordion";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CarouselTplComponent} from "../carousel-tpl/carousel-tpl.component";
import {AccordionTplComponent} from "../accordion-tpl/accordion-tpl.component";
import {FooterComponent} from "../footer/footer.component";
import {HomeTechnologyTplComponent} from "../home-technology-tpl/home-technology-tpl.component";
import {RegistrationFormComponent} from "../../users/register/registration-form/registration-form.component";
import {ChatDialogTplComponent} from "../chat-dialog-tpl/chat-dialog-tpl.component";

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    InputTextModule,
    CarouselTplComponent,
    AccordionTplComponent,
    FooterComponent,
    HomeTechnologyTplComponent,
    RegistrationFormComponent,
    ChatDialogTplComponent
  ],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.8,
        backgroundColor: 'blue'
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements AfterViewInit{
  ngAfterViewInit(): void {
  }
  @ViewChild('ani', {static: false}) private ani: ElementRef<HTMLDivElement> | undefined;
  isTestDivScrolledIntoView: boolean = false;

  @HostListener('window:scroll', ['$event'])
  isScrolledIntoView(){
    if (this.ani){
      const rect = this.ani.nativeElement.getBoundingClientRect();
      const topShown = rect.top >= 0;
      const bottomShown = rect.bottom <= window.innerHeight;
      this.isTestDivScrolledIntoView = topShown && bottomShown;
      this.isOpen = !this.isOpen
    }
  }

  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }


}


/*

./assets/logo/name-logo.extention

 */
