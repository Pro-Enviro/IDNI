import {AfterViewInit, Component, Input} from '@angular/core';
import {CarouselModule} from "primeng/carousel";
import {SharedModule} from "primeng/api";
import {ImageModule} from "primeng/image";

class carouselItems {
  title?: string;
  image?: string;
  content?: string;
}

@Component({
  selector: 'app-home-technology-tpl',
  standalone: true,
  imports: [
    CarouselModule,
    SharedModule,
    ImageModule
  ],
  templateUrl: './home-technology-tpl.component.html',
  styleUrl: './home-technology-tpl.component.scss'
})
export class HomeTechnologyTplComponent implements AfterViewInit{
  @Input('content') content: any;
  carouselItems?: carouselItems[];

  ngAfterViewInit(): void {
    this.carouselItems = this.content.items.map((x:any) => x.content_with_image_type_id)
  }

  responsiveOptions: any[] =  [
    {
      breakpoint: '1080px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '915px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '812px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '576px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}
