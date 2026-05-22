function searchMovie(){
	const query = (document.querySelector('.search')?.value || '').trim().toLowerCase();
	const searchTerms = query.split(/\s+/).filter(Boolean);
	const cards = document.querySelectorAll('.card');
	let found = false;

	cards.forEach(c => {
		const titleAttr = c.dataset.title || '';
		const titleText = (c.querySelector('.overlay p')?.innerText) || '';
		const fullTitle = (titleAttr || titleText).toLowerCase();
		const visible = searchTerms.every(term => fullTitle.includes(term));
		c.style.display = visible ? 'block' : 'none';
		if(visible) found = true;
	});

	const noResult = document.querySelector('.no-results');
	if(noResult){
		if(!found && query !== ''){
			noResult.textContent = `Aucun titre trouvé pour « ${query} »`;
			noResult.classList.remove('hidden');
		}else{
			noResult.classList.add('hidden');
		}
	}
}

function openMovie(page){
	if(!page) return;
	window.location.href = page;
}

function signOut(event){
	if(event){
		event.preventDefault();
	}
	localStorage.removeItem('isLoggedIn');
	localStorage.removeItem('userProfile');
	window.location.href = 'index.html';
}

function getDefaultProfileAvatar(){
	return 'https://i.pravatar.cc/150?img=3';
}

function setProfileAvatar(url){
	const avatars = document.querySelectorAll('.user-avatar');
	avatars.forEach(img => {
		if(img) img.src = url;
	});
	const profileAvatar = document.getElementById('profileAvatar');
	if(profileAvatar){
		profileAvatar.src = url;
	}
}

function loadProfileState(){
	const storedAvatar = localStorage.getItem('profileAvatarUrl');
	const storedName = localStorage.getItem('profileName');
	if(storedAvatar){
		setProfileAvatar(storedAvatar);
	}
	if(storedName){
		const profileNameInput = document.getElementById('profileName');
		if(profileNameInput){
			profileNameInput.value = storedName;
		}
		const membershipText = document.querySelector('.membership strong');
		if(membershipText){
			membershipText.textContent = storedName === 'Invité' ? 'Standard' : 'Premium';
		}
	}
}

function showProfileMessage(message){
	const messageEl = document.getElementById('profileMessage');
	if(!messageEl) return;
	messageEl.textContent = message;
	messageEl.classList.remove('hidden');
	clearTimeout(showProfileMessage.timeoutId);
	showProfileMessage.timeoutId = setTimeout(() => {
		messageEl.classList.add('hidden');
	}, 2800);
}

function setupProfilePage(){
	const profileCards = Array.from(document.querySelectorAll('.profile-card'));
	const profileAvatar = document.getElementById('profileAvatar');
	const profileNameInput = document.getElementById('profileName');
	const membershipText = document.querySelector('.membership strong');
	const saveProfileBtn = document.getElementById('saveProfile');
	const manageBtn = document.getElementById('manageBtn');

	if(profileCards.length && profileAvatar && profileNameInput){
		profileCards.forEach(card => {
			card.addEventListener('click', () => {
				profileCards.forEach(c => c.classList.remove('active'));
				card.classList.add('active');
				const name = card.dataset.name || 'Invité';
				profileNameInput.value = name;
				if(membershipText){
					membershipText.textContent = name === 'Invité' ? 'Standard' : 'Premium';
				}
				showProfileMessage(`Profil sélectionné : ${name}`);
			});
		});
	}

	const addProfileBtn = document.getElementById('addProfile');
	if(addProfileBtn && profileCards.length && profileAvatar && profileNameInput){
		addProfileBtn.addEventListener('click', () => {
			const newName = window.prompt('Nom du nouveau profil', 'Invité');
			if(!newName) return;
			const trimmedName = newName.trim();
			if(!trimmedName) return;
			const newCard = document.createElement('div');
			newCard.className = 'profile-card';
			newCard.dataset.name = trimmedName;
			newCard.innerHTML = `<img src="https://i.pravatar.cc/80?u=${encodeURIComponent(trimmedName)}" alt="${trimmedName}"><span>${trimmedName}</span>`;
			newCard.addEventListener('click', () => {
				profileCards.forEach(c => c.classList.remove('active'));
				newCard.classList.add('active');
				profileNameInput.value = trimmedName;
				if(membershipText){
					membershipText.textContent = 'Standard';
				}
				showProfileMessage(`Profil ajouté : ${trimmedName}`);
			});
			addProfileBtn.insertAdjacentElement('beforebegin', newCard);
			profileCards.push(newCard);
			newCard.click();
		});
	}

	if(saveProfileBtn && profileNameInput){
		saveProfileBtn.addEventListener('click', () => {
			const name = profileNameInput.value.trim() || 'NSI';
			const avatarUrl = profileAvatar ? profileAvatar.src : getDefaultProfileAvatar();
			localStorage.setItem('profileName', name);
			localStorage.setItem('profileAvatarUrl', avatarUrl);
			setProfileAvatar(avatarUrl);
			showProfileMessage(`Profil enregistré : ${name}`);
		});
	}

	if(manageBtn && profileNameInput){
		let editing = false;
		manageBtn.addEventListener('click', () => {
			editing = !editing;
			profileNameInput.disabled = !editing;
			manageBtn.textContent = editing ? 'Terminer' : 'Gérer le profil';
			showProfileMessage(editing ? 'Mode édition activé' : 'Mode édition désactivé');
			if(editing){
				profileNameInput.focus();
			}
		});
	}
}

function setupAvatarMenu(){
	const avatarWrap = document.querySelector('.avatar-wrap');
	const avatarMenu = document.getElementById('avatarMenu');
	const userAvatar = document.querySelector('.user-avatar');

	if(avatarWrap && avatarMenu && userAvatar){
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
	}

	const logoutBtn = document.getElementById('logoutBtn');
	const signOutBtn = document.getElementById('signOut');

	if(logoutBtn){
		logoutBtn.addEventListener('click', signOut);
	}

	if(signOutBtn){
		signOutBtn.addEventListener('click', signOut);
	}
}

document.addEventListener('DOMContentLoaded', function(){
	loadProfileState();
	setupAvatarMenu();
	setupProfilePage();
});

