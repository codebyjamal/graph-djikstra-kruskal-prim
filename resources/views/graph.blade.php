<!DOCTYPE html>
<html>
<head>
  <title>Graph Application</title>
 <link rel="stylesheet" href="{{ asset('css/style.css') }}">
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
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
  <button id="clear"> <i class="fa fa-trash-o" style="font-size:25px;color:red"></i></button>
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

