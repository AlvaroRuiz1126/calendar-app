import '@testing-library/jest-dom';
import { fetchWhithoutToken, fetchWhithToken } from '../../helpers/fetch';

describe('Pruebas en fetch', () => {
    let token = '';

    test('FetchsinToken debe funcionar', async () => {
        const resp = await fetchWhithoutToken('auth', {
            "email": "email@email.com",
            "password": "123456"
        }, 'POST');

        expect(resp instanceof Response).toBe(true);

        const body = await resp.json();
        expect(body.ok).toBe(true);
        token = body.token;
    });

    test('FetchconToken debe funcionar', async () => {
        localStorage.setItem('token', token);
        const resp = await fetchWhithToken('events/5fc9dd821f0ede0bfd013121', {}, 'DELETE');
        const body = await resp.json();
        
        expect(body.msg).toBe('El evento no existe');
    });
});