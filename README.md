
## API at a Glance

### API Documentation

##### Authorization

###### GET a JSON Web Token (Login)

* Request Type: `POST`

* URL: `https://silly-noether-09bfca.netlify.com/`

* Required Request Headers: 
```
{
  Content-Type: `application/json`
}
```

* Required Request JSON Body: 
```
{
  username: 'UsernameStringGoesHere',
  password: 'PasswordStringGoesHere'
}
```

* Response Body will be a JSON Web Token: 
```
{
  authToken: 'theTokenWillBeHereAsAString'
}
```

* Note - Web Token is valid for 7 days from the issue date



##### Book Data

###### GET all communal books

* Requires valid JSON Webtoken

* Request Type: `GET`

* URL: `https://silly-noether-09bfca.netlify.com/dashboard`

* Required Request Headers: 
```
{
  Authorization: `Bearer JSONWebToken`
}
```

* Response Body will be an array of events: 
(nuggets are highlighted passages of a book)
```
[
  {
        "nuggets": [
            {
                "fromPage": "20",
                "toPage": "49",
                "description": "Deutsch is a genius.  Here, he sums up his worldview, from quantum mechanics to the future of mankind.  Never heard a better case for optimism.",
                "id": "5be76c68783f4904bfc0211d"
            },
            {
                "fromPage": "300",
                "toPage": "340",
                "description": "I had to throw this one in there.  A theory of art by a quantum computing physicist.  Bizarre but fascinating.",
                "id": "5be76c68783f4904bfc0211e"
            }
        ],
        "comments": [
            {
                "text": "Have you read Pinker's 'How the Mind Works'?  There are some insights there that put a lot of this book into a larger context of Pinker's work in linguistics.",
                "author": "gatsby",
                "id": "5be76901783f4904bfc02116"
            }
        ],
        "userId": "000000000000000000000001",
        "title": "The Beginning of Infinity",
        "subtitle": "",
        "description": "The New York Times bestseller: A provocative, imaginative exploration of the nature and progress of knowledge In this groundbreaking book, award-winning physicist David Deutsch argues that explanations have a fundamental place in the universe—and that improving them is the basic regulating principle of all successful human endeavor. Taking us on a journey through every fundamental field of science, as well as the history of civilization, art, moral values, and the theory of political institutions, Deutsch tracks how we form new explanations and drop bad ones, explaining the conditions under which progress—which he argues is potentially boundless—can and cannot happen. Hugely ambitious and highly original, The Beginning of Infinity explores and establishes deep connections between the laws of nature, the human condition, knowledge, and the possibility for progress.",
        "authors": "David Deutsch",
        "Url": "https://play.google.com/store/books/details?id=jZHanN5_KPgC&source=gbs_api",
        "image": "http://books.google.com/books/content?id=jZHanN5_KPgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
       
        "id": "5be76c68783f4904bfc0211f"
    }, ...
]
```
