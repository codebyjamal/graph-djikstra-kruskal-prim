<!DOCTYPE html>
<html lang="en">
<head>
    <title>graph</title>
    <link rel="stylesheet" href="{{ asset('css/home.css') }}">
</head>
<body>

    <div class="main">
        <div class="navbar">
            <div class="icon">
                <h2 class="logo">GRAPH</h2>
            </div>
            <div class="menu">
                  <ul>
                    <li><a href="file:///C:/Users/soft/Desktop/projet/about.html">ABOUT</a></li>
                    <li><a href="#">SERVICE</a></li>
                    <li><a href="#">CONTACT US</a></li>
                   </ul>
            </div>

            

        </div> 
        <div class="content">
            <h1>App help you to <br><span>Design</span> your gaph</h1>
            <p class="par">Graph is a cutting-edge web app that puts graph creation, visualization, and algorithmic analysis <br>in your hands Create stunning graphs, visualize their intricate connections<br>and apply powerful algorithms like Dijkstra or Kruskal effortlessly.</p>

                

                <div class="form">
                <form method="POST" action="{{ route('signup.submit') }}">
                    @csrf
                    <h2>Sign up Here</h2>
                    <input type="text" name="name" placeholder="Enter your name" required>
                    <input type="email" name="email" placeholder="Enter Email Here" required>
                    <input type="password" name="password" placeholder="Enter Password Here" required>
                    <button class="btnn" type="submit">Sign up</button>
                    @if ($errors->has('login_failed'))
                        <p class="error">{{ $errors->first('signup_failed') }}</p>
                    @endif
                    <p class="link">Already have an account?<br>
                        <a href="{{ route('login') }}">Login</a> here</p>
                </form>

                   
                </div>
                    </div>
                </div>
        </div>
    </div>
    <script src="https://unpkg.com/ionicons@5.4.0/dist/ionicons.js"></script>
</body>
</html>