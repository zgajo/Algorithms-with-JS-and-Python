import folium

m = folium.Map(location=[45.111078, 13.709116], zoom_start=18)

folium.PolyLine(locations=[[45.1111499, 13.7105957], [
                45.1112519, 13.7105608], [45.1114067, 13.7105174]]).add_to(m)
folium.Marker(
    [45.111078, 13.709116], popup="<i>Darkina kuća</i>"
).add_to(m)

m._repr_html_()
