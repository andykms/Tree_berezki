import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IUser } from '../models/user-response.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.apiUrl + '/user';

  getUser() {
    return this.http.get<IUser>(this.baseUrl);
  }
}