const puppeteer = require("puppeteer");

//================ Your Username and password

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto("https://myclass.lpu.in/");

    //==========    LOGIN PAGE =========
    const Username = "";
    const Password = "";

    await page.waitFor("#txtUserName");
    await page.$eval(
        "#txtUserName",
        (el, value) => (el.value = value),
        Username
    );

    await page.waitFor("#txtPassword");
    await page.$eval(
        "#txtPassword",
        (el, value) => (el.value = value),
        Password
    );

    await page.click("#MainContent_btnSubmit");

    //========== DASHBOARD =======

    await page.waitFor('[title = "Click here to view Meetings"]');
    await page.click('[title = "Click here to view Meetings"]');

    //========== calender select tabular view =======
    const events = ".fc-event-container:nth-child(2) a";

    await page.waitFor(events);
    const x = await page.$$eval(events);
    console.log(x);
    // await page.click(events)
})();
