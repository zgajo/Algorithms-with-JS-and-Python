import numpy as np


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y


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

    def draw(self, ax, c='k', lw=1, **kwargs):
        x1, y1 = self.west, self.north
        x2, y2 = self.east, self.south
        ax.plot([x1, x2, x2, x1, x1], [y1, y1, y2, y2, y1],
                c=c, lw=lw, **kwargs)


class QuadTree:

    def __init__(self, boundary: Rectangle, capacity=4):
        self.boundary = boundary
        self.capacity = capacity
        self.points = []
        self.divided = False

    def insert(self, point: Point):
        print("inserting")
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

        print("Inserting into child:", point)
        if self.nw.insert(point):
            return True
        if self.ne.insert(point):
            return True
        if self.sw.insert(point):
            return True
        if self.se.insert(point):
            return True

        return False

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
