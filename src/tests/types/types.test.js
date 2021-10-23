import { types } from "../../types/types"

describe('Pruebas en los types.js', () => {
    test('Debe ser igual al objeto del archivo types', () => {
        expect(types).toEqual({
            uiOpenModal: '[UI] Open modal',
            uiCloseModal: '[UI] Close modal',

            eventSetActive: '[EVENT] Set Active',
            eventStartAddNew: '[EVENT] Start Add New',
            eventAddNew: '[EVENT] Add New',
            eventClearActiveEvent: '[EVENT] Clear Active Event',
            eventUpdated: '[EVENT] Event Updated',
            eventDeleted: '[EVENT] Event Deleted',
            eventLoaded: '[EVENT] Event Loaded',
            eventLogout: '[EVENT] Events Clear',

            authCheking: '[AUTH] Checking Loading State',
            authChekingFinish: '[AUTH] Checking Finish Loading State',
            authStartLogin: '[AUTH] Start Login',
            authLogin: '[AUTH] Login',
            authStartRegister: '[AUTH] Start Register',
            authStartTokenRenew: '[AUTH] Start Token Renew',
            authLogout: '[AUTH] Logout'
        });
    }); 
});