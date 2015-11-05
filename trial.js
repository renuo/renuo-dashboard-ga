var loopback = require("loopback");
 
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
                "metrics": "ga:sessions,ga:bounces"
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

