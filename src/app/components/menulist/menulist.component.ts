import { Component } from '@angular/core';
import { menuListModel } from '../../model/app.intertaces';
import { AppService } from '../../services/app.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrl: './menulist.component.scss'
})
export class MenulistComponent {
  menuListSubscription?:Subscription;
  menuList:menuListModel[]=[]
  constructor(private appService:AppService){

  }
  ngOnInit(){
    this.menuListSubscription = this.appService.getMenuList().subscribe((res:menuListModel[])=>{
      console.log(res)
      this.menuList=res;
    })
  }
  ngOnDestroy(){
    this.menuListSubscription?.unsubscribe();
  }
}
