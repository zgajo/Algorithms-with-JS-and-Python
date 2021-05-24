import numpy as np
import math as m
from matplotlib.patches import Circle


def distanceFrom(e: "QuadTree", point: "Point"):
    dx = e.boundary.xDistanceFrom(point)
    dy = e.boundary.yDistanceFrom(point)

    return m.sqrt(dx**2+dy**2)


def pointDistanceFrom(main_point: "Point", other_point: "Point"):
    dx = other_point.x - main_point.x
    dy = other_point.y - main_point.y

    return m.sqrt(dx**2+dy**2)


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

        # calculate euclidean distance of two points with coordinates: a(ax, ay) and b(bx, by)
    def distanceToCenter(self, center: "Point"):
        return m.sqrt((center.x-self.x)**2+(center.y-self.y)**2)

    def distanceFrom(self, other_point: "Point"):
        dx = other_point.x - self.x
        dy = other_point.y - self.y

        return m.sqrt(dx*dx+dy*dy)


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

    def xDistanceFrom(self, point: Point):
        # check if x is in current rectangle
        if self.west <= point.x and point.x <= self.east:
            return 0

        # return minimum distance from left or right
        return min(abs(point.x-self.west), abs(point.x-self.east))

    def yDistanceFrom(self, point: Point):
        # check if x is in current rectangle
        if self.south <= point.y and point.y <= self.north:
            return 0

        # return minimum distance from left or right
        return min(abs(point.y-self.north), abs(point.y-self.south))

    def distanceFrom(self, point: Point):
        dx = self.xDistanceFrom(point)
        dy = self.yDistanceFrom(point)

        return m.sqrt(dx*dx+dy*dy)

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
        self.boundary: Rectangle = boundary
        self.capacity = capacity
        self.points: Point = []
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
        point: Point
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

    def children(self):
        if self.divided:
            return [
                self.ne,
                self.nw,
                self.se,
                self.sw
            ]

        return []

    def kNearest(self, searchPoint: Point, maxCount, maxDistance, furthestDistance, foundSoFar):
        found = []

    def sortChildrenByDistance(self, searchPoint: Point, maxCount=1, maxDistance=m.inf, furthestDistance=0, foundSoFar=0):
        found_points = []

        tree_children = self.children()

        sorted_children = sorted(
            tree_children,
            key=lambda e: distanceFrom(e, searchPoint)
        )

        child: "QuadTree"
        for child in sorted_children:
            distance = child.boundary.distanceFrom(searchPoint)

            if distance > maxDistance:
                return

            if foundSoFar < maxCount or distance < furthestDistance:
                result = child.sortChildrenByDistance(
                    searchPoint, maxCount,  maxDistance, furthestDistance, foundSoFar
                )
                child_points = result["found_points"]
                found_points = found_points + child_points
                foundSoFar += len(child_points)
                furthestDistance = result["furthestDistance"]

        sorted_points = sorted(
            self.points,
            key=lambda e: pointDistanceFrom(e, searchPoint)
        )

        child_point: "Point"
        for child_point in sorted_points:
            distance = child_point.distanceFrom(searchPoint)

            if distance > maxDistance:
                return

            if foundSoFar < maxCount or distance < furthestDistance:
                found_points.append(child_point)
                furthestDistance = max(distance, furthestDistance)
                foundSoFar += 1

        obj = {
            "found_points": sorted(
                found_points,  key=lambda e: pointDistanceFrom(
                    e, searchPoint
                )
            )[0:maxCount],
            "furthestDistance": furthestDistance
        }

        return obj

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
