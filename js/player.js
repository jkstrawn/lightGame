(function() {

	var Player = my.Class({

		constructor: function() {

			this.health = 10;
			this.position = new THREE.Vector3(0, 0, 100);
			this.velocity = {x: 0, y: 0, z: 0};


			//this.move();
		},

		init: function() {

			this.model = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshLambertMaterial({color: 0xcccccc}));
			this.model.position.set(this.position.x, this.position.y, this.position.z);
			sim.graphics.scene.add(this.model);
		},

		keyActive: function(key) {

			switch (key) {
				case 188:
					//console.log("forward");
					this.moveForward = true;
					break;
				case 65:
					//console.log("left");
					this.moveLeft = true;
					break;
				case 69:
					//console.log("right");
					this.moveRight = true;
					break;
				case 79:
					//console.log("back");
					this.moveBackward = true;
					break;
			}
		},

		move: function(direction) {

			if (sim) {
				console.log("moving camera");
				sim.graphics.zoom(1);
			}
		},

		update: function(dt) {

			var delta = dt / 1000;

			this.velocity.x -= this.velocity.x * 10.0 * delta;
			this.velocity.z -= this.velocity.z * 10.0 * delta;

			this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

			if ( this.moveForward ) this.velocity.z -= 400.0 * delta;
			if ( this.moveBackward ) this.velocity.z += 400.0 * delta;

			if ( this.moveLeft ) this.velocity.x -= 400.0 * delta;
			if ( this.moveRight ) this.velocity.x += 400.0 * delta;

			if ( this.isOnObject === true ) {

				this.velocity.y = Math.max( 0, this.velocity.y );

			}

			var toMove = new THREE.Vector3(this.velocity.x * delta, this.velocity.y * delta, this.velocity.z * delta);

			var planes = [];
			planes.push(sim.graphics.plane);
			var newPosition = sim.controls.move(toMove);
			this.model.position.set(newPosition.x, newPosition.y, newPosition.z);




			var directionVector = new THREE.Vector3(0, -200, 0);
			var originPoint = newPosition;





			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( planes );
			if ( collisionResults.length > 0 ) {
				sim.controls.getObject().position.y = collisionResults[0].point.y + 10;
				//console.log(collisionResults[0].point);
				//debugger;
			}

		// 	yawObject.translateX( this.velocity.x * delta );
		// 	yawObject.translateY( this.velocity.y * delta ); 
		// 	yawObject.translateZ( this.velocity.z * delta );

			if ( this.position.y < 10 ) {

				this.velocity.y = 0;
				this.position.y = 10;

				canJump = true;

			}
			this.moveForward = this.moveRight = this.moveLeft = this.moveBackward = false;

			// sim.controls.move(this.position);

		},


	});

	SIM.Player = Player;
})()