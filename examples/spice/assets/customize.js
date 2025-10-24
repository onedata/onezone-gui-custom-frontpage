const spiceNavy = '#2a2768';
const spiceAzure = '#ed1c24';
const spiceRed = '#00aeef';
const customizerData = {
  /** @type {HTMLElement} */
  basicAuthButton: null,
};
const buttonLabels = {
  basicAuth: 'Sign-in with username',
};
function getButtonAuthId(button) {
  for (const possibleId of ['basicAuth']) {
    if (button.classList.contains(possibleId)) {
      return possibleId;
    }
  }
}
function customizeFrontpage() {
  const { basicAuthButton } = customizerData;
  const buttonsContainer = document.querySelector('#login-buttons-container');
  
  // force button colors
  basicAuthButton.style.backgroundColor = spiceNavy;
  basicAuthButton.style.borderColor = spiceNavy;
  basicAuthButton.style.color = '#fff';

  // force auth button images matching to their colors
  /** @type {HTMLElement} */
  const basicAuthIcon = basicAuthButton.querySelector('.auth-icon-image');
  basicAuthIcon.style.backgroundImage =
    'url(./assets/basicauth.svg?rev=1761214007910)';
  
  // remover tip and apply button labels
  for (const button of buttonsContainer.querySelectorAll('.login-icon-box')) {
    const label = buttonLabels[getButtonAuthId(button)] || button.ariaLabel;
    const authIcon = button.querySelector('.auth-icon-image');
    authIcon.textContent = `${label}`;
    button.role = '';
    button.ariaLabel = '';
    button.dataset['microtipPosition'] = '';
  }

  // force basic auth button to be last button
  buttonsContainer.append(basicAuthButton);

  // show the button container when it is customized
  buttonsContainer.classList.remove('spice-hidden');
}
const checkButtonsInterval = setInterval(() => {
  customizerData.basicAuthButton = document.querySelector('.login-icon-box.basicAuth');
  if (customizerData.basicAuthButton) {
    clearInterval(checkButtonsInterval);
    customizeFrontpage();
  }
}, 100);