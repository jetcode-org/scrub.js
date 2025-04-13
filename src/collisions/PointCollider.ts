/// <reference path="PolygonCollider.ts"/>

/**
 * A point used to detect collisions
 * @class
 */
class PointCollider extends PolygonCollider {
    /**
     * @constructor
     * @param {Number} [x = 0] The starting X coordinate
     * @param {Number} [y = 0] The starting Y coordinate
     * @param {Number} [padding = 5] The amount to pad the bounding volume when testing for potential collisions
     */
    constructor(x = 0, y = 0, padding = 5) {
        super(x, y, [[0, 0]], 0, 1, 1, padding);

        /** @private */
        this._point = true;
    }
}

PointCollider.prototype.setPoints = undefined;
