import osmiter
import json
import datetime

shop_count = 0
ways = {}


def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()


for feature in osmiter.iter_from_osm("andorra-latest.osm.pbf"):
    if feature["type"] == "way":
        print(feature["id"], json.dumps(feature, default=myconverter))
        ways.update({feature.get("id"): feature})

    if feature["type"] == "node" and "shop" in feature["tag"]:
        shop_count += 1

print(f"this osm file containes {shop_count} shop nodes")

print(ways.get("945815975"))
with open('data-ways.json', 'w') as outfile:
    json.dump(ways, outfile, default=myconverter)
