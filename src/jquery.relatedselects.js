/*
 * jQuery related selects plug-in 0.3
 *
 * http://www.erichynds.com/jquery/jquery-related-dependent-selects-plugin/
 * http://github.com/ferric84/jquery-related-selects
 *
 * Copyright (c) 2009 Eric Hynds
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($){
	$.fn.extend({
		relatedSelects: function(opts){
			opts = $.extend({}, $.RelatedSelect.defaults, opts);
		
			return this.each(function(){
				new $.RelatedSelect(this, opts);
			});
		}
	});

	$.RelatedSelect = function(context, opts) {
		var $context = $(context);
		var selects = [];
	
		// if the selects option is an array convert it to an object
		if($.isArray(opts.selects)) selectsToObj();
	
		// make array of select names
		for(key in opts.selects) selects.push(key); 
	
		// cache the options where the value is empty for each select before processing occurs.
		saveDefaultOptionText(); 
	
		// go through each select box & settings passed into options
		$.each(opts.selects, function(elem,o){
			var $select = $("select[name='" + elem + "']", $context); // jquery ref to this select box
			var $next = next(elem); // the select box after this one
			var selectedValue = $select.find('option:selected').attr('value'); // currently selected value
		
			// extend element-specific options
			// set the defaultOptionText to whatever was passed in or the option where value is blank.
			o = $.extend({
				defaultOptionText: opts.defaultOptionText || $select.data('defaultOption') 
			}, opts, o);
		
			// store the new default option text
			$select.data('defaultOption', o.defaultOptionText);

			// bind the change event
			$select.change(function(){
				o.onChange.call($select);
				process( $select, $next, elem, o );
			});
	
			// if there is already a selected option in this select and the next one is already populated, skip this iteration
			if(selectedValue && selectedValue.length > 0 && isPopulated($next)) return;
		
			// process the select box upon page load
			process( $select, $next, elem, o );
		});

		function saveDefaultOptionText(){
			var $select, text;
			//TODO cache selects.length
			for(var x=1, xx=selects.length; x < xx; x++){
				$select = $("select[name='"+ selects[x] +"']", $context);
				text = $("option[value='']", $select).text();
				$select.data('defaultOption', text);
			};
		};

		function process($select,$next,elem,o){
			if($next.length === 0) return;
			var value = $.trim($select.find('option:selected').attr('value'));
		
			// if this select box's length has been changed to a legit value, and there is another select box after this one
			if( value.length > 0 && value !== o.loadingMessage && $next){
			
				// reset all selects after this one
				resetAfter(elem);
			
				// populate the next select
				populate($select,$next,o);
			
			// otherwise, make all the selects after this one disabled and select the first option
			} else if($next) {
				resetAfter(elem);
			};
		};
	
		function populate($caller,$select,o){
			var selectors = [], params = [];
		
			// build a selector for each select box in this context
			for(var x=0; x<selects.length; x++){
				selectors.push('select[name="'+selects[x]+'"]');
			};
		
			// take those selectors and serialize the data in them
			params = $( selectors.join(','), $context ).serialize();
		
			// disable this select box, add loading msg
			$select.attr("disabled", "disabled").html('<option value="">' + o.loadingMessage + '</option>');
		
			// perform ajax request
			$.ajax({
				beforeSend: function(){ o.onLoadingStart.call($select); },
				complete: function(){ o.onLoadingEnd.call($select); },
				dataType: o.dataType,
				data: params,
				url: o.onChangeLoad,
				success: function(data){
					var html = '', defaultOptionText = $select.data('defaultOption');
					
					// set the default option in the select.
					if(defaultOptionText.length > 0) html = '<option value="" selected="selected">' + defaultOptionText + '</option>';
				
					// if the value returned from the ajax request is valid json and isn't empty
					if(o.dataType === 'json' && typeof(data) === 'object' && data){
					
						// build the options
						$.each(data, function(i,item){
							html += '<option value="'+i+'">' + item + '</option>';
						});

						$select.html(html).removeAttr('disabled');
				
					} else if(o.dataType === 'html' && $.trim(data).length > 0){
						html += $.trim(data);
						$select.html(html).removeAttr('disabled');
				
					// if the response is invalid/empty, reset the default option and fire the onEmptyResult callback
					} else {
						$select.html(html);
						if(!o.disableIfEmpty){ $select.removeAttr('disabled'); };
						o.onEmptyResult.call($caller);
					};
				}
			});
		};
	
		function isPopulated($select){
			var options = $select.find('option');
			return (options.length === 0 || (options.length === 1 && options.filter(':first').attr('value').length === 0)) ? false : true;
		};
	
		function resetAfter(elem){
			var thispos = getPosition(elem);
			for (var x = thispos+1; x < selects.length; x++){
				$("select[name='" + selects[x] + "']", $context ).attr("disabled","disabled").find("option:first").attr("selected","selected");
			};
		};
	
		function next(elem){
			return $("select[name='" + selects[ getPosition(elem)+1 ] + "']", $context);
		};

		// returns the position of an element in the array
		function getPosition(elem){
			for (var i=0, ii=selects.length; i < ii; i++){
				if(selects[i] === elem){ return i; };
			};
		};
	
		// converts an array of selects to an object
		function selectsToObj(){
			var arrSelects = opts.selects;
			opts.selects = {};
			for(var i=0, ii=arrSelects.length; i < ii; i++){
				opts.selects[ arrSelects[i] ] = {};
			};
		};
	};

	$.RelatedSelect.defaults = {
		selects: {},
		loadingMessage: 'Loading, please wait...',
		disableIfEmpty: false,
		dataType: 'json',
		onChangeLoad: '',
		onLoadingStart: function(){},
		onLoadingEnd: function(){},
		onChange: function(){},
		onEmptyResult: function(){}
	};

})(jQuery);
