# User Manual - Law Virtualization Website

Follow these steps to set up and run the application on your local machine.

## 1. Prerequisites
- **Node.js**: Ensure Node.js is installed. (You can check by running `node -v` in a terminal).
- **MySQL**: Ensure MySQL Server is installed and running.

## 2. Database Configuration
The backend needs to connect to your local MySQL database.

1.  Open the file: `server/.env`
2.  Update the `DB_PASS` field with your MySQL root password.
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=your_actual_password  <-- Update this
    DB_NAME=law_virtualization
    ```

## 3. Database Initialization
Once credentials are correct, run the setup script to create the database and tables.

1.  Open a terminal (Command Prompt or PowerShell).
2.  Navigate to the server directory:
    ```powershell
    cd server
    ```
3.  Run the setup script:
    ```powershell
    node setupDb.js
    ```
    *If successful, you will see "Database setup completed successfully."*

## 4. Starting the Backend Server
Keep the terminal open in the `server` directory (or open a new one if you closed it).

1.  Run the development server:
    ```powershell
    npm run dev
    ```
    *You should see: "Server running on port 5000" and "Connected to MySQL Database".*
    **Keep this terminal open.**

## 5. Starting the Frontend Client
Open a **new** terminal window for the frontend.

1.  Navigate to the client directory:
    ```powershell
    cd client
    ```
2.  Run the development server:
    ```powershell
    npm run dev
    ```
3.  Click the link shown (usually `http://localhost:5173`) to open the website in your browser.

## 6. Accessing Features

Now that the application is running, you can explore the new features:

### User Registration & Bookmarks
1.  Go to the **Register** page and create a new account.
2.  **Login** with your new credentials.
3.  Navigate to any law detail page (click "View Details" on a card).
4.  Click the **Bookmark** button. It will change to "Bookmarked" (Blue).
5.  If you refresh or log out/in, your bookmarks will persist!

### Interactive Chatbot
1.  Click the **Chat Icon** (bottom right).
2.  Ask it about specific laws (e.g., "Tell me about Theft" or "What is Section 302?").
3.  The bot now searches the **real database** and provides links directly to the law pages.

### Admin Dashboard (Restricted)
The `/admin` route is now protected. To access it, you must be an admin.
1.  Register a user if you haven't already.
2.  Open a terminal in the `server` directory.
3.  Run the following command to promote your user to admin:
    ```powershell
    node scripts/make_admin.js your_email@example.com
    ```
4.  Logout and Login again on the website.
5.  You will now see the **Admin** link in the navbar and can manage laws!

## Summary of Commands

**Terminal 1 (Backend):**
```powershell
cd server
node setupDb.js  # Only once
node db/seed.js  # Only once (to add initial laws)
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd client
npm run dev
```

**Promote User to Admin:**
```powershell
cd server
node scripts/make_admin.js <email>
```
