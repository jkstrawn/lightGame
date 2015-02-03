(function() {

	var Player = my.Class({

		constructor: function() {

			this.id = -1;
			this.health = 10;
			this.position = new THREE.Vector3(0, 0, 100);
			this.velocity = {x: 0, y: 0, z: 0};


			//this.move();
		},

		init: function() {

			//newPlayerModel.play("walk", 1, 2);
			this.model = sim.graphics.getModel(sim.modelUrls.live[0]);
			this.model.position.set(this.position.x, this.position.y, this.position.z);
			sim.graphics.scene.add(this.model);
		},

		setId: function(id) {
			this.id = id;
		},

		keyActive: function(key) {

			switch (key) {
				case 188:
				case 87:
				    //console.log("forward");
					this.moveForward = true;
					break;
				case 65:
					//console.log("left");
					this.moveLeft = true;
					break;
				case 69:
				case 68:
					//console.log("right");
					this.moveRight = true;
					break;
				case 79:
				case 83:
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

		mouseMove: function(event) {
			this.model.rotation.y = sim.controls.getRotation() - Math.PI;
		},

		update: function (dt) {

			var delta = dt / 1000;

			if (this.velocity.x < .5 && this.velocity.x > -.5) this.velocity.x = 0;
			if (this.velocity.y < .5 && this.velocity.y > -.5) this.velocity.y = 0;
			if (this.velocity.z < .5 && this.velocity.z > -.5) this.velocity.z = 0;

			this.velocity.x -= this.velocity.x * 10.0 * delta;
			this.velocity.z -= this.velocity.z * 10.0 * delta;

			//this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

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

			this.model.position.set(newPosition.x, newPosition.y - 10, newPosition.z);

			if (this.velocity.x || this.velocity.y || this.velocity.z) {
			    newPosition.x = Math.round(newPosition.x * 100) / 100;
			    newPosition.y = Math.round(newPosition.y * 100) / 100;
			    newPosition.z = Math.round(newPosition.z * 100) / 100;
			    newPosition.id = 1;
			    newPosition.rotation = sim.controls.getRotation() - Math.PI;
			    socket.emit('move', newPosition);
				
				this.model.playContinued("walk", 1, 2);
            } else {
				this.model.playContinued("idle", 1, 2);
            }




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