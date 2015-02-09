var Signal = require('signals').Signal;
function RenderRegion(fullWidth, fullHeight, x, y, w, h) {
	var _state = true;
	var _isFullscreen = true;
	var _fullWidth = fullWidth || 320;
	var _fullHeight = fullHeight || 240;
	var _x = x || 0;
	var _y = y || 0;
	var _w = w || fullWidth - _x;
	var _h = h || fullHeight - _y;
	var _right = _x + _w;
	var _bottom = _y + _h;

	var _halfWidth = _fullWidth * .5;
	var _halfHeight = _fullHeight * .5;
	var _wHalf = _w * .5;
	var _hHalf = _h * .5;

	var onChangeSignal = new Signal();

	var _this = this;
	function update() {
		_isFullscreen = _x === 0 && _y === 0 && _w == _fullWidth && _h == _fullHeight;
		_this.apply = (_state && !_isFullscreen) ? applyCrop : applyFull;
		onChangeSignal.dispatch(_x, _y, _w, _h);
	}

	function applyCrop(renderer) {
		// renderer.setScissor(_x, _fullHeight-_y-_h, _w, _h);
		renderer.setViewport(_x, _fullHeight-_y-_h, _w, _h, true);
		// renderer.enableScissorTest(true);
	}

	function applyFull(renderer) {
		// renderer.setScissor(0, 0, _fullWidth, _fullHeight);
		renderer.setViewport(0, 0, _fullWidth, _fullHeight, true);
		// renderer.enableScissorTest(false);
	}

	function setRegion(x, y, w, h){
		// console.log('region setRegion');
		_x = ~~x;
		_y = ~~y;
		_w = ~~w;
		_h = ~~h;
		_wHalf = _w * .5;
		_hHalf = _h * .5;
		update();
	}

	function setState(state) {
		_state = state;
		update();
	}

	function setFullSize(w, h) {
		_fullWidth = ~~w;
		_fullHeight = ~~h;
		_halfWidth = _fullWidth * .5;
		_halfHeight = _fullHeight * .5;
		update();
	}

	function setFullSizeAndRegion(fullWidth, fullHeight, x, y, w, h) {
		_x = ~~x;
		_y = ~~y;
		_w = ~~w;
		_h = ~~h;
		_right = _x + _w;
		_bottom = _y + _h;
		_wHalf = _w * .5;
		_hHalf = _h * .5;
		_fullWidth = ~~fullWidth;
		_fullHeight = ~~fullHeight;
		_halfWidth = _fullWidth * .5;
		_halfHeight = _fullHeight * .5;
		update();
	}

	var point = {
		x: 0,
		y: 0
	};

	function getScreenSpacePositionOfPixel(x, y) {
		if(_state && !_isFullscreen) {
			point.x = (x - _x) / _wHalf - 1;
			point.y = (y - _y) / _hHalf - 1;
		} else {
			point.x = x / _halfWidth - 1;
			point.y = y / _halfHeight - 1;
		}
		return point;
	}

	function contains(x, y) {
		return (x >= _x && x <= _right && y >= _y && y <= _bottom);
	}

	update();
	this.onChangeSignal = onChangeSignal;
	this.setRegion = setRegion;
	this.setState = setState;
	this.setFullSize = setFullSize;
	this.setFullSizeAndRegion = setFullSizeAndRegion;
	this.bump = update;
	this.contains = contains;
	this.getScreenSpacePositionOfPixel = getScreenSpacePositionOfPixel;

}

module.exports = RenderRegion