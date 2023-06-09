import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private http: HttpClient) {}

  Find(skip: number, limit: number) {
    return this.http.get(environment.apiUrl + '/currency', {
      params: { skip, limit },
    });
  }

  SaveData(currencyData: any) {
    return this.http.post(environment.apiUrl + '/currency', currencyData);
  }

  FindbyID(id: any) {
    return this.http.get(environment.apiUrl + '/currency/' + id);
  }

  update(id: any, currencyData: any) {
    return this.http.patch(
      environment.apiUrl + '/currency/' + id,
      currencyData
    );
  }

  Removedata(id: any) {
    return this.http.delete(environment.apiUrl + '/currency/' + id);
  }
}
