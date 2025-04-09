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

    // Create links with gradient and translucent effect
    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', 'rgba(150, 150, 150, 0.3)')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: Link) => Math.sqrt(d.value || 1))
      .attr('stroke-dasharray', (d: Link) => d.type === 'dashed' ? '5,5' : 'none');

    // Create link labels if they have labels
    const linkLabel = svg.append('g')
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

    // Create node groups
    const node = svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(drag(simulation) as any)
      .on('click', function(event: any, d: Node) {
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
      d3.select(this).select('circle:nth-child(2)')
        .transition()
        .duration(300)
        .attr('r', (d: Node) => (d.size || 15) * 1.2);
        
      showTooltip(event, d);
    })
    .on('mouseout', function(event: any, d: Node) {
      d3.select(this).select('circle:nth-child(2)')
        .transition()
        .duration(300)
        .attr('r', (d: Node) => d.size || 15);
        
      hideTooltip();
    });

    // Create and configure tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'graph-tooltip glass-effect')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(255, 255, 255, 0.8)')
      .style('backdrop-filter', 'blur(8px)')
      .style('border', '1px solid rgba(255, 255, 255, 0.3)')
      .style('padding', '10px')
      .style('border-radius', '8px')
      .style('pointer-events', 'none')
      .style('font-size', '12px')
      .style('box-shadow', '0 4px 15px rgba(0, 0, 0, 0.1)');

    function showTooltip(event: any, d: Node) {
      tooltip
        .style('visibility', 'visible')
        .html(`
          <div>
            <strong class="text-blue-600">ID:</strong> ${d.id}<br/>
            <strong class="text-blue-600">Type:</strong> ${d.type}<br/>
            ${d.content ? `<strong class="text-blue-600">Content:</strong> ${d.content.substring(0, 100)}${d.content.length > 100 ? '...' : ''}` : ''}
          </div>
        `)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 30) + 'px');
    }

    function hideTooltip() {
      tooltip.style('visibility', 'hidden');
    }

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

    // Clean up tooltip when component unmounts
    return () => {
      tooltip.remove();
    };
  }, [data, width, height, onNodeClick]);

  return (
    <div 
      ref={containerRef} 
      className={`graph-visualizer glass-effect rounded-xl p-2 w-full ${className}`}
    >
      <svg ref={svgRef} className="rounded-lg overflow-hidden" />
    </div>
  );
};

export default GraphVisualizer;