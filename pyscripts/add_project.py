import os
import os.path
import sys

canvas_html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        canvas {{
            border: 1px solid black;
        }}
        body {{
            margin: 0;
            overflow: hidden;
        }}
    </style>
    <link rel="icon" href="../../../assets/favicon.ico">
</head>
<body>
    <canvas></canvas>
    <script src="../../../js/canvas_setup.js"></script>
    <script src="main.js"></script>
</body>
</html>
"""

intro_html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{title}</title>
    <meta name="description" content="{title}">
    <meta name="author" content="Nikhil Sasi Rajan">

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="../../css/normalise.css">
    <link rel="stylesheet" href="../../css/style.css">

    <link rel="icon" href="../../assets/favicon.ico">


    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div class="container">
        <div class="row" style="margin-top:10rem;"></div>
        <div class="row">
            <div class="six columns">
                <div class="row">
                    <h2>{title}</h2>
                </div>
                
                <p class="demo"><a href="demo" target="_blank">[Jump to demo!]</a></p>

             </div>

        <div class="six columns">
        </div>

        </div>

        <div class="row" style="margin-top:2rem;"></div>
        <p class="go"><a href="demo/canvas.js" target="_blank">[Source]</a></p>
        <p class="go"><a href="../../index.html#{folder_name}">[Go back]</a></p>
    </div>
</body>
</html>
"""

canvas_js_template = """var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = 'black';
var c = canvas.getContext('2d');

window.addEventListener('resize',
    function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
);
"""


def add_to_list(folder_name, title):
    projects_line_content = '<h2 id="projects">projects</h2>'
    end_of_ul = '</ul>'
    project_list_template = '          <li id="{folder_name}"><a href="projects/{folder_name}/">{title} - [WIP]</a></li>'

    in_projects_list = False
    done = False

    with open('index.html', 'r') as fin:
        with open('__temp__', 'w') as fout:
            for line in fin.readlines():
                if not done:
                    if projects_line_content in line:
                        in_projects_list = True
                    if end_of_ul in line and in_projects_list:
                        fout.write(project_list_template.format(folder_name=folder_name, title=title))
                        fout.write('\n')
                        done = True
                fout.write(line)
    os.remove('index.html')
    os.rename('__temp__', 'index.html')


def add_project(project_name):
    """ do things to add a new project """
    folder_name = project_name.replace(' ', '-')
    title = project_name

    project_folderpath = f'./projects/{folder_name}'
    demo_folderpath = f'./projects/{folder_name}/demo'

    # mkdirs
    try:
        os.mkdir(project_folderpath)
    except:
        pass

    try:
        os.mkdir(demo_folderpath)
    except:
        pass

    # create intro html file
    with open(project_folderpath + '/index.html', 'w') as fout:
        fout.write(intro_html_template.format(folder_name=folder_name, title=title))

    # create canvas html file
    with open(demo_folderpath + '/index.html', 'w') as fout:
        fout.write(canvas_html_template.format(title=title))

    # create canvas js file
    with open(demo_folderpath + '/main.js', 'w') as fout:
        fout.write(canvas_js_template)

    # add project to main html
    add_to_list(folder_name=folder_name, title=title)


if __name__ == '__main__':
    if len(sys.argv) == 1:
        print('Too few arguments\n')
        print('Usage:')
        print('  ' + sys.argv[0] + ' <project-names> ...\n')
        exit(1)

    for project_name in sys.argv[1:]:
        add_project(project_name)
