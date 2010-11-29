# jQuery Related Selects

Demos @ [http://www.erichynds.com/examples/jquery-related-selects/](http://www.erichynds.com/examples/jquery-related-selects/)  
jQuery project page @ [http://plugins.jquery.com/project/related-selects](http://plugins.jquery.com/project/related-selects)  
Blog post/comments @ [http://www.erichynds.com/jquery/jquery-related-dependent-selects-plugin/](http://www.erichynds.com/jquery/jquery-related-dependent-selects-plugin/)  

Related Selects is a jQuery plugin that allows you to create any number of select boxes whose options are determined upon the selected value of another.  Select boxes can be populated via AJAX (returning HTML or JSON), an array, or custom logic.

### Usage

In the example below, changing the "state" select updates the "county" select and so on.  The values of all four select
boxes are serialized and passed to datasupplier.php, which returns data for the next select box in JSON format (default).

The `relatedSelects` method must be called on a form element and it accepts an object as an options parameter.  Each key within the object corresponds to the ID of a select box.  Each key itself is an object, for which you can set specific options for that particular select in the chain.

	<form>
		<select name="stateID" id="state">
		<option value="">Choose State &raquo;</option>
		<option value="MA">Massachusetts</option>
		<option value="VT">Vermont</option>
		</select>

		<select name="countyID" id="county">
		<option value="">Choose County &raquo;</option>
		</select>

		<select name="townID" id="town">
		<option value="">Choose Town &raquo;</option>
		</select>

		<select name="villageID" id="village">
		<option value="">Choose Village &raquo;</option>
		</select>
	</form>

	$("form").relatedSelects({
		"county": {
			depends: "basic-state",
			loadingMessage: "Loading counties...",
			source: "datasupplier.php"
		},
		"town": {
			depends: "basic-county",
			loadingMessage: "Loading towns...",
			source: "datasupplier.php"
		},
		"village": {
			depends: "basic-town",
			loadingMessage: "Loading villages...",
			source: 'datasupplier.php'
		}
	});

In the above example we pass an object to relatedSelects with three keys: county, town, and village.  These keys correspond to the ID of each select in the form that requires a dependency.  Each key in the options object is an object itself, each select can be individually customized with a different source, dependency, etc.  The options below are available to the configuration object for each key.

### Options

> source

Required.  Determines how to populate a select box.  This option accepts three data types:

1. *File name/location (string):*  If the value is a string, an AJAX request will fire to the location and pass the name/value pairs of all related selects as parameters.  Data must be returned in either JSON or HTML format.  

2. *An array of objects:*  Each object in the array should have a `value` key to populate the option tag's value attribute, and a `text` key to display to the user.  Here's an example:
	source: [
		{ value:"a", text:"Apple" },
		{ value:"b", text:"Banana }
	]

3. *Callback function:* A function to evaluate in case you'd like to do some additional processing to determine the source.  This function should return an array of objects or HTML.

> dataType

Optional, either "json" or "html".  This option tells the script which format to expect the server response to be in.  If the response is in JSON format, it should be well formed and look like this: `[{"VALUE","TEXT},{"VALUE","TEXT"}]`.  HTML should be pre-built option tags because whatever is returned will be inserted in between the opening and closing select tags.

Default is "json".

> depends

Required.  Use this option to specify the dependencies for each select box.  If there is only one dependency, pass in a string with the select box's ID.  If there are multiple dependencies, pass in an array with each select box's ID.

>> One dependency:
>> `depends: 'state' // where "state" is the ID of another select box`
>>
>> Multiple dependencies:
>> `depends: ['state','town','country'] // where each item in the array is an ID of another select box`

The order in which you declare multiple depencencies is not important.  Each must be satisfied for the select box to populate and enable.

> loadingMessage

Optional.  The text to change the select box to while it is being populated.  Defaults to &quot;Loading, please wait...&quot;.

> defaultValue

Optional.

> disableIfEmpty

Optional.  Keep select2 disabled if select1 does not return any results.  Defaults to false.  Also see the onEmptyResult callback.

### Events

Specify these inside the options object just as you would any other option.  The `this` keyword is a reference to the particular select box inside all callbacks.

> onLoadingStart

Optional.  A callback to fire when an AJAX call starts.

> onLoadingEnd

Optional.  A callback to fire when an AJAX call ends.

> onError

Optional.  A callback to fire when an AJAX call results in an error.

> onDependencyChanged

Optional.  A callback to fire when a dependency is met.  Receives two parameters:

1. An array of references to the satisfied select boxes
2. An array of references to the particular select box's dependencies

> onChange

Optional.  A callback to fire when a select box is changed.  Receives two parameters:

1. A reference to the select box that caused this select to change. The `this` keyword inside the callback is the actual select being changed.
2. The number of unsatisfied select boxes remaining.

> onEmptyResult

Optional.  A callback to fire when no results are returned after changing a select.
