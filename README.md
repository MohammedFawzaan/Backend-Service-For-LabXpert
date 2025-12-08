<!DOCTYPE html>
<html>
<body>

<h1 align="center">⚗️ Virtual LabXperience Backend</h1>
<p align="center">Production-ready backend powering the Virtual Chemistry Laboratory platform - <a href="https://github.com/MohammedFawzaan/Virtual-Chemistry-Laboratory" target="_blank">Frontend Repo.</a></p>

<hr />

<h2>📌 Overview</h2>
<p>
  This Backend is built using <strong>Node.js, Express.js, MongoDB, and Passport.js</strong>.
  It provides secure authentication using Google OAuth-2.0, user role management,
  experiment tracking, insights collection, and complete REST APIs for the frontend.
</p>

<hr />

<h2>⚙️ Tech Stack</h2>
<ul>
  <li><strong>Node.js</strong> – Server runtime</li>
  <li><strong>Express.js</strong> – API framework</li>
  <li><strong>MongoDB + Mongoose</strong> – Database</li>
  <li><strong>Passport.js Google OAuth</strong> – Authentication</li>
  <li><strong>JWT</strong> – Authorization with tokens</li>
  <li><strong>CORS</strong> – Secure cross-origin access</li>
  <li><strong>Cookie Parser</strong> – HttpOnly cookies</li>
</ul>

<hr />

<h2>📁 Project Structure</h2>

<pre>
backend/
│── db/
│   ├── mongodb.js
│
│── controllers/
│   ├── user.controller.js
│   ├── experiment.controller.js
│   ├── titration.controller.js
│   ├── distillation.controller.js
│   └── saltAnalysis.controller.js
│
│── models/
│   ├── user.model.js
│   ├── experiment.model.js
│   ├── titration.model.js
│   ├── distillation.model.js
│   └── saltAnalysis.model.js
│
│── routes/
│   ├── user.routes.js
│   ├── experiment.routes.js
│   ├── titration.routes.js
│   ├── distillation.routes.js
│   └── saltAnalysis.routes.js
│
│── middleware/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│
│── .env
│── server.js
│── app.js
│── debug_server.js
│── socket.js
</pre>

<hr />

<h2>🔐 Environment Variables</h2>
<p>Create a <code>.env</code> file in the backend folder and add the following:</p>

<pre>
PORT=5000
VITE_BASE_URL=http://localhost:8080

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url

# JWT Secret Key
JWT_SECRET=your_secret_key

# MongoDB
DB_CONNECTION_URL=mongodb+srv://...
</pre>

<hr />

<h2>🚀 Running the Backend</h2>

<h3>1️⃣ Install dependencies</h3>
<pre>
npm install
</pre>

<h3>2️⃣ Start the server</h3>
<pre>
npm run dev
</pre>

<p>Your backend starts at:  
<strong>http://localhost:5000</strong></p>

<hr />

<h2>🔑 Authentication Flow</h2>
<ol>
  <li>User logs in using Google OAuth.</li>
  <li>Backend verifies + generates JWT token.</li>
  <li>Two cookies are created:
    <ul>
      <li><strong>token</strong> – authentication (HttpOnly)</li>
      <li><strong>role</strong> – student/admin (HttpOnly)</li>
    </ul>
  </li>
  <li>Redirects user to <code>/select-role</code> if first login.</li>
  <li>Else redirects to <code>/home</code>.</li>
</ol>

<hr />

<h2>🧪 API Routes Overview</h2>

<h3>Auth Routes</h3>
<pre>
GET    /api/google
GET    /api/google/callback
POST   /api/set-role
GET    /api/check
GET    /auth/logout
</pre>

<h3>Experiment Routes</h3>
<pre>
GET    /api/experiments
GET    /api/experiments/admin
GET    /api/experiments/:experimentId/all
GET    /api/experiments/:id
POST   /api/experiments
DELETE /api/experiments/:id
</pre>

<h3>Titration Experiment Routes</h3>
<pre>
GET    /api/titration
GET    /api/titration/:id
GET    /api/titration/status/:experimentId
POST   /api/titration
POST   /api/titration/:id/observations
POST   /api/titration/:id/finalize
DELETE /api/titration/:id
</pre>

<h3>Distillation Experiment Routes</h3>
<pre>
GET    /api/distillation
GET    /api/distillation/:id
POST   /api/distillation
POST   /api/distillation/:id/observations
POST   /api/distillation/:id/finalize
DELETE /api/distiallation/:id
</pre>

<h3>Salt Analysis Experiment Routes</h3>
<pre>
GET    /api/saltanalysis
GET    /api/saltanalysis/:id
POST   /api/saltanalysis
POST   /api/saltanalysis/:id/observations
POST   /api/saltanalysis/:id/finalize
DELETE /api/saltanalysis/:id
</pre>

<hr />

<h2>📊 Features</h2>
<ul>
  <li>Google OAuth 2.0 login</li>
  <li>Role-based authentication (Student/Admin)</li>
  <li>Record experiment data state-by-state</li>
  <li>Admin & Student API routes for dashboard</li>
  <li>Experiment history & insights</li>
  <li>Start, Complete, Perform, Reset experiment</li>
</ul>

<hr />

<h2>🛡️ Security</h2>
<ul>
  <li>HttpOnly Cookies</li>
  <li>JWT authentication</li>
  <li>Full CORS protection</li>
  <li>Secure Google OAuth flow</li>
</ul>

<hr />

<h2>🔗 Deployed on Render</h2>
<p>
  <a href="https://backend-service-for-labxpert-1.onrender.com" target="_blank">
    👉 Click here for deployed link on render.
  </a>
</p>

<hr />

<h2>🙌 Contribution</h2>
<p>
  Feel free to raise issues or contribute new experiment modules.
</p>

<hr />

<h2>📜 License</h2>
<p>
  By Mohammed Fawzaan.
</p>

</body>
</html>
