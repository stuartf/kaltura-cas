This is a CAS provider for Kaltura's SSO Gateway

Usage
-----
Make a `config.json` file with contents like:

    {
      "cas" : {
        "casHost" : "https://your.cas.server",
        "casBasePath" : "/cas",
        "loginPath" : "/login",
        "validatePath" : "/serviceValidate",
        "service" : "http://this.server:8080/login"
      },
      "kaltura" : {
        "host" : "http://your.kaltura.server",
        "secret" : "yourKalturaSharedSecret",
        "defaultRole" : "viewerRole",
        "roles" : {
          "userID" : "adminRole"
        }
      }
    }

Install the dependencies with `npm install`

Start the server with `node server.js`
