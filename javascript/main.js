function create_text_node(header_type, text) {
    let h = document.createElement(header_type);
    let text_node = document.createTextNode(text);
    h.style.margin="0";
    h.appendChild(text_node);
    return h;
}

function todo_onmousehover(header_type, display_text) {
    let navbar_content = document.getElementById('navbar-content');
    navbar_content.style.display="block";
    navbar_content.appendChild(create_text_node(header_type, display_text));
}

function todo_onmouseout() {
    let navbar_content = document.getElementById('navbar-content');
    navbar_content.style.display="none";
    while(navbar_content.firstChild) {
        navbar_content.removeChild(navbar_content.lastChild);
    }
}

document.getElementById('lorem').onmouseover = function() {
    todo_onmousehover('h1', 'LOREM');
}
document.getElementById('ipsum').onmouseover = function() {
    todo_onmousehover('h1', 'IPSUM');
}
document.getElementById('dolor').onmouseover = function() {
    todo_onmousehover('h1', 'DOLOR');
}
document.getElementById('sit').onmouseover = function() {
    todo_onmousehover('h1', 'SIT');
}

document.getElementById('lorem').onmouseout = function() {
    todo_onmouseout();
}
document.getElementById('ipsum').onmouseout = function() {
    todo_onmouseout();
}
document.getElementById('dolor').onmouseout = function() {
    todo_onmouseout();
}
document.getElementById('sit').onmouseout = function() {
    todo_onmouseout();
}