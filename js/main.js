document.addEventListener("DOMContentLoaded", () => {

	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			e.preventDefault(); // 기본 이동 막기

			const targetId = this.getAttribute('href');
			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				// 해당 섹션의 절대 위치 계산
				const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
				
				// 상단 여백 100px을 뺀 위치로 이동
				const offsetPosition = targetPosition - 60;

				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth'
				});
			}
		});
	});


	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
	ScrollTrigger.config({ ignoreMobileResize: true });

	function getLenisOptions() {
		const width = window.innerWidth;

		if (width > 1024) {
			// 1. PC (1025px 이상)
			return {
				duration: 0.8,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				lerp: 0.1,
				wheelMultiplier: 1.5,
				smoothWheel: true,
				syncTouch: true,
				syncTouchLerp: 0.1,
				touchMultiplier: 1.5,
			};
		} else if (width <= 1024 && width > 570) {
			// 2. 태블릿 (1024px ~ 571px)
			return {
				syncTouch: true, 
				syncTouchLerp: 0.1,
				touchMultiplier: 2,
				wheelMultiplier: 1.4,
				smoothWheel: true,
			};
		} else {
			// 3. 모바일 (570px 이하)
			return {
				syncTouch: true, 
				syncTouchLerp: 0.1,
				touchMultiplier: 2,
				touchInertiaMultiplier: 10,
				lerp: 0.1,
				wheelMultiplier: 1.4,
				smoothWheel: true,
			};
		}
	}

	window.lenis = new Lenis(getLenisOptions());

	window.lenis.on('scroll', ScrollTrigger.update);

	gsap.ticker.add((time) => {
		window.lenis.raf(time * 1000);
	});

	gsap.ticker.lagSmoothing(0);
// lenis.stop();
	// document.body.style.height = "100vh";
	// document.body.style.overflow = "hidden";
	

	let mm = gsap.matchMedia();

	const introTl = gsap.timeline();

    introTl
	.to('.fill-text .top-text', {
		width: '100%',
		duration: 3,
		ease: "power3.inOut"
	})
	
	.to('.main-intro-wr', {
		yPercent: -100, 
		duration: 1,  
		ease: "power3.inOut",
		onComplete: () => {
			lenis.start();
			document.body.style.height = "";
			document.body.style.overflow = "";
		}
	}, "+=0.8");
	



	mm.add("(min-width: 1025px)", () => {
		const main__act01 = gsap.timeline({
			scrollTrigger: {
				trigger: "#main-contents-wr00",
				start: "top top",
				end: "+=100%",
				scrub: 1,
			}
		});
		
		main__act01.fromTo(
		".main-intro-title-wr .text",
		{ "backgroundPosition": "101% 0%" },
		{ "backgroundPosition": "0% 0%", stagger: 0.5, duration: 1 });
		
		
		const main__act01__01 = gsap.timeline({
			scrollTrigger: {
				trigger: "body",
				start: "top top",     
				end: "bottom bottom",
				scrub: 0.5,          
			}
		});

		main__act01__01.to(".active-line", { height: "100%",ease: "none"});
	
	}); // PC END

	mm.add("(min-width: 769px) and (max-width: 1024px)", () => {
		const main__act01 = gsap.timeline({
			scrollTrigger: {
				trigger: "#main-contents-wr00",
				start: "top top",
				end: "bottom center",
				scrub: 0.5,
			}
		});
		
		main__act01.fromTo(
		".main-intro-title-wr .text",
		{ "backgroundPosition": "101% 0%" },
		{ "backgroundPosition": "0% 0%", stagger: 0.5, duration: 0.8 });
		
		const main__act01__01 = gsap.timeline({
			scrollTrigger: {
				trigger: "body",
				start: "top top",     
				end: "bottom bottom", 
				scrub: 1,          
			}
		});

		main__act01__01.to(".active-line", { height: "100%",ease: "none" });
		
	}); // TAB END

	mm.add("(max-width: 768px)", () => {
	
		const main__act01 = gsap.timeline({
			scrollTrigger: {
				trigger: "#main-contents-wr00",
				start: "top top",
				end: "+=10%",
				scrub: 0.5,
			}
		});
		
		main__act01.fromTo(
		".main-intro-title-wr .text",
		{ "backgroundPosition": "101% 0%" },
		{ "backgroundPosition": "0% 0%", stagger: 0.5, duration: 0.8 });
		
		const main__act01__01 = gsap.timeline({
			scrollTrigger: {
				trigger: "body",
				start: "top top",     
				end: "bottom bottom", 
				scrub: 0.5,          
			}
		});

		main__act01__01.to(".active-line", { height: "100%",ease: "none" });
		
	}); // MO END






});




