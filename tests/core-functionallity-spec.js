import {expect} from 'chai';
import td from 'testdouble';
import webdriver from 'selenium-webdriver';
import {URL, start, subToTracks, returnStatus, stop} from './testsServer';
import { pause } from './utils';

const By = webdriver.By;

describe('Tellor', function() {
    this.slow(100000);

    let driver;
    before(async function() {
        this.timeout(10000);
        driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

        await start();
    });

    it('after init is done it should track events that were tracked before app init', async () => {
        const track = td.function();
        subToTracks(track);
        await driver.get(`${URL}/tests/beforeInit.html`);
        await pause(50);
        td.verify(track({sdk: 'web', app_key: 'test', app_version: '1', events: '[{"name":"Test-BeforeLoad"}]'}, {status: 200}), {times: 1});
    });

    it('should successfully track events that are tracked after init', async () => {
        const track = td.function();
        subToTracks(track);
        await driver.get(`${URL}/tests/afterInit.html`);
        await driver.findElement(By.id('button')).click();
        await pause(50);
        td.verify(track({sdk: 'web', app_key: 'test', app_version: '1', events: '[{"name":"Test-afterInit"}]'}, {status: 200}), {times: 1});
    });


    it('should retry to track events if it fails', async () => {

        const track = td.function();
        subToTracks(track);
        await driver.get(`${URL}/tests/afterInit.html`);
        returnStatus(500); // so tracking fails
        await driver.findElement(By.id('button')).click();
        await pause(50);
        returnStatus(200); // so tracking succeeds
        await pause(1050);

        td.verify(track({sdk: 'web', app_key: 'test', app_version: '1', events: '[{"name":"Test-afterInit"}]'}, {status: 500}), {times: 1}); // called and got status 500
        td.verify(track({sdk: 'web', app_key: 'test', app_version: '1', events: '[{"name":"Test-afterInit"}]'}, {status: 200}), {times: 1}); // retried
    });

    it('should load events from localStorage (which were failed to track before) and track them', async () => {
        const track = td.function();
        subToTracks(track);
        
        await driver.get(`${URL}/tests/afterInit.html`);
        returnStatus(500); // so tracking fails
        await driver.findElement(By.id('button')).click();
        await pause(50);
        returnStatus(200); // so tracking succeeds

        await driver.get(`http://example.com/`); // go to another page so auto retry doesn't run
        await driver.get(`${URL}/tests/afterInit.html`); // go back - event should be loaded from localStorage and tracked

        await pause(1050);

        td.verify(track({sdk: 'web', app_key: 'test', app_version: '1', events: '[{"name":"Test-afterInit"}]'}, {status: 500}), {times: 1}); // called and got status 500
        td.verify(track({sdk: 'web', app_key: 'test', app_version: '1', events: '[{"name":"Test-afterInit"}]'}, {status: 200}), {times: 1}); // retried
    });

    after(async () => {
        await driver.quit();
        await stop();
    })
});