import {Component, OnInit} from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import {AuthService} from 'src/app/providers/auth.service';
import {EventService} from 'src/app/providers/event.service';
// services

/**
 * company header Component
 */
@Component({
    selector: 'company-header',
    templateUrl: './company-header.html',
    styleUrls: ['./company-header.scss'],
})
export class CompanyHeaderComponent implements OnInit{

    public selectedPage = 'view';

    public dir;

    public initials: string;

    public bgColorsAvailable: string[] = [
        '#39ca74',
        '#29bb9c',
        '#f19b2c',
        '#e54d42',
        '#3a99d8',
        '#f0c330',
    ];

    public bgColorWhenNoPhoto: string;

    constructor(
        public auth: AuthService,
        public navCtrl: NavController,
        public _menuCtrl: MenuController,
        public eventService: EventService,
    ) {
        this.eventService.profileUpdated$.subscribe(() => {
            this.nameTitle();
        });

        this.eventService.userLogined$.subscribe(() => {
            this.nameTitle();
        });
    }

    ngOnInit() {
        this.nameTitle();
    }

    async generateAgentInitial() {

        // get which color to use
        const colorNumber = (this.initials.charCodeAt(0)) % this.bgColorsAvailable.length;
        this.bgColorWhenNoPhoto = this.bgColorsAvailable[colorNumber];
    }

    /**
     * name intials
     */
    nameTitle() {
        if (this.auth.name) {
            const name = this.auth.name;
            const initials = name.match(/\b\w/g) || [];
            this.initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            this.generateAgentInitial();
        }
    }

    /**
     * Load page
     * @param page
     */
    loadPage(page) {
        this.selectedPage = page;
        this.navCtrl.navigateForward(page);
    }
}
