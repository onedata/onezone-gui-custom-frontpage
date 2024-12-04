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

function noCacheUrl(url) {
  const timestamp = new Date().getTime();
  return `${url}?timestamp=${timestamp}`;
}

class CustomFrontpageMock {
  constructor() {
    this.isErrorMockedLast = this.isAuthenticationErrorMocked();
  }
  integrate() {
    const iframe = this.getCustomFrontpageIframeElement();
    iframe.addEventListener('load', () => this.onIframeLoad(iframe));
  }
  getCustomFrontpageIframeElement() {
    return document.getElementById('custom-frontpage-iframe');
  }
  onIframeLoad(iframe) {
    this.injectFrontpageIntegrationScript(iframe);
    window.addEventListener('hashchange', () => {
      if (this.isErrorMockedLast !== this.isAuthenticationErrorMocked()) {
        window.location.reload();
      }
    });
  }
  isAuthenticationErrorMocked() {
    return window.location.hash.includes('error');
  }
  injectFrontpageIntegrationScript(iframe) {
    iframe.contentWindow.customFrontpageModel = this.createMockModel();
    const iframeDocument = iframe.contentWindow.document;
    // Append integration script.
    const script = iframeDocument.createElement('script');
    script.src = noCacheUrl(`../../assets/scripts/custom-frontpage-integration.js`);
    const style = iframeDocument.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = noCacheUrl('../../assets/styles/custom-frontpage.css');
    iframeDocument.body.appendChild(script);
    iframeDocument.head.appendChild(style);
  }
  createMockModel() {
    /** @type {FrontpageApi} */
    let localFrontpageApi;
    const imagesOrigin = 'https://demo.onedata.org';
    const isAuthenticationError = this.isErrorMockedLast;
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
        loginMessage: '<p>Mollit fugiat laboris do qui esse culpa eiusmod nostrud occaecat tempor officia eu occaecat nostrud.</p><p>Irure id veniam velit sunt adipisicing reprehenderit irure esse ea qui eiusmod.</p>',
        isAuthenticationError: false,
        privacyPolicyUrl: 'https://example.com/privacy-policy',
        termsOfUseUrl: 'https://example.com/terms-of-use',
        version: '21.02.6',
        versionBuild: 'a1b2c3d4',
        sessionHasExpired: false,
        isDomainMismatch: false,
        isTestMode: false,
        isAuthenticationError,
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
            // will be in the loading state infinitely
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
          if (isAuthenticationError) {
            return {
              message: 'The Identity Provider of your choice seems to be temporarily unavailable, please try again later.',
              refId: '12345678',
              isContactInfo: true,
            };
          } else {
            return null;
          }
        },
      },
      i18n: {
        signIn: 'Sign in',
        signInUsing: 'Sign in using',
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
        versionBuild: 'Build',
        sessionExpiredText: 'Your session has expired.',
        domainMismatchText: 'You have entered this page using a different domain (127.0.0.1) than the actual Onezone server domain (demo.onedata.org). Some of the content will be unavailable or malfunctioning, e.g. the file upload action. Use the server domain to ensure full functionality.',
        signInTestMode: 'This is the test sign-in page — based on test.auth.config — used for sign-in simulation and diagnostics.',
      },
    };
  }
}

function mockAppInit() {
  new CustomFrontpageMock().integrate();
}