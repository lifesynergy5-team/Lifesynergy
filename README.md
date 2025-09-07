# Lifesynergy

# Kerala Migrant Health Portal

A comprehensive web platform designed to assist migrant workers in Kerala with **health monitoring, medical assistance, and disease hotspot tracking**. The portal provides secure login via **Aadhaar card**, an **AI doctor assistant** in multiple languages, and a visual **health map** to track disease prevalence.

---

## Features

### **1. Aadhaar-Based Authentication**
- Secure login using Aadhaar number.
- Sensitive data is encrypted using **PGP encryption**.
- User sessions are managed securely.

### **2. Health Map (Disease Hotspots)**
- Interactive map showing disease prevalence across Kerala.
- Hotspots are color-coded based on severity.
- Filter by disease type, date, or location.
- Clickable markers for detailed statistics.

### **3. AI Doctor Assistant**
- AI-powered doctor assistance to answer health-related queries.
- Multilingual support: converse in **any language**.
- Provides advice on symptoms, tests, precautions, and nearby healthcare facilities.

### **4. Past Medical History**
- Users can view their past medical records.
- Includes conditions, treatments, allergies, immunizations, and lab results.
- Data is securely encrypted for privacy.

### **5. Admin Dashboard**
- Visual graphs for disease trends and migrant statistics.
- Map-based view of hotspots.
- Access to anonymized medical records (with user consent).

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend  | HTML, TailwindCSS, JavaScript, React (optional) |
| Backend   | Supabase / Node.js / Express |
| Database  | PostgreSQL with PGP encryption |
| Maps      | Leaflet.js / Google Maps API |
| AI        | OpenAI GPT API |
| Translation | Google Translate API / GPT-based multilingual support |
| Authentication | Aadhaar-based login |

---

## Database Structure

**Users Table**
- `id` (PK)
- `aadhaar` (encrypted)
- `name`
- `dob`
- `contact_number` (encrypted)
- `language`
- `past_medical_history`

**Medical History Table**
- `id` (PK)
- `user_id` (FK)
- `condition`
- `treatment`
- `date`
- `notes`

**Disease Reports Table**
- `id` (PK)
- `location_lat`
- `location_lng`
- `disease_name`
- `reported_on`
- `severity_level`

**Sessions Table**
- `id` (PK)
- `user_id` (FK)
- `login_time`
- `logout_time`

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kerala-migrant-health-portal.git
cd kerala-migrant-health-portal
