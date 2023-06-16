<!DOCTYPE html>
<html>
<head>
  <title>Graph Application</title>
 <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
  <h1>Graph Application</h1>
  <canvas id="graphCanvas" width="800" height="400"></canvas><br>
  <div id="adjacencyMatrixContainer"></div>
  <div id="algorithms">
    <h2>Algorithms</h2>
    <button id="kruskalButton">Run Kruskal's Algorithm</button>
    <button id="dijkstraButton">Run Dijkstra's Algorithm</button>
    <button id="primButton">Run prim Algorithm</button>
    <button id="adjacencyMatrixButton">Run adjacency Matrix</button>
  </div>
  <button id="clear">Clear  graph</button>
  <label class="graph-label">directed graph</label>
  <label class="switch">
    <input type="checkbox" id="directedSwitch">
    <span class="slider round"></span>
  </label><br>
  <div class="main">
        <div class="navbar">
            <div class="icon">
                <h2 class="logo">GRAPH</h2>
            </div>
            <form action="{{ route('logout') }}" method="POST">
    @csrf
    <button class="logout" type="submit">Logout</button>
</form>

            

        </div> 
        <div class="content">
        </div>
    </div>
  <script src="{{ asset('js/main.js') }}">
  </script>
</body>
</html>

