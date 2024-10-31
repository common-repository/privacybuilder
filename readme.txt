=== Plugin Name ===
Contributors:ronslow
Tags: data protection, privacy, privacybuilder
Requires at least: 4.0
Tested up to: 4.1
Stable tag: 1.0.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Integration of the external PrivacyBuilder data protection service to WordPress

== Description ==

PrivacyBuilder allows a web framework such as WordPress to incorporate and manage user consents during the registration process, and on the user's profile page, to assist in compliance with EU data protection law.

This WordPress plugin provides a service to a WordPress installation, and in doing so makes API calls to external servers at privacybuilder.eu. To use this plugin, you must create an account at [PrivacyBuilder](https://privacybuilder.eu).

== Installation ==


1. Upload `privacybuilder` directory to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Log on as admin, and edit Settings/PrivacyBuilder
1. Enter your PrivacyBuilder user name and password.
1. Define consents for the registration page. Read the [manual] (https://privacybuilder.eu/static/manuals/user_manual.pdf)
1. It is strongly recommended that you install a user delete plugin, such as DeleteMe, to enable a user to delete the user account.

== Frequently Asked Questions ==
= What is the infofield name to user meta field look up (JSON) =
When the user withdraws a particular consent, the PrivacyBuilder server is queried as to which fields of user data must be deleted from WordPress. Each field of user data to be deleted, as specified in PrivacyBuilder, may correspond to multiple keys within the user meta data which your WordPress application has created.
Specify, in JSON form, the PrivacyBuilder infofield to be deleted, and the corresponding array of keys of WordPress user meta data to be deleted. Use PHP style double quotes here, not Javascript single quotes.

== Screenshots ==

1. Registration page with PrivacyBuilder plugin enabled
2. Profile page with PrivacyBuilder plugin enabled
3. Admin page for PrivacyBuilder

== Changelog ==

= 1.0 =
* First commit

= 1.0.1 =
* Required checkboxes

= 1.0.2 =
* Upgrade mp_client.js

== Upgrade Notice ==

= 1.0 =
Install
= 1.0.1 =
Upgrade to correct required checkboxes
= 1.0.2 =
Upgrade mp_client.js
