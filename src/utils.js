export async function preloadScript(url, cb) {
	return new Promise(resolve => {
		const script_el = document.createElement('script');
		script_el.addEventListener('load', () => {
			script_el.remove();
			typeof cb === 'function' && cb();
			resolve();
		});
		script_el.src = url;
		document.head.append(script_el);
	});
}


export async function vimeoAutoPlay(observer_options = {}) {
	const vboxes = document.querySelectorAll('.vimeo-video-box [data-vimeo-vid]');
	if (vboxes.length) {
		await preloadScript('https://player.vimeo.com/api/player.js');
		const io = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				const target = entry.target;
				if (entry.isIntersecting) {
					if (!target['vimeo-player']) {
						target['vimeo-player'] = new Vimeo.Player(target, {
							id: target.dataset.vimeoVid,
							background: 1,
							playsinline: 1,
							autopause: 0,
							title: 0,
							byline: 0,
							portrait: 0,
							autoplay: 1,
							muted: 1,
						});
						target['vimeo-player'].on('play', function () {
							this.element.parentElement.classList.add('playback');
						});
					}
					target['vimeo-player'].play();
				} else {
					target['vimeo-player']?.pause();
				}
			});
		}, Object.assign({}, {threshold: .33}, observer_options));
		vboxes.forEach(box => io.observe(box));
	}
}

export async function hostReactAppReady(
	selector = "#__next > div",
	timeout = 500,
) {
	return new Promise((resolve) => {
		const waiter = () => {
			const host_el = document.querySelector(selector);
			if (host_el?.getBoundingClientRect().height) {
				resolve();
			} else {
				setTimeout(waiter, timeout);
			}
		};
		waiter();
	});
}

export async function Bitrix24Ready(
        selector = '.b24-form-click-btn',
        timeout = 500
    ) {
        return new Promise(resolve => {
            const waiter = () => {
                const host_el = document.querySelector(selector)

                if (host_el?.getBoundingClientRect().width) {
                    // Используем явный флаг, чтобы избежать повторного вызова resolve
                    if (!waiter.resolved) {
                        waiter.resolved = true
                        resolve()
                    }
                } else {
                    setTimeout(waiter, timeout)
                }
            }
            waiter.resolved = false // Флаг, чтобы предотвратить повторное разрешение
            waiter()
        })
    }