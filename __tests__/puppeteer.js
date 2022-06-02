const puppeteer = require('puppeteer');
const regeneratorRuntime = require("regenerator-runtime");

const APP = `http://localhost:8080/`;

describe('Puppeteer tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        page = await browser.newPage();
    });

    afterAll(() => {
        browser.close();
    });

    describe('Initial display', () => {
        it('Loads the landing page successfully', async () => {
            await page.goto(APP);
            await page.waitForSelector('.landing-btn')
            const btnText = await page.$eval('.landing-btn', el => el.innerHTML);
            expect(btnText).toBe(' Let\'s Get Started');
        });
        
        it('Displays the Login Page', async () => {
            await page.goto(APP);
            await page.waitForSelector('.landing-btn');
            await page.click('.landing-btn');

            // wait for login page to load
            await page.waitForSelector('.login-form-btn')
            const btnText = await page.$eval('.login-form-btn', el => el.innerHTML);
            expect(btnText).toBe('Login');
        });

        it('Displays the appropriate form for sign up when clicking Sign up', async () => {

            await page.waitForSelector('.signup-button');
            await page.click('.signup-button');
            await page.waitForSelector('.signup-form-btn');
            const btnText = await page.$eval('.signup-form-btn', el => el.innerHTML);
            expect(btnText).toBe('Sign up');
        });

        it('Sucessfull creates a new user', async () => {
            await page.focus('#firstName');
            await page.keyboard.type('Chuck');

            await page.focus('#lastName');
            await page.keyboard.type('Norris');
            
            await page.focus('#age');
            await page.keyboard.type('9000');

            await page.focus('#email');
            await page.keyboard.type('chuck.norris@gmail.com');

            await page.focus('#password');
            await page.keyboard.type('toolong');

            await page.click('.signup-form-btn');
            
            await page.waitForSelector('.search-label');
            const searchText = await page.$eval('.search-label', el => el.innerHTML);
            expect(searchText).toBe('Origin');
        });
        
        it('Successfully renders the home page after logging in', async () => {
            await page.goto(APP);
            await page.waitForSelector('.landing-btn');
            await page.click('.landing-btn');

            await page.waitForSelector('.login-input');
            await page.type('#email', 'chuck.norris@gmail.com');
            await page.type('#password', 'toolong');
            await page.click('.login-form-btn');

            await page.waitForSelector('.search-label');
            const searchText = await page.$eval('.search-label', el => el.innerHTML);
            expect(searchText).toBe('Origin');
        });
    });

    describe('In app functionality', () => {

        it('Is able to create a new journey within the app', async () => {
            await page.goto(APP);
            await page.waitForSelector('.landing-btn');
            await page.click('.landing-btn');

            await page.waitForSelector('.login-input');
            await page.type('#email', 'chuck.norris@gmail.com');
            await page.type('#password', 'toolong');
            await page.click('.login-form-btn');

            // logged into app here
            await page.waitForSelector('.search-label');
            await page.type('#origin', 'New York');
            await page.type('#destination', 'Philadelphia');
            await page.type('#date', '06/01/2022');
            await page.click('#driver');
            await page.click('.search-btn');

            await page.waitForSelector('.journey-trait');
            const originText = await page.$eval('.journey-trait', el => el.innerHTML);
            expect(originText).toBe('New York');

        });
        
        it('Should display the journey added in user\'s profile', async () => {
            await page.waitForSelector('.navbar-links');
            await page.click('.navbar-link:nth-child(2)');
            
            await page.waitForSelector('.journey-trait');
            const originText = await page.$eval('.journey-trait', el => el.innerHTML);
            expect(originText).toBe('New York');
        });
    });
});