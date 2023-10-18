import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit{

  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];

  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router){
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user){
          this.router.navigateByUrl('/');
        }
      }
    })
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  login(){
    this.submitted = true;
    this.errorMessages = [];
    console.log(this.loginForm.value)
  if(this.loginForm.valid){
    this.accountService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/');
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }
  }

}
