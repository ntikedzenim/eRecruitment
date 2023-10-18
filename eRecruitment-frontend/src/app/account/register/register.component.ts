import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];

  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router){}


  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    })
  }

  register(){
    this.submitted = true;
    this.errorMessages = [];
    console.log(this.registerForm.value)
  if(this.registerForm.valid){
    this.accountService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/account/login');
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }
  }

}
