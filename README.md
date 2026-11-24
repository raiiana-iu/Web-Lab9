# assignment9

file organization:
/assignment9
 ├─ server/
 │   ├─ server.js
 │   ├─ booksStore.js
 │   ├─ validate.js
 │   ├─ package.json
 │   └─ package-lock.json
 ├─ client/
 │   ├─ src/
 │   │   ├─ api/books.js
 │   │   ├─ components/
 │   │   ├─ App.jsx
 │   │   └─ main.jsx
 │   ├─ .env.example
 │   ├─ index.html
 │   └─ package.json
 ├─ .gitignore
 └─ README.md
 └─ screenshot.png

The following tests were performed using curl.exe --include in PowerShell.

**1. GET all books with two query parameters (200 OK)**

Command:
curl.exe --include "http://localhost:3000/api/books?genre=fantasy&read=true"

Output:
http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 231
ETag: W/"e7-MRDW1yjgToIXjNLIuORL4Yp0FB8"
Date: Tue, 24 Nov 2026 20:07:25 GMT
Connection: keep-alive
Keep-Alive: timeout=5
[{"id":1,"title":"The Hobbit","author":"J.R.R. Tolkien","genre":"fantasy","year":1937,"read":true,"rating":5},{"id":6,"title":"The Name of the Wind","author":"Patrick Rothfuss","genre":"fantasy","year":2007,"read":true,"rating":5}]
**2. GET one book (200 OK)**

Command:
curl.exe --include http://localhost:3000/api/books/1

Output:
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 108
ETag: W/"6c-KRWNaY7qw8ptKDBJMR0nZjCnnhw"
Date: Tue, 24 Nov 2026 20:07:38 GMT
Connection: keep-alive
Keep-Alive: timeout=5
{"id":1,"title":"The Hobbit","author":"J.R.R. Tolkien","genre":"fantasy","year":1937,"read":true,"rating":5}
**3. POST a new book (201 Created)**
Command:
curl.exe --include -X POST http://localhost:3000/api/books -H "Content-Type: application/json" --data-binary "@post-body.json"

Output:
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Location: /api/books/7
Content-Type: application/json; charset=utf-8
Content-Length: 115
ETag: W/"73-xb5o5fw0JjoNN2vFmy21+QzJf8k"
Date: Tue, 24 Nov 2026 20:16:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5
{"title":"Curl Test Book 2","author":"Test Author","genre":"history","year":2020,"read":false,"rating":null,"id":7}
**4. POST an invalid book (400 Bad Request)**

Command:
curl.exe --include -X POST http://localhost:3000/api/books -H "Content-Type: application/json" --data-binary "@invalid-body.json"

Output:
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 44
ETag: W/"2c-WvFfzAW5xnlH0o/LjvmR+2Abjfo"
Date: Tue, 24 Nov 2026 20:10:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5
{"error":"title must be a non-empty string"}
**5. GET with repeated query parameters (400 Bad Request)**

Command:
curl.exe --include "http://localhost:3000/api/books?genre=fiction&genre=history"

Output:
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 54
ETag: W/"36-eWIQheY9O7QXLeBXlRo8gfVZkyI"
Date: Tue, 24 Nov 2026 20:11:23 GMT
Connection: keep-alive
Keep-Alive: timeout=5
{"error":"Invalid or repeated query parameter: genre"}

**6. GET a missing book (404 Not Found)**

Command:
curl.exe --include http://localhost:3000/api/books/999

Output:
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 26
ETag: W/"1a-9K7Ys+5Z9m3qczPTmMk82VGBL7g"
Date: Tue, 24 Nov 2026 20:11:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5
{"error":"Book not found"}

**7. POST a duplicate book (409 Conflict)**
Command:
curl.exe --include -X POST http://localhost:3000/api/books -H "Content-Type: application/json" --data-binary "@duplicate-body.json"

Output:
HTTP/1.1 409 Conflict
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 60
ETag: W/"3c-YJy0XpDp5agPe/8cl8QkvyagI8A"
Date: Tue, 24 Nov 2026 20:11:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
{"error":"A book with this title and author already exists"}

**8. PUT – Replace the complete book (200 OK)**

Command:
curl.exe --include -X PUT http://localhost:3000/api/books/7 -H "Content-Type: application/json" --data-binary "@put-body.json"
Output:
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 112
ETag: W/"70-tAyLyJzgxGDuCDJXx65LbjitxZs"
Date: Tue, 24 Nov 2026 20:16:24 GMT
Connection: keep-alive
Keep-Alive: timeout=5
{"title":"Updated Curl Book","author":"Test Author","genre":"history","year":2021,"read":true,"rating":4,"id":7}

**9. PATCH – Change only the read status (200 OK)**

Command:
curl.exe --include -X PATCH http://localhost:3000/api/books/7 -H "Content-Type: application/json" --data-binary "@patch-body.json"
Output:

HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 113
ETag: W/"71-qG0vQDhEgPeuMwEP7S4og28haoo"
Date: Tue, 24 Nov 2026 20:17:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5
{"title":"Updated Curl Book","author":"Test Author","genre":"history","year":2021,"read":false,"rating":4,"id":7}

PUT replaced all book fields,while PATCH changed only the read field and kept the other information unchanged.

**10. GET statistics before and after a change (200 OK)**

Before changing the book:

Command:
curl.exe --include http://localhost:3000/api/stats
Output:
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 112
ETag: W/"70-y/3Y21qUGXZKo7Pv445Zy1U15Ew"
Date: Tue, 24 Nov 2026 20:12:22 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"total":5,"read":3,"unread":2,"averageRating":4.5,"byGenre":{"fantasy":2,"romantic":1,"romance":1,"history":1}}

I changed book ID 2 using PATCH to set read to false.

Command:
curl.exe --include -X PATCH http://localhost:3000/api/books/2 -H "Content-Type: application/json" --data-binary "@patch-body.json"
After changing the book:
Command:
curl.exe --include http://localhost:3000/api/stats

Output:
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 112
ETag: W/"70-Lh/yEVTRNwv8drD2q1ar6Y7Ny0s"
Date: Tue, 24 Nov 2026 20:12:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"total":5,"read":2,"unread":3,"averageRating":4.5,"byGenre":{"fantasy":2,"romantic":1,"romance":1,"history":1}}
The number of read books decreased from 3 to 2, and the number of unread books increased from 2 to 3.

**11. DELETE a book (204 No Content), followed by another DELETE (404 Not Found)**

First request:

Command:
curl.exe --include -X DELETE http://localhost:3000/api/books/7

Output:
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Date: Tue, 24 Nov 2026 20:18:16 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Second request:
Command:
curl.exe --include -X DELETE http://localhost:3000/api/books/7

Output:
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 26
ETag: W/"1a-9K7Ys+5Z9m3qczPTmMk82VGBL7g"
Date: Tue, 24 Nov 2026 20:18:28 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Book not found"}

also there is a screenshot in assignment 9


1. What is the difference between route parameters and query parameters?
Route parameters identify a specific resource, while query parameters are used to filter or sort results.
2. What happens if express.json() is placed after the routes?
The server cannot read the JSON body before processing the request. As a result, req.body is undefined and the request may fail.
3. What happens if we remove return before an early 404 response?
The code continues running after sending the 404 response. This can cause an error because the server may try to send another response.
4. What is the difference between PUT and PATCH?
PUT replaces the whole resource, while PATCH updates only the fields we specify.
5. What happens if the CLIENT_ORIGIN is incorrect?
The browser blocks the frontend from accessing the response because the CORS origin does not match.
6. Why do we need server-side validation?
Because users can send requests without using our frontend. Server-side validation protects the data from invalid input.
7. Why do the books reset after restarting the server?
Because the books are stored in memory, not in a database. When the server restarts, the data is lost and the initial books are loaded again.

## Challenges
 Understanding how the frontend communicates with the backend using HTTP requests.I also had some problems with JSON formatting when sending POST requests using PowerShell.Configuring CORS correctly between the React client and Express server,separate API requests into a dedicated module and how to handle errors and update the application state after successful requests.
 I forgot to connect with github repository thats why i will send by one commit.Hope for your understanding
