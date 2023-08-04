import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root',})
export class DirReaderStatsService {
  constructor(private readonly httpClient: HttpClient) {
  }

  findDirReaderStats(): Observable<DirReaderStats> {
    return this.httpClient.get<DirReaderStats>('http://localhost:8080');
  }
}

interface DirReaderStats {
  amountOfFilesAddedToFolder: number;
  amountOfFilesInFolder: number;
  amountOfFilesProcessed: number;
}
