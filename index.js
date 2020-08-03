const puppeteer = require("puppeteer");

(async () => {
    console.log("starting puppeteer.....");
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    const page = await browser.newPage();

    console.log("opening myclass.lpu.in...");

    await page.goto("https://myclass.lpu.in/", {
        waitUntil: "load",
        timeout: 0,
    });

    //==========    LOGIN PAGE =========
    console.log("Logging you up...");

    //================ Your Username and password
    const Username = "";
    const Password = "";

    try {
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
    } catch (err) {
        console.log("error logging in.");
        console.log(err);
    }

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

    //=========displaying total classes for that day======
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

    const timeTable = [Array.from(titles), Array.from(timings)];
    console.table(timeTable);

    //======getting starting time of all classes that are available (blue color)

    await page.waitFor("div.fc-time");

    const startTimings = await page.evaluate(() =>
        Array.from(
            document.querySelectorAll(
                "div.fc-event-container a[style*='background: rgb(55, 136, 216)'] div.fc-time"
            ),
            (el) => el.getAttribute("data-start")
        )
    );

    console.log("Upcoming Classes : ");
    console.table(startTimings);

    for (let i = 0; i < startTimings.length + 1; ++i) {
        await page.reload();

        await page.waitFor(
            "div.fc-event-container a[style*='background: green']",
            { timeout: 0 }
        );

        let runningClass = await page.evaluate(() => {
            let that_a = document.querySelector(
                "div.fc-event-container a[style*='background: green']"
            );
            return that_a.href;
        });

        //await new Promise((resolve) => setTimeout(resolve, *1000));

        //attend that class
        if (runningClass) {
            console.log(runningClass);
            await page.goto(runningClass);

            await page.waitFor("#meetingSummary > div > div > a");
            await page.click("#meetingSummary > div > div > a");

            await page.waitForSelector("iframe");

            const elementHandle = await page.$("#frame");
            const frame = await elementHandle.contentFrame();

            await frame.waitForSelector(
                ".audioOptions--NhLnv button:nth-child(2)",
                { timeout: 0 }
            );

            await frame.click(".audioOptions--NhLnv button:nth-child(2)");

            //some code for message sending and polls

            setInterval(async () => {
                await frame.waitFor("#message-input");
                //await frame.$eval("#message-input", (el) => (el.value = "."));
                await frame.type("#message-input", ".");
                await frame.type("#message-input", String.fromCharCode(13));
            }, 150 * 1000);

            //finally close ok for back button when class is over
            await frame.waitForSelector(
                "button.button--Z2dosza.md--Q7ug4.primary--1IbqAO.button--Z1j2w3P",
                { timeout: 0 }
            );
            await frame.click(
                "button.button--Z2dosza.md--Q7ug4.primary--1IbqAO.button--Z1j2w3P"
            );
        }
    }
})();
