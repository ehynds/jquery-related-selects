// jquery related selects plugin by eric hynds, erichynds.com
// re-write of http://github.com/ehynds/jquery-related-selects

(function($){

$.fn.relatedSelects = function( options ){
	
	function RelatedSelect( form, options ){
		var selects = this.selects = [], form = $(form), i = 0;
		
		// build an array of select instances
		$.each(options, function( name ){
			selects[i++] = new Select( name, this, form );
		});
		
		// store obj in form's data cache
		$.data(form, "relatedSelects", this);
		
		return this;
	}
	
	function Select( name, options, form ){
		var elem = document.getElementById( name );
		this.form = form;
		this.element = $(elem);
		this.options = $.extend({}, $.fn.relatedSelects.options, options);
		this.dependencies = [];
		this.satisfied = [];
		
		// let's do this thing
		this._init();
		
		return this;
	}
	
	Select.prototype = {
		_init: function(){
			var self = this,
				opts = self.options,
				depends = opts.depends,
				satisfied = self.satisfied,
				dependencies = self.dependencies;
			
			// build an array of dependencies
			if( typeof depends === "string" && depends.length ){
				dependencies.push( document.getElementById(depends) );
				
			} else if( $.isArray(depends) ){
				dependencies = $.map(depends, function(elem){
					return document.getElementById( elem );
				});
			}
			
			// disable selects that have dependencies
			if( dependencies.length ){
				self.element.attr("disabled","disabled");
			}
			
			// build a loading message
			self.loading = $('<option selected="selected">'+opts.loadingMessage+'</option>');
			
			// listen to the change event on each dependency
			// self obj in here is the elem being updated!
			// "this" is the calling select box
			$(dependencies).bind("change.relatedselects", function(){
				
				// get the relatedselect obj associated with the calling elem
				var obj = $.data(this, "relatedSelect") || {},
					o = $.extend({}, opts, obj.options || {}),
					defaultValue = o.defaultValue,
					index = $.inArray(this.name, satisfied);
				
				// abort the current ajax request if exists
				if( self.xhr ){
					self.xhr.abort();
				}
				
				// selected an option considered to be invalid?
				if( this.value == defaultValue  ){
					satisfied.splice(index, 1);
					
					// reset element
					self.element
						.attr("disabled","disabled")
						.find("option[value="+defaultValue +"]")
						.attr("selected","selected")
						.trigger("change.relatedselects");
					
					// legit values, mark as satisfied
				} else {
					if( index === -1 ){
						satisfied.push( this.name );
					}
				}
				
				// fire onchange callback
				o.onChange.call( self.element, this, dependencies.length-satisfied.length );
				self.options.onDependencyChanged.call( self.element, satisfied, dependencies );
				
				// if this select box is satisfied, run it.
				if( satisfied.length === dependencies.length ){
					self._fetch( this );
				}
			});
		},
		
		// "this" is the select being updated, not the caller
		_fetch: function( caller ){
			var self = this,
				opts = self.options,
				elem = this.element,
				source = opts.source;
			
			// insert loading option
			this.loading.prependTo( elem );
			
			// resolve function sources
			if( $.isFunction(source) ){
				source = source.call( self.form[0] );
			}
			
			// ajax data source
			if( typeof source === "string" ){
				this.xhr = $.ajax({
					url: opts.source,
					dataType: opts.dataType,
					data: self.form.serialize(),
					beforeSend: function(){
						opts.onLoadingStart.call( elem );
					},
					success: function( data ){
						self._populate( data );
					},
					complete: function(){
						self.loading.detach();
						opts.onLoadingEnd.call( elem );
					},
					error: function(){
						opts.onError.call( elem );
					}
				});
				
				// array datasource
			} else if( $.isArray( source ) ){
				self._populate( source );
			}
		},
		
		// data fed from _fetch
		_populate: function( data ){
			var html = [], select = this.element, selected, match;
 
			// if the value returned from the ajax request is valid json and isn't empty
			if( $.isPlainObject(data) && !$.isEmptyObject(data) ){
				
				// build the options
				$.each(data, function(i,item){
					html.push('<option value="'+i+'">' + item + '</option>');
				});
				
			// html datatype
			} else if( typeof data === 'string' && $.trim(data).length ){
				
				html.push($.trim(data));
				
			// array of objects
			} else if( $.isArray(data) && data.length ){
				
				$.each(data, function(i,obj){
					html.push('<option value="'+obj.value+'">' + obj.text + '</option>');
				});
				
			// if the response is invalid/empty, reset the default option
			// and fire the onEmptyResult callback
			} else {
				
				if( !opts.disableIfEmpty ){
					select.removeAttr('disabled');
				}
				
				opts.onEmptyResult.call( select, caller );
			}
			
			// inject new markup
			select
				.find('option:gt(1)') // TODO: change this
				.remove()
				.end()
				.append( html.join('') )
				.removeAttr('disabled');
			
			// look for a data-selected attr and a match
			selected = select.attr('data-selected');
			
			if( selected ){
				match = select.find('option').filter(function(){
					return this.value === selected;
				}).attr('selected','selected');
				
				// only trigger change event if there was a matching value
				if( match.length ){
					select.trigger('change');
				}
			}
			
			// remove the loading message
			this.loading.detach();
		}
	};
	
	return this.each(function(){
		$.data(this, "relatedSelect", this, new RelatedSelect( this, options ));
	});
};

// default options
$.fn.relatedSelects.options = {
	loadingMessage: "Loading...",
	source: null,
	dataType: "json",
	depends: null,
	disableIfEmpty: false,
	defaultValue: "",
	onLoadingStart: $.noop,
	onLoadingEnd: $.noop,
	onDependencyChanged: $.noop,
	onEmptyResult: $.noop,
	onChange: $.noop,
	onError: $.noop
};

// end plugin closure
})(jQuery);