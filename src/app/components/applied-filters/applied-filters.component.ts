import { Component, Inject, forwardRef, Input } from '@angular/core';
import { BaseWidget } from 'angular-instantsearch';
import { capitalize, noop } from "angular-instantsearch/esm2015/utils";
import { connectCurrentRefinedValues } from "instantsearch.js/es/connectors";
import * as tslib_1 from "tslib";
import { Platform } from "@ionic/angular";
import { CurrencyPipe } from '@angular/common';
//services
import { AuthService } from '../../providers/auth.service';
//component
import { InstantSearchComponent } from '../instant-search/instant-search.component';


/**
 * Display filter selection
 */
@Component({
    selector: 'applied-filters',
    templateUrl: './applied-filters.component.html',
    styleUrls: ['./applied-filters.component.scss'],
})
export class AppliedFiltersComponent extends BaseWidget {

    @Input() loading;
    @Input() transformItems;
    @Input() attributes;
    @Input() currencies;

    @Input() labelWithFilter;
    @Input() labelWithoutFilter;

    public state;
    public total;

    public average = null;

    constructor(
        @Inject(forwardRef(() => InstantSearchComponent))
        public instantSearchParent,
        public authService: AuthService,
        public platform: Platform,
        public currencyPipe: CurrencyPipe
    ) {
        super('AppliedFiltersComponent');

        this.state = {
            attributes: {},
            clearAllClick: noop,
            clearAllURL: noop,
            createURL: noop,
            refine: noop,
            items: []
        };

        if (this.instantSearchParent) {
            this.instantSearchParent.change.subscribe(() => {

                let lastResults = this.instantSearchParent.instantSearchInstance.helper.lastResults;

                if (lastResults) {

                    this.total = lastResults.nbHits;
                }
            });
        }
    }

    /**
     * Initialize widget
     */
    public ngOnInit() {

        let options = {
            includedAttributes: this.attributes
        };

        if (this.instantSearchParent) {
            this.createWidget(connectCurrentRefinedValues, options);

            setTimeout(() => { // to protect dual request
                super.ngOnInit();
            },500)
        }
    }

    /*_createClearAllURL = function () {
      return connectCurrentRefinedValues.createURL(connectCurrentRefinedValues.clearRefinements({ helper: helper, whiteList: restrictedTo, clearsQuery: clearsQuery }));
    };*/

    /**
     * Return current selection for given attribute
     */
    refinements() {

        /** @type {?} */
        var items = typeof this.transformItems === "function"
            ? this.transformItems(this.state.refinements)
            : this.state.refinements;

        // group refinements by category? (attribute && type)
        return items.reduce(function (res, _a) {
            var type = _a.type, attribute = _a.attribute, refinement = tslib_1.__rest(_a, ["type", "attribute"]);
            /** @type {?} */

            var match = res.find(function (r) { return r.attribute === attribute && r.type === type; });

            if (match) {
                match.items.push(tslib_1.__assign({ type: type, attribute: attribute }, refinement));
            }

            else {
                res.push({
                    type: type,
                    attribute: attribute,
                    label: capitalize(attribute),
                    items: [tslib_1.__assign({ type: type, attribute: attribute }, refinement)]
                });
            }

            return res;
        }, []);
    }

    json() {
        return JSON.stringify(this.refinements, null, 4);
    }

    /**
     * @return boolean
     */
    isHidden() {
        return this.state && this.state.refinements && this.state.refinements.length === 0;
        /*&& (
            !this.instantSearchParent.instantSearchInstance.searchParameters.query ||
            this.instantSearchParent.instantSearchInstance.searchParameters.query.length == 0
        );*/
    }

    /**
     * remove current selection
     * @param currentSelection
     */
    toggleCurrentSelection(currentSelection) {
        this.state.refine(currentSelection);
    }

    committedTransformItems = (items) => {

        if(!items)
            return [];

        return items.map(item => {
            if (item.name == "Yes" || item.label == "Yes")
                item.label = item.highlighted = item.name = 'Committed';
            else if (item.name == "No" || item.label == "No")
                item.label = item.highlighted = item.name = 'Not committed';

            return item;
        });
    };

    haveVideoTransformItems = (items) => {

        if(!items)
            return [];

        return items.map(item => {
            if (item.name == "Yes" || item.label == "Yes")
                item.label = item.highlighted = item.name = 'Have video';
            else if (item.name == "No" || item.label == "No")
                item.label = item.highlighted = item.name = 'Not have video';

            return item;
        });
    };

    haveResumeTransformItems = (items) => {

        if(!items)
            return [];

        return items.map(item => {
            if (item.name == "Yes" || item.label == "Yes")
                item.label = item.highlighted = item.name = 'Have resume';
            else if (item.name == "No" || item.label == "No")
                item.label = item.highlighted = item.name = 'Not have resume';

            return item;
        });
    };

    licenseTransformItems = (items) => {

        if(!items)
            return [];

        return items.map(item => {
            if (item.name == "1" || item.label == "1")
                item.label = item.highlighted = item.name = 'Have license';
            else if (item.name == "2" || item.label == "2")
                item.label = item.highlighted = item.name = 'Not have license';
            else if (item.name == "0" || item.label == "0")
                item.label = item.highlighted = item.name = 'No data';

            return item;
        });
    };

    assignedTransformItems = (items) => {

        if(!items)
            return [];

      return items.map(item => {
        if (item.name == '0' || item.label == '0') {
          item.label = item.highlighted = item.name = 'Not Assigned';
        }
        else if (item.name == '1' || item.label == '1') {
          item.label = item.highlighted = item.name = 'Assigned';
        }

        return item;
      });
    };

    kuwaitiMomTransformItems = (items) => {

        if(!items)
            return [];

      return items.map(item => {
        if (item.name == '1' || item.label == '1') {
          item.label = item.highlighted = item.name = 'Mom Kuwaiti';
        }
        else if (item.name == '2' || item.label == '2') {
          item.label = item.highlighted = item.name = 'Mom Not Kuwaiti';
        }

        return item;
      });
    }
}
