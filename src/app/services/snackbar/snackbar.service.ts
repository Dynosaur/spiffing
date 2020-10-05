import { EventEmitter, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface SnackbarData {
    content: string;
    button?: string;
    duration?: number;
}

type SnackbarEvent = 'NEW' | 'DESTROYED';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    private notifications: SnackbarData[] = [];
    private visibleNotifs = 0;
    private maxVisibleNotifs = 3;

    // private snackEventStream = new EventEmitter<SnackbarEvent>();

    constructor(private snack: MatSnackBar) {
        // this.snackEventStream.subscribe(() => {console.log('hello')});
    }

    public push(content: string, button?: string, duration?: number): void {
        this.notifications.push({ content, button, duration });
        console.log('HELLOOOOFUCKERS')
        this.onSnackEvent('NEW');
    }

    private onSnackEvent(event: SnackbarEvent): void {
        switch (event) {
            case 'NEW':
                console.log('new');
                if (this.visibleNotifs < this.maxVisibleNotifs) {
                    const notif = this.notifications.pop();
                    this.snack.open(notif.content, notif.button, { duration: notif.duration });
                    this.visibleNotifs++;

                    if (notif.duration) {
                        setTimeout(() => this.onSnackEvent('DESTROYED'), notif.duration);
                    }
                }
                break;
            case 'DESTROYED':
                console.log('destroyed');
                this.visibleNotifs--;
        }
    }
}
