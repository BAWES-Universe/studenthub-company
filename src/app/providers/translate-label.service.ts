import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class TranslateLabelService {

    convertedValue: string;

    /**
     * if content in english
     */
    isEnglish(s) {
        if (s && s[0]) {
            let english = /^[A-Za-z0-9_ ?<>~!@#$%^&*(){}/,.|-]*$/;
            return english.test(s[0]);
        }
        return false;
    }
    
    /**
     * json to string error message 
     * @param message 
     */
    errorMessage(message): string {

        if (message.length)
        {
            return message + '';
		}

        let a = [];

        for (let i in message) {

            if (!Array.isArray(message[i])) {
                a.push(message[i]);
                continue;
            }

            for (let j of message[i]) {
                a.push(j);
            }
        }

        return a.join('<br />');
    }
}
