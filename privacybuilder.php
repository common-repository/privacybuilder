<?php 
/**
 * Plugin Name: Privacy Builder
 * Plugin URI: http://privacybuilder.eu/plugins/wordpress.html
 * Description: Privacy Builder configuration
 * Version: 1.0.2
 * Author: Robert Onslow
 * Author URI: http://privacybuilder.eu/ronslow.html
 * License: GPLv2 or later
 */

add_action( 'delete_user', 'pb_deleted_user');
add_action( 'wp_enqueue_scripts', 'pb_register_scripts');
add_action( 'login_enqueue_scripts', 'pb_register_scripts');
add_action( 'admin_enqueue_scripts', 'pb_register_scripts');
add_action( 'show_user_profile', 'override_profile');
add_action( 'edit_user_profile', 'override_profile');
add_action( 'profile_update', 'override_profile_update');
/** Step 2 (from text above). */
if ( is_admin() ) {
add_action( 'admin_menu', 'privacy_builder_menu' );
add_action( 'admin_init', 'register_pbsettings');


} else {
add_action( 'register_form', 'override_registration_form');
add_action( 'user_register', 'override_register');


}



function pb_register_scripts(){
      wp_register_script("jquery_validate", plugins_url("/privacybuilder/js/jquery.validate.min.js"), array("jquery"));
      wp_register_script("privacybuilder_client", plugins_url("/privacybuilder/js/mp_client.js"), array("jquery"));
      wp_enqueue_script("jquery_validate");
       wp_enqueue_script("privacybuilder_client");
}

function register_pbsettings() { // whitelist options
  register_setting( 'myoption-group', 'pb_username' );
  register_setting( 'myoption-group', 'pb_password' );
  register_setting( 'myoption-group', 'pb_reg_consents');
  register_setting('myoption-group', 'pb_lookup');
}
/** Step 1. */
function privacy_builder_menu() {
	add_options_page( 'PrivacyBuilder Options', 'PrivacyBuilder', 'manage_options', 'my-unique-identifier', 'my_plugin_options' );
}

/** Step 3. */
function my_plugin_options() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	echo '<div class="wrap">';
	echo '<form method="post" action="options.php"> ';
        settings_fields( 'myoption-group' );
        do_settings_sections( 'myoption-group' );
    ?>
        <table class="form-table">
        <tr valign="top">
        <th scope="row">PrivacyBuilder user name</th>
        <td><input type="text" name="pb_username" value="<?php echo esc_attr(get_option('pb_username')); ?>" /></td>
        </tr>
	<tr valign="top">
	<th scope="row">PrivacyBuilder password</th>
        <td><input type="password" name="pb_password" value="<?php echo esc_attr(get_option('pb_password')); ?>" /></td>
	</tr>
	<tr valign="top">
	<th scope="row">Registration consents (comma separated)</th>
        <td><input type="text" name="pb_reg_consents" value="<?php echo esc_attr(get_option('pb_reg_consents')); ?>" /></td>
	</tr>
         <tr valign="top">
         <th scope="row">Infofield name to user meta field look up (JSON)</th>
         <td><input type="textarea" name="pb_lookup" value="<?php echo esc_attr(get_option('pb_lookup')); ?>" /></td>
         </tr>
	</table>
	</div>
        <?php submit_button();
        echo '</form>';
        echo '</div>';
}

function override_registration_form() {



       $consents =  get_option('pb_reg_consents');
       $username = get_option('pb_username');
?>
 <style>
ul
{
    list-style-type: none;
}
</style>
 <p><div id="consents"></div></p>

 <script>displaySelectedConsents("<?php echo esc_attr($username);?>","<?php echo esc_attr($consents);?>", {host : "https://privacybuilder.eu"}); $("#registerform").validate(); </script>
<?php

}

function override_register($user_id) {
  $username = get_option('pb_username');
  $password = get_option('pb_password');

  $consents = $_POST['consents-added'];
  $args = array(
   'headers' => array(
    'Authorization' => 'Basic ' . base64_encode($username . ':' . $password)
    )
  );
  $pb_id = wp_remote_request("https://privacybuilder.eu/user/addUser/" . $username . "?consents=" . $consents, $args)['body'];
  update_user_meta($user_id, 'pb_id', trim($pb_id,'"'));





}

function override_profile($user) {

  $username = get_option('pb_username');
  $pb_id = get_user_meta($user->ID, 'pb_id', true);
 
?>
   <h3>Consents</h3>
   <p><div id="consents"></div></p>

<script>displayUserConsents("<?php echo esc_attr($username);?>","<?php echo esc_attr($pb_id);?>", {host : "https://privacybuilder.eu"});</script>
<?php
}

function pb_deleted_user($user_id){
 $username = get_option('pb_username');
  $password = get_option('pb_password');
  $pb_id = get_user_meta($user_id, 'pb_id', true);
   $args = array(
   'headers' => array(
    'Authorization' => 'Basic ' . base64_encode($username . ':' . $password)
    )
  );
  wp_remote_request("https://privacybuilder.eu/user/userRemoved/" . $username . "/" . $pb_id, $args);
 
}
function override_profile_update($user_id) {
 
  $consents = $_POST['consents-withdrawn'];
  if ($consents == '')
    return;
  $username = get_option('pb_username');
  $password = get_option('pb_password');
  $pb_id = get_user_meta($user_id, 'pb_id', true);
  $args = array(
   'headers' => array(
    'Authorization' => 'Basic ' . base64_encode($username . ':' . $password)
    )
  );
  $del_infofields_str = wp_remote_request("https://privacybuilder.eu/user/getInfofieldsForDeletion/" . $username . "/" . $pb_id . "?consents=" . $consents, $args)['body'];  
  $del_infofields = json_decode($del_infofields_str, true)['infofields'];
  $infofield_lookup = json_decode(get_option('pb_lookup'), true);
  $out = [];
  foreach($del_infofields as $del_infofield){
   $name = $del_infofield['name'];
   if (array_key_exists($name, $infofield_lookup)) {
   $lookup = $infofield_lookup[$name];
   foreach ($lookup as $l) {
    if (!in_array($l, $out)){
     $out[] = $l;
   }
  }
  }
 }
  array_map(function($meta_key) use ($user_id){
 
   delete_user_meta($user_id, $meta_key);
 }, $out);

//signal that the fields are deleted
  wp_remote_request("https://privacybuilder.eu/user/consentsRemoved/" . $username . "/" . $pb_id . "?consents=" . $consents, $args);

}
?>