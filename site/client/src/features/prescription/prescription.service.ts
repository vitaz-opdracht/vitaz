import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Prescription} from "./prescription";
import {AbstractPaginationSortFilterService} from "../../pagination-sort/abstract-pagination-sort-filter.service";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root',})
export class PrescriptionService extends AbstractPaginationSortFilterService<Prescription> {
  constructor(protected override readonly httpClient: HttpClient) {
    super(httpClient, 'prescription');
  }

  findTotalCorrectRejectedCount(): Observable<{ total: number, correct: number, rejected: number }> {
    return this.httpClient.get<{
      total: number,
      correct: number,
      rejected: number
    }>('http://localhost:3000/prescription/totalCorrectRejectedCount');
  }

  /*findPrescriptionById(id: string): Observable<Prescription | null> {
      return this._httpClient
          .get<Prescription>(`http://localhost:3000/prescription/${id}`)
          .pipe(catchError(() => of(null)));
  }*/
}

interface DirReaderStats {
  amountOfFilesAddedToFolder: number;
  amountOfFilesInFolder: number;
  amountOfFilesProcessed: number;
}
