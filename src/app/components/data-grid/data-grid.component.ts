import { Component } from '@angular/core';
import { socailMediaModel } from '../../model/app.intertaces';
import { AppService } from '../../services/app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss'
})
export class DataGridComponent {
  data: any[] = [];
  isPopupVisible:boolean=true
  constructor(private appService:AppService){}
  socialMedialist:socailMediaModel[] = []
  socialMedialistSubscription?:Subscription;
  ngOnInit(){
    this.socialMedialistSubscription= this.appService.getSocialList().subscribe((res:socailMediaModel[])=>{
      console.log(res);
      this.socialMedialist=res;
    })
  }
  ngOnDestroy(){
    this.socialMedialistSubscription?.unsubscribe();
  }
 
}
