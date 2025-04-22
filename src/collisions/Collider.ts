import { SAT } from './SAT';
import { CollisionResult } from './CollisionResult';

/**
 * The base class for bodies used to detect collisions
 * @class
 * @protected
 */
export class Collider {
    /**
     * The X coordinate of the body
     */
    x: number;

    /**
     * The Y coordinate of the body
     */
    y: number;

    /**
     * The width of the body
     */
    width: number;

    /**
     * The width of the body
     */
    height: number

    /**
     * The amount to pad the bounding volume when testing for potential collisions
     */
    padding: number;

    /**
     * The offset of the body along X axis
     */
    protected _offset_x = 0;

    /**
     * The offset of the body along Y axis
     */
    protected _offset_y = 0;

    protected _circle = false;
    protected _polygon = false;
    protected _point = false;
    protected _bvh = null;
    protected _bvh_parent = null;
    protected _bvh_branch = false;
    protected _bvh_padding: number;
    protected _bvh_min_x = 0;
    protected _bvh_min_y = 0;
    protected _bvh_max_x = 0;
    protected _bvh_max_y = 0;
    protected _parent_sprite = null;
    protected _center_distance = 0
    protected _center_angle = 0;

    /**
     * @constructor
     * @param {Number} [x = 0] The starting X coordinate
     * @param {Number} [y = 0] The starting Y coordinate
     * @param {Number} [padding = 5] The amount to pad the bounding volume when testing for potential collisions
     */
    constructor(x = 0, y = 0, padding = 5) {
        this.x = x;
        this.y = y;
        this.padding = padding;
        this._bvh_padding = padding;
    }

    /**
     * Determines if the body is colliding with another body
     * @param {CircleCollider|PolygonCollider|PointCollider} target The target body to test against
     * @param {CollisionResult} [result = null] A Result object on which to store information about the collision
     * @param {Boolean} [aabb = true] Set to false to skip the AABB test (useful if you use your own potential collision heuristic)
     * @returns {Boolean}
     */
    collides(target, result = null, aabb = true) {
        return SAT(this, target, result, aabb);
    }

    /**
     * Returns a list of potential collisions
     * @returns {Array<Collider>}
     */
    potentials() {
        const bvh = this._bvh;

        if (bvh === null) {
            throw new Error('Body does not belong to a collision system');
        }

        return bvh.potentials(this);
    }

    /**
     * Removes the body from its current collision system
     */
    remove() {
        const bvh = this._bvh;

        if (bvh) {
            bvh.remove(this, false);
        }
    }

    set parentSprite(value) {
        this._parent_sprite = value;
    }

    get parentSprite() {
        return this._parent_sprite;
    }

    set offset_x(value) {
        this._offset_x = -value;
        this.updateCenterParams()
    }

    get offset_x() {
        return -this._offset_x;
    }

    set offset_y(value) {
        this._offset_y = -value;
        this.updateCenterParams()
    }

    get offset_y() {
        return -this._offset_y;
    }

    get center_offset_x() {
        if (this._parent_sprite.rotateStyle === 'leftRight' || this._parent_sprite.rotateStyle === 'none') {
            const leftRightMultiplier = this._parent_sprite._direction > 180 && this._parent_sprite.rotateStyle === 'leftRight' ? -1 : 1;
            return this._offset_x * leftRightMultiplier;
        }

        return this._center_distance * Math.cos(this._center_angle - this._parent_sprite.globalAngleRadians);
    }

    get center_offset_y() {
        if (this._parent_sprite.rotateStyle === 'leftRight' || this._parent_sprite.rotateStyle === 'none') {
            return -this._offset_y;
        }

        return -this._center_distance * Math.sin(this._center_angle - this._parent_sprite.globalAngleRadians);
    }

    /**
     * Creates a {@link CollisionResult} used to collect the detailed results of a collision test
     */
    createResult() {
        return new CollisionResult();
    }

    updateCenterParams(): void {
        this._center_distance = Math.hypot(this._offset_x, this._offset_y);
        this._center_angle = -Math.atan2(-this._offset_y, -this._offset_x);
    }

    /**
     * Creates a Result used to collect the detailed results of a collision test
     */
    static createResult() {
        return new CollisionResult();
    }

}
