"use strict";
window.c_Settings = class Settings {
    _currentSettingsVersion = 3.00;
    _currentSettingsLanguage = "RU";

    _checkbox_enable_extension = true;
    _checkbox_enable_customIconOnPage = true;
    _checkbox_enable_customTitleOnPage = true;
    _checkbox_enable_customThemeOnPage = true;

    _checkbox_enable_autoLoginOnAuthPage = false;
    _checkbox_enable_newNavbarOnPage = false;
    _checkbox_enable_customLoginPage = true;
    _checkbox_enable_customErrorPage = true;
    _checkbox_enable_customDisplayScore = true;
    _checkbox_enable_syncThemeAccentOnPage = false;
    _checkbox_enable_settingsAccentColorOnInputs = true;
    _checkbox_enable_loadingLayer = true;

    _checkbox_enable_settingsMenuRGB = false;
    _checkbox_enable_clearAuthFields = true;
    _checkbox_enable_errorRedirect = true;

    _inputfield_link_pageIcon = null;
    _inputfield_link_loadingLayerIcon = null;
    _inputfield_link_pageTheme = null;
    _inputfield_pageTitle = null;
    _inputfield_auth_login = null;
    _inputfield_auth_pass = null;

    _listbox_settingsSelectedTheme = "light";
    _listbox_selectedThemeOnPage = "light";
    _listbox_selectedThemeLoadingLayer = "light";

    _slider_accentColor_R = 13;
    _slider_accentColor_G = 110;
    _slider_accentColor_B = 253;

    _slider_loadingLayerDuration = 800;
    _slider_loadingLayerFadeDuration = 500;

    _slider_hoursUntilNextNotificaion = 6;
    _slider_daysBeforeDisplayDeadline = 3;
    _slider_amountOfRepeatsOfTheDeadline = 3;

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