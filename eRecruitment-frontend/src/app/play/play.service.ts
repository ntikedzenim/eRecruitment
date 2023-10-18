import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayService {

  constructor(private httpClient: HttpClient, private router: Router) { } 

  getPlayers(){
    return this.httpClient.get(`${environment.eRecruitmentURL}/api/play/get-players`);
  }
}
