"use strict";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let w, h, centerX, centerY;
let stars = [];
const maxStars = 2500; 
const fov = 450; 

// 인터랙션 변수
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

// 스크롤 제어 변수
let currentScroll = 0;
let targetScroll = 0;

function setCanvasSize() {
	w = canvas.width = window.innerWidth;
	h = canvas.height = window.innerHeight;
	centerX = w / 2;
	centerY = h / 2;
	targetMouseX = centerX;
	targetMouseY = centerY;
	mouseX = centerX;
	mouseY = centerY;
}

const starCanvas = document.createElement('canvas');
const starCtx = starCanvas.getContext('2d');
starCanvas.width = 64;
starCanvas.height = 64;
const half = starCanvas.width / 2;
const gradient = starCtx.createRadialGradient(half, half, 0, half, half, half);

gradient.addColorStop(0, '#fff');
gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.9)');
gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)');
gradient.addColorStop(0.7, 'transparent');

starCtx.fillStyle = gradient;
starCtx.beginPath();
starCtx.arc(half, half, half, 0, Math.PI * 2);
starCtx.fill();

function random(min, max) {
	if (arguments.length < 2) { max = min; min = 0; }
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Star {
	constructor() {
		this.reset();
	}

	reset() {
		const radius = random(250, 950); 
		const theta = Math.random() * Math.PI * 2; 
		const phi = Math.acos((Math.random() * 2) - 1); 

		this.x3d = radius * Math.sin(phi) * Math.cos(theta);
		this.y3d = radius * Math.sin(phi) * Math.sin(theta);
		this.z3d = radius * Math.cos(phi);

		this.radius = random(4, 22) / 10;
		this.alpha = random(4, 10) / 10;
		
		this.rotationSpeed = 0.0018;
	}

	update() {
		const cos = Math.cos(this.rotationSpeed);
		const sin = Math.sin(this.rotationSpeed);

		const x = this.x3d * cos - this.z3d * sin;
		const z = this.x3d * sin + this.z3d * cos;

		this.x3d = x;
		this.z3d = z;

		const twinkle = random(200);
		if (twinkle === 1 && this.alpha > 0.3) this.alpha -= 0.03;
		else if (twinkle === 2 && this.alpha < 1) this.alpha += 0.03;
	}

	draw() {
		// 스크롤 비율 계산 (0 ~ 1)
		const scrollFactor = currentScroll / (document.documentElement.scrollHeight - window.innerHeight);

		// 카메라 거리 조절: 스크롤할수록 별들과 더 가까워지게 설정
		const cameraOffset = 850 - (scrollFactor * 300);
		const scale = fov / (fov + this.z3d + cameraOffset); 
		
		// 마우스 상호작용
		const mX = (mouseX - centerX) * 0.03 * scale;
		const mY = (mouseY - centerY) * 0.03 * scale;

		// 스크롤 상호작용: 시작 시 우측에 위치하되, 너무 치우치지 않게 오프셋 조정 (-200)
		const sX = (Math.cos(scrollFactor * Math.PI * 6.5) * 500 - 200) * scale;
		const sY = scrollFactor * -150 * scale; 

		// 확장 계수
		const expansion = 1 + (scrollFactor * 0.7);

		const x2d = centerX + (this.x3d * scale * expansion) + mX + sX;
		const y2d = centerY + (this.y3d * scale * expansion) + mY + sY;

		const finalSize = this.radius * scale * 6;
		const finalAlpha = this.alpha * scale * 2.2;

		if (finalAlpha > 0.05) {
			ctx.globalAlpha = Math.min(finalAlpha, 1);
			ctx.drawImage(starCanvas, x2d - finalSize / 2, y2d - finalSize / 2, finalSize, finalSize);
		}
	}
}

function init() {
	setCanvasSize();
	stars = [];
	for (let i = 0; i < maxStars; i++) {
		stars.push(new Star());
	}
}

function animate() {
	ctx.globalCompositeOperation = 'source-over';
	ctx.globalAlpha = 1.0; 
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, w, h);

	mouseX += (targetMouseX - mouseX) * 0.05;
	mouseY += (targetMouseY - mouseY) * 0.05;

	currentScroll += (targetScroll - currentScroll) * 0.07;

	ctx.globalCompositeOperation = 'lighter';
	
	stars.forEach(star => {
		star.update();
		star.draw();
	});

	requestAnimationFrame(animate);
}

window.addEventListener('resize', init);

window.addEventListener('mousemove', (e) => {
	targetMouseX = e.clientX;
	targetMouseY = e.clientY;
});

window.addEventListener('scroll', () => {
	targetScroll = window.scrollY;
}, { passive: true });

init();
animate();