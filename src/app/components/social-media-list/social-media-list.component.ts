import { Component } from '@angular/core';
import { socailMediaModel } from '../../model/app.intertaces';
import { AppService } from '../../services/app.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-social-media-list',
  templateUrl: './social-media-list.component.html',
  styleUrl: './social-media-list.component.scss'
})
export class SocialMediaListComponent {
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
