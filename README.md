# Campus Outpass Management System

A complete student outpass management system with role-based access for Students, Wardens, and Security Guards.

## Architecture

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Supabase Edge Functions (serverless API)
- **Database**: Supabase PostgreSQL with Row Level Security

## Quick Start

### 1. Open the Application

Simply open the frontend files in your browser:

```bash
cd webcontent
# Open index.html in your browser
```

Or use a simple HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then visit: http://localhost:8000
```

### 2. Test Login Credentials

The system comes with pre-configured test accounts:

**Student Login:**
- USN: `4CB24CG010`
- Password: `12345`

**Warden Login:**
- Username: `warden1`
- Password: `12345`

**Security Guard Login:**
- Guard ID: `guard01`
- Password: `12345`

## Features

### Student Portal
- Apply for outpasses with reason, date, and time
- Mark passes as emergency
- View all pass requests and their status (Pending, Approved, Rejected, Used)
- QR code generation for approved passes
- Track exit and return times

### Warden Portal
- View all pending pass requests
- Approve or reject passes
- Add rejection reasons when declining requests
- Real-time dashboard updates

### Security Guard Portal
- Scan QR codes (or manually enter pass IDs)
- Record student EXIT from campus
- Record student RETURN to campus
- Validates pass status before allowing actions

## API Endpoints

All endpoints are deployed as Supabase Edge Functions:

- `POST /functions/v1/auth` - Multi-role authentication
- `GET /functions/v1/pass?usn={usn}` - Get student's passes
- `POST /functions/v1/pass` - Create new pass request
- `GET /functions/v1/warden` - Get pending passes
- `POST /functions/v1/warden` - Approve/reject passes
- `POST /functions/v1/guard` - Record exit/return events

## Database Schema

### Tables

1. **students**
   - usn (primary key)
   - name, password, department, semester, phone

2. **wardens**
   - username (primary key)
   - name, password

3. **security_guards**
   - guard_id (primary key)
   - name, password

4. **passes**
   - id (auto-increment)
   - pass_id (unique, for QR codes)
   - usn (foreign key to students)
   - student_name, reason, date, time_out
   - status (PENDING/APPROVED/REJECTED/USED)
   - rejection_reason
   - is_emergency
   - created_at, exited_at, returned_at

## Workflow

1. **Student** logs in and applies for an outpass
2. Pass status is set to **PENDING**
3. **Warden** reviews and approves/rejects the request
4. If approved, student receives a QR code
5. **Security Guard** scans QR code to record EXIT
6. Pass status changes to **USED**
7. When student returns, guard scans again to record RETURN

## Security Features

- Row Level Security (RLS) enabled on all tables
- Public read access for authentication (all users can verify credentials)
- All API calls require Supabase authentication headers
- Session management via localStorage
- Role-based routing and authorization

## Project Structure

```
.
├── webcontent/
│   ├── index.html              # Login page
│   ├── student_dashboard.html  # Student view
│   ├── student_apply.html      # Pass application form
│   ├── warden_dashboard.html   # Warden review panel
│   ├── security_scan.html      # Security guard scanner
│   ├── css/
│   │   └── style.css          # All styles
│   └── js/
│       └── app.js             # API integration
├── supabase/
│   └── functions/
│       ├── auth/              # Authentication endpoint
│       ├── pass/              # Pass management endpoint
│       ├── warden/            # Warden actions endpoint
│       └── guard/             # Security guard endpoint
└── README.md
```

## Adding More Users

You can add more test users directly in the database:

### Add Student
```sql
INSERT INTO students (usn, name, password, department, semester, phone)
VALUES ('USN123', 'John Doe', 'password123', 'CSE', 4, '9876543210');
```

### Add Warden
```sql
INSERT INTO wardens (username, name, password)
VALUES ('warden2', 'Assistant Warden', 'password123');
```

### Add Security Guard
```sql
INSERT INTO security_guards (guard_id, name, password)
VALUES ('guard02', 'Night Shift Guard', 'password123');
```

## Customization

### Change Supabase Credentials

If you need to use your own Supabase instance, update the credentials in `webcontent/js/app.js`:

```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### Styling

All styles are centralized in `webcontent/css/style.css`. The design uses CSS custom properties for easy theming:

```css
:root {
    --primary: #3b82f6;
    --success: #22c55e;
    --danger: #ef4444;
    /* ... more variables */
}
```

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6+ support

## Notes

- Passwords are stored in plain text for demo purposes only
- In production, implement proper password hashing (bcrypt/scrypt)
- Consider adding email notifications for pass status updates
- QR code scanning can be enhanced with camera integration
- Currently, RLS policies allow public read access for authentication purposes

## Troubleshooting

**Issue**: Login fails with "Server connection failed"
- Check browser console for CORS errors
- Verify Supabase Edge Functions are deployed
- Check network connectivity

**Issue**: Passes not showing up
- Verify database contains data
- Check browser console for API errors
- Ensure correct USN is being used

**Issue**: QR codes not generating
- Verify qrcodejs library is loaded
- Check that pass status is "APPROVED"
- Look for console errors

## Future Enhancements

- Email/SMS notifications
- Camera-based QR scanning
- Pass expiry time tracking
- Analytics dashboard for wardens
- Mobile app version
- Attendance reports
- Parent notification system
