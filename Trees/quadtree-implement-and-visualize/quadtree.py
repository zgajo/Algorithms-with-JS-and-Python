import numpy as np
import math as m
from matplotlib.patches import Circle


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distanceToCenter(self, center: "Point"):
        return m.sqrt((center.x-self.x)**2+(center.y-self.y)**2)


class Rectangle:
    def __init__(self, center: Point, width, height):
        self.center = center
        self.width = width
        self.height = height
        self.west = center.x - width
        self.east = center.x + width
        self.north = center.y - height
        self.south = center.y + height

    def containsPoint(self, point: Point):
        return (self.west <= point.x < self.east and
                self.north <= point.y < self.south)

    def intersects(self, range):
        return not (range.west > self.east
                    or range.east < self.west
                    or range.north > self.south
                    or range.south < self.north)

    def draw(self, ax, c='k', lw=1, **kwargs):
        x1, y1 = self.west, self.north
        x2, y2 = self.east, self.south
        ax.plot([x1, x2, x2, x1, x1], [y1, y1, y2, y2, y1],
                c=c, lw=lw, **kwargs)

    def drawCircle(self, radius, ax, c='k', lw=1, **kwargs):
        x1, y1 = self.west, self.north
        x2, y2 = self.east, self.south
        # ax.plot(300, 200,
        #         c=c, lw=lw, **kwargs)
        circle = Circle((self.center.y, self.center.y), radius, edgecolor=c,
                        fill=False, linewidth=lw)

        ax.add_patch(circle)

        # ax.plot([200], [200], c=c, lw=lw, **kwargs)
        # ax.pie([200, 200], colors=['limegreen', 'crimson'],
        #        labels=['Correct', 'Wrong'], autopct='%1.1f%%')


class QuadTree:

    def __init__(self, boundary: Rectangle, capacity=4):
        self.boundary = boundary
        self.capacity = capacity
        self.points = []
        self.divided = False
        self.nw: QuadTree
        self.ne: QuadTree
        self.sw: QuadTree
        self.ne: QuadTree

    def insert(self, point: Point):
        print("inserting", point.x, point.y)
        # if the point is in the range of current quadtree
        if not self.boundary.containsPoint(point):
            return False

        # if has not reached capacity
        if len(self.points) < self.capacity:
            self.points.append(point)
            return True

        if not self.divided:
            print("Dividing")
            self.divide()

        if self.nw.insert(point):
            print("Inserting point:", point.x, point.y, "into child nw")
            return True
        if self.ne.insert(point):
            print("Inserting point:", point.x, point.y, "into child ne")
            return True
        if self.sw.insert(point):
            print("Inserting point:", point.x, point.y, "into child sw")
            return True
        if self.se.insert(point):
            print("Inserting point:", point.x, point.y, "into child se")
            return True

        return False

    def queryRange(self, range: Rectangle):
        found_points = []
        if not self.boundary.intersects(range):
            return []
        for point in self.points:
            if range.containsPoint(point):
                found_points.append(point)

        if self.divided:
            found_points.extend(self.nw.queryRange(range))
            found_points.extend(self.ne.queryRange(range))
            found_points.extend(self.sw.queryRange(range))
            found_points.extend(self.se.queryRange(range))

        return found_points

    def queryRadius(self, range: Rectangle, center):
        found_points = []
        if not self.boundary.intersects(range):
            return []
        for point in self.points:
            # width is our radius
            if range.containsPoint(point) and point.distanceToCenter(center) < range.width:
                found_points.append(point)

        if self.divided:
            found_points.extend(self.nw.queryRadius(range, center))
            found_points.extend(self.ne.queryRadius(range, center))
            found_points.extend(self.sw.queryRadius(range, center))
            found_points.extend(self.se.queryRadius(range, center))

        return found_points

    def divide(self):
        center_x = self.boundary.center.x
        center_y = self.boundary.center.y
        new_width = self.boundary.width / 2
        new_height = self.boundary.height / 2

        nw = Rectangle(Point(center_x - new_width, center_y -
                             new_height), new_width, new_height)
        self.nw = QuadTree(nw)
        print("diveded self.nw", self.nw.points)

        ne = Rectangle(Point(center_x + new_width, center_y -
                             new_height), new_width, new_height)
        self.ne = QuadTree(ne)
        print("diveded self.ne", self.ne.points)

        sw = Rectangle(Point(center_x - new_width, center_y +
                             new_height), new_width, new_height)
        self.sw = QuadTree(sw)
        print("diveded self.sw", self.sw.points)

        se = Rectangle(Point(center_x + new_width, center_y +
                             new_height), new_width, new_height)
        self.se = QuadTree(se)
        print("diveded self.se", self.se.points)

        self.divided = True

    def __len__(self):
        count = len(self.points)
        print("count", count)
        if self.divided:
            count += len(self.nw)+len(self.ne)+len(self.sw)+len(self.se)
        return count

    def draw(self, ax):
        self.boundary.draw(ax)

        if self.divided:
            self.nw.draw(ax)
            self.ne.draw(ax)
            self.sw.draw(ax)
            self.se.draw(ax)
