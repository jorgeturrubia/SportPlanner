---
inclusion: always
---

# UI/UX Development Conventions

## CSS Framework Standards

### Tailwind CSS Implementation
- **Version**: Use specific version from tech.md (e.g., Tailwind CSS v4)
- **Approach**: Utility-first CSS with component-specific patterns
- **Configuration**: Follow project-specific tailwind.config.js settings
- **Custom Classes**: Minimize custom CSS, prefer utility combinations

### Responsive Design Patterns
- **Strategy**: Mobile-first design approach
- **Breakpoints**: Use Tailwind's standard breakpoints (sm:, md:, lg:, xl:, 2xl:)
- **Components**: Design for mobile then enhance for larger screens
- **Testing**: Verify responsiveness across all target devices

### Component Styling Guidelines
- **Consistency**: Use design system tokens for colors, spacing, typography
- **Modularity**: Create reusable utility class combinations
- **Performance**: Avoid unnecessary style repetition
- **Maintainability**: Group related styles logically

## Iconography Standards

### Icon Library Usage
- **Primary Library**: Use library specified in tech.md (e.g., Hero Icons)
- **Sizing**: Consistent icon sizes across similar contexts
- **Colors**: Icons should inherit text color unless specifically themed
- **Accessibility**: Include appropriate aria-labels for meaningful icons

### Icon Implementation Patterns
```html
<!-- Standard icon usage -->
<icon-name class="w-5 h-5 text-gray-500" aria-label="descriptive text" />

<!-- Interactive icons -->
<button class="p-2 hover:bg-gray-100 rounded">
  <icon-name class="w-4 h-4" aria-label="action description" />
</button>
```

## Color System Guidelines

### Color Palette Management
- **Primary Colors**: Use project brand colors from design system
- **Semantic Colors**: Consistent success, warning, error, info colors
- **Neutral Scale**: Comprehensive gray scale for backgrounds and text
- **Accessibility**: Ensure WCAG AA contrast ratios (4.5:1 minimum)

### Color Usage Patterns
- **Text**: Use semantic color classes (text-gray-900, text-blue-600)
- **Backgrounds**: Subtle background variations (bg-gray-50, bg-white)
- **Borders**: Consistent border colors (border-gray-200, border-gray-300)
- **Interactive States**: Clear hover, active, and focus color changes

## Typography Conventions

### Font System
- **Font Stack**: Use system fonts or web fonts specified in tech.md
- **Font Sizes**: Consistent type scale (text-sm, text-base, text-lg, text-xl)
- **Line Heights**: Appropriate line-height for readability
- **Font Weights**: Strategic use of font-weight variations

### Text Hierarchy
```css
/* Heading hierarchy example */
.heading-1: text-3xl font-bold text-gray-900
.heading-2: text-2xl font-semibold text-gray-800
.heading-3: text-xl font-medium text-gray-800
.body-text: text-base text-gray-700
.caption: text-sm text-gray-600
```

## Component Design Patterns

### Form Components
- **Input Fields**: Consistent padding, borders, and focus states
- **Labels**: Clear, descriptive labels with proper associations
- **Validation**: Visual feedback for errors and success states
- **Accessibility**: Proper ARIA attributes and keyboard navigation

### Modal Components
- **Backdrop**: Semi-transparent overlay (bg-black bg-opacity-50)
- **Container**: Centered, responsive modal container
- **Animations**: Smooth enter/exit transitions
- **Focus Management**: Trap focus within modal, return on close

### Button Components
```css
/* Button pattern examples */
.btn-primary: bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded
.btn-secondary: bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded
.btn-danger: bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded
```

### Card Components
- **Container**: Consistent padding, borders, and shadows
- **Content Hierarchy**: Clear information organization
- **Interactive States**: Subtle hover effects when clickable
- **Responsive**: Adapt layout for different screen sizes

## Layout Conventions

### Grid Systems
- **CSS Grid**: Use for complex layouts requiring precise control
- **Flexbox**: Use for component-level alignment and distribution
- **Tailwind Grid**: Leverage utility classes for common grid patterns
- **Responsive Grids**: Adjust column counts based on screen size

### Spacing System
- **Margin/Padding**: Use Tailwind's spacing scale (p-4, m-2, space-y-4)
- **Consistency**: Maintain consistent spacing patterns throughout
- **Vertical Rhythm**: Establish clear vertical spacing relationships
- **Component Spacing**: Standardize spacing between related elements

## Accessibility Requirements

### WCAG Compliance
- **Level**: Minimum WCAG 2.1 AA compliance
- **Color Contrast**: 4.5:1 ratio for normal text, 3:1 for large text
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Readers**: Semantic HTML and appropriate ARIA attributes

### Implementation Guidelines
- **Alt Text**: Descriptive alt text for all meaningful images
- **Form Labels**: Explicit labels for all form controls
- **Focus Indicators**: Visible focus indicators for keyboard users
- **Error Messages**: Clear, programmatically associated error messages

## Performance Considerations

### CSS Optimization
- **Purging**: Remove unused CSS in production builds
- **Critical CSS**: Inline critical styles for above-the-fold content
- **CSS Loading**: Optimize CSS loading strategy
- **Bundle Size**: Monitor and minimize CSS bundle size

### Image Optimization
- **Formats**: Use modern image formats (WebP, AVIF) with fallbacks
- **Sizing**: Provide images in multiple sizes for different viewports
- **Loading**: Implement lazy loading for non-critical images
- **Compression**: Optimize images for web delivery

## Development Workflow

### Design System Integration
- **Tokens**: Use design tokens for consistent values across projects
- **Documentation**: Document component variations and usage guidelines
- **Testing**: Visual regression testing for design consistency
- **Collaboration**: Clear communication between design and development

### Code Organization
- **File Structure**: Organize styles logically (components, utilities, base)
- **Naming**: Consistent naming conventions for custom classes
- **Comments**: Document complex styling decisions
- **Maintenance**: Regular audits for unused or redundant styles

Remember: These conventions should be applied consistently across all UI components and should align with the specific CSS framework and tools specified in your project's tech.md file.
