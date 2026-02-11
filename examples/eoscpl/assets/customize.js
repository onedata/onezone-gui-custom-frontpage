const eoscplPink = '#F39BB1';
const eoscplTeal = '#257B85';

const customizerData = {
  /** @type {HTMLElement} */
  basicAuthButton: null,
  /** @type {HTMLElement} */
  accessEoscPlButton: null,
};
const buttonLabels = {
  accessEoscPl: 'Sign in with federated AAI',
  basicAuth: 'Sign in with username',
};
function getButtonAuthId(button) {
  for (const possibleId of ['accessEoscPl', 'basicAuth']) {
    if (button.classList.contains(possibleId)) {
      return possibleId;
    }
  }
}
function getButtonsContainer() {
  return document.querySelector('#login-buttons-container');
}
function showLoginButtons() {
  const buttonsContainer = getButtonsContainer();
  buttonsContainer.classList.remove('one-hidden');
}
function convertTipsToLabels() {
  const buttonsContainer = getButtonsContainer();
  // remove tip and apply button labels
  for (const button of buttonsContainer.querySelectorAll('.login-icon-box')) {
    const label = buttonLabels[getButtonAuthId(button)] || button.ariaLabel;
    const authIcon = button.querySelector('.auth-icon-image');
    authIcon.textContent = `${label}`;
    button.role = '';
    button.ariaLabel = '';
    button.dataset['microtipPosition'] = '';
  }
}
function customizeFrontpage() {
  const { basicAuthButton } = customizerData;
  const buttonsContainer = document.querySelector('#login-buttons-container');
  
  convertTipsToLabels();

  // force button colors
  basicAuthButton.style.backgroundColor = 'white';

  // force auth button images matching to their colors
  /** @type {HTMLElement} */
  const basicAuthIcon = basicAuthButton.querySelector('.auth-icon-image');
  basicAuthIcon.style.backgroundImage =
    'url(./assets/basicauth.svg?rev=1769612656635)';

  // force basic auth button to be last button
  buttonsContainer.append(basicAuthButton);

  // show the button container when it is customized
  showLoginButtons();
}
const startTimeMs = new Date().getTime();
const checkButtonsInterval = setInterval(() => {
  customizerData.basicAuthButton = document.querySelector('.login-icon-box.basicAuth');
  customizerData.accessEoscPlButton = document.querySelector('.login-icon-box.accessEoscPl');
  if (customizerData.basicAuthButton && customizerData.accessEoscPlButton) {
    console.debug('Onedata custom frontpage: starting customization');
    clearInterval(checkButtonsInterval);
    customizeFrontpage();
  } else {
    // Abort customization if the loading is too long.
    if (new Date().getTime() - startTimeMs > 10000) {
      console.warn('Onedata custom frontpage: aborting customization due to timeout');
      convertTipsToLabels();
      showLoginButtons();
      clearInterval(checkButtonsInterval);
    }
  }
}, 100);