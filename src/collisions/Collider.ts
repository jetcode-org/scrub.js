/**
 * The base class for bodies used to detect collisions
 * @class
 * @protected
 */
class Collider {
    /**
     * The X coordinate of the body
     */
    x: number;

    /**
     * The Y coordinate of the body
     */
    y: number;

    /**
     * The amount to pad the bounding volume when testing for potential collisions
     */
    padding: number;

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

	/**
	 * @constructor
	 * @param {Number} [x = 0] The starting X coordinate
	 * @param {Number} [y = 0] The starting Y coordinate
	 * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
	 */
	constructor(x = 0, y = 0, padding = 0) {
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

		if(bvh === null) {
			throw new Error('Body does not belong to a collision system');
		}

		return bvh.potentials(this);
	}

	/**
	 * Removes the body from its current collision system
	 */
	remove() {
		const bvh = this._bvh;

		if(bvh) {
			bvh.remove(this, false);
		}
	}

	/**
	 * Creates a {@link CollisionResult} used to collect the detailed results of a collision test
	 */
	createResult() {
		return new CollisionResult();
	}

	/**
	 * Creates a Result used to collect the detailed results of a collision test
	 */
	static createResult() {
		return new CollisionResult();
	}
}
