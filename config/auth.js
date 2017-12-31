module.exports = {

    'facebookAuth': {
        'clientID': '376438736139321', // your App ID
        'clientSecret': 'ac302c1355188e333a3421e842206418', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields': ['id', 'emails', 'name', 'locale'] // For requesting permissions from Facebook API
    },

    'twitterAuth': {
        'consumerKey': 'JRRcgywW2NoX2Yxy1rirDTvjD',
        'consumerSecret': 'rH7jmCA4m6aaLXya2XRPfatGwXvDgA7a8ZuDNmj4dlP2xd72VC',
        'callbackURL': 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': '835084663082-ji5eb0h1bkdj0vj1c5qfk8tkc9rkaffv.apps.googleusercontent.com',
        'clientSecret': 'N6A2Ato-xp06ynsXd61GW1uM',
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    },

    

};