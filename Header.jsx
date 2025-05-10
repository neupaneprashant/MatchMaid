function Header() {
  return (
    <header>
      <h1>MatchMaid</h1>
      <body id = "desktop-template">
        <div id = "container">
            <label for = "username"><b>UserName</b></label>
            <input type = "text" placeholder = "Enter Username" name = "username" required></input>
            <label for = "password"><b>Password</b></label>
            <input type = "password" placeholder = "Enter Password" name = "password" required></input>
            <button type = "submit">Login</button>
            <input type = "checkbox" checked = "checked"></input> Remember me
            <button type = "button" class = "cancelbtn">Cancel</button>
            <span class = "psw">Forgot <a href = "#">password?</a></span> 
        </div>
      </body> 
    </header>
  );
}export default Header;