# Birthday Reminder Application

A simple automated birthday reminder system that sends email wishes to users on their birthdays.

## Features

- 🎂 Simple UI to add users with username, email, and date of birth
- 📅 Automated daily cron job that runs at 7:00 AM to check for birthdays
- 📧 Sends beautiful HTML birthday emails using Gmail and Nodemailer
- 💾 SQLite database for storing user information

## Prerequisites

- Node.js (v14 or higher)
- A Gmail account with App Password enabled

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gmail

To use Gmail with nodemailer, you need to:

1. **Enable 2-Step Verification** on your Google account:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate an App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "Birthday Reminder" as the name
   - Click "Generate"
   - Copy the 16-character password (you'll use this in the .env file)

### 3. Create Environment File

Create a `.env` file in the root directory:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
PORT=3000
```

Replace:
- `your-email@gmail.com` with your Gmail address
- `your-16-character-app-password` with the App Password you generated

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port you specified).

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Fill in the form with:
   - **Username**: The person's name
   - **Email**: Their email address
   - **Date of Birth**: Their birthday (year is stored but only month-day is used for reminders)
3. Click "Add User" to save the information

## How It Works

- **Daily Cron Job**: Every day at 7:00 AM, the system automatically:
  1. Checks the database for users whose birthday is today
  2. Sends a beautifully formatted HTML email to each birthday celebrant
  3. Logs the results to the console

- **Email Format**: The birthday emails include:
  - Personalized greeting with the user's name
  - Beautiful gradient design
  - Warm birthday wishes

## API Endpoints

- `GET /` - Serves the HTML form
- `POST /api/users` - Add a new user
  ```json
  {
    "username": "John Doe",
    "email": "john@example.com",
    "dateOfBirth": "1990-05-15"
  }
  ```
- `GET /api/users` - Get all users (for testing)

## Database

The application uses SQLite with a database file `birthdays.db` that is automatically created in the project root.

## Troubleshooting

### Email Not Sending

1. **Check your .env file**: Make sure `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set correctly
2. **Verify App Password**: Make sure you're using an App Password, not your regular Gmail password
3. **Check Console Logs**: The server logs will show any errors when sending emails

### Cron Job Not Running

- The cron job runs automatically when the server starts
- Make sure the server is running continuously (use PM2 or similar for production)
- Check the console logs at 7:00 AM to verify the job is executing

## Production Deployment

For production, consider:

1. **Process Manager**: Use PM2 or similar to keep the server running
   ```bash
   npm install -g pm2
   pm2 start index.js --name birthday-reminder
   ```

2. **Environment Variables**: Set environment variables securely on your hosting platform

3. **Database Backup**: Regularly backup the `birthdays.db` file

## License

ISC

