"use strict";
window.c_Deadlines = class Deadlines {
    

    constructor( properties ) {
        this.setProperties( properties );
    }

    getProperty( property ) {
        if ( property in this ) {
            return this[ property ];
        }
    }

    setProperties( properties ) {
        for ( let key in properties ) {
            if ( key in this ) {
                this[ key ] = properties[ key ];
            }
        }
    }

    exportSettingsToObject() {
        let _obj = {}

        for ( let key in this ) {
            _obj[ key ] = this[ key ];
        }

        return _obj;
    }

    setSettingsInLocalStorage() {
        localStorage.setItem( 
            'DomicV2_settings', 
            JSON.stringify( this.exportSettingsToObject() ) 
        );
    }

    updateSettings() {
        this.setProperties( this.getSettingsFromLocalStorage() );
    }

    getSettingsFromLocalStorage() {
        return JSON.parse( localStorage.getItem( 'DomicV2_settings' ) );
    }
}




var ddline_list = {
    data_count: 3,
    mass_y: [2021, 2021, 2021],
    mass_m: [08, 08, 08],
    mass_d: [01, 02, 03],
    mass_koef: ["0.90", "0.80", "0.70"],
    mass_text: ["Лекция 1", "Лекция 2", "Лекция 3"],
    mass_push_count: [0, 0, 0]
};