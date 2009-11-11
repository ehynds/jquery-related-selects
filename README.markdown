# jQuery Related Selects

jQuery Related Selects allows you to create any number of select boxes whose options are based on the selected value of another.  You pass 
the select box name's as an array or object, and in either case, the select boxes will depend on each other in the order in which they are passed in.

When a select box is changed an AJAX request is sent to the file specified in the onChangeLoad property, passing the selected value of each select box
as parameters.  For now the data must be returned in JSON format.

This script provides a high level of customization.  You can set the options once for each select to use, or set the options on a select-by-select basis.

### Usage

A basic example.  Changing the state select updates the county select, and so on.

> <form>
> 	<select name="stateID">
> 	<option value="">Choose State</option>
> 	<option value="MA">Massachusetts</option>
> 	<option value="VT">Vermont</option>
> 	</select>
> 	<select name="countyID"><option value="">Choose County</option></select>
> 	<select name="townID"><option value="">Choose Town</option></select>
> 	<select name="villageID"><option value="">Choose Village</option></select>
> </form>

> $("form").relatedSelects({
>	onChangeLoad: 'datasupplier.php',
>	selects: ['stateID', 'countyID', 'townID', 'villageID']
> });
