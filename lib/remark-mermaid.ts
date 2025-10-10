import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Code } from 'mdast'

interface MdxJsxAttribute {
  type: 'mdxJsxAttribute'
  name: string
  value: string
}

interface MdxJsxFlowElement {
  type: 'mdxJsxFlowElement'
  name: string
  attributes: MdxJsxAttribute[]
  children: never[]
}

/**
 * Remark plugin to transform mermaid code blocks into custom JSX components
 * This runs before rehype plugins, so rehype-pretty-code won't process mermaid blocks
 */
export const remarkMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang === 'mermaid' && parent && typeof index === 'number') {
        // Replace the code node with a JSX element
        const mermaidNode: MdxJsxFlowElement = {
          type: 'mdxJsxFlowElement',
          name: 'Mermaid',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'chart',
              value: node.value,
            },
          ],
          children: [],
        }
        
        parent.children[index] = mermaidNode as unknown as Code
      }
    })
  }
}

