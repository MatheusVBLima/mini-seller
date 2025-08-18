# Mini Seller Console

A lightweight, modern lead management system built with React and Vite that enables sales teams to efficiently triage leads and convert them into opportunities.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-success?style=for-the-badge)](https://mini-seller-assessment.vercel.app/)

![React](https://img.shields.io/badge/React-19.x-blue) ![Vite](https://img.shields.io/badge/Vite-7.x-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-cyan) ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)

## 🎯 Project Overview

The Mini Seller Console is a comprehensive lead management application designed to streamline the sales process from initial lead capture to opportunity conversion. Built with modern web technologies and featuring a beautiful dark/light theme system.

## 🌐 Live Demo

**[🚀 View Live Application](https://mini-seller-assessment.vercel.app/)**

Try the live demo to experience all features including lead management, opportunity conversion, dark/light themes, and responsive design!


## ✨ Features

### Core Functionality (MVP)
- **📋 Lead Management**: Load leads from local JSON file with fields: id, name, company, email, source, score, status
- **🔍 Advanced Search & Filtering**: Real-time search by name/company with status-based filtering  
- **📊 Smart Sorting**: Sort leads by score (desc), name, or company
- **📝 Lead Detail Panel**: Click any row to open slide-over panel for inline editing
- **✏️ Inline Editing**: Edit status and email with email format validation
- **💾 Save/Cancel Actions**: Complete with error handling and optimistic updates
- **🔄 Lead Conversion**: Convert leads to opportunities with detailed form
- **📈 Opportunities Table**: View converted opportunities in clean table format

### Enhanced User Experience
- **🌙 Dark/Light Mode**: Beautiful theme system with system preference detection
- **⚡ Optimistic Updates**: Immediate UI feedback with automatic rollback on failures
- **📱 Responsive Design**: Mobile-first design with card view for small screens
- **💾 Persistent Preferences**: Search terms and filters saved to localStorage
- **🎨 Modern UI**: Clean interface using shadcn/ui components with Sonner toasts
- **🔄 Loading States**: Comprehensive loading, empty, and error state handling
- **🎯 Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🏗️ Technology Stack

- **React 19** with modern hooks and concurrent features
- **Vite 7** for lightning-fast development and optimized builds
- **TypeScript 5** for type safety and better developer experience
- **Tailwind CSS 4** with utility-first styling and modern CSS features
- **shadcn/ui** for high-quality, accessible components
- **Sonner** for beautiful toast notifications
- **React Hook Form + Zod** for robust form validation
- **Lucide React** for consistent iconography

## 📁 Project Structure

```
src/
├── components/               # React components
│   ├── ui/                  # shadcn/ui base components
│   ├── data-content.tsx     # Main data management component
│   ├── leads-table.tsx      # Lead listing with search/filter/sort
│   ├── lead-detail-panel.tsx # Lead editing slide-over panel
│   ├── convert-lead-dialog.tsx # Opportunity conversion dialog
│   ├── opportunities-table.tsx # Opportunities display
│   ├── header.tsx           # App header with theme switcher
│   └── theme-provider.tsx   # Dark/light theme context
├── hooks/                   # Custom React hooks
│   ├── use-local-storage.ts # Persistent preferences
│   └── use-toast.ts        # Toast notifications (legacy)
├── lib/                    # Utility functions
│   ├── api.ts             # Mock API with simulated latency
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript definitions
│   └── index.ts          # Core type definitions (Lead, Opportunity)
├── data/                 # Static data
│   └── leads.json       # Sample lead data (10 leads)
├── App.tsx              # Main app component with theme provider
├── main.tsx            # App entry point with Sonner toaster
└── index.css          # Global styles and theme variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-seller
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🧪 Testing the Application

**🌐 [Test Live on Vercel](https://mini-seller-asessment.vercel.app/)** or run locally following the installation steps above.

### Core Features Testing

1. **Lead Management**
   - Browse the 10 sample leads in the table
   - Search for leads by name (e.g., "Sarah") or company (e.g., "TechCorp")
   - Filter leads by status (New, Contacted, Qualified, Unqualified)
   - Sort leads by score, name, or company (click column headers)
   - Preferences are automatically saved to localStorage

2. **Lead Detail Panel**
   - Click on any lead row to open the slide-over panel
   - View all lead information in a clean, organized layout
   - Click "Edit Details" to enable inline editing
   - Test email validation with invalid formats
   - Save changes and see optimistic updates with rollback on simulated failures

3. **Opportunity Conversion**
   - Click "Convert to Opportunity" on any lead
   - Fill in the conversion form (opportunity name, account, stage, amount)
   - Submit and watch the lead disappear from leads table
   - Switch to "Opportunities" tab to see the converted opportunity
   - Notice the toast notification with Sonner

4. **Theme System**
   - Click the theme switcher in the header (sun/moon icon)
   - Toggle between Light, Dark, and System themes
   - Notice smooth transitions and proper color schemes
   - Theme preference is saved to localStorage

5. **Responsive Design**
   - Resize browser window or test on mobile device
   - Notice how table switches to card view on small screens
   - All interactions remain fully functional on mobile

### Error Handling & Edge Cases

- **Network Simulation**: API calls have simulated latency (400-800ms)
- **Error Simulation**: 5% chance of simulated API failures for testing
- **Optimistic Updates**: Try editing a lead and watch rollback on failure
- **Form Validation**: Test email format validation and required fields
- **Empty States**: Clear all filters to see "no leads found" state

## 🎨 Design System

### Theme System
- **Light Theme**: Clean, professional appearance with subtle shadows
- **Dark Theme**: Modern dark interface with proper contrast ratios
- **System Theme**: Automatically follows OS preference
- **Theme Variables**: Consistent color tokens using Tailwind CSS custom properties

### Components
- **shadcn/ui**: High-quality, accessible components (Sheet, Dialog, Table, Form)
- **Consistent Spacing**: 4px base unit with systematic spacing scale
- **Typography**: Clear hierarchy with proper font weights and sizes
- **Icons**: Lucide React for consistent, beautiful iconography

## 🔧 Configuration

### Mock API Behavior

The application uses a sophisticated mock API (`lib/api.ts`) that simulates real backend behavior:

- **Realistic Latency**: 400-800ms delays to simulate network requests
- **Error Simulation**: 5% chance of failures for testing error handling
- **Data Persistence**: Changes persist in memory during session
- **Validation**: Proper email validation and error responses

### Sample Data

The application comes with 10 sample leads in `data/leads.json`. You can modify this file to test with different data:

```json
{
  "id": "lead-011",
  "name": "Your Name",
  "company": "Your Company",
  "email": "email@company.com", 
  "source": "Website",
  "score": 85,
  "status": "new"
}
```

## 🎯 Implementation Highlights

### MVP Requirements ✅
All requirements from the task specification have been fully implemented:

1. **Leads List**: ✅ Local JSON, all fields, search, filter, sort
2. **Lead Detail Panel**: ✅ Click to open, inline edit, validation, save/cancel
3. **Convert to Opportunity**: ✅ Conversion button, full opportunity creation, table display
4. **UX/States**: ✅ Loading, empty, error states, smooth performance

### Nice-to-Haves ✅ (All Implemented)
- **Persistent Preferences**: ✅ localStorage integration for filters/sort
- **Optimistic Updates**: ✅ Immediate UI feedback with rollback
- **Responsive Layout**: ✅ Desktop table → mobile cards

### Bonus Features ✅
- **Dark/Light Theme System**: Complete theme switching with persistence
- **Modern Toast System**: Sonner integration as recommended by shadcn/ui
- **Advanced Form Validation**: React Hook Form + Zod for robust validation
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Performance

- **Fast Development**: Vite's HMR provides instant feedback
- **Optimized Builds**: Tree-shaking and code splitting out of the box  
- **Smooth Interactions**: 60fps animations and transitions
- **Memory Efficient**: Proper cleanup and optimized re-renders
- **Mobile Performance**: Responsive design works smoothly on all devices

---

