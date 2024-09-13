const FrontpageState = Object.freeze({
  Init: 'Init',
  Buttons: 'Buttons',
  Form: 'Form',
  ButtonAuthenticating: 'ButtonAuthenticating',
  FormAuthenticating: 'FormAuthenticating',
  Error: 'Error',
  FormError: 'FormError',
  Final: 'Final',
});

const State = FrontpageState;

class CustomFrontpageMock {
  integrate() {
    const iframe = this.getCustomFrontpageIframeElement();
    iframe.addEventListener('load', () => this.onIframeLoad(iframe));
  }
  getCustomFrontpageIframeElement() {
    return document.getElementById('custom-frontpage-iframe');
  }
  onIframeLoad(iframe) {
    this.injectFrontpageIntegrationScript(iframe);
  }
  injectFrontpageIntegrationScript(iframe) {
    iframe.contentWindow.customFrontpageModel = this.createMockModel();
    const iframeDocument = iframe.contentWindow.document;
    // Append integration script.
    const script = iframeDocument.createElement('script');
    script.src = `../../assets/scripts/custom-frontpage-integration.js?nocache=1`;
    const style = iframeDocument.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = '../../assets/styles/custom-frontpage.css';
    iframeDocument.body.appendChild(script);
    iframeDocument.head.appendChild(style);
  }
  createMockModel() {
    /** @type {FrontpageApi} */
    let localFrontpageApi;
    // FIXME: obrazki lokalne
    const imagesOrigin = 'https://dev-onezone.default.svc.cluster.local';
    const windowMock = window.mock ?? {};
    return {
      data: {
        availableAuthenticators: [{
            id: 'basicAuth',
            iconPath: `${imagesOrigin}/ozw/onezone/assets/images/auth-providers/basicauth.svg`,
            iconBackgroundColor: '#4BD187',
            displayName: 'username & password',
          },
          {
            id: 'egi',
            iconPath: `${imagesOrigin}/ozw/onezone/assets/images/auth-providers/egi.svg`,
            iconBackgroundColor: '#FFFFFF',
            displayName: 'EGI',
          },
          {
            id: 'google',
            iconPath: `${imagesOrigin}/ozw/onezone/assets/images/auth-providers/google.svg`,
            iconBackgroundColor: '#FFFFFF',
            displayName: 'Google',
          },
        ],
        loginMessage: 'Mollit fugiat laboris do qui esse culpa eiusmod nostrud occaecat tempor officia eu occaecat nostrud.<br>Irure id veniam velit sunt adipisicing reprehenderit irure esse ea qui eiusmod.',
        isAuthenticationError: false,
        privacyPolicyUrl: 'https://example.com/privacy-policy',
        termsOfUseUrl:'https://example.com/terms-of-use',
        version: '21.02.6',
        sessionHasExpired: false,
        isDomainMismatch: false,
      },
      api: {
        registerFrontpageApi(frontpageApi) {
          localFrontpageApi = frontpageApi;
        },
        async authenticate(authenticatorName) {
          if (authenticatorName === 'basicAuth') {
            localFrontpageApi.setState(State.Form);
          } else {
            localFrontpageApi.setState(State.ButtonAuthenticating, {
              authenticatorName,
            });
            await new Promise(resolve => {
              setTimeout(resolve, 2000);
            });
            localFrontpageApi.setState(State.Buttons);
          }
        },
        async usernameAuthenticate() {
          localFrontpageApi.setState(State.FormAuthenticating);
          await new Promise(resolve => {
            setTimeout(resolve, 2000);
          });
          localFrontpageApi.setState(State.FormError, {
            message: 'Invalid username and/or password.',
          });
        },
        getAuthenticationError() {
          return windowMock.authenticationError ?? null;
        },
      },
      i18n: {
        signIn: 'Sign in',
        withIdentityProvider: 'with your identity provider',
        usingUsername: 'using your username & password',
        username: 'Username',
        password: 'Password',
        back: 'Back',
        signInButton: 'Sign in',
        unknownError: 'Unknown error',
        authenticationError: 'Authentication error',
        authenticationErrorContactInfo: 'If the problem persists, please contact the site administrators and quote the below request state identifier:',
        privacyPolicyLabel: 'Privacy policy',
        termsOfUseLabel: 'Terms of use',
        versionLabel: 'version',
        sessionExpiredText: 'Your session has expired.',
        domainMismatchText: 'You have entered this page using a different domain (127.0.0.1) than the actual Onezone server domain (demo.onedata.org). Some of the content will be unavailable or malfunctioning, e.g. the file upload action. Use the server domain to ensure full functionality.',
      },
    };
  }
}

function mockAppInit() {
  new CustomFrontpageMock().integrate();
}
