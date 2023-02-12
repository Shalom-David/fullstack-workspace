import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operation } from 'src/interfaces/operation';

@Injectable({
  providedIn: 'root',
})
export class AccountOperationsService {
  private accountOperations = 'http://localhost:8080/operations';
  constructor(private httpClient: HttpClient) {}

  getOperations(accountNumber: number): Observable<Operation[]> {
    return this.httpClient.get<Operation[]>(
      `${this.accountOperations}?accountNumber=${accountNumber}`
    );
  }

  postOperation(operation: Operation): Observable<Operation> {
    return this.httpClient.post<Operation>(this.accountOperations, operation);
  }
}
