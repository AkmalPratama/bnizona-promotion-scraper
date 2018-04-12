var scrape = require('./scrape.js');
var fs = require('fs');

const targetUrl = 'https://m.bnizona.com/index.php/category/index/promo';

var run = function(targetUrl) {
    scrape.scrapeAll(targetUrl).then(function(result) {
        fs.writeFile("solution.json", (JSON.stringify(result, null, 3)), function(err){
            if (err) {
                return console.log(error);
            }
            console.log("Finished scraping");
        });
    });
}

run(targetUrl);
