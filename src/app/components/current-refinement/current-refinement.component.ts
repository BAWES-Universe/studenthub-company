import { Component, Inject, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { BaseWidget } from 'angular-instantsearch';
import { noop } from "angular-instantsearch/esm2015/utils";
import { connectCurrentRefinedValues } from "instantsearch.js/es/connectors";
import { InstantSearchComponent } from '../instant-search/instant-search.component';


@Component({
    selector: 'current-refinement',
    templateUrl: './current-refinement.component.html',
    styleUrls: ['./current-refinement.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CurrentRefinementComponent extends BaseWidget {

    @Input() attribute;
    @Input() transformItems;

    public attributes;
    public clearsQuery;
    public state;

    constructor(
        @Inject(forwardRef(() => InstantSearchComponent))
        public instantSearchParent
    ) {
        super('CurrentRefinementComponent');

        this.clearsQuery = false;

        this.state = {
            attributes: {},
            clearAllClick: noop,
            clearAllURL: noop,
            createURL: noop,
            refine: noop,
            items: []
        };
    }

    /**
     * Initialize widget 
     */
    public ngOnInit() {

        this.attributes = [this.attribute];

        let options = {
            includedAttributes: this.attributes
        };

        //connectCurrentRefinedValues
        if(this.instantSearchParent) { 
            this.createWidget(connectCurrentRefinedValues, options);
            super.ngOnInit();
        }
    }

    json() {
        return JSON.stringify(this.state.refinements, null, 4);
    }

    /**
     * @param {?} event
     * @param array refinement
     * @return null
     */
    handleClick(event, refinement) {
        event.preventDefault();
        event.stopPropagation();
        this.state.refine(refinement);
    }

    /**
     * @param {?} event
     * @return null
     */
    handleClearAllClick(event) {

        //let helper = this.instantSearchParent.instantSearchInstance.helper; 

        //on location clear, show results sorted by location 

        /*if(this.attribute == 'currentLocations.ar' || this.attribute == 'currentLocations.en') { 
            helper.setQueryParameter('getRankingInfo', true);
            helper.setQueryParameter('aroundLatLngViaIP', true);
            helper.setQueryParameter('aroundRadius', 'all');
        }*/

        this.instantSearchParent.instantSearchInstance.helper.clearRefinements(this.attribute);
        this.instantSearchParent.instantSearchInstance.refresh();
        
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * @return boolean 
     */
    isHidden() {
        return this.state.refinements && 
            this.state.refinements.filter(b => b.attributeName == this.attribute).length === 0;// && this.autoHideContainer;
    }

    /**
     * Return current selection comma(,) separated 
     */
    currentSelections() {
        
        if(!this.state || !this.state.refinements) {
            return false;    
        }

        let a = [];

        for (let b of this.state.refinements) {
            if(this.attribute && b.attributeName == this.attribute)
                a.push(b.computedLabel);
        } 

        return a.join(', ');
    }
} 