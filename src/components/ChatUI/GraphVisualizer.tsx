// components/ChatUI/GraphVisualizer.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Node, Link, GraphData } from '../../types';

interface GraphVisualizerProps {
  data: GraphData;
  width?: number;
  height?: number;
  onNodeClick?: (node: Node) => void;
  className?: string;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  data,
  width = 600,
  height = 400,
  onNodeClick,
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || !data.nodes || !data.links) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Define node colors based on type
    const nodeColors: Record<string, string> = {
      'document': '#4f46e5', // Indigo
      'chunk': '#10b981',    // Emerald
      'query': '#f59e0b',    // Amber
      'answer': '#ef4444',   // Red
      'default': '#6b7280',  // Gray
    };

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));

    // Create links
    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', (d: Link) => Math.sqrt(d.value || 1));

    // Create link labels if they have labels
    const linkLabel = svg.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(data.links.filter((d: Link) => d.label))
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .attr('fill', '#666')
      .attr('font-size', '8px')
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

    // Add circle to each node
    node.append('circle')
      .attr('r', (d: Node) => d.size || 15)
      .attr('fill', (d: Node) => nodeColors[d.type] || nodeColors.default)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    // Add text label to each node
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .text((d: Node) => d.id.substring(0, 8));

    // Handle hover effects
    node.on('mouseover', function(event: any, d: Node) {
      d3.select(this).select('circle')
        .transition()
        .duration(300)
        .attr('r', (d: Node) => (d.size || 15) * 1.2);
        
      showTooltip(event, d);
    })
    .on('mouseout', function(event: any, d: Node) {
      d3.select(this).select('circle')
        .transition()
        .duration(300)
        .attr('r', (d: Node) => d.size || 15);
        
      hideTooltip();
    });

    // Create and configure tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'graph-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('padding', '10px')
      .style('border-radius', '6px')
      .style('pointer-events', 'none')
      .style('font-size', '12px')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');

    function showTooltip(event: any, d: Node) {
      tooltip
        .style('visibility', 'visible')
        .html(`
          <div>
            <strong>ID:</strong> ${d.id}<br/>
            <strong>Type:</strong> ${d.type}<br/>
            ${d.content ? `<strong>Content:</strong> ${d.content.substring(0, 100)}${d.content.length > 100 ? '...' : ''}` : ''}
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
    <div className={`graph-visualizer ${className}`}>
      <svg ref={svgRef} />
    </div>
  );
};

export default GraphVisualizer;