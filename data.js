var dotenv = require('dotenv');
var _ = require('underscore');
var google = require('googleapis');

dotenv.load();

var authClient = new google.auth.JWT(
    process.env.SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_SERVICE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly']
);

var analytics = google.analytics('v3');
var results = [];

function startGaClient() {
    authClient.authorize(function (err, tokens) {
        if(err) { console.log(err, tokens); }
        gaListProfiles();
    });
}

function gaListProfiles() {
    analytics.management.profiles.list({
        auth: authClient,
        accountId: '~all',
        webPropertyId: '~all'
    }, function(err, data) {
        if(err) { console.log(err, data); }
        gaGetData(data)
    });
}

function gaGetData(profilesData) {
    var profileIds = profilesData.items.map(function(el) {
        return el.id;
    });

    profileIds.forEach(function(profileId) {
        analytics.data.ga.get({
            auth: authClient,
            'ids': 'ga:' + profileId,
            'start-date': '7daysAgo',
            'end-date': 'today',
            'metrics': 'ga:sessions,ga:pageviews'
        }, function(err, data) {
            if(err) { console.log(err, data); }
            handleGaData(data);
        });
    });
}

function handleGaData(gaData) {
    var result = {
        profile: gaData.profileInfo.profileName,
        results: gaData.totalsForAllResults
    };
    console.log('retrieved: ' + result.profile);
    results.push(result);
}

function retrieveResults() {
    return results;
}

module.exports = {
    startGaClient: startGaClient,
    retrieveResults: retrieveResults
};
