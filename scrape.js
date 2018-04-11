var request =  require('request-promise');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var target = require('./target');

var scrapeCategory = function(url) {
    return request(url).then(function(result) {
        var categoryList = [];
        var $ = cheerio.load(result);
        $('.menu').find('li').each(function(idx, elem) {
            categoryList.push({
                'title': $(elem).find('a').text(),
                'link': $(elem).find('a').attr('href')
            });
        });
        return categoryList;
    })
}

var scrapePromo = function(category) {
    return request(category.link).then(function(result) {
        var promoList = [];
        var $ = cheerio.load(result);
        $('.list2').find('li').each(function(idx, elem) {
            var promo = $(elem).find('a');
            promoList.push({
                'merchant': $(promo).children('merchant-name').text(),
                'description': $(promo).children('.promo-title').text(),
                'validity': $(promo).children('.valid-until').text(),
                'image': $(promo).find('img').attr('src'),
                'link': $(promo).attr('href')
            });
        });
        return Promise.map(promoList, getDetail).then(function(result) {
            var categoryDetail = {};
            categoryDetail[category.title] = JSON.stringify(result);
            return categoryDetail;
        });
    });
}

var getDetail = function(promo) {
    return request(promo.link).then(function(result) {
        var detail = {}
        var $ = cheerio.load(result);
        detail.description = promo.description;
        detail.validity = promo.validity;
        detail.image = promo.image;
        detail.banner = $('#banner').find('img').attr('src');
        detail.link = promo.link;

        return detail;
    });
}

module.exports = {
    scrapeCategory: scrapeCategory;
    scrapePromo : scrapePromo;
    getDetail: getDetail
};