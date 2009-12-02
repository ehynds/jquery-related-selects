# jQuery Related Selects

Demos @ [http://www.erichynds.com/examples/jquery-related-selects/](http://www.erichynds.com/examples/jquery-related-selects/)  
jQuery project page @ [http://plugins.jquery.com/project/related-selects](http://plugins.jquery.com/project/related-selects)  
Blog post/comments @ [http://www.erichynds.com/jquery/jquery-related-dependent-selects-plugin/](http://www.erichynds.com/jquery/jquery-related-dependent-selects-plugin/)  

jQuery Related Selects is a plugin that allows you to create any number of select boxes whose options are determined upon the selected value of another.  
You pass an array or object of select box names, and the select boxes will depend on each other in the order in which they are passed in.

When a select box is changed an AJAX request is sent to the file specified in the onChangeLoad property, passing the selected value of each select box
as parameters.  The data must be returned in either JSON or HTML format.  An <option> must have a legitimate value in order to trigger the script.  An <option>
where the value is blank (value="") is used for the defaultOptionText option (see below).

This script provides a high level of customization.  You can set the options once for each select to use, or set the options on a select-by-select basis.
You can also start your markup with pre-populated options and selected values.

### Usage

A basic example.  Changing the "stateID" select updates the "countyID" select and so on.  The values of all four select
boxes are serialized and passed to datasupplier.php, which returns data for the next select box in JSON format (default).

	<form>
		<select name="stateID">
		<option value="">Choose State</option>
		<option value="MA">Massachusetts</option>
		<option value="VT">Vermont</option>
		</select>
		<select name="countyID"><option value="">Choose County</option></select>
		<select name="townID"><option value="">Choose Town</option></select>
		<select name="villageID"><option value="">Choose Village</option></select>
	</form>

	$("form").relatedSelects({
		onChangeLoad: 'datasupplier.php',
		selects: ['stateID', 'countyID', 'townID', 'villageID']
	});
	
### Options

> selects

Required.  An array or object of select boxes you want to be dependent.  Each one will depend on each other **in the order in which they are passed in.**  If you want to 
override any of the options below on a select-by-select basis you can pass this as an object.  See examples.

> dataType

The type of data the server will return.  Either 'json' or 'html'.

> onChangeLoad

Required.  The file to call to retrieve data when a select box is changed.

> loadingMessage

Optional.  The text to change the sibling select box to during the AJAX request.  Defaults to &quot;Loading, please wait...&quot;.

> defaultOptionText

Optional.  The text inside the default <option> tag after AJAX populates a select box.  This is typically the text where you instruct the user
to choose an option.  If this option is not provided and an <option> tag with a blank value attribute exists in your markup, that text will be used.

> disableIfEmpty

Optional.  Keep select2 disabled if select1 does not return any results.  Defaults to false.  Also see the onEmptyResult callback.

> onLoadingStart

Optional.  A callback to fire when the AJAX call starts.

> onLoadingEnd

Optional.  A callback to fire when the AJAX call ends.

> onChange

Optional.  A callback to fire when a select box is changed.

> onEmptyResult

Optional.  A callback to fire when no results are returned after changing a select.
