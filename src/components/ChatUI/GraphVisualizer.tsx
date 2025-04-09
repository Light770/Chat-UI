// components/ChatUI/GraphVisualizer.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Node, Link, GraphData } from '../../types';

interface GraphVisualizerProps {
  data: GraphData;
  width?: number;
  height?: number;
  onNodeClick?: (node: Node) => void;
  className?: string;
  responsive?: boolean;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  data,
  width: initialWidth = 600,
  height = 400,
  onNodeClick,
  className = '',
  responsive = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initialWidth);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  // Handle responsive sizing
  useEffect(() => {
    if (!responsive || !containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [responsive]);

  useEffect(() => {
    if (!svgRef.current || !data || !data.nodes || !data.links) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Add a glass-like background with rounded corners
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('rx', 12) // Rounded corners
      .attr('fill', 'rgba(255, 255, 255, 0.08)')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', 1);

    // Define gradient colors for nodes based on type
    const defs = svg.append('defs');

    // Create gradients for each node type
    const nodeGradients: Record<string, string> = {
      'document': 'url(#gradientDocument)',
      'chunk': 'url(#gradientChunk)',
      'query': 'url(#gradientQuery)',
      'answer': 'url(#gradientAnswer)',
      'default': 'url(#gradientDefault)',
    };

    // Create document gradient (blue to purple)
    const gradientDocument = defs.append('linearGradient')
      .attr('id', 'gradientDocument')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');
    
    gradientDocument.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4f46e5');
    
    gradientDocument.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8b5cf6');

    // Create chunk gradient (green to teal)
    const gradientChunk = defs.append('linearGradient')
      .attr('id', 'gradientChunk')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');
    
    gradientChunk.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981');
    
    gradientChunk.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0ea5e9');

    // Create query gradient (amber to orange)
    const gradientQuery = defs.append('linearGradient')
      .attr('id', 'gradientQuery')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');
    
    gradientQuery.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#f59e0b');
    
    gradientQuery.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f97316');

    // Create answer gradient (red to pink)
    const gradientAnswer = defs.append('linearGradient')
      .attr('id', 'gradientAnswer')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');
    
    gradientAnswer.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ef4444');
    
    gradientAnswer.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ec4899');

    // Create default gradient (gray)
    const gradientDefault = defs.append('linearGradient')
      .attr('id', 'gradientDefault')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');
    
    gradientDefault.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#6b7280');
    
    gradientDefault.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#4b5563');

    // Add a subtle glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'blur');
    
    filter.append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blur')
      .attr('operator', 'over');

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));

    // Main container for all links (lowest z-index)
    const linksGroup = svg.append('g')
      .attr('class', 'links-group');

    // Create links with gradient and translucent effect
    const link = linksGroup.selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', 'rgba(150, 150, 150, 0.3)')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: Link) => Math.sqrt(d.value || 1))
      .attr('stroke-dasharray', (d: Link) => d.type === 'dashed' ? '5,5' : 'none');

    // Create link labels if they have labels
    const linkLabel = linksGroup.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(data.links.filter((d: Link) => d.label))
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .attr('fill', 'rgba(150, 150, 150, 0.9)')
      .attr('font-size', '8px')
      .attr('filter', 'url(#glow)')
      .text((d: Link) => d.label || '');

    // Container for all nodes (higher z-index)
    const nodesGroup = svg.append('g')
      .attr('class', 'nodes-group');

    // Create node groups
    const node = nodesGroup.selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(drag(simulation) as any)
      .on('click', function(event: any, d: Node) {
        event.stopPropagation(); // Prevent event propagation
        
        // Get coordinates - important for tooltip positioning
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          
          setTooltipPos({ x, y });
        }
        
        if (selectedNode && selectedNode.id === d.id) {
          // If clicking the same node, deselect it
          setSelectedNode(null);
        } else {
          // Select new node
          setSelectedNode(d);
        }
        
        // Call external handler if provided
        if (onNodeClick) onNodeClick(d);
      });

    // Add glass-like circle effect to each node
    node.append('circle')
      .attr('r', (d: Node) => (d.size || 15) + 3) // Larger background for glass effect
      .attr('fill', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke', 'rgba(255, 255, 255, 0.3)')
      .attr('stroke-width', 1);

    // Add colored circle to each node
    node.append('circle')
      .attr('r', (d: Node) => d.size || 15)
      .attr('fill', (d: Node) => nodeGradients[d.type] || nodeGradients.default)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('filter', 'url(#glow)');

    // Add text label to each node
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .text((d: Node) => d.id.substring(0, 8));

    // Handle hover effects
    node.on('mouseover', function(event: any, d: Node) {
      // Grow the node slightly
      d3.select(this).select('circle:nth-child(2)')
        .transition()
        .duration(300)
        .attr('r', (d: Node) => (d.size || 15) * 1.2);
        
      // Get coordinates for hover tooltip
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        setTooltipPos({ x, y });
      }
    })
    .on('mouseout', function(event: any, d: Node) {
      d3.select(this).select('circle:nth-child(2)')
        .transition()
        .duration(300)
        .attr('r', (d: Node) => d.size || 15);
    });

    // Handle click on SVG background to deselect
    svg.on('click', () => {
      setSelectedNode(null);
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Reheat simulation when width changes
    if (width) {
      simulation.alpha(0.3).restart();
    }

    // Drag functions
    function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  }, [data, width, height, onNodeClick]);

  // Generate tooltip content from node data
  const renderNodeContent = (node: Node) => {
    return (
      <div className="flex flex-col space-y-2">
        <div className="font-bold text-blue-700 dark:text-blue-400 text-sm">{node.id}</div>
        <div><strong className="text-blue-600 dark:text-blue-300">Type:</strong> {node.type}</div>
        {node.content && (
          <div>
            <strong className="text-blue-600 dark:text-blue-300">Content:</strong> 
            <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 max-h-40 overflow-y-auto text-xs">
              {node.content}
            </div>
          </div>
        )}
        {Object.entries(node)
          .filter(([key]) => !['id', 'type', 'content', 'size', 'index', 'x', 'y', 'vx', 'vy'].includes(key))
          .map(([key, value]) => (
            <div key={key}>
              <strong className="text-blue-600 dark:text-blue-300">{key}:</strong> {String(value)}
            </div>
          ))
        }
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className={`graph-visualizer glass-effect rounded-xl p-2 w-full relative ${className}`}
    >
      <svg ref={svgRef} className="rounded-lg overflow-hidden" />
      
      {/* Rendered tooltip with absolute positioning */}
      {selectedNode && (
        <div 
          className="absolute glass-effect p-3 rounded-lg max-w-xs z-50"
          style={{ 
            left: `${tooltipPos.x + 15}px`, 
            top: `${tooltipPos.y - 15}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            pointerEvents: 'auto',
            backdropFilter: 'blur(5px)',
          }}
        >
          <button 
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            onClick={() => setSelectedNode(null)}
          >
            ✕
          </button>
          {renderNodeContent(selectedNode)}
        </div>
      )}
    </div>
  );
};

export default GraphVisualizer;