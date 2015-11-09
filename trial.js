var _ = require('underscore');
var loopback = require('loopback');
var google = require('googleapis');

SERVICE_ACCOUNT_EMAIL = '';
SERVICE_ACCOUNT_KEY_FILE = '';

var authClient = new google.auth.JWT(
    SERVICE_ACCOUNT_EMAIL,
    SERVICE_ACCOUNT_KEY_FILE,
    null, ['https://www.googleapis.com/auth/analytics.readonly']);

authClient.authorize(function (err, tokens) {
    console.log(err);
    var analytics = google.analytics('v3');

    analytics.management.profiles.list({
        auth: authClient,
        accountId: '~all',
        webPropertyId: '~all'
    }, function(err, data) {
        console.log(err);
        profileIds = _.pluck(data.items, 'id');

        profileIds.forEach(function(profileId) {
            analytics.data.ga.get({
                auth: authClient,
                'ids': 'ga:' + profileId,
                'start-date': '7daysAgo',
                'end-date': 'today',
                'metrics': 'ga:sessions,ga:pageviews'
            }, function(err, data) {
                console.log(err);
                var result = {
                    profile: data.profileInfo.profileName,
                    results: data.totalsForAllResults
                };
                console.log(result);
            });
        });
    });
});

/*
var ds = loopback.createDataSource({
    "connector": require("loopback-connector-rest"),
    "debug": true,
    "operations": [{
        "template": {
            "method": "GET",
            "url": " https://www.googleapis.com/analytics/v3/data/ga",
            "headers": {
                "accepts": "application/json",
                "content-type": "application/json",
                "authorization": "Bearer {token}"
            },
            "query": {
                "ids": "ga:12345",
                "startdate": "{startDate}",
                "enddate": "{endDate}",
                "metrics": "ga:sessions,ga:pageviews"
            },
            "responsePath": "$.totalResults"
        },
        "functions": {
            "findByDateRange": ["token", "startDate", "endDate"]
        }
    }]
});


var GaEndpoint = ds.createModel('ga-endpoint', {
});


GaEndpoint.findByDateRange('token', '2015-08-01', '2015-08-30', function(err, gaEndpoint) {
    console.log(err);
    console.log(gaEndpoint);
});

*/
