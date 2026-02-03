'use client'

import { useEffect } from 'react'

export function CodeBlockCopy() {
  useEffect(() => {
    // Find all code blocks
    const codeBlocks = document.querySelectorAll('figure[data-rehype-pretty-code-figure]')
    
    codeBlocks.forEach((figure) => {
      // Skip if button already exists
      if (figure.querySelector('.copy-button')) return
      
      const pre = figure.querySelector('pre')
      const code = pre?.querySelector('code')
      
      if (!code) return
      
      // Create copy button
      const button = document.createElement('button')
      button.className = 'copy-button'
      button.setAttribute('aria-label', 'Copy code to clipboard')
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `
      
      // Add click handler
      button.addEventListener('click', async () => {
        const text = code.textContent || ''
        
        try {
          await navigator.clipboard.writeText(text)
          
          // Show success state
          button.classList.add('copied')
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `
          
          // Reset after 2 seconds
          setTimeout(() => {
            button.classList.remove('copied')
            button.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            `
          }, 2000)
        } catch (err) {
          console.error('Failed to copy code:', err)
        }
      })
      
      // Add button to figure
      figure.appendChild(button)
    })
  }, [])
  
  return null
}
