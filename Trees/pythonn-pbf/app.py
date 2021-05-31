""" flask_example.py

    Required packages:
    - flask
    - folium

    Usage:

    Start the flask server by running:

        $ python flask_example.py

    And then head to http://127.0.0.1:5000/ in your browser to see the map displayed

"""

from flask import Flask

import folium

app = Flask(__name__)


@app.route('/')
def index():
    folium_map = folium.Map(location=[45.111078, 13.709116], zoom_start=18)

    folium.PolyLine(locations=[[45.1111499, 13.7105957], [
        45.1112519, 13.7105608], [45.1114067, 13.7105174]]).add_to(folium_map)
    folium.Marker(
        [45.111078, 13.709116], popup="<i>Darkina kuća</i>"
    ).add_to(folium_map)

    return folium_map._repr_html_()


if __name__ == '__main__':
    app.run(debug=True)
