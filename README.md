# 🚀 TIC-Registration Portal

<div align="center">
  <h3>🎓 Tech Innovation Club (TIC) Membership Registration System</h3>
  <p><i>Empowering students to join the future of technology and innovation</i></p>
  
  [![GitHub stars](https://img.shields.io/github/stars/Rutuja-131005/TIC-Registration?style=social)](https://github.com/Rutuja-131005/TIC-Registration/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/Rutuja-131005/TIC-Registration?style=social)](https://github.com/Rutuja-131005/TIC-Registration/network/members)
  
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

**TIC-Registration** is a modern, responsive web application designed for **Tech Innovation Club (TIC)** to streamline the student membership registration process. The application features:

✨ **Real-time form validation**  
📊 **Google Sheets integration** for automatic data storage  
🔐 **Secure admin panel** for managing applications  
🎨 **Beautiful neon-themed UI** with glassmorphism effects  
📱 **Fully responsive design** for all devices  

This project eliminates the need for manual data entry and provides an intuitive interface for both applicants and administrators.

---

## ✨ Features

### 🎯 For Applicants
- **📝 Multi-section Registration Form**
  - Personal information capture (Name, Email, Phone, Department)
  - Motivation statement text area
  - Multiple position selection (max 2 positions)
- **✅ Client-side Validation**
  - Real-time email format validation
  - 10-digit phone number validation
  - Position selection constraints (1-2 positions)
- **🎨 Interactive UI Elements**
  - Neon-glow effects on hover
  - Smooth animations and transitions
  - Success message confirmation
- **📲 Social Media Integration**
  - Direct links to TIC WhatsApp group
  - Instagram profile link

### 🔧 For Administrators
- **🔐 Secure Login System**
  - Password-protected admin access
  - Session management
- **📊 Dashboard Features**
  - View all registrations in a data table
  - Real-time registration count
  - Sortable and filterable table
- **💾 Data Export**
  - Download registrations as CSV
  - Includes all applicant details with timestamps
- **🔄 Data Refresh**
  - Manual refresh button for latest data

### 🛠️ Technical Features
- **☁️ Cloud Storage**
  - Automatic Google Sheets integration via Apps Script
  - No backend server required
- **🎭 Modern Design**
  - Glassmorphism UI with backdrop blur
  - Animated gradient backgrounds
  - Neon cyan/blue color scheme
- **♿ Accessibility**
  - Keyboard navigation support
  - Screen reader friendly
  - ARIA labels for interactive elements

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|----------|
| ![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) | Structure & Markup |
| ![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white) | Styling & Animations |
| ![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black) | Client-side Logic |

### Backend & Storage
| Technology | Purpose |
|-----------|----------|
| ![Google Sheets](https://img.shields.io/badge/Google%20Sheets-%2334A853.svg?style=flat&logo=google-sheets&logoColor=white) | Database |
| ![Apps Script](https://img.shields.io/badge/Apps%20Script-%234285F4.svg?style=flat&logo=google&logoColor=white) | Backend API |

### Design
- **Custom CSS Variables** for theming
- **Neon Color Palette** (#00d9ff, #00ffff, #b300ff)
- **Glassmorphism** with backdrop filters
- **Responsive Grid Layout**

---

## 📁 Project Structure

```
TIC-Registration/
│
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── app.js              # Client-side JavaScript logic
├── assets/
│   └── logo.jpg        # TIC Club logo
│
└── README.md           # Project documentation
```

### File Descriptions

**`index.html`**
- Main registration form
- Success confirmation page
- Admin login interface
- Admin dashboard with data table

**`style.css`**
- Neon theme variables
- Glassmorphism effects
- Responsive media queries
- Animation keyframes

**`app.js`**
- Form validation logic
- Google Sheets API integration
- Admin authentication
- CSV export functionality
- In-memory session management

---

## 🚀 Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Google account (for Google Sheets integration)
- Text editor (VS Code, Sublime Text, etc.)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Rutuja-131005/TIC-Registration.git
cd TIC-Registration
```

### Step 2: Set Up Google Sheets Integration

1. **Create a Google Spreadsheet**
   - Open [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet named "TIC Registrations"
   - Add headers: `Name | Email | Phone | Department | Motivation | Positions | Timestamp`

2. **Create Apps Script**
   - In Google Sheets: `Extensions > Apps Script`
   - Paste the following code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.name,
      data.email,
      data.phone,
      data.department,
      data.motivation,
      data.positions.join(', '),
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true
    })).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const registrations = data.slice(1).map(row => ({
    name: row[0],
    email: row[1],
    phone: row[2],
    department: row[3],
    motivation: row[4],
    positions: row[5].split(', '),
    timestamp: row[6]
  }));
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    registrations: registrations
  })).setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy as Web App**
   - Click `Deploy > New deployment`
   - Select `Web app`
   - Set "Execute as": Me
   - Set "Who has access": Anyone
   - Copy the **Web app URL**

4. **Update app.js**
   - Replace the URL in `fetch()` calls with your Apps Script URL

### Step 3: Run the Application

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server
python -m http.server 8000
# Then open: http://localhost:8000

# Option 3: Use Live Server (VS Code extension)
# Right-click index.html > Open with Live Server
```

---

## 💻 Usage

### For Students (Applicants)

1. **Fill Out the Registration Form**
   - Enter your name, email, and phone number
   - Specify your department/stream
   - Write a motivation statement explaining why you want to join TIC
   - Select 1-2 positions you're interested in

2. **Submit the Form**
   - Click the "Submit Application" button
   - Wait for the success confirmation

3. **Join the Community**
   - Click the WhatsApp link to join the group
   - Follow TIC on Instagram

### For Administrators

1. **Access Admin Panel**
   - Navigate to: `index.html#admin`
   - Or add `?admin=true` to the URL

2. **Login**
   - Enter admin credentials:
     - Email: `admin@ticclub.com` (default)
     - Password: `admin123` (⚠️ Change in production!)

3. **Manage Registrations**
   - View all applications in the dashboard
   - Download data as CSV for offline analysis
   - Refresh to get latest submissions

---

## ⚙️ Configuration

### Admin Credentials

To change admin login credentials, modify `app.js`:

```javascript
const ADMIN_CREDENTIALS = {
  email: 'your-admin@email.com',
  password: 'your-secure-password'
};
```

⚠️ **Security Note**: For production, implement proper backend authentication with hashed passwords.

### Customization

**Change Color Theme** (`style.css`):
```css
:root {
  --neon-blue: #00d9ff;      /* Primary color */
  --neon-cyan: #00ffff;      /* Accent color */
  --neon-purple: #b300ff;    /* Highlight color */
}
```

**Modify Position Options** (`index.html`):
```html
<label class="checkbox-label">
  <input type="checkbox" name="positions" value="Your Position">
  <span class="checkbox-text">Your Position</span>
</label>
```

---

## 📸 Screenshots

### Registration Form
![Registration Form](https://via.placeholder.com/800x450.png?text=Registration+Form+Screenshot)

### Success Message
![Success Message](https://via.placeholder.com/800x450.png?text=Success+Message+Screenshot)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x450.png?text=Admin+Dashboard+Screenshot)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues

### 🐛 Reporting Bugs

Please open an issue with:
- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Tech Innovation Club (TIC)**

- 📧 Email: tic@yourschool.edu
- 💬 WhatsApp: [Join Our Group](https://chat.whatsapp.com/GXNT7RgNoDHC8wyuxfQg75)
- 📸 Instagram: [@tic.nextgen](https://www.instagram.com/tic.nextgen)
- 🌐 Website: [Coming Soon]

**Developer**
- GitHub: [@Rutuja-131005](https://github.com/Rutuja-131005)

---

## 🙏 Acknowledgments

- Icons from [Font Awesome](https://fontawesome.com/)
- Design inspiration from modern web trends
- Special thanks to all TIC members and contributors

---

<div align="center">
  <p><b>Made with ❤️ by TIC Club</b></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
