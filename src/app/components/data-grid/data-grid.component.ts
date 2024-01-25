import { Component } from '@angular/core';
import { socailMediaModel } from '../../model/app.intertaces';
import { AppService } from '../../services/app.service';
import { Subscription } from 'rxjs';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss'
})
export class DataGridComponent {
  data: any[] = [];
  isPopupVisible:boolean=false;
  constructor(private appService:AppService){
    // yeni data eklendiğinde tabloya ekliyoruz ve modalı kapatıyoruz
    this.appService.formSubmit.subscribe({
      next:(data:socailMediaModel)=>{
        this.isPopupVisible=false;
        this.addDataToTable(data);
      }
    })
  }
  socialMedialist:socailMediaModel[] = []
  socialMedialistSubscription?:Subscription;
  ngOnInit(){
    //localde data varsa onu kullanıyoruz yoksa servisten alıyoruz
    let cachedData:boolean=this.cacheControl();
    if(!cachedData){
      this.generateTable();
    }
  };

  cacheControl():boolean{
    const data=localStorage.getItem('data');
    if(data){
      // data varsa setliyoruz ve diğer componentler için datayı emitliyoruz
      this.socialMedialist=JSON.parse(data);
      this.appService.dataFetched.emit(this.socialMedialist);
      return true;
    }
    else{
      return false;
    }
  }

  generateTable(){
    this.socialMedialistSubscription= this.appService.getSocialList().subscribe({
      next:(res:socailMediaModel[])=>{
        console.log(res);
        this.socialMedialist=res;
        this.setLocal(this.socialMedialist)
      },
      error:(e)=>{
        console.log(e);
        this.appService.showMessage('JSON serveri çalıştırınız','error')
      },
      complete:()=>{
       this.appService.dataFetched.emit(this.socialMedialist);
      }   
    })
  }
  setLocal(data:any):void{
    localStorage.setItem("data",JSON.stringify(data))
  }
  addRowRequest(){
    this.isPopupVisible=true;
  }

  addDataToTable(data:socailMediaModel){
    this.socialMedialist.push(data);
    localStorage.setItem("data",JSON.stringify(  this.socialMedialist))
  }
  ngOnDestroy(){
    this.socialMedialistSubscription?.unsubscribe();
  }
}
