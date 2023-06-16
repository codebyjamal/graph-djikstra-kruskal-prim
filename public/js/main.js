// Get the canvas element
const canvas = document.getElementById('graphCanvas');
const context = canvas.getContext('2d');

// Set up the graph parameters
const graphWidth = canvas.width;
const graphHeight = canvas.height;

// Create the graph variables and ID counters
let nodes = [];
let edges = [];
let nodeIdCounter = 1;
let edgeIdCounter = 1;
let selectedNodeId = null;
let draggedNodeId = null;
let selectedEdgeId = null;
let directed = true;
const directedSwitch = document.getElementById('directedSwitch');
directedSwitch.checked = directed;

// Function to add a node to the graph
function addNode(x, y) {
  const node = {
    id: nodeIdCounter++,
    x: x / graphWidth,
    y: (canvas.height - y) / graphHeight,
    selected: false
  };
  nodes.push(node);
  renderGraph();
}

// Function to add an edge to the graph
function addEdge(fromNodeId, toNodeId, weight) {
  const edge = {
    id: edgeIdCounter++,
    from: fromNodeId,
    to: toNodeId,
    weight: weight
  };
  edges.push(edge);
  renderGraph();
}

// Function to select a node
function selectNode(nodeId) {
  selectedNodeId = nodeId;
  selectedEdgeId = null;
  draggedNodeId = null;
  renderGraph();
}

// Function to update the node position while dragging
function updateNodePosition(x, y) {
  const node = nodes.find((node) => node.id === draggedNodeId);
  node.x = x / graphWidth;
  node.y = (canvas.height - y) / graphHeight;
  renderGraph();
}

// Function to render the graph
function renderGraph() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

// Draw the edges
for (const edge of edges) {
  const fromNode = nodes.find((node) => node.id === edge.from);
  const toNode = nodes.find((node) => node.id === edge.to);
  const fromX = fromNode.x * graphWidth;
  const fromY = canvas.height - fromNode.y * graphHeight;
  const toX = toNode.x * graphWidth;
  const toY = canvas.height - toNode.y * graphHeight;

  // Calculate the angle and length of the edge
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const length = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);

  // Offset for arrowhead and gap between arrowhead and node
  const offset = 15;
  const gap = -1;

  // Calculate the coordinates of the arrowhead
  const arrowX = toX - Math.cos(angle) * (offset + gap);
  const arrowY = toY - Math.sin(angle) * (offset + gap);

  // Draw the edge line
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.strokeStyle = (edge.id === selectedEdgeId) ? 'red' : 'black';
  context.stroke();
  if(directed){
    // Draw the arrowhead
    context.beginPath();
    context.moveTo(arrowX, arrowY);
    context.lineTo(arrowX - Math.cos(angle - Math.PI / 6) * offset, arrowY - Math.sin(angle - Math.PI / 6) * offset);
    context.lineTo(arrowX - Math.cos(angle + Math.PI / 6) * offset, arrowY - Math.sin(angle + Math.PI / 6) * offset);
    context.closePath();
    context.fillStyle = 'black';
    context.fill();
  }

  // Draw the edge weight
  const weightX = (fromX + toX) / 2;
  const weightY = (fromY + toY) / 2;
  context.fillStyle = 'black';
  context.font = '12px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(edge.weight.toString(), weightX, weightY);
}

  // Draw the nodes
  for (const node of nodes) {
    const x = node.x * graphWidth;
    const y = canvas.height - node.y * graphHeight;
    context.beginPath();
    context.arc(x, y, 15, 0, Math.PI * 2);

    // Fill the circle based on selection
    if (node.id === selectedNodeId) {
      context.fillStyle = 'red';
    } else {
      context.fillStyle = 'blue';
    }
    context.fill();

    // Draw the node ID inside the circle
    context.fillStyle = 'white';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(node.id.toString(), x, y);
  }
}

// Add an event listener to the canvas for click events
canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Check if a node was clicked
  for (const node of nodes) {
    const nodeX = node.x * graphWidth;
    const nodeY = canvas.height - node.y * graphHeight;
    const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);

    // If a node was clicked, select it
    if (distance <= 15) {
      if (selectedNodeId !== null && selectedNodeId !==node.id) {
        const existingEdge = edges.find((edge) => {
          return (edge.from === selectedNodeId && edge.to === node.id) ||
            (edge.from === node.id && edge.to === selectedNodeId);
        });
        if(existingEdge){
          selectedNodeId = node.id;
          selectedEdgeId = null;
          draggedNodeId = null;
        }else{
        const weight = prompt('Enter the weight for the edge:');
        if (weight) {
          addEdge(selectedNodeId, node.id, weight);
        }
        return;
      }}
      if (node.id === selectedNodeId) {
        // Deselect the node if already selected
        selectedNodeId = null;
      } else {
        // Select the node
        selectedNodeId = node.id;
        selectedEdgeId = null;
        draggedNodeId = null;
      }
      renderGraph();
      return; // Exit the function to prevent adding a new node
    }
  }
    // Check if an edge was clicked
    for (const edge of edges) {
      const startNode = nodes.find((node) => node.id === edge.from);
      const endNode = nodes.find((node) => node.id === edge.to);
      
      const startX = startNode.x * graphWidth;
      const startY = canvas.height - startNode.y * graphHeight;
      const endX = endNode.x * graphWidth;
      const endY = canvas.height - endNode.y * graphHeight;
  
      // Calculate the distance from the click to the edge
      const distance = distanceToEdge(x, y, startX, startY, endX, endY);
  
      // If an edge was clicked, select it
      if (distance <= 5) {
        if (edge.id === selectedEdgeId) {
          // Deselect the edge if already selected
          selectedEdgeId = null;
        } else {
          // Select the edge
          selectedEdgeId = edge.id;
          selectedNodeId = null;
        }
        renderGraph();
        return; // Exit the function to prevent adding a new node
      }
    }

  // If no node was clicked, add a new node
  addNode(x, y);
});

// Add an event listener to the canvas for mousedown events
canvas.addEventListener('mousedown', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Check if a node was clicked
  for (const node of nodes) {
    const nodeX = node.x * graphWidth;
    const nodeY = canvas.height - node.y * graphHeight;
    const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);

    // If a node was clicked, start dragging it
    if (distance <= 15) {
      draggedNodeId = node.id;
      return;
    }
  }
});

// Add an event listener to the canvas for mousemove events
canvas.addEventListener('mousemove', function(event) {
  if (draggedNodeId) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    updateNodePosition(x, y);
  }
});

// Add an event listener to the canvas for mouseup events
canvas.addEventListener('mouseup', function(event) {
  draggedNodeId = null;
});


// Render the initial empty graph
renderGraph();

// Function to calculate the distance from a point to an edge
function distanceToEdge(x, y, startX, startY, endX, endY) {
  const A = x - startX;
  const B = y - startY;
  const C = endX - startX;
  const D = endY - startY;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = startX;
    yy = startY;
  } else if (param > 1) {
    xx = endX;
    yy = endY;
  } else {
    xx = startX + param * C;
    yy = startY + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}
// Add an event listener to the document for keydown events
document.addEventListener('keydown', function(event) {
  // Check if the Backspace key is pressed
  if (event.key === 'Backspace') {
    if (selectedNodeId) {
      // Delete the selected node
      nodes = nodes.filter((node) => node.id !== selectedNodeId);
      // Remove any edges connected to the selected node
      edges = edges.filter((edge) => edge.startNodeId !== selectedNodeId && edge.endNodeId !== selectedNodeId);
      selectedNodeId = null; // Deselect the node
      renderGraph();
    } else if (selectedEdgeId) {
      // Delete the selected edge
      edges = edges.filter((edge) => edge.id !== selectedEdgeId);
      selectedEdgeId = null; // Deselect the edge
      renderGraph();
    }
  }
});


document.getElementById("clear").addEventListener('click',function(){
  nodes=[];
  edges=[];
  renderGraph();
})


// Function to run Dijkstra's algorithm and mark the shortest path
function runDijkstra() {
  startNodeId = prompt('start');
  endNodeId = prompt('end');
  if (!startNodeId || !endNodeId){
    return;
  }
  // Initialize distances and visited flags for all nodes
  const distances = {};
  const visited = {};
  const previous = {};

  for (const node of nodes) {
    distances[node.id] = Infinity;
    visited[node.id] = false;
    previous[node.id] = null;
  }

  // Set the distance of the starting node to 0
  distances[startNodeId] = 0;

  // Run Dijkstra's algorithm
  while (true) {
    // Find the node with the smallest distance that is not visited
    let minDistance = Infinity;
    let minNodeId = null;

    for (const node of nodes) {
      if (!visited[node.id] && distances[node.id] < minDistance) {
        minDistance = distances[node.id];
        minNodeId = node.id;
      }
    }

    if (minNodeId === null) {
      // No more unvisited nodes, algorithm finished
      break;
    }

    // Mark the current node as visited
    visited[minNodeId] = true;

    // Update distances of neighboring nodes
    for (const edge of edges) {
      if (edge.from === minNodeId) {
        const neighborNode = nodes.find((node) => node.id === edge.to);
        const newDistance = distances[minNodeId] + parseInt(edge.weight);

        if (newDistance < distances[neighborNode.id]) {
          distances[neighborNode.id] = newDistance;
          previous[neighborNode.id] = minNodeId;
        }
      }
      else if (!directed && edge.to === minNodeId) {
        const neighborNode = nodes.find((node) => node.id === edge.from);
        const newDistance = distances[minNodeId] + parseInt(edge.weight);

        if (newDistance < distances[neighborNode.id]) {
          distances[neighborNode.id] = newDistance;
          previous[neighborNode.id] = minNodeId;
        }
      }
    }
  }

  // Mark the shortest path
  let currentNodeId = endNodeId;
  const shortestPath = [];

  while (currentNodeId !== null) {
    shortestPath.push(currentNodeId);
    currentNodeId = previous[currentNodeId];
  }

  // Reverse the shortest path array to get the correct order
  shortestPath.reverse();
  // Render the graph with marked shortest path
  renderDijkstra(shortestPath, endNodeId, startNodeId);
}

// Add an event listener to the button for running Dijkstra's algorithm
document.getElementById('dijkstraButton').addEventListener('click', function() {
    clearmatrix();
    runDijkstra(); 
});

function renderDijkstra(shortestPath, endNodeId, startNodeId) {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the edges
  for (const edge of edges) {
    const fromNode = nodes.find((node) => node.id === edge.from);
    const toNode = nodes.find((node) => node.id === edge.to);
    const fromX = fromNode.x * graphWidth;
    const fromY = canvas.height - fromNode.y * graphHeight;
    const toX = toNode.x * graphWidth;
    const toY = canvas.height - toNode.y * graphHeight;

    // Draw the edge line
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.strokeStyle = (edge.id === selectedEdgeId) ? 'red' : 'black';
    context.stroke();

    // Draw the edge weight
    const weightX = (fromX + toX) / 2;
    const weightY = (fromY + toY) / 2;
    context.fillStyle = 'black';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(edge.weight.toString(), weightX, weightY);
  }

  // Animate the shortest path nodes and edges
  let animationFrame = 0;
  const animate = () => {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the edges
    for (const edge of edges) {
      const fromNode = nodes.find((node) => node.id === edge.from);
      const toNode = nodes.find((node) => node.id === edge.to);
      const fromX = fromNode.x * graphWidth;
      const fromY = canvas.height - fromNode.y * graphHeight;
      const toX = toNode.x * graphWidth;
      const toY = canvas.height - toNode.y * graphHeight;

      // Draw the edge line
      context.beginPath();
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.strokeStyle = (edge.id === selectedEdgeId) ? 'red' : 'black';
      context.stroke();

      // Draw the edge weight
      const weightX = (fromX + toX) / 2;
      const weightY = (fromY + toY) / 2;
      context.fillStyle = 'black';
      context.font = '12px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(edge.weight.toString(), weightX, weightY);
    }

    // Draw the nodes
    for (const node of nodes) {
      const x = node.x * graphWidth;
      const y = canvas.height - node.y * graphHeight;
      context.beginPath();
      context.arc(x, y, 15, 0, Math.PI * 2);

      // Fill the circle based on selection and if it's in the shortest path
      if (endNodeId == node.id || node.id == startNodeId || shortestPath.includes(node.id) && animationFrame >= shortestPath.indexOf(node.id)) {
        context.fillStyle = 'green'; // Color nodes in the shortest path green
      } else if (node.id === selectedNodeId) {
        context.fillStyle = 'red';
      } else {
        context.fillStyle = 'blue';
      }
      context.fill();

      // Draw the node ID inside the circle
      context.fillStyle = 'white';
      context.font = '12px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(node.id.toString(), x, y);
    }

    animationFrame++;
    if (animationFrame < shortestPath.length) {
      requestAnimationFrame(animate);
    }
  };

  animate();
}

// Add an event listener to the toggle switch
const toggleSwitch = document.querySelector('.switch input');
toggleSwitch.addEventListener('change', function() {
  directed = !directed; // Toggle the value of directed
  renderGraph();
});

// Kruskal's Algorithm
function runKruskal() {
  // Sort edges by weight in non-decreasing order
  const sortedEdges = edges.slice().sort((a, b) => a.weight - b.weight);

  // Create disjoint sets for each node
  const sets = {};
  for (const node of nodes) {
    sets[node.id] = new Set([node.id]);
  }

  // Array to store the edges in the minimum spanning tree
  const minimumSpanningTree = [];

  // Iterate over each edge in the sorted order
  for (const edge of sortedEdges) {
    const fromNode = edge.from;
    const toNode = edge.to;

    // Check if the two nodes belong to different sets (i.e., not in the same connected component)
    if (sets[fromNode].size !== sets[toNode].size || !sets[fromNode].has(toNode)) {
      minimumSpanningTree.push(edge);

      // Merge the sets of the two nodes
      const mergedSet = new Set([...sets[fromNode], ...sets[toNode]]);
      for (const node of mergedSet) {
        sets[node] = mergedSet;
      }
    }
  }

  // Render the graph with marked minimum spanning tree
  renderKruskal(minimumSpanningTree);
}

// Add an event listener to the button for running Kruskal's algorithm
document.getElementById('kruskalButton').addEventListener('click', function() {
  directed = false;
  directedSwitch.checked = directed;
  clearmatrix();
  runKruskal();
});

function renderKruskal(minimumSpanningTree) {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the edges
  for (const edge of edges) {
    const fromNode = nodes.find((node) => node.id === edge.from);
    const toNode = nodes.find((node) => node.id === edge.to);
    const fromX = fromNode.x * graphWidth;
    const fromY = canvas.height - fromNode.y * graphHeight;
    const toX = toNode.x * graphWidth;
    const toY = canvas.height - toNode.y * graphHeight;

    // Draw the edge line
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.strokeStyle = (minimumSpanningTree.includes(edge)) ? 'green' : 'black';
    context.stroke();

    // Draw the edge weight
    const weightX = (fromX + toX) / 2;
    const weightY = (fromY + toY) / 2;
    context.fillStyle = 'black';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(edge.weight.toString(), weightX, weightY);
  }

  // Draw the nodes
  for (const node of nodes) {
    const x = node.x * graphWidth;
    const y = canvas.height - node.y * graphHeight;
    context.beginPath();
    context.arc(x, y, 15, 0, Math.PI * 2);

    // Fill the circle based on if it's in the minimum spanning tree
    if (minimumSpanningTree.some((edge) => edge.from === node.id || edge.to === node.id)) {
      context.fillStyle = 'green'; // Color nodes in the minimum spanning tree green
    } else {
      context.fillStyle = 'blue';
    }
    context.fill();

    // Draw the node ID inside the circle
    context.fillStyle = 'white';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(node.id.toString(), x, y);
  }
}


// Prim's Algorithm
function runPrim() {
  // Choose a starting node (e.g., the first node in the list)
  const startNode = nodes[0];

  // Create a set to keep track of visited nodes
  const visited = new Set();

  // Array to store the edges in the minimum spanning tree
  const minimumSpanningTree = [];

  // Add the starting node to the visited set
  visited.add(startNode.id);

  // Run Prim's algorithm
  while (visited.size < nodes.length) {
    let minEdge = null;
    let minWeight = Infinity;

    // Find the minimum-weight edge that connects a visited node to an unvisited node
    for (const edge of edges) {
      if (
        (visited.has(edge.from) && !visited.has(edge.to)) ||
        (visited.has(edge.to) && !visited.has(edge.from))
      ) {
        if (edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
        }
      }
    }

    // Add the minimum-weight edge to the minimum spanning tree
    minimumSpanningTree.push(minEdge);

    // Add the unvisited node to the visited set
    if (!visited.has(minEdge.from)) {
      visited.add(minEdge.from);
    } else {
      visited.add(minEdge.to);
    }
  }

  // Render the graph with marked minimum spanning tree
  renderPrim(minimumSpanningTree);
}

// Add an event listener to the button for running Prim's algorithm
document.getElementById('primButton').addEventListener('click', function () {
  directed = false;
  directedSwitch.checked = directed;
  clearmatrix();
  runPrim();
});

function renderPrim(minimumSpanningTree) {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the edges
  for (const edge of edges) {
    const fromNode = nodes.find((node) => node.id === edge.from);
    const toNode = nodes.find((node) => node.id === edge.to);
    const fromX = fromNode.x * graphWidth;
    const fromY = canvas.height - fromNode.y * graphHeight;
    const toX = toNode.x * graphWidth;
    const toY = canvas.height - toNode.y * graphHeight;

    // Draw the edge line
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.strokeStyle = minimumSpanningTree.includes(edge) ? 'green' : 'black';
    context.stroke();

    // Draw the edge weight
    const weightX = (fromX + toX) / 2;
    const weightY = (fromY + toY) / 2;
    context.fillStyle = 'black';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(edge.weight.toString(), weightX, weightY);
  }

  // Draw the nodes
  for (const node of nodes) {
    const x = node.x * graphWidth;
    const y = canvas.height - node.y * graphHeight;
    context.beginPath();
    context.arc(x, y, 15, 0, Math.PI * 2);

    // Fill the circle based on if it's in the minimum spanning tree
    if (minimumSpanningTree.some((edge) => edge.from === node.id || edge.to === node.id)) {
      context.fillStyle = 'green'; // Color nodes in the minimum spanning tree green
    } else {
      context.fillStyle = 'blue';
    }
    context.fill();

    // Draw the node ID inside the circle
    context.fillStyle = 'white';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(node.id.toString(), x, y);
  }
}


// Function to create an adjacency matrix for the graph
function createAdjacencyMatrix() {
  // Create a 2D array to store the adjacency matrix
  const matrix = [];

  // Initialize the matrix with zeros
  for (let i = 0; i < nodes.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < nodes.length; j++) {
      matrix[i][j] = 0;
    }
  }

  // Fill the matrix with edge weights
  for (const edge of edges) {
    const fromIndex = nodes.findIndex((node) => node.id === edge.from);
    const toIndex = nodes.findIndex((node) => node.id === edge.to);
    matrix[fromIndex][toIndex] = edge.weight;
    matrix[toIndex][fromIndex] = edge.weight; // Uncomment this line for an undirected graph
  }

  // Render the adjacency matrix
  renderAdjacencyMatrix(matrix);
}

// Add an event listener to the button for creating the adjacency matrix
document.getElementById('adjacencyMatrixButton').addEventListener('click', function() {
  createAdjacencyMatrix();
});
function renderAdjacencyMatrix(matrix) {
  const container=clearmatrix();

  // Create a table element for the matrix
  const table = document.createElement('table');

  // Apply CSS classes to the table for styling
  table.classList.add('adjacency-matrix');
  table.classList.add('matrix-bordered');

  // Create the table rows and cells
  for (let i = 0; i < matrix.length; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < matrix[i].length; j++) {
      const cell = document.createElement('td');
      cell.textContent = matrix[i][j].toString();

      // Apply CSS classes to the cells for styling
      cell.classList.add('matrix-cell');
      if (i === j) {
        cell.classList.add('matrix-diagonal');
      }

      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  // Append the table to the container
  container.appendChild(table);
}
function clearmatrix(){
  const container = document.getElementById('adjacencyMatrixContainer');

  // Clear the container
  container.innerHTML = '';
  return container;
}