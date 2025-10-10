# Mermaid Diagram Support in MDX

## Overview

Your blog now supports **Mermaid diagrams** natively in MDX files! The implementation is theme-aware and will automatically switch between light and dark modes based on your site's theme.

## Usage

To add a Mermaid diagram to your blog post, simply use a code block with the `mermaid` language identifier:

````markdown
```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Check the docs]
    C --> E[End]
    D --> E
```
````

## Supported Diagram Types

Mermaid supports many diagram types, including:

1. **Flowcharts**
2. **Sequence Diagrams**
3. **Class Diagrams**
4. **State Diagrams**
5. **Entity Relationship Diagrams**
6. **User Journey Diagrams**
7. **Gantt Charts**
8. **Pie Charts**
9. **Git Graphs**

## Examples

### Flowchart

````markdown
```mermaid
flowchart TB
    User[("👤 User")]
    AWS["☁️ AWS Cloud"]
    Lambda["λ Lambda Function"]
    
    User -->|Request| AWS
    AWS -->|Invoke| Lambda
    Lambda -->|Response| AWS
    AWS -->|Return| User
```
````

### Sequence Diagram

````markdown
```mermaid
sequenceDiagram
    participant U as User
    participant A as API Gateway
    participant L as Lambda
    participant D as DynamoDB
    
    U->>A: POST /api/endpoint
    A->>L: Invoke function
    L->>D: Store data
    D->>L: Confirm
    L->>A: Success
    A->>U: 200 OK
```
````

## Theme Support

The Mermaid component automatically adapts to your site's theme:

- **Light Mode**: Uses the default Mermaid theme with light colors
- **Dark Mode**: Uses the dark Mermaid theme with appropriate colors

The theme variables are configured to match your site's design system for a seamless experience.

## Error Handling

If a Mermaid diagram fails to render (e.g., due to syntax errors), an error message will be displayed instead of breaking the page. Check the browser console for detailed error information.

## Technical Implementation

The implementation includes three key pieces:

1. **remark-mermaid.ts** - A custom Remark plugin that:
   - Runs during the MDX compilation phase (BEFORE rehype plugins)
   - Transforms Mermaid code blocks into custom `<Mermaid>` JSX components
   - Prevents `rehype-pretty-code` from processing Mermaid blocks as regular code

2. **Mermaid.tsx** - A client-side React component that:
   - Detects the current theme (light/dark)
   - Initializes Mermaid with theme-specific configuration
   - Renders diagrams with proper error handling
   - Re-renders when the theme changes

3. **MDXContent.tsx** - Updated to include the Mermaid component in the available components for MDX

### Why the Remark Plugin?

Initially, the Mermaid diagrams weren't rendering because `rehype-pretty-code` (used for syntax highlighting) was processing ALL code blocks before they could reach the React components. The remark plugin solves this by transforming Mermaid blocks into JSX components during the MDX compilation phase, which happens before syntax highlighting.

## Resources

- [Mermaid Documentation](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live/) - Test your diagrams before adding them to your blog

## Notes

- Mermaid diagrams are rendered client-side, so they won't appear in the initial HTML
- The diagrams are responsive and will adjust to different screen sizes
- All diagrams are styled to match your site's theme automatically

