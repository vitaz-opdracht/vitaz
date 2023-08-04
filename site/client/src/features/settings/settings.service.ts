import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Rule} from "./rule";

@Injectable({providedIn: 'root',})
export class SettingsService {
    constructor(private readonly httpClient: HttpClient) {
    }

    findAllRules(): Observable<Rule[]> {
        return this.httpClient.get<Rule[]>('http://localhost:3000/rule');
    }

    saveRules(rules: Rule[]): Observable<void> {
        return this.httpClient.post<void>('http://localhost:3000/rule', rules);
    }
}
