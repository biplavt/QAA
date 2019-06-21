# QAA
Backend server for Quality Assessment Tool (written in Node.Js)

<h2>Architecture:</h2>
<div>
<p>Server scripts are written following <b>MVC Architecture</b>. <p>
1. <b>Model</b>: Code segment responsible for talking with database and restructuring the data. It gets called by corresponding controller code and gives final response back to the controller code.<br>
2. <b>View</b>: We only have simple public views, and do not address view element from the backend (since our backend serves APIs to our frontend)<br>
3. <b>Controller</b>: Receives request from Frontend Angular application, and send the response back to frontend. Calls corresponding model function to serve the incoming request.<br>
</div>

<h2>Security: </h2>
1. Uses pre-shared JSON web token Authentication.<br>
2. Request to the backend can only be made from a list of whitelisted urls.

<h2>Run: </h2>
1. Clone the Repo if you already don't have it. <br>
2. Run 'npm install' : this installs all of the dependencies.<br>
3. To start the server: npm start  or node server/server.js<br>
4. Open localhost:3060 to see the homepage.<br>
5. Hosting site: <a href="https://cloud.google.com/appengine/">Google App Engine</a>
















