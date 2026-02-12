# Budget Lens: React TypeScript Vite Project Setup

## Project Initialization

### 1. Install Tailwind CSS

```bash
# Install Tailwind and related dependencies
npm install -D tailwindcss postcss autoprefixer

# Generate tailwind config files
npx tailwindcss init -p
```

### 3. Configure Tailwind

#### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
        },
        secondary: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
        },
        neutral: {
          background: "#F4F4F5",
          text: {
            primary: "#18181B",
            secondary: "#71717A",
          },
        },
        status: {
          positive: "#10B981",
          negative: "#EF4444",
          warning: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
      },
      spacing: {
        xs: "0.25rem", // 4px
        sm: "0.5rem", // 8px
        md: "1rem", // 16px
        lg: "1.5rem", // 24px
        xl: "2rem", // 32px
      },
    },
  },
  plugins: [],
};
```

#### `src/index.css`

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom global styles */
body {
  @apply font-sans text-neutral-text-primary bg-neutral-background;
}
```

### 4. Project Structure

```
budget-lens-frontend/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Reusable React components
│   │   ├── atoms/        # Smallest components
│   │   ├── molecules/    # Composed components
│   │   └── organisms/    # Complex, page-level components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Route-based page components
│   ├── services/         # API and data services
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── favicon.ico
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

### 5. Essential Dependencies

```bash
# State Management
npm install zustand

# Routing
npm install react-router-dom

# Form Handling
npm install react-hook-form @hookform/resolvers

# Data Fetching
npm install @tanstack/react-query

# Validation
npm install zod

# Icons
npm install lucide-react

# Extras
npm install date-fns
```

### 6. Initial Component Example

#### `src/components/atoms/Button.tsx`

```typescript
import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark',
        outline: 'border border-primary text-primary hover:bg-primary/10',
        ghost: 'hover:bg-neutral-100 text-neutral-text-secondary'
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  children: React.ReactNode
}

export function Button({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  )
}
```

#### `src/utils/cn.ts` (Utility for conditional classes)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 7. Development Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### 8. Git Initialization

```bash
# Create .gitignore
npx gitignore node
git add .
git commit -m "Initial project setup with Tailwind CSS"
```

### 9. Recommended VS Code Extensions

- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Path Intellisense

## Next Steps

1. Set up routing
2. Create core pages
3. Implement state management
4. Set up API services

## Performance Optimization

- Use React.memo()
- Implement code splitting
- Optimize bundle size

## Accessibility Considerations

- Use semantic HTML
- Implement keyboard navigation
- Add ARIA attributes
- Ensure color contrast

## Deployment Preparation

- Configure environment variables
- Set up CI/CD pipeline
- Choose hosting platform (Vercel, Netlify)

## Recommended Learning Resources

- React Official Docs
- Tailwind CSS Documentation
- TypeScript Handbook
