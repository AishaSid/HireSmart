# HireSmart -Resume Builder App

HireSmart is a modern resume builder that helps users create professional resumes using advanced AI technology and customizable templates.

##  Features

### Core Features
- **AI-Powered Resume Generation**: Convert existing CVs/Resumes into professional formats using Google's Gemini AI
- **Multiple Resume Templates**: Choose from various professional templates (Modern, Classic, Creative, Minimal)
- **Real-time Preview**: See how your resume looks before downloading
- **PDF Generation**: Download resumes as high-quality PDF files
- **ATS Analysis**: Get a Detailed Analysis from Ai and Suggestions for optimizations 
- **User Authentication**: Secure user management system

### Template Categories
- **Modern Professional**: Clean layout perfect for tech jobs
- **Minimal Clean**: Simple, whitespace-focused professional layout
- **Ethos Dark**: Dark-themed sections with bold typography
- **Bootstrap Two-Column**: Two-column layout with sidebar and main content

##  Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern component library
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **MongoDB**: Database for user cv, resume and available templates
- **Google Gemini AI**: AI-powered content generation
- **Puppeteer**: PDF generation from HTML
- **SupaBase**: For user autentication and logs


### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **pnpm**: Fast package manager

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) 
- MongoDB database
- Google Gemini API key

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HireSmart
   cd hiresmart
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # AI Services
   GEMINI_API_KEY=your_gemini_api_key
   
   # App Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The app will automatically create collections on first run

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

##  Usage

### For Users

1. **Upload Your CV**
   - Navigate to the dashboard
   - Upload your existing CV/Resume (PDF format)

2. **Choose a Template**
   - Browse through available templates
   - Preview each template's design
   - Select the one that best fits your industry

3. **Generate Resume**
   - Enter your job title (optional)
   - Click "Generate Resume"
   - AI will optimize your content for the selected template

4. **Download PDF**
   - Preview the generated resume
   - Download as a professional PDF file

### For Developers

#### API Endpoints

**Upload CV**
```http
POST /api/upload-cv
Content-Type: multipart/form-data
```

**Generate Resume**
```http
POST /api/resume/generate
Content-Type: application/json

{
  "templateId": "template_id",
  "userId": "user_id",
  "commands": "optional_customization"
}
```

**Get Templates**
```http
GET /api/templates
```


##  Configuration

### Environment Variables

 Variables
---------------------------------
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
// MongoDb
username=
password=
MONGODB_URI=
//Gemini 
GEMINI_API_KEY=
NEXT_PUBLIC_GEMINI_ENABLED=true
GEMINI_API_URL=
NEXT_PUBLIC_BASE_URL=http://localhost:3000

### Database Collections

- **users**: User account information
- **templates**: Resume template data
- **resumes**: Generated resume data
- **cvs**: Uploaded CV files

##  Customization

### Adding New Templates

1. Create template HTML in `src/app/api/templates/route.ts`
2. Add template metadata (name, category, description)
3. Include CSS styling within the template

### Styling

The app uses Tailwind CSS for styling. Custom styles can be added in:
- `src/app/globals.css` for global styles
- Component-specific styles using Tailwind classes

## Troubleshooting

### Common Issues

**PDF Generation Fails**
- Ensure Puppeteer dependencies are installed
- Check if the HTML content is valid
- Verify the template structure

**AI Generation Errors**
- Verify your Gemini API key is correct
- Check API rate limits
- Ensure the PDF file is not corrupted

**Database Connection Issues**
- Verify MongoDB connection string
- Check if MongoDB service is running
- Ensure network connectivity

### Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


##  Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn/ui](https://ui.shadcn.com/) for components

