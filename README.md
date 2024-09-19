# Custom Onezone front page

The Onezone component of Onedata can be configured to include a custom front page (i.e. login page). Implementation of a custom front page is based on an HTML template, as described further on. 

This repository includes implementation examples, a tutorial and a toolkit for launching the front page preview in a mocked environment for convenient development and testing.

# Development basics

The front page is essentially an HTML page put in the designated directory with optional static files like images, with some special elements utilized by Onezone GUI to display an authentication view.

## Front page structure

The original, built-in Onezone GUI front page looks this way:

![Built-in Onezone authentication page](docs/original-buttons.png)

It contains structural elements like headers, identity providers buttons, username & password form, etc.

A custom front page contains the same structural elements, but is styled by the implementer. The content of the elements is populated with data and controlled by Onedata scripts. 

Every implementation must be based on an `index.html` file that contains HTML elements with special, predefined IDs:

1. **Header** — a first-level header containing "Sign-in" or "Authentication error" text. A `h1` element with `sign-in-header` ID.
2. **Sub-header** — second level header containing text like "with your identity provider" depending on view current context. A `h2` element with `sign-in-subheader` ID.
3. **Login buttons container** — set of available login buttons that starts authentication in the selected identity provider, like Google; also displays a button for opening the username & password authentication form. Not displayed when the only authentication method is by username & password. A `div` element with `login-buttons-container` ID.
4. **Login form container** — text inputs for authenticating username & password, validation message and buttons. Could be displayed automatically instead of login buttons, when the only authentication method is by username & password. A `div` element with `login-form-container` ID.
5. **Error container** — error message when the authentication via identity provider fails. A `div` element with `login-error-container` ID.
6. **Login message container** — a message defined by admin using Onezone cluster GUI settings. A `div` element with `login-message-container` ID.
7. **Footer** — links for _Privacy policy_, _Terms of use_ (if available — can be set using Onezone cluster GUI settings) and Onezone version string. A `div` element with `footer` ID.

Note that all above elements must be present in the HTML file. Otherwise, the page will be malfunctioning.

## Examples

Consult the `examples/` directory. There is a production-grade example `egi-datahub` created for the [EGI Datahub](https://datahub.egi.eu) service and a minimal `simple` template. The `simple` template is a good starting point for your own front page, while the `egi-datahub` is a good reference for a complete implementation.

On the EGI Datahub front page, the structural elements (see the list above) are placed like this:

![](docs/egi-example-buttons.png)

![](docs/egi-example-form.png)

![](docs/egi-example-error.png)


## Testing the app

Normally, the custom front page static files should be mounted into the Onezone container. The Onezone GUI interacts with the front page by controlling the events and injecting the necessary data.

To enable the preview for development, this repository contains an application for testing the implementation, which works on mocked data (without an actual Onezone service running).

To use it, run the `./run.sh` script with the optional relative path to the directory with the developed front page. Note that the directory must be inside this repo. By default, the script sets up the environment using the `egi-datahub` implementation.

To launch the `simple` template, invoke the following command from the root directory of the repository:

```shell
./run.sh examples/simple
```

A docker container with the integration web app should start. When the docker starts, you should see the following message above the `http-server` status:

```
Open the mock app: http://localhost:8080/ozw/onezone/index.html"
```

Open the above URL to see the mocked login page. All changes made in the `examples/simple` files will be visible on full page refresh (you should use refresh with cache clear, typically using `ctrl + shift + r`).

The page will display username & password authentication button and two additional identity providers. Clicking on username & password will open login form, while clicking on identity providers will cause them to be loading infinitely. You can also simulate the error view by adding `#error` to the URL: <http://localhost:8080/ozw/onezone/index.html#error>.

## Injecting into a development Onezone

If you are using one-env, you can use the following script to deploy (and overwrite) the front page in the Onezone container:

```shell
./deploy.sh [path_to_static_dir]
```

As in the `./run.sh` — it takes the `egi-datahub` front page by default.

Refresh the Onezone GUI login page — you should see your own front page instead of the built-in one. Test the typical scenarios and check the JS console to see if there are no errors.

# Installing the front page in production

Mount the directory containing the `index.html` and other optional files/directories at `/var/www/html/oz_worker/custom/frontpage` in the Onezone container. 
Finally, the `index.html` file should reside at `/var/www/html/oz_worker/custom/frontpage/index.html`, with other files/directories such as `style.css` beside it.

# Technical details

The custom front page is rendered in an iframe, which has data and API injected by the main Onezone GUI frame. The page is controlled by a script using a state machine, where states are representing e.g. "displaying buttons", "displaying username form" or "displaying error". The front page implementer does not need to know the technical details how the script works, because states change automatically due to events like an identity provider button click.

## Injected data and API

The data and API injected into the iframe includes:

- **Available authenticators data** — to display authentication buttons. Color of button background and icon path if sent by backend, so styling of these buttons is limited.
- **Login message** — which can be set by Onezone admin. The login message can be empty.
- **Footer data** — URLs to privacy policy and terms of use (if available) and version string.
- **Warning data** — information if "session expired" and/or "domain mismatch" message should be displayed on the login screen on initialization.
- **Authentication error data** — message about authentication error.
- **Authentication API methods** — methods that invokes authentication on the Onezone GUI side.
- **Texts (i18n)** — all texts like "Sign in", "using your username & password" etc. are injected from the main Onezone GUI frame. Currently, only the English language is available, but the mechanism is coupled with i18n system in Onezone GUI which may be extended someday.

## Login view states

There are 8 states of the login screen:

1. **Initialization** — user just entered the login screen and the script will decide to which state transition into: showing buttons, showing username form or showing error.
2. **Buttons** — display clickable identity provider buttons.
3. **Form** — display username & password form instead of identity provider buttons.
4. **Button authenticating** — user clicked some button from state (3), and we wait to be redirected to the identity provider's login page (or to be authenticated automatically). This state replaces the clicked authenticator icon to `.login-icon-spinner` element, which can be styled. See `egi-datahub` for example implementation.
5. **Form authenticating** — user submitted the username & password, either hitting enter on the input or clicking on the `Sign in` button. In this state, the submit button has a `.loading` class and an additional `.button-spinner` element.
6. **Error** — there was an error when authenticating, and the error message is displayed instead of login buttons or form. You can simulate the error view by adding `#error` to the URL, e.g. http://localhost:8080/ozw/onezone/index.html#error
7. **Form error** — user entered invalid username and/or password. The `.has-error` class is added to inputs and small information about invalid credentials is displayed.
8. **Final** — authentication succeeded and page is being redirected to the authenticated Onezone GUI.

The below diagram shows possible state transitions:

![Login view states](docs/states.svg)