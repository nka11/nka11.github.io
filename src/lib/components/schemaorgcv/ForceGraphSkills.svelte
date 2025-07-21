<script>
    import { skillsLinks, skillsNodes } from '$lib/semcv/adapters/skillsAdapter';


  import * as d3 from 'd3';
    import { onMount } from 'svelte';
    export let nodes = [];
  export let links = [];
  let container;
  onMount(async () => {

    nodes = skillsNodes().map((e) => {
        return {
            "id": e.id.value,
            "label": e.label.value,
            "group": e.group.value
        }
    });
    // console.log(nodes)
    links = skillsLinks().map((e) => {
        return {
            "source": e.source.value,
            "target": e.target.value
        }
    });
    console.log(links)
  if (container && nodes.length && links.length) {
    drawGraph();
  }

  function drawGraph() {
    d3.select(container).selectAll("*").remove(); // reset

    const width = 800;
    const height = 600;

    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(20))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#aaa")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 6)
      .attr("fill", d => color(d.group))
      .call(drag(simulation));

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.label)
      .attr("font-size", "10px")
      .attr("dy", -8)
      .attr("text-anchor", "middle");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });
  }

  function drag(simulation) {
    return d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }})
</script>

<div bind:this={container} class="w-full h-full"></div>

<style>
  svg {
    border: 1px solid #ccc;
    background-color: #fdfdfd;
  }
</style>
