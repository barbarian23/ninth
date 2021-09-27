const webdriver = require('selenium-webdriver');
//ie
const ie = require('selenium-webdriver/ie');
//const iedriver = require('iedriver');

//chrome
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

const path = require('path')

var ieOption = null, driver = null;

//nack lại 1 level, vì dirname đnag chạy wor folder dist
const driverfolder = path.join(__dirname, '../');;

function seleniumCrawl() {
    function getOption() {

        //chrome
        return new chrome.Options().addArguments("start-maximized") // open Browser in maximized mode
            .addArguments("disable-infobars") // disabling infobars
            .addArguments("--disable-extensions") // disabling extensions
            .addArguments("--disable-gpu") // applicable to windows os only
            .addArguments("--disable-dev-shm-usage")// overcome limited resource problems
            .addArguments("--no-sandbox"); // Bypass OS security model
        // chromeOptions.addArguments("--remote-debugging-port=9222");
        // chromeOptions.addArguments("--no-sandbox") ;
        // chromeOptions.addArguments("--disable-setuid-sandbox") ;
        // chromeOptions.addArguments("--disable-dev-shm-using") ;
        // chromeOptions.addArguments("--disable-extensions") ;
        // chromeOptions.addArguments("--disable-gpu") ;
        // chromeOptions.addArguments("start-maximized") ;
        // chromeOptions.addArguments("disable-infobars");

        //ie
        //return new ie.Options().addArguments('--ignore-certificate-errors').addArguments('--ignore-ssl-errors').addArguments('--disable-single-click-autofill')
    };

    function getCrawler() {
        console.log(driverfolder);

        //chrome
        return new webdriver.Builder().forBrowser('chrome')
        //chromeOptions.setChromeBinaryPath(driverfolder + "driver\\chrome.exe");
        .setChromeOptions(getOption()).withCapabilities(webdriver.Capabilities.chrome()).build();

        // return new webdriver.Builder()
        //     .setIeOptions(getOption())
        //     .withCapabilities(webdriver.Capabilities.ie()).build();
    }

    let driver = {
        option: null,
        crawler: null,
        init: function () {
            if (!this.option || !this.crawler) {
                this.option = getOption();
                this.crawler = getCrawler();
            }
        },
        goto: async function (path) {
            try {
                if (!this.option || !this.crawler) {
                    this.init();
                }
                await this.crawler.get(path);
            } catch (e) {
                console.log("goto", e);
            }
        },

        getInnerTextByPath: async function (path) {
            try {
                if (!this.option || !this.crawler) {
                    this.init();
                }
                return await this.crawler.findElement(webdriver.By.css(path)).getText();
            } catch (e) {
                console.log("getInnerTextByPath", e);
            }
        },

        inputTextByPath: async function (path, text) {
            try {
                if (!this.option || !this.crawler) {
                    this.init();
                }
                await this.crawler.findElement(webdriver.By.css(path)).sendKeys(text);
            } catch (e) {
                console.log("inputTextByPath", e);
            }
        },

        clearInputByPath: async function (path) {
            try {
                if (!this.option || !this.crawler) {
                    this.init();
                }
                await this.crawler.findElement(webdriver.By.css(path)).clear();
            } catch (e) {
                console.log("clearInputByPath", e);
            }
        },

        clickByPath: async function (path) {
            try {
                if (!this.option || !this.crawler) {
                    this.init();
                }
                await this.crawler.findElement(webdriver.By.css(path)).click();
            } catch (e) {
                console.log("clickByPath", e);
            }
        },

        executeScript: async function (script) {
            try {
                if (!this.option || !this.crawler) {
                    this.init();
                }
                return await this.crawler.executeScript(script);
            } catch (e) {
                console.log("executeScript", e);
                return null;
            }
        },

        waitForScriptDone: async function (script, status) {
            try {
                if (!this.option || !this.crawler) {
                    this.init();
                }
                await this.crawler.wait(function () {
                    return this.crawler.executeScript(script).then(function (readyState) {
                        return readyState === status;
                    });
                });
            }
            catch (e) {
                console.log("waitForScriptDone", e);
            }
        },
        isDisplay: async function (path) {
            try {
                if (!this.option || !this.crawler) {
                    this.init();
                }
                return await this.crawler.findElement(webdriver.By.css(path)).isDisplayed();
            } catch (e) {
                console.log("isDisplay", e);
                return null;
            }
        }
    };

    return driver;
}

export default seleniumCrawl;