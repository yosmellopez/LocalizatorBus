import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class TranslateService {
    data: any = {};
    private lang: string = "";
    languageEmitter: EventEmitter<boolean> = new EventEmitter();

    constructor(private http: HttpClient) {
        this.lang = localStorage.getItem("lang") || "es";
        this.use();
    }

    use(): Promise<{}> {
        return new Promise<{}>((resolve, reject) => {
            const langPath = `assets/i18n/${this.lang || 'en'}.json`;
            return this.http.get<{}>(langPath).subscribe(
                translation => {
                    this.data = Object.assign({}, translation || {});
                    resolve(this.data);
                },
                error => {
                    console.log(error)
                    this.data = {};
                    resolve(this.data);
                }
            );
        });
    }

    translate(key: string) {
        let split: any[] = key.split(".");
        let currentObject: any = null;
        split.forEach(string => {
            if (!currentObject)
                currentObject = this.data[string];
            else
                currentObject = currentObject[string];
        });
        return currentObject || key;
    }

    getLang(): string {
        this.lang = localStorage.getItem("lang") || "es";
        console.log(this.lang);
        return this.lang;
    }

    setLang(lang: string) {
        this.lang = lang;
        localStorage.setItem("lang", lang);
        this.use().then(datos => {
            this.languageEmitter.emit(true);
        });
    }
}
