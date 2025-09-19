"use client"

import React from 'react';

interface SimpleMarkdownProps {
  children: string;
  className?: string;
}

export function SimpleMarkdown({ children, className = "" }: SimpleMarkdownProps) {
  const renderMarkdown = (text: string) => {
    if (!text) return '';

    // Simple markdown parsing for basic features
    let html = text
      // Headers (##, ###)
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>')

      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')

      // Code blocks
      .replace(/```([^`]+)```/g, '<pre class="bg-muted p-3 rounded-md overflow-x-auto"><code class="text-sm font-mono">$1</code></pre>')

      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>')

      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')

      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br />');

    // Wrap in paragraphs
    if (html && !html.includes('<h') && !html.includes('<li') && !html.includes('<pre>')) {
      html = `<p class="mb-3">${html}</p>`;
    }

    // Wrap list items in proper lists
    html = html
      .replace(/(<li class="ml-4">• .*?<\/li>)/g, '<ul class="mb-3">$1</ul>')
      .replace(/(<li class="ml-4 list-decimal">.*?<\/li>)/g, '<ol class="mb-3 ml-4">$1</ol>');

    return html;
  };

  return (
    <div
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(children) }}
    />
  );
}