const puppeteer = require("puppeteer");

//================ Your Username and password

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto("https://myclass.lpu.in/", {
        waitUntil: "load",
        timeout: 0,
    });

    //==========    LOGIN PAGE =========
    const Username = ""; //enter ums username
    const Password = ""; //enter ums password

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
    // const events = ".fc-event-container:nth-child(2) a";

    // await page.waitFor(events);

    // const urls = await page.evaluate(() =>
    //     Array.from(
    //         document.querySelectorAll(".fc-event-container:nth-child(2) a"),
    //         (el) => el.href
    //     )
    // );

    // for (let i = 0; i < urls.length; ++i) {
    //     await page.goto(urls[i], { waitUntil: "load" });

    //     const className = await page.$eval(
    //         "#meetingInfoTitle",
    //         (el) => el.textContent
    //     );
    //     console.log(className);
    // }

    await page.waitFor("div.fc-title");
    await page.waitFor("div.fc-time");

    const titles = await page.evaluate(() =>
        Array.from(
            document.querySelectorAll("div.fc-title"),
            (el) => el.textContent
        )
    );

    const timings = await page.evaluate(() =>
        Array.from(
            document.querySelectorAll("div.fc-time span"),
            (el) => el.textContent
        )
    );

    for (let i = 0; i < titles.length; ++i) {
        console.log(titles[i], "    ", timings[i]);
    }
})();
