function searchMovie(){
	const input = (document.querySelector('.search')?.value || '').toLowerCase();
	const cards = document.querySelectorAll('.card');
	cards.forEach(c => {
		const titleAttr = c.dataset.title || '';
		const titleText = (c.querySelector('.overlay p')?.innerText) || '';
		const t = (titleAttr || titleText).toLowerCase();
		c.style.display = t.includes(input) ? 'block' : 'none';
	});
}

function openMovie(page){
	if(!page) return;
	window.location.href = page;
}

function setupAvatarMenu(){
	const avatarWrap = document.querySelector('.avatar-wrap');
	const avatarMenu = document.getElementById('avatarMenu');
	const userAvatar = document.querySelector('.user-avatar');

	if(!avatarWrap || !avatarMenu || !userAvatar) return;

	userAvatar.addEventListener('click', function(event){
		event.stopPropagation();
		const isHidden = avatarMenu.getAttribute('aria-hidden') === 'true';
		avatarMenu.setAttribute('aria-hidden', String(!isHidden));
	});

	document.addEventListener('click', function(){
		avatarMenu.setAttribute('aria-hidden', 'true');
	});

	avatarMenu.addEventListener('click', function(event){
		event.stopPropagation();
	});

	const logoutBtn = document.getElementById('logoutBtn');
	if(logoutBtn){
		logoutBtn.addEventListener('click', function(event){
			event.preventDefault();
			avatarMenu.setAttribute('aria-hidden', 'true');
			window.location.href = 'index.html';
		});
	}
}

document.addEventListener('DOMContentLoaded', setupAvatarMenu);

