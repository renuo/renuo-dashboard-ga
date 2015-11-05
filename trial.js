var loopback = require("loopback");
 
var ds = loopback.createDataSource({
    connector: require("loopback-connector-rest"),
    debug: false,
    operations: [
    {
        template: {
            "method": "GET",
            "url": "http://maps.googleapis.com/maps/api/geocode/{format=json}",
            "headers": {
                "accepts": "application/json",
                "content-type": "application/json"
            },
            "query": {
                "address": "{street},{city},{zipcode}",
                "sensor": "{sensor=false}"
            },
            "responsePath": "$.results[0].geometry.location"
        },
        functions: {
           "geocode": ["street", "city", "zipcode"]
        }
    }
]});

var GaEndpoint = ds.createModel('ga-endpoint', {
});

GaEndpoint.geocode('107 S B St', 'San Mateo', '94401', function(err, gaEndpoint) {
    console.log(err);
    console.log(gaEndpoint);
});
