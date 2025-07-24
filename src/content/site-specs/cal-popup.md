# Cal.com Popup Integration

This document describes the integration of the Cal.com popup into the website.

The Cal.com popup is a feature that allows users to book meetings with me directly from the website. It is implemented as a Svelte component that is included in the global layout of the site.

The component can be found in `src/lib/components/CalPopup.svelte`. It is a simple component that uses the Cal.com embed script to create the popup. The component is included in the `src/theme/GlobalLayout.svelte` file, which is the main layout for the site.

The popup is triggered by a button in the footer of the site. When the button is clicked, the Cal.com popup is displayed, allowing the user to book a meeting.
