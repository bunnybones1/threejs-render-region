var onReady = function() {
	var View = require('threejs-managed-view').View;
	var RenderRegion = require('./');
	var view = new View({
		useRafPolyfill: false
	});
	var scene = view.scene;

	var sphereGeometry = new THREE.SphereGeometry(1.5);
	var size = 500;
	var sizeHalf = size * .5;
	var bounds = new THREE.Box3(
		new THREE.Vector3(-sizeHalf, -sizeHalf, -sizeHalf),
		new THREE.Vector3(sizeHalf, sizeHalf, sizeHalf)
	)
	var random = new THREE.Vector3();
	var boundSize = bounds.size();
	for (var i = 0; i < 1200; i++) {
		var ball = new THREE.Mesh(sphereGeometry);
		scene.add(ball);
		random.set(
			Math.random(),
			Math.random(),
			Math.random()
		);
		ball.position.copy(bounds.min).add(random.multiply(boundSize));
	};

	var camera2 = view.camera.clone();
	scene.add(camera2);

	var renderRegion = new RenderRegion(view.domSize.x, view.domSize.y, 0, 0, view.domSize.x * .5, view.domSize.y);
	var renderRegion2 = new RenderRegion(view.domSize.x, view.domSize.y, view.domSize.x * .5, 0, view.domSize.x * .5, view.domSize.y);
	view.onResizeSignal.add(function(w, h) {
		renderRegion.setFullSizeAndRegion(w, h, 0, 0, w * .5, h);
		renderRegion2.setFullSizeAndRegion(w, h, w * .5, 0, w * .5, h);
	})
	view.renderManager.onEnterFrame.add(function() {
		renderRegion.apply(view.renderer);
	})
	view.renderManager.onExitFrame.add(function() {
		renderRegion2.apply(view.renderer);
		view.renderer.render(view.scene, camera2);
	})
	renderRegion.onChangeSignal.add(function(x, y, w, h) {
		view.camera.aspect = w/h;
		view.camera.updateProjectionMatrix();
	})
	renderRegion2.onChangeSignal.add(function(x, y, w, h) {
		camera2.aspect = w/h;
		camera2.updateProjectionMatrix();
	})
	renderRegion.bump();
	renderRegion2.bump();

}

var loadAndRunScripts = require('loadandrunscripts');
loadAndRunScripts(
	[
		'bower_components/three.js/three.js'
	],
	onReady
);