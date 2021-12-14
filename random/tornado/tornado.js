var s = c.width = c.height = 750,
		ctx = c.getContext( '2d' ),
		
		opts = {
			text: '`1234567890-=qwertyuiop[]asdfghjkl;zxcvbnm,./¬!"£$%^&*()_+ASDFGHJKL:@~ZXCVBNM<>?|QWERTYUIOP{}',
			count: 150,
			baseStartDist: 100,
			addedStartDist: 60,
			startY: 100,
			endY: -200,
			gravity: .03,
			baseVel: 6,
			addedVel: 1,
			angleVariation: .2,
			middleAttraction: .003,
			templateColor: 'hsla(hue,80%,50%,.5)',
			
			vanishPoint: {
				x: s / 2,
				y: s / 2
			},
			focalLength: 250,
			depth: 250
			
		},
		
		particles = [],
		tick = 0,
		
		tau = 6.2831853071795864769252867665590057683943387987502116419498891846156328125724179972560696506842341359; // yes, I decided that memorizing tau to 100 decimal places was a good idea. e^(i*tau/2) + cos( tau ) regrets

function Particle(){
	this.canvas = document.createElement( 'canvas' );
	this.canvas.width = 20;
	this.canvas.height = 40;
	this.ctx = this.canvas.getContext( '2d' );
	this.ctx.font = '40px monospace';
	this.reset();
}
Particle.prototype.reset = function(){
	
	var radius = opts.baseStartDist + opts.addedStartDist * Math.random(),
			ang = Math.random() * tau,
			velAng = ang + tau / 4 + opts.angleVariation *  ( Math.random() * 2 - 1 ),
			vel = opts.baseVel + opts.addedVel * Math.random();
	
	this.x = radius * Math.cos( ang );
	this.y = opts.startY;
	this.z = radius * Math.sin( ang );
	
	this.vx = vel * Math.cos( velAng );
	this.vy = 0;
	this.vz = vel * Math.sin( velAng );
	
	var character = opts.text[ opts.text.length * Math.random() | 0 ],
	    color = opts.templateColor.replace( 'hue', tick + ang / tau * 180 );
	
	this.ctx.clearRect( 0, 0, 20, 40 );
	this.ctx.fillStyle = color;
	this.ctx.fillText( character, -2, 40 );
}
Particle.prototype.step = function(){
	
	this.x += this.vx -= this.x * opts.middleAttraction;
	this.y += this.vy -= opts.gravity;
	this.z += this.vz -= this.z * opts.middleAttraction;
	
	var radius = 1 - Math.sqrt( ( this.y - opts.startY ) / ( opts.endY - opts.startY ) );
	
	if( radius < 0 )
		radius *= 2;
	
	if( isNaN( radius ) )
		radius = 0;
	
	var x = this.x * radius,
			y = -this.y,
			z = this.z * radius
	
	if( y > -opts.endY )
		y = -opts.endY + .1 * ( -opts.endY - y );
	
	
	z += opts.depth;
	
	var scale = opts.focalLength / z,
			screenX = opts.vanishPoint.x + x * scale,
			screenY = opts.vanishPoint.y + y * scale,
			
			charSize = scale * 20;
	
	ctx.drawImage( this.canvas, 0, 0, 20, 40, screenX - charSize / 4, screenY - charSize / 2, charSize / 2, charSize );
	
	if( this.y < opts.endY && Math.random() < .1 )
		this.reset();
}

function anim(){
	
	window.requestAnimationFrame( anim );
	
	++tick;
	
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = '#222';
	ctx.fillRect( 0, 0, s, s );
	
	if( particles.length < opts.count && Math.random() < .6 )
		particles.push( new Particle );
	
	ctx.globalCompositeOperation = 'lighter';
	particles.map( function( particle ){ particle.step(); } );
	
}

anim();