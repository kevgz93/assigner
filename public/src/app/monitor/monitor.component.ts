import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {FormBuilder, FormGroup, Validators, FormControl,FormArray} from '@angular/forms';
import { convertToR3QueryMetadata } from '@angular/core/src/render3/jit/directive';


@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  public myform: FormGroup;
  public rotation = [];
  public users;
  private selectDisabled = true;
  private showTable = false;
  private btn = {modify:false,update:false};
  public displayedColumns = ['time','monday','tuesday','wednesday', 'thursday', 'friday'];

  constructor(private service: ApiService, private fb: FormBuilder) { }

  checkAdmin(session){
    if (session.role === 'admin'){
      this.btn.modify = true;
    }
  }

  private checkSessionId= () => {
    this.service.getUserBySessionId().subscribe(response =>{
      if(response.status === 201) {
        
        this.checkAdmin(response.body);
      }
      else{
        alert('error in the page, contact the administrator');
      }
    });
  }

  private getUsers = () => {
    this.service.getUsersRotation()
    .subscribe(users => {
      this.users = users;
    });
  }

  private getRotation = () => {
    this.service.getRotation()
    .subscribe(rot => {
      
      let rotat = rot.body[0];
      this.fillForm(rotat);
      

      //console.log(this.rotation);


      //this.rotation.push(this.rota);
      //console.log(this.rotation);
      
    });

    
  }

  public updateRotation = (data) => {
    this.service.updateRotation(data)
      .subscribe(response => {
        if (response.status != 204) {
          alert("error finding user");
        }
        else {
          alert("Rotation updated");
          this.cancelForm();
        }
      })

    return;
  }

  public modifyRotation = () =>{
    this.selectDisabled = false;
    this.btn.modify = false;
    this.btn.update = true;

  }

  public cancelForm = () =>{
    this.selectDisabled = true;
    this.btn.modify = true;
    this.btn.update = false;
    this.getRotation();
  }

  private fillForm = (rotation) =>{
    this.myform = this.fb.group({
      _id:rotation._id,
      monday: new FormGroup({
        morning: new FormControl(rotation.monday.morning),
        afternoon:new FormControl(rotation.monday.afternoon),
      }),
      tuesday: new FormGroup({
        morning: new FormControl(rotation.tuesday.morning),
        afternoon:new FormControl(rotation.tuesday.afternoon),
      }),
      wednesday: new FormGroup({
        morning: new FormControl(rotation.wednesday.morning),
        afternoon:new FormControl(rotation.wednesday.afternoon),
      }),
      thursday : new FormGroup({
        morning: new FormControl(rotation.thursday.morning),
        afternoon:new FormControl(rotation.thursday.afternoon),
      }),
      friday: new FormGroup({
        morning: new FormControl(rotation.friday.morning),
        afternoon:new FormControl(rotation.friday.afternoon),
      })
      
    });
    this.showTable = true;
  }

  ngOnInit() {
    this.checkSessionId();
    this.getUsers();
    this.getRotation();
  }

}
