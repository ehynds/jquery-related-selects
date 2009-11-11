# jQuery Related Selects

jQuery Related Selects allows you to create any number of select boxes whose options are based on the selected value of another.  You pass 
the select box name's as an array or object, and the select boxes will depend on each other in the order in which they are passed in.

When a select box is changed an AJAX request is sent to the file specified in the onChangeLoad property, passing the selected value of each select box
as parameters.  For now the data must be returned in JSON format.

This script provides a high level of customization.  You can set the options once for each select to use, or set the options on a select-by-select basis.

### Usage

A basic example.  Changing the state select updates the county select, and so on.

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

Required.  An array or object of select boxes you want to be dependent.  Each one will depend on each other in order.  If you want to 
override other options below on a select-by-select basis you can pass this as an object.  See examples.

> onChangeLoad

Required.  The file to call to retrieve dependent data when a select box is changed.  Data must be returned in AJAX format for now.

> loadingMessage

Optional.  The text to change the sibling select box to while AJAX data is being retreived.

> defaultOptionText

Optional.  The text inside the default selected option after AJAX loads in new values.  If this option is not provided, the option
where the value is blank is used (if one exists).  So for example, <option value="">Choose</option>

> onLoadingStart

Optional.  A callback to fire when the AJAX call starts.

> onLoadingEnd

Optional.  A callback to fire when the AJAX call ends.

> onChange

Optional.  A callback to fire when a select box is changed.


