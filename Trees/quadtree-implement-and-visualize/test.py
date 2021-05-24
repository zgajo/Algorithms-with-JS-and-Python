import numpy as np
import matplotlib.pyplot as plt
from matplotlib.pyplot import subplot
from matplotlib import gridspec
from quadtree import Point, Rectangle, QuadTree

DPI = 72

width, height = 600, 400

N = 1000

xs = np.random.rand(N) * width
ys = np.random.rand(N) * height

points = [Point(xs[i], ys[i]) for i in range(N)]

domain = Rectangle(Point(width/2, height/2), width/2, height/2)

qtree = QuadTree(domain)
i = 1
for point in points:
    print(i)
    i += 1
    qtree.insert(point)

print("Total points: ", len(qtree), len(points))

# draw rectangles
fig = plt.figure(figsize=(1600 / DPI, 1100/DPI), dpi=DPI)
ax = plt.subplot()
ax.set_xlim(0, width)
ax.set_ylim(0, height)

qtree.draw(ax)

# draw the points
ax.scatter([p.x for p in points], [p.y for p in points], s=4)
ax.set_xticks([])
ax.set_yticks([])

# test the rectangle range
# generate the range
center_x = np.random.rand() * width
center_y = np.random.rand() * height

range_width = np.random.rand()*min(center_x, width-center_x)
range_height = np.random.rand()*min(center_y, height-center_y)

found_points = []
range = Rectangle(Point(center_x, center_y), range_width, range_height)
found_points = qtree.queryRange(range)

print("points in range", len(found_points))

ax.scatter([p.x for p in found_points], [p.y for p in found_points],
           facecolors="none", edgecolors="r", s=32)
range.draw(ax, c="r", lw=2)

# test the radius
# generate the radius range
# center_x = np.random.rand() * width
# center_y = np.random.rand() * height
center_x = 300
center_y = 200

range_width = np.random.rand()*min(center_x, width-center_x)
range_height = np.random.rand()*min(center_y, height-center_y)

found_points = []
# range = Rectangle(Point(center_x, center_y), range_width, range_height)
# found_points = qtree.queryRange(range)
radius = min(range_width, range_height)
radius = 150
range = Rectangle(Point(center_y, center_y), radius, radius)
found_points = qtree.queryRadius(range, Point(center_y, center_y))

print("points in radius", len(found_points))

ax.scatter([p.x for p in found_points], [p.y for p in found_points],
           facecolors="none", edgecolors="g", s=32)
range.drawCircle(radius, ax, c="g", lw=2)


xsrch = np.random.rand(1) * width
ysrch = np.random.rand(1) * height
ax.scatter([xsrch], [ysrch], edgecolors="red", facecolors="red", s=75)

sorted_by_distance = qtree.kNearest(
    Point(xsrch, ysrch), maxCount=10
)
print("Sorted:", sorted_by_distance)
print("furthestDistance:", sorted_by_distance["furthestDistance"])

range = Rectangle(Point(xsrch, ysrch),
                  sorted_by_distance["furthestDistance"],
                  sorted_by_distance["furthestDistance"]
                  )


range.drawCircle(sorted_by_distance["furthestDistance"], ax, c="g", lw=2)

val: Point
for i, val in enumerate(sorted_by_distance["found_points"]):
    print("point", val)
    c = "green" if i == 0 else "orange"
    lw = 5 if i == 0 else 2
    print("sorted_by_distance[", i, "]",
          val.distanceFrom(Point(xsrch, ysrch)))

    ax.scatter([val.x], [val.y], edgecolors="blue",
               facecolors="yellow", s=75)

ax.invert_yaxis()
plt.tight_layout()
plt.savefig("search-quadtree.png", DPI=72)
plt.show()
