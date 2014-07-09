/*!
 * jQuery JavaScript Library v1.10.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-05-30T21:49Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-05-27
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function() { return 0; },

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied if the test fails
 * @param {Boolean} test The result of a test. If true, null will be set as the handler in leiu of the specified handler
 */
function addHandle( attrs, handler, test ) {
	attrs = attrs.split("|");
	var current,
		i = attrs.length,
		setHandle = test ? null : handler;

	while ( i-- ) {
		// Don't override a user's handler
		if ( !(current = Expr.attrHandle[ attrs[i] ]) || current === handler ) {
			Expr.attrHandle[ attrs[i] ] = setHandle;
		}
	}
}

/**
 * Fetches boolean attributes by node
 * @param {Element} elem
 * @param {String} name
 */
function boolHandler( elem, name ) {
	// XML does not need to be checked as this will not be assigned for XML documents
	var val = elem.getAttributeNode( name );
	return val && val.specified ?
		val.value :
		elem[ name ] === true ? name.toLowerCase() : null;
}

/**
 * Fetches attributes without interpolation
 * http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
 * @param {Element} elem
 * @param {String} name
 */
function interpolationHandler( elem, name ) {
	// XML does not need to be checked as this will not be assigned for XML documents
	return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
}

/**
 * Uses defaultValue to retrieve value in IE6/7
 * @param {Element} elem
 * @param {String} name
 */
function valueHandler( elem ) {
	// Ignore the value *property* on inputs by using defaultValue
	// Fallback to Sizzle.attr by returning undefined where appropriate
	// XML does not need to be checked as this will not be assigned for XML documents
	if ( elem.nodeName.toLowerCase() === "input" ) {
		return elem.defaultValue;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns Returns -1 if a precedes b, 1 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.parentWindow;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	if ( parent && parent.frameElement ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {

		// Support: IE<8
		// Prevent attribute/property "interpolation"
		div.innerHTML = "<a href='#'></a>";
		addHandle( "type|href|height|width", interpolationHandler, div.firstChild.getAttribute("href") === "#" );

		// Support: IE<9
		// Use getAttributeNode to fetch booleans when getAttribute lies
		addHandle( booleans, boolHandler, div.getAttribute("disabled") == null );

		div.className = "i";
		return !div.getAttribute("className");
	});

	// Support: IE<9
	// Retrieving value should defer to defaultValue
	support.input = assert(function( div ) {
		div.innerHTML = "<input>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	});

	// IE6/7 still return empty string for value,
	// but are actually retrieving the property
	addHandle( "value", valueHandler, support.attributes && support.input );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( doc.createElement("div") ) & 1;
	});

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = ( fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined );

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Initialize against the default document
setDocument();

// Support: Chrome<<14
// Always assume duplicates if they aren't passed to the comparison function
[0, 0].sort( sortOrder );
support.detectDuplicates = hasDuplicate;

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/* ========================================================================
 * Bootstrap: affix.js v3.0.3
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: alert.js v3.0.3
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
/* ========================================================================
 * Bootstrap: button.js v3.0.3
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')
    var changed = true

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') === 'radio') {
        // see if clicking on current one
        if ($input.prop('checked') && this.$element.hasClass('active'))
          changed = false
        else
          $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: carousel.js v3.0.3
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: collapse.js v3.0.3
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: dropdown.js v3.0.3
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);
/* ========================================================================
 * Bootstrap: tab.js v3.0.3
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: transition.js v3.0.3
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.3
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: modal.js v3.0.3
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);
/* ========================================================================
 * Bootstrap: tooltip.js v3.0.3
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
/* ========================================================================
 * Bootstrap: popover.js v3.0.3
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);















(function() {
  if (typeof window['CKEDITOR_BASEPATH'] === "undefined" || window['CKEDITOR_BASEPATH'] === null) {
    window['CKEDITOR_BASEPATH'] = "/assets/ckeditor/";
  }
}).call(this);
/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/


(function(){if(window.CKEDITOR&&window.CKEDITOR.dom)return;if(!window.CKEDITOR)window.CKEDITOR=(function(){var a={timestamp:'C6HH5UF',version:'3.6.4',revision:'7575',rnd:Math.floor(Math.random()*900)+100,_:{},status:'unloaded',basePath:(function(){var d=window.CKEDITOR_BASEPATH||'';if(!d){var e=document.getElementsByTagName('script');for(var f=0;f<e.length;f++){var g=e[f].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);if(g){d=g[1];break;}}}if(d.indexOf(':/')==-1)if(d.indexOf('/')===0)d=location.href.match(/^.*?:\/\/[^\/]*/)[0]+d;else d=location.href.match(/^[^\?]*\/(?:)/)[0]+d;if(!d)throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';return d;})(),getUrl:function(d){if(d.indexOf(':/')==-1&&d.indexOf('/')!==0)d=this.basePath+d;if(this.timestamp&&d.charAt(d.length-1)!='/'&&!/[&?]t=/.test(d))d+=(d.indexOf('?')>=0?'&':'?')+'t='+this.timestamp;return d;}},b=window.CKEDITOR_GETURL;if(b){var c=a.getUrl;a.getUrl=function(d){return b.call(a,d)||c.call(a,d);};}return a;})();var a=CKEDITOR;if(!a.event){a.event=function(){};a.event.implementOn=function(b){var c=a.event.prototype;for(var d in c){if(b[d]==undefined)b[d]=c[d];}};a.event.prototype=(function(){var b=function(d){var e=d.getPrivate&&d.getPrivate()||d._||(d._={});return e.events||(e.events={});},c=function(d){this.name=d;this.listeners=[];};c.prototype={getListenerIndex:function(d){for(var e=0,f=this.listeners;e<f.length;e++){if(f[e].fn==d)return e;}return-1;}};return{on:function(d,e,f,g,h){var i=b(this),j=i[d]||(i[d]=new c(d));if(j.getListenerIndex(e)<0){var k=j.listeners;if(!f)f=this;if(isNaN(h))h=10;var l=this,m=function(o,p,q,r){var s={name:d,sender:this,editor:o,data:p,listenerData:g,stop:q,cancel:r,removeListener:function(){l.removeListener(d,e);}};e.call(f,s);return s.data;};m.fn=e;m.priority=h;for(var n=k.length-1;n>=0;n--){if(k[n].priority<=h){k.splice(n+1,0,m);return;}}k.unshift(m);}},fire:(function(){var d=false,e=function(){d=true;},f=false,g=function(){f=true;};return function(h,i,j){var k=b(this)[h],l=d,m=f;d=f=false;if(k){var n=k.listeners;if(n.length){n=n.slice(0);for(var o=0;o<n.length;o++){var p=n[o].call(this,j,i,e,g);if(typeof p!='undefined')i=p;if(d||f)break;}}}var q=f||(typeof i=='undefined'?false:i);d=l;f=m;return q;};})(),fireOnce:function(d,e,f){var g=this.fire(d,e,f);delete b(this)[d];return g;},removeListener:function(d,e){var f=b(this)[d];if(f){var g=f.getListenerIndex(e);
if(g>=0)f.listeners.splice(g,1);}},hasListeners:function(d){var e=b(this)[d];return e&&e.listeners.length>0;}};})();}if(!a.editor){a.ELEMENT_MODE_NONE=0;a.ELEMENT_MODE_REPLACE=1;a.ELEMENT_MODE_APPENDTO=2;a.editor=function(b,c,d,e){var f=this;f._={instanceConfig:b,element:c,data:e};f.elementMode=d||0;a.event.call(f);f._init();};a.editor.replace=function(b,c){var d=b;if(typeof d!='object'){d=document.getElementById(b);if(d&&d.tagName.toLowerCase() in {style:1,script:1,base:1,link:1,meta:1,title:1})d=null;if(!d){var e=0,f=document.getElementsByName(b);while((d=f[e++])&&d.tagName.toLowerCase()!='textarea'){}}if(!d)throw '[CKEDITOR.editor.replace] The element with id or name "'+b+'" was not found.';}d.style.visibility='hidden';return new a.editor(c,d,1);};a.editor.appendTo=function(b,c,d){var e=b;if(typeof e!='object'){e=document.getElementById(b);if(!e)throw '[CKEDITOR.editor.appendTo] The element with id "'+b+'" was not found.';}return new a.editor(c,e,2,d);};a.editor.prototype={_init:function(){var b=a.editor._pending||(a.editor._pending=[]);b.push(this);},fire:function(b,c){return a.event.prototype.fire.call(this,b,c,this);},fireOnce:function(b,c){return a.event.prototype.fireOnce.call(this,b,c,this);}};a.event.implementOn(a.editor.prototype,true);}if(!a.env)a.env=(function(){var b=navigator.userAgent.toLowerCase(),c=window.opera,d={ie:/*@cc_on!@*/false,opera:!!c&&c.version,webkit:b.indexOf(' applewebkit/')>-1,air:b.indexOf(' adobeair/')>-1,mac:b.indexOf('macintosh')>-1,quirks:document.compatMode=='BackCompat',mobile:b.indexOf('mobile')>-1,iOS:/(ipad|iphone|ipod)/.test(b),isCustomDomain:function(){if(!this.ie)return false;var g=document.domain,h=window.location.hostname;return g!=h&&g!='['+h+']';},secure:location.protocol=='https:'};d.gecko=navigator.product=='Gecko'&&!d.webkit&&!d.opera;var e=0;if(d.ie){e=parseFloat(b.match(/msie (\d+)/)[1]);d.ie8=!!document.documentMode;d.ie8Compat=document.documentMode==8;d.ie9Compat=document.documentMode==9;d.ie7Compat=e==7&&!document.documentMode||document.documentMode==7;d.ie6Compat=e<7||d.quirks;}if(d.gecko){var f=b.match(/rv:([\d\.]+)/);if(f){f=f[1].split('.');e=f[0]*10000+(f[1]||0)*100+ +(f[2]||0);}}if(d.opera)e=parseFloat(c.version());if(d.air)e=parseFloat(b.match(/ adobeair\/(\d+)/)[1]);if(d.webkit)e=parseFloat(b.match(/ applewebkit\/(\d+)/)[1]);d.version=e;d.isCompatible=d.iOS&&e>=534||!d.mobile&&(d.ie&&e>=6||d.gecko&&e>=10801||d.opera&&e>=9.5||d.air&&e>=1||d.webkit&&e>=522||false);d.cssClass='cke_browser_'+(d.ie?'ie':d.gecko?'gecko':d.opera?'opera':d.webkit?'webkit':'unknown');
if(d.quirks)d.cssClass+=' cke_browser_quirks';if(d.ie){d.cssClass+=' cke_browser_ie'+(d.version<7?'6':d.version>=8?document.documentMode:'7');if(d.quirks)d.cssClass+=' cke_browser_iequirks';}if(d.gecko&&e<10900)d.cssClass+=' cke_browser_gecko18';if(d.air)d.cssClass+=' cke_browser_air';return d;})();var b=a.env;var c=b.ie;if(a.status=='unloaded')(function(){a.event.implementOn(a);a.loadFullCore=function(){if(a.status!='basic_ready'){a.loadFullCore._load=1;return;}delete a.loadFullCore;var e=document.createElement('script');e.type='text/javascript';e.src=a.basePath+'ckeditor.js';document.getElementsByTagName('head')[0].appendChild(e);};a.loadFullCoreTimeout=0;a.replaceClass='ckeditor';a.replaceByClassEnabled=1;var d=function(e,f,g,h){if(b.isCompatible){if(a.loadFullCore)a.loadFullCore();var i=g(e,f,h);a.add(i);return i;}return null;};a.replace=function(e,f){return d(e,f,a.editor.replace);};a.appendTo=function(e,f,g){return d(e,f,a.editor.appendTo,g);};a.add=function(e){var f=this._.pending||(this._.pending=[]);f.push(e);};a.replaceAll=function(){var e=document.getElementsByTagName('textarea');for(var f=0;f<e.length;f++){var g=null,h=e[f];if(!h.name&&!h.id)continue;if(typeof arguments[0]=='string'){var i=new RegExp('(?:^|\\s)'+arguments[0]+'(?:$|\\s)');if(!i.test(h.className))continue;}else if(typeof arguments[0]=='function'){g={};if(arguments[0](h,g)===false)continue;}this.replace(h,g);}};(function(){var e=function(){var f=a.loadFullCore,g=a.loadFullCoreTimeout;if(a.replaceByClassEnabled)a.replaceAll(a.replaceClass);a.status='basic_ready';if(f&&f._load)f();else if(g)setTimeout(function(){if(a.loadFullCore)a.loadFullCore();},g*1000);};if(window.addEventListener)window.addEventListener('load',e,false);else if(window.attachEvent)window.attachEvent('onload',e);})();a.status='basic_loaded';})();a.dom={};var d=a.dom;(function(){var e=[];a.on('reset',function(){e=[];});a.tools={arrayCompare:function(f,g){if(!f&&!g)return true;if(!f||!g||f.length!=g.length)return false;for(var h=0;h<f.length;h++){if(f[h]!=g[h])return false;}return true;},clone:function(f){var g;if(f&&f instanceof Array){g=[];for(var h=0;h<f.length;h++)g[h]=this.clone(f[h]);return g;}if(f===null||typeof f!='object'||f instanceof String||f instanceof Number||f instanceof Boolean||f instanceof Date||f instanceof RegExp)return f;g=new f.constructor();for(var i in f){var j=f[i];g[i]=this.clone(j);}return g;},capitalize:function(f){return f.charAt(0).toUpperCase()+f.substring(1).toLowerCase();},extend:function(f){var g=arguments.length,h,i;
if(typeof (h=arguments[g-1])=='boolean')g--;else if(typeof (h=arguments[g-2])=='boolean'){i=arguments[g-1];g-=2;}for(var j=1;j<g;j++){var k=arguments[j];for(var l in k){if(h===true||f[l]==undefined)if(!i||l in i)f[l]=k[l];}}return f;},prototypedCopy:function(f){var g=function(){};g.prototype=f;return new g();},isArray:function(f){return!!f&&f instanceof Array;},isEmpty:function(f){for(var g in f){if(f.hasOwnProperty(g))return false;}return true;},cssStyleToDomStyle:(function(){var f=document.createElement('div').style,g=typeof f.cssFloat!='undefined'?'cssFloat':typeof f.styleFloat!='undefined'?'styleFloat':'float';return function(h){if(h=='float')return g;else return h.replace(/-./g,function(i){return i.substr(1).toUpperCase();});};})(),buildStyleHtml:function(f){f=[].concat(f);var g,h=[];for(var i=0;i<f.length;i++){g=f[i];if(/@import|[{}]/.test(g))h.push('<style>'+g+'</style>');else h.push('<link type="text/css" rel=stylesheet href="'+g+'">');}return h.join('');},htmlEncode:function(f){var g=function(k){var l=new d.element('span');l.setText(k);return l.getHtml();},h=g('\n').toLowerCase()=='<br>'?function(k){return g(k).replace(/<br>/gi,'\n');}:g,i=g('>')=='>'?function(k){return h(k).replace(/>/g,'&gt;');}:h,j=g('  ')=='&nbsp; '?function(k){return i(k).replace(/&nbsp;/g,' ');}:i;this.htmlEncode=j;return this.htmlEncode(f);},htmlEncodeAttr:function(f){return f.replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');},getNextNumber:(function(){var f=0;return function(){return++f;};})(),getNextId:function(){return 'cke_'+this.getNextNumber();},override:function(f,g){return g(f);},setTimeout:function(f,g,h,i,j){if(!j)j=window;if(!h)h=j;return j.setTimeout(function(){if(i)f.apply(h,[].concat(i));else f.apply(h);},g||0);},trim:(function(){var f=/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;return function(g){return g.replace(f,'');};})(),ltrim:(function(){var f=/^[ \t\n\r]+/g;return function(g){return g.replace(f,'');};})(),rtrim:(function(){var f=/[ \t\n\r]+$/g;return function(g){return g.replace(f,'');};})(),indexOf:Array.prototype.indexOf?function(f,g){return f.indexOf(g);}:function(f,g){for(var h=0,i=f.length;h<i;h++){if(f[h]===g)return h;}return-1;},bind:function(f,g){return function(){return f.apply(g,arguments);};},createClass:function(f){var g=f.$,h=f.base,i=f.privates||f._,j=f.proto,k=f.statics;if(i){var l=g;g=function(){var p=this;var m=p._||(p._={});for(var n in i){var o=i[n];m[n]=typeof o=='function'?a.tools.bind(o,p):o;}l.apply(p,arguments);};}if(h){g.prototype=this.prototypedCopy(h.prototype);
g.prototype['constructor']=g;g.prototype.base=function(){this.base=h.prototype.base;h.apply(this,arguments);this.base=arguments.callee;};}if(j)this.extend(g.prototype,j,true);if(k)this.extend(g,k,true);return g;},addFunction:function(f,g){return e.push(function(){return f.apply(g||this,arguments);})-1;},removeFunction:function(f){e[f]=null;},callFunction:function(f){var g=e[f];return g&&g.apply(window,Array.prototype.slice.call(arguments,1));},cssLength:(function(){return function(f){return f+(!f||isNaN(Number(f))?'':'px');};})(),convertToPx:(function(){var f;return function(g){if(!f){f=d.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>',a.document);a.document.getBody().append(f);}if(!/%$/.test(g)){f.setStyle('width',g);return f.$.clientWidth;}return g;};})(),repeat:function(f,g){return new Array(g+1).join(f);},tryThese:function(){var f;for(var g=0,h=arguments.length;g<h;g++){var i=arguments[g];try{f=i();break;}catch(j){}}return f;},genKey:function(){return Array.prototype.slice.call(arguments).join('-');}};})();var e=a.tools;a.dtd=(function(){var f=e.extend,g={isindex:1,fieldset:1},h={input:1,button:1,select:1,textarea:1,label:1},i=f({a:1},h),j=f({iframe:1},i),k={hr:1,ul:1,menu:1,div:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,mark:1,time:1,meter:1,command:1,keygen:1,output:1,progress:1,audio:1,video:1,details:1,datagrid:1,datalist:1,blockquote:1,noscript:1,table:1,center:1,address:1,dir:1,pre:1,h5:1,dl:1,h4:1,noframes:1,h6:1,ol:1,h1:1,h3:1,h2:1},l={ins:1,del:1,script:1,style:1},m=f({b:1,acronym:1,bdo:1,'var':1,'#':1,abbr:1,code:1,br:1,i:1,cite:1,kbd:1,u:1,strike:1,s:1,tt:1,strong:1,q:1,samp:1,em:1,dfn:1,span:1,wbr:1},l),n=f({sub:1,img:1,object:1,sup:1,basefont:1,map:1,applet:1,font:1,big:1,small:1,mark:1},m),o=f({p:1},n),p=f({iframe:1},n,h),q={img:1,noscript:1,br:1,kbd:1,center:1,button:1,basefont:1,h5:1,h4:1,samp:1,h6:1,ol:1,h1:1,h3:1,h2:1,form:1,font:1,'#':1,select:1,menu:1,ins:1,abbr:1,label:1,code:1,table:1,script:1,cite:1,input:1,iframe:1,strong:1,textarea:1,noframes:1,big:1,small:1,span:1,hr:1,sub:1,bdo:1,'var':1,div:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,mark:1,time:1,meter:1,menu:1,command:1,keygen:1,output:1,progress:1,audio:1,video:1,details:1,datagrid:1,datalist:1,object:1,sup:1,strike:1,dir:1,map:1,dl:1,applet:1,del:1,isindex:1,fieldset:1,ul:1,b:1,acronym:1,a:1,blockquote:1,i:1,u:1,s:1,tt:1,address:1,q:1,pre:1,p:1,em:1,dfn:1},r=f({a:1},p),s={tr:1},t={'#':1},u=f({param:1},q),v=f({form:1},g,j,k,o),w={li:1},x={style:1,script:1},y={base:1,link:1,meta:1,title:1},z=f(y,x),A={head:1,body:1},B={html:1},C={address:1,blockquote:1,center:1,dir:1,div:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,time:1,meter:1,menu:1,command:1,keygen:1,output:1,progress:1,audio:1,video:1,details:1,datagrid:1,datalist:1,dl:1,fieldset:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,hr:1,isindex:1,noframes:1,ol:1,p:1,pre:1,table:1,ul:1};
return{$nonBodyContent:f(B,A,y),$block:C,$blockLimit:{body:1,div:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,time:1,meter:1,menu:1,command:1,keygen:1,output:1,progress:1,audio:1,video:1,details:1,datagrid:1,datalist:1,td:1,th:1,caption:1,form:1},$inline:r,$body:f({script:1,style:1},C),$cdata:{script:1,style:1},$empty:{area:1,base:1,br:1,col:1,hr:1,img:1,input:1,link:1,meta:1,param:1,wbr:1},$listItem:{dd:1,dt:1,li:1},$list:{ul:1,ol:1,dl:1},$nonEditable:{applet:1,button:1,embed:1,iframe:1,map:1,object:1,option:1,script:1,textarea:1,param:1,audio:1,video:1},$captionBlock:{caption:1,legend:1},$removeEmpty:{abbr:1,acronym:1,address:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,s:1,samp:1,small:1,span:1,strike:1,strong:1,sub:1,sup:1,tt:1,u:1,'var':1,mark:1},$tabIndex:{a:1,area:1,button:1,input:1,object:1,select:1,textarea:1},$tableContent:{caption:1,col:1,colgroup:1,tbody:1,td:1,tfoot:1,th:1,thead:1,tr:1},html:A,head:z,style:t,script:t,body:v,base:{},link:{},meta:{},title:t,col:{},tr:{td:1,th:1},img:{},colgroup:{col:1},noscript:v,td:v,br:{},wbr:{},th:v,center:v,kbd:r,button:f(o,k),basefont:{},h5:r,h4:r,samp:r,h6:r,ol:w,h1:r,h3:r,option:t,h2:r,form:f(g,j,k,o),select:{optgroup:1,option:1},font:r,ins:r,menu:w,abbr:r,label:r,table:{thead:1,col:1,tbody:1,tr:1,colgroup:1,caption:1,tfoot:1},code:r,tfoot:s,cite:r,li:v,input:{},iframe:v,strong:r,textarea:t,noframes:v,big:r,small:r,span:r,hr:{},dt:r,sub:r,optgroup:{option:1},param:{},bdo:r,'var':r,div:v,object:u,sup:r,dd:v,strike:r,area:{},dir:w,map:f({area:1,form:1,p:1},g,l,k),applet:u,dl:{dt:1,dd:1},del:r,isindex:{},fieldset:f({legend:1},q),thead:s,ul:w,acronym:r,b:r,a:p,blockquote:v,caption:r,i:r,u:r,tbody:s,s:r,address:f(j,o),tt:r,legend:r,q:r,pre:f(m,i),p:r,em:r,dfn:r,section:v,header:v,footer:v,nav:v,article:v,aside:v,figure:v,dialog:v,hgroup:v,mark:r,time:r,meter:r,menu:r,command:r,keygen:r,output:r,progress:u,audio:u,video:u,details:u,datagrid:u,datalist:u};})();var f=a.dtd;d.event=function(g){this.$=g;};d.event.prototype={getKey:function(){return this.$.keyCode||this.$.which;},getKeystroke:function(){var h=this;var g=h.getKey();if(h.$.ctrlKey||h.$.metaKey)g+=1114112;if(h.$.shiftKey)g+=2228224;if(h.$.altKey)g+=4456448;return g;},preventDefault:function(g){var h=this.$;if(h.preventDefault)h.preventDefault();else h.returnValue=false;if(g)this.stopPropagation();},stopPropagation:function(){var g=this.$;if(g.stopPropagation)g.stopPropagation();else g.cancelBubble=true;
},getTarget:function(){var g=this.$.target||this.$.srcElement;return g?new d.node(g):null;}};a.CTRL=1114112;a.SHIFT=2228224;a.ALT=4456448;d.domObject=function(g){if(g)this.$=g;};d.domObject.prototype=(function(){var g=function(h,i){return function(j){if(typeof a!='undefined')h.fire(i,new d.event(j));};};return{getPrivate:function(){var h;if(!(h=this.getCustomData('_')))this.setCustomData('_',h={});return h;},on:function(h){var k=this;var i=k.getCustomData('_cke_nativeListeners');if(!i){i={};k.setCustomData('_cke_nativeListeners',i);}if(!i[h]){var j=i[h]=g(k,h);if(k.$.addEventListener)k.$.addEventListener(h,j,!!a.event.useCapture);else if(k.$.attachEvent)k.$.attachEvent('on'+h,j);}return a.event.prototype.on.apply(k,arguments);},removeListener:function(h){var k=this;a.event.prototype.removeListener.apply(k,arguments);if(!k.hasListeners(h)){var i=k.getCustomData('_cke_nativeListeners'),j=i&&i[h];if(j){if(k.$.removeEventListener)k.$.removeEventListener(h,j,false);else if(k.$.detachEvent)k.$.detachEvent('on'+h,j);delete i[h];}}},removeAllListeners:function(){var k=this;var h=k.getCustomData('_cke_nativeListeners');for(var i in h){var j=h[i];if(k.$.detachEvent)k.$.detachEvent('on'+i,j);else if(k.$.removeEventListener)k.$.removeEventListener(i,j,false);delete h[i];}}};})();(function(g){var h={};a.on('reset',function(){h={};});g.equals=function(i){return i&&i.$===this.$;};g.setCustomData=function(i,j){var k=this.getUniqueId(),l=h[k]||(h[k]={});l[i]=j;return this;};g.getCustomData=function(i){var j=this.$['data-cke-expando'],k=j&&h[j];return k&&k[i];};g.removeCustomData=function(i){var j=this.$['data-cke-expando'],k=j&&h[j],l=k&&k[i];if(typeof l!='undefined')delete k[i];return l||null;};g.clearCustomData=function(){this.removeAllListeners();var i=this.$['data-cke-expando'];i&&delete h[i];};g.getUniqueId=function(){return this.$['data-cke-expando']||(this.$['data-cke-expando']=e.getNextNumber());};a.event.implementOn(g);})(d.domObject.prototype);d.window=function(g){d.domObject.call(this,g);};d.window.prototype=new d.domObject();e.extend(d.window.prototype,{focus:function(){if(b.webkit&&this.$.parent)this.$.parent.focus();this.$.focus();},getViewPaneSize:function(){var g=this.$.document,h=g.compatMode=='CSS1Compat';return{width:(h?g.documentElement.clientWidth:g.body.clientWidth)||0,height:(h?g.documentElement.clientHeight:g.body.clientHeight)||0};},getScrollPosition:function(){var g=this.$;if('pageXOffset' in g)return{x:g.pageXOffset||0,y:g.pageYOffset||0};else{var h=g.document;
return{x:h.documentElement.scrollLeft||h.body.scrollLeft||0,y:h.documentElement.scrollTop||h.body.scrollTop||0};}}});d.document=function(g){d.domObject.call(this,g);};var g=d.document;g.prototype=new d.domObject();e.extend(g.prototype,{appendStyleSheet:function(h){if(this.$.createStyleSheet)this.$.createStyleSheet(h);else{var i=new d.element('link');i.setAttributes({rel:'stylesheet',type:'text/css',href:h});this.getHead().append(i);}},appendStyleText:function(h){var k=this;if(k.$.createStyleSheet){var i=k.$.createStyleSheet('');i.cssText=h;}else{var j=new d.element('style',k);j.append(new d.text(h,k));k.getHead().append(j);}},createElement:function(h,i){var j=new d.element(h,this);if(i){if(i.attributes)j.setAttributes(i.attributes);if(i.styles)j.setStyles(i.styles);}return j;},createText:function(h){return new d.text(h,this);},focus:function(){this.getWindow().focus();},getById:function(h){var i=this.$.getElementById(h);return i?new d.element(i):null;},getByAddress:function(h,i){var j=this.$.documentElement;for(var k=0;j&&k<h.length;k++){var l=h[k];if(!i){j=j.childNodes[l];continue;}var m=-1;for(var n=0;n<j.childNodes.length;n++){var o=j.childNodes[n];if(i===true&&o.nodeType==3&&o.previousSibling&&o.previousSibling.nodeType==3)continue;m++;if(m==l){j=o;break;}}}return j?new d.node(j):null;},getElementsByTag:function(h,i){if(!(c&&!(document.documentMode>8))&&i)h=i+':'+h;return new d.nodeList(this.$.getElementsByTagName(h));},getHead:function(){var h=this.$.getElementsByTagName('head')[0];if(!h)h=this.getDocumentElement().append(new d.element('head'),true);else h=new d.element(h);return(this.getHead=function(){return h;})();},getBody:function(){var h=new d.element(this.$.body);return(this.getBody=function(){return h;})();},getDocumentElement:function(){var h=new d.element(this.$.documentElement);return(this.getDocumentElement=function(){return h;})();},getWindow:function(){var h=new d.window(this.$.parentWindow||this.$.defaultView);return(this.getWindow=function(){return h;})();},write:function(h){var i=this;i.$.open('text/html','replace');b.isCustomDomain()&&(i.$.domain=document.domain);i.$.write(h);i.$.close();}});d.node=function(h){if(h){var i=h.nodeType==9?'document':h.nodeType==1?'element':h.nodeType==3?'text':h.nodeType==8?'comment':'domObject';return new d[i](h);}return this;};d.node.prototype=new d.domObject();a.NODE_ELEMENT=1;a.NODE_DOCUMENT=9;a.NODE_TEXT=3;a.NODE_COMMENT=8;a.NODE_DOCUMENT_FRAGMENT=11;a.POSITION_IDENTICAL=0;a.POSITION_DISCONNECTED=1;
a.POSITION_FOLLOWING=2;a.POSITION_PRECEDING=4;a.POSITION_IS_CONTAINED=8;a.POSITION_CONTAINS=16;e.extend(d.node.prototype,{appendTo:function(h,i){h.append(this,i);return h;},clone:function(h,i){var j=this.$.cloneNode(h),k=function(l){if(l.nodeType!=1)return;if(!i)l.removeAttribute('id',false);l.removeAttribute('data-cke-expando',false);if(h){var m=l.childNodes;for(var n=0;n<m.length;n++)k(m[n]);}};k(j);return new d.node(j);},hasPrevious:function(){return!!this.$.previousSibling;},hasNext:function(){return!!this.$.nextSibling;},insertAfter:function(h){h.$.parentNode.insertBefore(this.$,h.$.nextSibling);return h;},insertBefore:function(h){h.$.parentNode.insertBefore(this.$,h.$);return h;},insertBeforeMe:function(h){this.$.parentNode.insertBefore(h.$,this.$);return h;},getAddress:function(h){var i=[],j=this.getDocument().$.documentElement,k=this.$;while(k&&k!=j){var l=k.parentNode;if(l)i.unshift(this.getIndex.call({$:k},h));k=l;}return i;},getDocument:function(){return new g(this.$.ownerDocument||this.$.parentNode.ownerDocument);},getIndex:function(h){var i=this.$,j=0;while(i=i.previousSibling){if(h&&i.nodeType==3&&(!i.nodeValue.length||i.previousSibling&&i.previousSibling.nodeType==3))continue;j++;}return j;},getNextSourceNode:function(h,i,j){if(j&&!j.call){var k=j;j=function(n){return!n.equals(k);};}var l=!h&&this.getFirst&&this.getFirst(),m;if(!l){if(this.type==1&&j&&j(this,true)===false)return null;l=this.getNext();}while(!l&&(m=(m||this).getParent())){if(j&&j(m,true)===false)return null;l=m.getNext();}if(!l)return null;if(j&&j(l)===false)return null;if(i&&i!=l.type)return l.getNextSourceNode(false,i,j);return l;},getPreviousSourceNode:function(h,i,j){if(j&&!j.call){var k=j;j=function(n){return!n.equals(k);};}var l=!h&&this.getLast&&this.getLast(),m;if(!l){if(this.type==1&&j&&j(this,true)===false)return null;l=this.getPrevious();}while(!l&&(m=(m||this).getParent())){if(j&&j(m,true)===false)return null;l=m.getPrevious();}if(!l)return null;if(j&&j(l)===false)return null;if(i&&l.type!=i)return l.getPreviousSourceNode(false,i,j);return l;},getPrevious:function(h){var i=this.$,j;do{i=i.previousSibling;j=i&&i.nodeType!=10&&new d.node(i);}while(j&&h&&!h(j));return j;},getNext:function(h){var i=this.$,j;do{i=i.nextSibling;j=i&&new d.node(i);}while(j&&h&&!h(j));return j;},getParent:function(){var h=this.$.parentNode;return h&&h.nodeType==1?new d.node(h):null;},getParents:function(h){var i=this,j=[];do j[h?'push':'unshift'](i);while(i=i.getParent());return j;},getCommonAncestor:function(h){var j=this;
if(h.equals(j))return j;if(h.contains&&h.contains(j))return h;var i=j.contains?j:j.getParent();do{if(i.contains(h))return i;}while(i=i.getParent());return null;},getPosition:function(h){var i=this.$,j=h.$;if(i.compareDocumentPosition)return i.compareDocumentPosition(j);if(i==j)return 0;if(this.type==1&&h.type==1){if(i.contains){if(i.contains(j))return 16+4;if(j.contains(i))return 8+2;}if('sourceIndex' in i)return i.sourceIndex<0||j.sourceIndex<0?1:i.sourceIndex<j.sourceIndex?4:2;}var k=this.getAddress(),l=h.getAddress(),m=Math.min(k.length,l.length);for(var n=0;n<=m-1;n++){if(k[n]!=l[n]){if(n<m)return k[n]<l[n]?4:2;break;}}return k.length<l.length?16+4:8+2;},getAscendant:function(h,i){var j=this.$,k;if(!i)j=j.parentNode;while(j){if(j.nodeName&&(k=j.nodeName.toLowerCase(),typeof h=='string'?k==h:k in h))return new d.node(j);j=j.parentNode;}return null;},hasAscendant:function(h,i){var j=this.$;if(!i)j=j.parentNode;while(j){if(j.nodeName&&j.nodeName.toLowerCase()==h)return true;j=j.parentNode;}return false;},move:function(h,i){h.append(this.remove(),i);},remove:function(h){var i=this.$,j=i.parentNode;if(j){if(h)for(var k;k=i.firstChild;)j.insertBefore(i.removeChild(k),i);j.removeChild(i);}return this;},replace:function(h){this.insertBefore(h);h.remove();},trim:function(){this.ltrim();this.rtrim();},ltrim:function(){var k=this;var h;while(k.getFirst&&(h=k.getFirst())){if(h.type==3){var i=e.ltrim(h.getText()),j=h.getLength();if(!i){h.remove();continue;}else if(i.length<j){h.split(j-i.length);k.$.removeChild(k.$.firstChild);}}break;}},rtrim:function(){var k=this;var h;while(k.getLast&&(h=k.getLast())){if(h.type==3){var i=e.rtrim(h.getText()),j=h.getLength();if(!i){h.remove();continue;}else if(i.length<j){h.split(i.length);k.$.lastChild.parentNode.removeChild(k.$.lastChild);}}break;}if(!c&&!b.opera){h=k.$.lastChild;if(h&&h.type==1&&h.nodeName.toLowerCase()=='br')h.parentNode.removeChild(h);}},isReadOnly:function(){var h=this;if(this.type!=1)h=this.getParent();if(h&&typeof h.$.isContentEditable!='undefined')return!(h.$.isContentEditable||h.data('cke-editable'));else{var i=h;while(i){if(i.is('body')||!!i.data('cke-editable'))break;if(i.getAttribute('contentEditable')=='false')return true;else if(i.getAttribute('contentEditable')=='true')break;i=i.getParent();}return false;}}});d.nodeList=function(h){this.$=h;};d.nodeList.prototype={count:function(){return this.$.length;},getItem:function(h){var i=this.$[h];return i?new d.node(i):null;}};d.element=function(h,i){if(typeof h=='string')h=(i?i.$:document).createElement(h);
d.domObject.call(this,h);};var h=d.element;h.get=function(i){return i&&(i.$?i:new h(i));};h.prototype=new d.node();h.createFromHtml=function(i,j){var k=new h('div',j);k.setHtml(i);return k.getFirst().remove();};h.setMarker=function(i,j,k,l){var m=j.getCustomData('list_marker_id')||j.setCustomData('list_marker_id',e.getNextNumber()).getCustomData('list_marker_id'),n=j.getCustomData('list_marker_names')||j.setCustomData('list_marker_names',{}).getCustomData('list_marker_names');i[m]=j;n[k]=1;return j.setCustomData(k,l);};h.clearAllMarkers=function(i){for(var j in i)h.clearMarkers(i,i[j],1);};h.clearMarkers=function(i,j,k){var l=j.getCustomData('list_marker_names'),m=j.getCustomData('list_marker_id');for(var n in l)j.removeCustomData(n);j.removeCustomData('list_marker_names');if(k){j.removeCustomData('list_marker_id');delete i[m];}};e.extend(h.prototype,{type:1,addClass:function(i){var j=this.$.className;if(j){var k=new RegExp('(?:^|\\s)'+i+'(?:\\s|$)','');if(!k.test(j))j+=' '+i;}this.$.className=j||i;},removeClass:function(i){var j=this.getAttribute('class');if(j){var k=new RegExp('(?:^|\\s+)'+i+'(?=\\s|$)','i');if(k.test(j)){j=j.replace(k,'').replace(/^\s+/,'');if(j)this.setAttribute('class',j);else this.removeAttribute('class');}}},hasClass:function(i){var j=new RegExp('(?:^|\\s+)'+i+'(?=\\s|$)','');return j.test(this.getAttribute('class'));},append:function(i,j){var k=this;if(typeof i=='string')i=k.getDocument().createElement(i);if(j)k.$.insertBefore(i.$,k.$.firstChild);else k.$.appendChild(i.$);return i;},appendHtml:function(i){var k=this;if(!k.$.childNodes.length)k.setHtml(i);else{var j=new h('div',k.getDocument());j.setHtml(i);j.moveChildren(k);}},appendText:function(i){if(this.$.text!=undefined)this.$.text+=i;else this.append(new d.text(i));},appendBogus:function(){var k=this;var i=k.getLast();while(i&&i.type==3&&!e.rtrim(i.getText()))i=i.getPrevious();if(!i||!i.is||!i.is('br')){var j=b.opera?k.getDocument().createText(''):k.getDocument().createElement('br');b.gecko&&j.setAttribute('type','_moz');k.append(j);}},breakParent:function(i){var l=this;var j=new d.range(l.getDocument());j.setStartAfter(l);j.setEndAfter(i);var k=j.extractContents();j.insertNode(l.remove());k.insertAfterNode(l);},contains:c||b.webkit?function(i){var j=this.$;return i.type!=1?j.contains(i.getParent().$):j!=i.$&&j.contains(i.$);}:function(i){return!!(this.$.compareDocumentPosition(i.$)&16);},focus:(function(){function i(){try{this.$.focus();}catch(j){}};return function(j){if(j)e.setTimeout(i,100,this);
else i.call(this);};})(),getHtml:function(){var i=this.$.innerHTML;return c?i.replace(/<\?[^>]*>/g,''):i;},getOuterHtml:function(){var j=this;if(j.$.outerHTML)return j.$.outerHTML.replace(/<\?[^>]*>/,'');var i=j.$.ownerDocument.createElement('div');i.appendChild(j.$.cloneNode(true));return i.innerHTML;},setHtml:function(i){return this.$.innerHTML=i;},setText:function(i){h.prototype.setText=this.$.innerText!=undefined?function(j){return this.$.innerText=j;}:function(j){return this.$.textContent=j;};return this.setText(i);},getAttribute:(function(){var i=function(j){return this.$.getAttribute(j,2);};if(c&&(b.ie7Compat||b.ie6Compat))return function(j){var n=this;switch(j){case 'class':j='className';break;case 'http-equiv':j='httpEquiv';break;case 'name':return n.$.name;case 'tabindex':var k=i.call(n,j);if(k!==0&&n.$.tabIndex===0)k=null;return k;break;case 'checked':var l=n.$.attributes.getNamedItem(j),m=l.specified?l.nodeValue:n.$.checked;return m?'checked':null;case 'hspace':case 'value':return n.$[j];case 'style':return n.$.style.cssText;case 'contenteditable':case 'contentEditable':return n.$.attributes.getNamedItem('contentEditable').specified?n.$.getAttribute('contentEditable'):null;}return i.call(n,j);};else return i;})(),getChildren:function(){return new d.nodeList(this.$.childNodes);},getComputedStyle:c?function(i){return this.$.currentStyle[e.cssStyleToDomStyle(i)];}:function(i){return this.getWindow().$.getComputedStyle(this.$,'').getPropertyValue(i);},getDtd:function(){var i=f[this.getName()];this.getDtd=function(){return i;};return i;},getElementsByTag:g.prototype.getElementsByTag,getTabIndex:c?function(){var i=this.$.tabIndex;if(i===0&&!f.$tabIndex[this.getName()]&&parseInt(this.getAttribute('tabindex'),10)!==0)i=-1;return i;}:b.webkit?function(){var i=this.$.tabIndex;if(i==undefined){i=parseInt(this.getAttribute('tabindex'),10);if(isNaN(i))i=-1;}return i;}:function(){return this.$.tabIndex;},getText:function(){return this.$.textContent||this.$.innerText||'';},getWindow:function(){return this.getDocument().getWindow();},getId:function(){return this.$.id||null;},getNameAtt:function(){return this.$.name||null;},getName:function(){var i=this.$.nodeName.toLowerCase();if(c&&!(document.documentMode>8)){var j=this.$.scopeName;if(j!='HTML')i=j.toLowerCase()+':'+i;}return(this.getName=function(){return i;})();},getValue:function(){return this.$.value;},getFirst:function(i){var j=this.$.firstChild,k=j&&new d.node(j);if(k&&i&&!i(k))k=k.getNext(i);return k;},getLast:function(i){var j=this.$.lastChild,k=j&&new d.node(j);
if(k&&i&&!i(k))k=k.getPrevious(i);return k;},getStyle:function(i){return this.$.style[e.cssStyleToDomStyle(i)];},is:function(){var i=this.getName();for(var j=0;j<arguments.length;j++){if(arguments[j]==i)return true;}return false;},isEditable:function(i){var l=this;var j=l.getName();if(l.isReadOnly()||l.getComputedStyle('display')=='none'||l.getComputedStyle('visibility')=='hidden'||l.is('a')&&l.data('cke-saved-name')&&!l.getChildCount()||f.$nonEditable[j]||f.$empty[j])return false;if(i!==false){var k=f[j]||f.span;return k&&k['#'];}return true;},isIdentical:function(i){if(this.getName()!=i.getName())return false;var j=this.$.attributes,k=i.$.attributes,l=j.length,m=k.length;for(var n=0;n<l;n++){var o=j[n];if(o.nodeName=='_moz_dirty')continue;if((!c||o.specified&&o.nodeName!='data-cke-expando')&&o.nodeValue!=i.getAttribute(o.nodeName))return false;}if(c)for(n=0;n<m;n++){o=k[n];if(o.specified&&o.nodeName!='data-cke-expando'&&o.nodeValue!=this.getAttribute(o.nodeName))return false;}return true;},isVisible:function(){var l=this;var i=(l.$.offsetHeight||l.$.offsetWidth)&&l.getComputedStyle('visibility')!='hidden',j,k;if(i&&(b.webkit||b.opera)){j=l.getWindow();if(!j.equals(a.document.getWindow())&&(k=j.$.frameElement))i=new h(k).isVisible();}return!!i;},isEmptyInlineRemoveable:function(){if(!f.$removeEmpty[this.getName()])return false;var i=this.getChildren();for(var j=0,k=i.count();j<k;j++){var l=i.getItem(j);if(l.type==1&&l.data('cke-bookmark'))continue;if(l.type==1&&!l.isEmptyInlineRemoveable()||l.type==3&&e.trim(l.getText()))return false;}return true;},hasAttributes:c&&(b.ie7Compat||b.ie6Compat)?function(){var i=this.$.attributes;for(var j=0;j<i.length;j++){var k=i[j];switch(k.nodeName){case 'class':if(this.getAttribute('class'))return true;case 'data-cke-expando':continue;default:if(k.specified)return true;}}return false;}:function(){var i=this.$.attributes,j=i.length,k={'data-cke-expando':1,_moz_dirty:1};return j>0&&(j>2||!k[i[0].nodeName]||j==2&&!k[i[1].nodeName]);},hasAttribute:(function(){function i(j){var k=this.$.attributes.getNamedItem(j);return!!(k&&k.specified);};return c&&b.version<8?function(j){if(j=='name')return!!this.$.name;return i.call(this,j);}:i;})(),hide:function(){this.setStyle('display','none');},moveChildren:function(i,j){var k=this.$;i=i.$;if(k==i)return;var l;if(j)while(l=k.lastChild)i.insertBefore(k.removeChild(l),i.firstChild);else while(l=k.firstChild)i.appendChild(k.removeChild(l));},mergeSiblings:(function(){function i(j,k,l){if(k&&k.type==1){var m=[];
while(k.data('cke-bookmark')||k.isEmptyInlineRemoveable()){m.push(k);k=l?k.getNext():k.getPrevious();if(!k||k.type!=1)return;}if(j.isIdentical(k)){var n=l?j.getLast():j.getFirst();while(m.length)m.shift().move(j,!l);k.moveChildren(j,!l);k.remove();if(n&&n.type==1)n.mergeSiblings();}}};return function(j){var k=this;if(!(j===false||f.$removeEmpty[k.getName()]||k.is('a')))return;i(k,k.getNext(),true);i(k,k.getPrevious());};})(),show:function(){this.setStyles({display:'',visibility:''});},setAttribute:(function(){var i=function(j,k){this.$.setAttribute(j,k);return this;};if(c&&(b.ie7Compat||b.ie6Compat))return function(j,k){var l=this;if(j=='class')l.$.className=k;else if(j=='style')l.$.style.cssText=k;else if(j=='tabindex')l.$.tabIndex=k;else if(j=='checked')l.$.checked=k;else if(j=='contenteditable')i.call(l,'contentEditable',k);else i.apply(l,arguments);return l;};else if(b.ie8Compat&&b.secure)return function(j,k){if(j=='src'&&k.match(/^http:\/\//))try{i.apply(this,arguments);}catch(l){}else i.apply(this,arguments);return this;};else return i;})(),setAttributes:function(i){for(var j in i)this.setAttribute(j,i[j]);return this;},setValue:function(i){this.$.value=i;return this;},removeAttribute:(function(){var i=function(j){this.$.removeAttribute(j);};if(c&&(b.ie7Compat||b.ie6Compat))return function(j){if(j=='class')j='className';else if(j=='tabindex')j='tabIndex';else if(j=='contenteditable')j='contentEditable';i.call(this,j);};else return i;})(),removeAttributes:function(i){if(e.isArray(i))for(var j=0;j<i.length;j++)this.removeAttribute(i[j]);else for(var k in i)i.hasOwnProperty(k)&&this.removeAttribute(k);},removeStyle:function(i){var j=this.$.style;j.removeProperty?j.removeProperty(i):j.removeAttribute(e.cssStyleToDomStyle(i));if(!this.$.style.cssText)this.removeAttribute('style');},setStyle:function(i,j){this.$.style[e.cssStyleToDomStyle(i)]=j;return this;},setStyles:function(i){for(var j in i)this.setStyle(j,i[j]);return this;},setOpacity:function(i){if(c&&b.version<9){i=Math.round(i*100);this.setStyle('filter',i>=100?'':'progid:DXImageTransform.Microsoft.Alpha(opacity='+i+')');}else this.setStyle('opacity',i);},unselectable:b.gecko?function(){this.$.style.MozUserSelect='none';this.on('dragstart',function(i){i.data.preventDefault();});}:b.webkit?function(){this.$.style.KhtmlUserSelect='none';this.on('dragstart',function(i){i.data.preventDefault();});}:function(){if(c||b.opera){var i=this.$,j=i.getElementsByTagName('*'),k,l=0;i.unselectable='on';while(k=j[l++])switch(k.tagName.toLowerCase()){case 'iframe':case 'textarea':case 'input':case 'select':break;
default:k.unselectable='on';}}},getPositionedAncestor:function(){var i=this;while(i.getName()!='html'){if(i.getComputedStyle('position')!='static')return i;i=i.getParent();}return null;},getDocumentPosition:function(i){var D=this;var j=0,k=0,l=D.getDocument(),m=l.getBody(),n=l.$.compatMode=='BackCompat';if(document.documentElement.getBoundingClientRect){var o=D.$.getBoundingClientRect(),p=l.$,q=p.documentElement,r=q.clientTop||m.$.clientTop||0,s=q.clientLeft||m.$.clientLeft||0,t=true;if(c){var u=l.getDocumentElement().contains(D),v=l.getBody().contains(D);t=n&&v||!n&&u;}if(t){j=o.left+(!n&&q.scrollLeft||m.$.scrollLeft);j-=s;k=o.top+(!n&&q.scrollTop||m.$.scrollTop);k-=r;}}else{var w=D,x=null,y;while(w&&!(w.getName()=='body'||w.getName()=='html')){j+=w.$.offsetLeft-w.$.scrollLeft;k+=w.$.offsetTop-w.$.scrollTop;if(!w.equals(D)){j+=w.$.clientLeft||0;k+=w.$.clientTop||0;}var z=x;while(z&&!z.equals(w)){j-=z.$.scrollLeft;k-=z.$.scrollTop;z=z.getParent();}x=w;w=(y=w.$.offsetParent)?new h(y):null;}}if(i){var A=D.getWindow(),B=i.getWindow();if(!A.equals(B)&&A.$.frameElement){var C=new h(A.$.frameElement).getDocumentPosition(i);j+=C.x;k+=C.y;}}if(!document.documentElement.getBoundingClientRect)if(b.gecko&&!n){j+=D.$.clientLeft?1:0;k+=D.$.clientTop?1:0;}return{x:j,y:k};},scrollIntoView:function(i){var j=this.getParent();if(!j)return;do{var k=j.$.clientWidth&&j.$.clientWidth<j.$.scrollWidth||j.$.clientHeight&&j.$.clientHeight<j.$.scrollHeight;if(k)this.scrollIntoParent(j,i,1);if(j.is('html')){var l=j.getWindow();try{var m=l.$.frameElement;m&&(j=new h(m));}catch(n){}}}while(j=j.getParent());},scrollIntoParent:function(i,j,k){!i&&(i=this.getWindow());var l=i.getDocument(),m=l.$.compatMode=='BackCompat';if(i instanceof d.window)i=m?l.getBody():l.getDocumentElement();function n(z,A){if(/body|html/.test(i.getName()))i.getWindow().$.scrollBy(z,A);else{i.$.scrollLeft+=z;i.$.scrollTop+=A;}};function o(z,A){var B={x:0,y:0};if(!z.is(m?'body':'html')){var C=z.$.getBoundingClientRect();B.x=C.left,B.y=C.top;}var D=z.getWindow();if(!D.equals(A)){var E=o(h.get(D.$.frameElement),A);B.x+=E.x,B.y+=E.y;}return B;};function p(z,A){return parseInt(z.getComputedStyle('margin-'+A)||0,10)||0;};var q=i.getWindow(),r=o(this,q),s=o(i,q),t=this.$.offsetHeight,u=this.$.offsetWidth,v=i.$.clientHeight,w=i.$.clientWidth,x,y;x={x:r.x-p(this,'left')-s.x||0,y:r.y-p(this,'top')-s.y||0};y={x:r.x+u+p(this,'right')-(s.x+w)||0,y:r.y+t+p(this,'bottom')-(s.y+v)||0};if(x.y<0||y.y>0)n(0,j===true?x.y:j===false?y.y:x.y<0?x.y:y.y);
if(k&&(x.x<0||y.x>0))n(x.x<0?x.x:y.x,0);},setState:function(i){var j=this;switch(i){case 1:j.addClass('cke_on');j.removeClass('cke_off');j.removeClass('cke_disabled');break;case 0:j.addClass('cke_disabled');j.removeClass('cke_off');j.removeClass('cke_on');break;default:j.addClass('cke_off');j.removeClass('cke_on');j.removeClass('cke_disabled');break;}},getFrameDocument:function(){var i=this.$;try{i.contentWindow.document;}catch(j){i.src=i.src;if(c&&b.version<7)window.showModalDialog('javascript:document.write("<script>window.setTimeout(function(){window.close();},50);</script>")');}return i&&new g(i.contentWindow.document);},copyAttributes:function(i,j){var p=this;var k=p.$.attributes;j=j||{};for(var l=0;l<k.length;l++){var m=k[l],n=m.nodeName.toLowerCase(),o;if(n in j)continue;if(n=='checked'&&(o=p.getAttribute(n)))i.setAttribute(n,o);else if(m.specified||c&&m.nodeValue&&n=='value'){o=p.getAttribute(n);if(o===null)o=m.nodeValue;i.setAttribute(n,o);}}if(p.$.style.cssText!=='')i.$.style.cssText=p.$.style.cssText;},renameNode:function(i){var l=this;if(l.getName()==i)return;var j=l.getDocument(),k=new h(i,j);l.copyAttributes(k);l.moveChildren(k);l.getParent()&&l.$.parentNode.replaceChild(k.$,l.$);k.$['data-cke-expando']=l.$['data-cke-expando'];l.$=k.$;},getChild:function(i){var j=this.$;if(!i.slice)j=j.childNodes[i];else while(i.length>0&&j)j=j.childNodes[i.shift()];return j?new d.node(j):null;},getChildCount:function(){return this.$.childNodes.length;},disableContextMenu:function(){this.on('contextmenu',function(i){if(!i.data.getTarget().hasClass('cke_enable_context_menu'))i.data.preventDefault();});},getDirection:function(i){var j=this;return i?j.getComputedStyle('direction')||j.getDirection()||j.getDocument().$.dir||j.getDocument().getBody().getDirection(1):j.getStyle('direction')||j.getAttribute('dir');},data:function(i,j){i='data-'+i;if(j===undefined)return this.getAttribute(i);else if(j===false)this.removeAttribute(i);else this.setAttribute(i,j);return null;}});(function(){var i={width:['border-left-width','border-right-width','padding-left','padding-right'],height:['border-top-width','border-bottom-width','padding-top','padding-bottom']};function j(k){var l=0;for(var m=0,n=i[k].length;m<n;m++)l+=parseInt(this.getComputedStyle(i[k][m])||0,10)||0;return l;};h.prototype.setSize=function(k,l,m){if(typeof l=='number'){if(m&&!(c&&b.quirks))l-=j.call(this,k);this.setStyle(k,l+'px');}};h.prototype.getSize=function(k,l){var m=Math.max(this.$['offset'+e.capitalize(k)],this.$['client'+e.capitalize(k)])||0;
if(l)m-=j.call(this,k);return m;};})();a.command=function(i,j){this.uiItems=[];this.exec=function(k){var l=this;if(l.state==0)return false;if(l.editorFocus)i.focus();if(l.fire('exec')===true)return true;return j.exec.call(l,i,k)!==false;};this.refresh=function(){if(this.fire('refresh')===true)return true;return j.refresh&&j.refresh.apply(this,arguments)!==false;};e.extend(this,j,{modes:{wysiwyg:1},editorFocus:1,state:2});a.event.call(this);};a.command.prototype={enable:function(){var i=this;if(i.state==0)i.setState(!i.preserveState||typeof i.previousState=='undefined'?2:i.previousState);},disable:function(){this.setState(0);},setState:function(i){var j=this;if(j.state==i)return false;j.previousState=j.state;j.state=i;j.fire('state');return true;},toggleState:function(){var i=this;if(i.state==2)i.setState(1);else if(i.state==1)i.setState(2);}};a.event.implementOn(a.command.prototype,true);a.ENTER_P=1;a.ENTER_BR=2;a.ENTER_DIV=3;a.config={customConfig:'config.js',autoUpdateElement:true,baseHref:'',contentsCss:a.basePath+'contents.css',contentsLangDirection:'ui',contentsLanguage:'',language:'',defaultLanguage:'en',enterMode:1,forceEnterMode:false,shiftEnterMode:2,corePlugins:'',docType:'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',bodyId:'',bodyClass:'',fullPage:false,height:200,plugins:'about,a11yhelp,basicstyles,bidi,blockquote,button,clipboard,colorbutton,colordialog,contextmenu,dialogadvtab,div,elementspath,enterkey,entities,filebrowser,find,flash,font,format,forms,horizontalrule,htmldataprocessor,iframe,image,indent,justify,keystrokes,link,list,liststyle,maximize,newpage,pagebreak,pastefromword,pastetext,popup,preview,print,removeformat,resize,save,scayt,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,tabletools,templates,toolbar,undo,wsc,wysiwygarea',extraPlugins:'',removePlugins:'',protectedSource:[],tabIndex:0,theme:'default',skin:'kama',width:'',baseFloatZIndex:10000};var i=a.config;a.focusManager=function(j){if(j.focusManager)return j.focusManager;this.hasFocus=false;this._={editor:j};return this;};a.focusManager.prototype={focus:function(){var k=this;if(k._.timer)clearTimeout(k._.timer);if(!k.hasFocus){if(a.currentInstance)a.currentInstance.focusManager.forceBlur();var j=k._.editor;j.container.getChild(1).addClass('cke_focus');k.hasFocus=true;j.fire('focus');}},blur:function(){var j=this;if(j._.timer)clearTimeout(j._.timer);j._.timer=setTimeout(function(){delete j._.timer;
j.forceBlur();},100);},forceBlur:function(){if(this.hasFocus){var j=this._.editor;j.container.getChild(1).removeClass('cke_focus');this.hasFocus=false;j.fire('blur');}}};(function(){var j={};a.lang={languages:{af:1,ar:1,bg:1,bn:1,bs:1,ca:1,cs:1,cy:1,da:1,de:1,el:1,'en-au':1,'en-ca':1,'en-gb':1,en:1,eo:1,es:1,et:1,eu:1,fa:1,fi:1,fo:1,'fr-ca':1,fr:1,gl:1,gu:1,he:1,hi:1,hr:1,hu:1,is:1,it:1,ja:1,ka:1,km:1,ko:1,lt:1,lv:1,mn:1,ms:1,nb:1,nl:1,no:1,pl:1,'pt-br':1,pt:1,ro:1,ru:1,sk:1,sl:1,'sr-latn':1,sr:1,sv:1,th:1,tr:1,uk:1,vi:1,'zh-cn':1,zh:1},load:function(k,l,m){if(!k||!a.lang.languages[k])k=this.detect(l,k);if(!this[k])a.scriptLoader.load(a.getUrl('lang/'+k+'.js'),function(){m(k,this[k]);},this);else m(k,this[k]);},detect:function(k,l){var m=this.languages;l=l||navigator.userLanguage||navigator.language||k;var n=l.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/),o=n[1],p=n[2];if(m[o+'-'+p])o=o+'-'+p;else if(!m[o])o=null;a.lang.detect=o?function(){return o;}:function(q){return q;};return o||k;}};})();a.scriptLoader=(function(){var j={},k={};return{load:function(l,m,n,o){var p=typeof l=='string';if(p)l=[l];if(!n)n=a;var q=l.length,r=[],s=[],t=function(y){if(m)if(p)m.call(n,y);else m.call(n,r,s);};if(q===0){t(true);return;}var u=function(y,z){(z?r:s).push(y);if(--q<=0){o&&a.document.getDocumentElement().removeStyle('cursor');t(z);}},v=function(y,z){j[y]=1;var A=k[y];delete k[y];for(var B=0;B<A.length;B++)A[B](y,z);},w=function(y){if(j[y]){u(y,true);return;}var z=k[y]||(k[y]=[]);z.push(u);if(z.length>1)return;var A=new h('script');A.setAttributes({type:'text/javascript',src:y});if(m)if(c)A.$.onreadystatechange=function(){if(A.$.readyState=='loaded'||A.$.readyState=='complete'){A.$.onreadystatechange=null;v(y,true);}};else{A.$.onload=function(){setTimeout(function(){v(y,true);},0);};A.$.onerror=function(){v(y,false);};}A.appendTo(a.document.getHead());};o&&a.document.getDocumentElement().setStyle('cursor','wait');for(var x=0;x<q;x++)w(l[x]);}};})();a.resourceManager=function(j,k){var l=this;l.basePath=j;l.fileName=k;l.registered={};l.loaded={};l.externals={};l._={waitingList:{}};};a.resourceManager.prototype={add:function(j,k){if(this.registered[j])throw '[CKEDITOR.resourceManager.add] The resource name "'+j+'" is already registered.';a.fire(j+e.capitalize(this.fileName)+'Ready',this.registered[j]=k||{});},get:function(j){return this.registered[j]||null;},getPath:function(j){var k=this.externals[j];return a.getUrl(k&&k.dir||this.basePath+j+'/');},getFilePath:function(j){var k=this.externals[j];
return a.getUrl(this.getPath(j)+(k&&typeof k.file=='string'?k.file:this.fileName+'.js'));},addExternal:function(j,k,l){j=j.split(',');for(var m=0;m<j.length;m++){var n=j[m];this.externals[n]={dir:k,file:l};}},load:function(j,k,l){if(!e.isArray(j))j=j?[j]:[];var m=this.loaded,n=this.registered,o=[],p={},q={};for(var r=0;r<j.length;r++){var s=j[r];if(!s)continue;if(!m[s]&&!n[s]){var t=this.getFilePath(s);o.push(t);if(!(t in p))p[t]=[];p[t].push(s);}else q[s]=this.get(s);}a.scriptLoader.load(o,function(u,v){if(v.length)throw '[CKEDITOR.resourceManager.load] Resource name "'+p[v[0]].join(',')+'" was not found at "'+v[0]+'".';for(var w=0;w<u.length;w++){var x=p[u[w]];for(var y=0;y<x.length;y++){var z=x[y];q[z]=this.get(z);m[z]=1;}}k.call(l,q);},this);}};a.plugins=new a.resourceManager('plugins/','plugin');var j=a.plugins;j.load=e.override(j.load,function(k){return function(l,m,n){var o={},p=function(q){k.call(this,q,function(r){e.extend(o,r);var s=[];for(var t in r){var u=r[t],v=u&&u.requires;if(v)for(var w=0;w<v.length;w++){if(!o[v[w]])s.push(v[w]);}}if(s.length)p.call(this,s);else{for(t in o){u=o[t];if(u.onLoad&&!u.onLoad._called){u.onLoad();u.onLoad._called=1;}}if(m)m.call(n||window,o);}},this);};p.call(this,l);};});j.setLang=function(k,l,m){var n=this.get(k),o=n.langEntries||(n.langEntries={}),p=n.lang||(n.lang=[]);if(e.indexOf(p,l)==-1)p.push(l);o[l]=m;};a.skins=(function(){var k={},l={},m=function(n,o,p,q){var r=k[o];if(!n.skin){n.skin=r;if(r.init)r.init(n);}var s=function(B){for(var C=0;C<B.length;C++)B[C]=a.getUrl(l[o]+B[C]);};function t(B,C){return B.replace(/url\s*\(([\s'"]*)(.*?)([\s"']*)\)/g,function(D,E,F,G){if(/^\/|^\w?:/.test(F))return D;else return 'url('+C+E+F+G+')';});};p=r[p];var u=!p||!!p._isLoaded;if(u)q&&q();else{var v=p._pending||(p._pending=[]);v.push(q);if(v.length>1)return;var w=!p.css||!p.css.length,x=!p.js||!p.js.length,y=function(){if(w&&x){p._isLoaded=1;for(var B=0;B<v.length;B++){if(v[B])v[B]();}}};if(!w){var z=p.css;if(e.isArray(z)){s(z);for(var A=0;A<z.length;A++)a.document.appendStyleSheet(z[A]);}else{z=t(z,a.getUrl(l[o]));a.document.appendStyleText(z);}p.css=z;w=1;}if(!x){s(p.js);a.scriptLoader.load(p.js,function(){x=1;y();});}y();}};return{add:function(n,o){k[n]=o;o.skinPath=l[n]||(l[n]=a.getUrl('skins/'+n+'/'));},load:function(n,o,p){var q=n.skinName,r=n.skinPath;if(k[q])m(n,q,o,p);else{l[q]=r;a.scriptLoader.load(a.getUrl(r+'skin.js'),function(){m(n,q,o,p);});}}};})();a.themes=new a.resourceManager('themes/','theme');a.ui=function(k){if(k.ui)return k.ui;
this._={handlers:{},items:{},editor:k};return this;};var k=a.ui;k.prototype={add:function(l,m,n){this._.items[l]={type:m,command:n.command||null,args:Array.prototype.slice.call(arguments,2)};},create:function(l){var q=this;var m=q._.items[l],n=m&&q._.handlers[m.type],o=m&&m.command&&q._.editor.getCommand(m.command),p=n&&n.create.apply(q,m.args);m&&(p=e.extend(p,q._.editor.skin[m.type],true));if(o)o.uiItems.push(p);return p;},addHandler:function(l,m){this._.handlers[l]=m;}};a.event.implementOn(k);(function(){var l=0,m=function(){var x='editor'+ ++l;return a.instances&&a.instances[x]?m():x;},n={},o=function(x){var y=x.config.customConfig;if(!y)return false;y=a.getUrl(y);var z=n[y]||(n[y]={});if(z.fn){z.fn.call(x,x.config);if(a.getUrl(x.config.customConfig)==y||!o(x))x.fireOnce('customConfigLoaded');}else a.scriptLoader.load(y,function(){if(a.editorConfig)z.fn=a.editorConfig;else z.fn=function(){};o(x);});return true;},p=function(x,y){x.on('customConfigLoaded',function(){if(y){if(y.on)for(var z in y.on)x.on(z,y.on[z]);e.extend(x.config,y,true);delete x.config.on;}q(x);});if(y&&y.customConfig!=undefined)x.config.customConfig=y.customConfig;if(!o(x))x.fireOnce('customConfigLoaded');},q=function(x){var y=x.config.skin.split(','),z=y[0],A=a.getUrl(y[1]||'skins/'+z+'/');x.skinName=z;x.skinPath=A;x.skinClass='cke_skin_'+z;x.tabIndex=x.config.tabIndex||x.element.getAttribute('tabindex')||0;x.readOnly=!!(x.config.readOnly||x.element.getAttribute('disabled'));x.fireOnce('configLoaded');t(x);},r=function(x){a.lang.load(x.config.language,x.config.defaultLanguage,function(y,z){x.langCode=y;x.lang=e.prototypedCopy(z);if(b.gecko&&b.version<10900&&x.lang.dir=='rtl')x.lang.dir='ltr';x.fire('langLoaded');var A=x.config;A.contentsLangDirection=='ui'&&(A.contentsLangDirection=x.lang.dir);s(x);});},s=function(x){var y=x.config,z=y.plugins,A=y.extraPlugins,B=y.removePlugins;if(A){var C=new RegExp('(?:^|,)(?:'+A.replace(/\s*,\s*/g,'|')+')(?=,|$)','g');z=z.replace(C,'');z+=','+A;}if(B){C=new RegExp('(?:^|,)(?:'+B.replace(/\s*,\s*/g,'|')+')(?=,|$)','g');z=z.replace(C,'');}b.air&&(z+=',adobeair');j.load(z.split(','),function(D){var E=[],F=[],G=[];x.plugins=D;for(var H in D){var I=D[H],J=I.lang,K=j.getPath(H),L=null;I.path=K;if(J){L=e.indexOf(J,x.langCode)>=0?x.langCode:J[0];if(!I.langEntries||!I.langEntries[L])G.push(a.getUrl(K+'lang/'+L+'.js'));else{e.extend(x.lang,I.langEntries[L]);L=null;}}F.push(L);E.push(I);}a.scriptLoader.load(G,function(){var M=['beforeInit','init','afterInit'];
for(var N=0;N<M.length;N++)for(var O=0;O<E.length;O++){var P=E[O];if(N===0&&F[O]&&P.lang)e.extend(x.lang,P.langEntries[F[O]]);if(P[M[N]])P[M[N]](x);}x.fire('pluginsLoaded');u(x);});});},t=function(x){a.skins.load(x,'editor',function(){r(x);});},u=function(x){var y=x.config.theme;a.themes.load(y,function(){var z=x.theme=a.themes.get(y);z.path=a.themes.getPath(y);z.build(x);if(x.config.autoUpdateElement)v(x);});},v=function(x){var y=x.element;if(x.elementMode==1&&y.is('textarea')){var z=y.$.form&&new h(y.$.form);if(z){function A(){x.updateElement();};z.on('submit',A);if(!z.$.submit.nodeName&&!z.$.submit.length)z.$.submit=e.override(z.$.submit,function(B){return function(){x.updateElement();if(B.apply)B.apply(this,arguments);else B();};});x.on('destroy',function(){z.removeListener('submit',A);});}}};function w(){var x,y=this._.commands,z=this.mode;if(!z)return;for(var A in y){x=y[A];x[x.startDisabled?'disable':this.readOnly&&!x.readOnly?'disable':x.modes[z]?'enable':'disable']();}};a.editor.prototype._init=function(){var z=this;var x=h.get(z._.element),y=z._.instanceConfig;delete z._.element;delete z._.instanceConfig;z._.commands={};z._.styles=[];z.element=x;z.name=x&&z.elementMode==1&&(x.getId()||x.getNameAtt())||m();if(z.name in a.instances)throw '[CKEDITOR.editor] The instance "'+z.name+'" already exists.';z.id=e.getNextId();z.config=e.prototypedCopy(i);z.ui=new k(z);z.focusManager=new a.focusManager(z);a.fire('instanceCreated',null,z);z.on('mode',w,null,null,1);z.on('readOnly',w,null,null,1);p(z,y);};})();e.extend(a.editor.prototype,{addCommand:function(l,m){return this._.commands[l]=new a.command(this,m);},addCss:function(l){this._.styles.push(l);},destroy:function(l){var m=this;if(!l)m.updateElement();m.fire('destroy');m.theme&&m.theme.destroy(m);a.remove(m);a.fire('instanceDestroyed',null,m);},execCommand:function(l,m){var n=this.getCommand(l),o={name:l,commandData:m,command:n};if(n&&n.state!=0)if(this.fire('beforeCommandExec',o)!==true){o.returnValue=n.exec(o.commandData);if(!n.async&&this.fire('afterCommandExec',o)!==true)return o.returnValue;}return false;},getCommand:function(l){return this._.commands[l];},getData:function(){var n=this;n.fire('beforeGetData');var l=n._.data;if(typeof l!='string'){var m=n.element;if(m&&n.elementMode==1)l=m.is('textarea')?m.getValue():m.getHtml();else l='';}l={dataValue:l};n.fire('getData',l);return l.dataValue;},getSnapshot:function(){var l=this.fire('getSnapshot');if(typeof l!='string'){var m=this.element;if(m&&this.elementMode==1)l=m.is('textarea')?m.getValue():m.getHtml();
}return l;},loadSnapshot:function(l){this.fire('loadSnapshot',l);},setData:function(l,m,n){if(m)this.on('dataReady',function(p){p.removeListener();m.call(p.editor);});var o={dataValue:l};!n&&this.fire('setData',o);this._.data=o.dataValue;!n&&this.fire('afterSetData',o);},setReadOnly:function(l){l=l==undefined||l;if(this.readOnly!=l){this.readOnly=l;this.fire('readOnly');}},insertHtml:function(l){this.fire('insertHtml',l);},insertText:function(l){this.fire('insertText',l);},insertElement:function(l){this.fire('insertElement',l);},checkDirty:function(){return this.mayBeDirty&&this._.previousValue!==this.getSnapshot();},resetDirty:function(){if(this.mayBeDirty)this._.previousValue=this.getSnapshot();},updateElement:function(){var n=this;var l=n.element;if(l&&n.elementMode==1){var m=n.getData();if(n.config.htmlEncodeOutput)m=e.htmlEncode(m);if(l.is('textarea'))l.setValue(m);else l.setHtml(m);}}});a.on('loaded',function(){var l=a.editor._pending;if(l){delete a.editor._pending;for(var m=0;m<l.length;m++)l[m]._init();}});a.htmlParser=function(){this._={htmlPartsRegex:new RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)-->)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))",'g')};};(function(){var l=/([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,m={checked:1,compact:1,declare:1,defer:1,disabled:1,ismap:1,multiple:1,nohref:1,noresize:1,noshade:1,nowrap:1,readonly:1,selected:1};a.htmlParser.prototype={onTagOpen:function(){},onTagClose:function(){},onText:function(){},onCDATA:function(){},onComment:function(){},parse:function(n){var A=this;var o,p,q=0,r;while(o=A._.htmlPartsRegex.exec(n)){var s=o.index;if(s>q){var t=n.substring(q,s);if(r)r.push(t);else A.onText(t);}q=A._.htmlPartsRegex.lastIndex;if(p=o[1]){p=p.toLowerCase();if(r&&f.$cdata[p]){A.onCDATA(r.join(''));r=null;}if(!r){A.onTagClose(p);continue;}}if(r){r.push(o[0]);continue;}if(p=o[3]){p=p.toLowerCase();if(/="/.test(p))continue;var u={},v,w=o[4],x=!!(w&&w.charAt(w.length-1)=='/');if(w)while(v=l.exec(w)){var y=v[1].toLowerCase(),z=v[2]||v[3]||v[4]||'';if(!z&&m[y])u[y]=y;else u[y]=z;}A.onTagOpen(p,u,x);if(!r&&f.$cdata[p])r=[];continue;}if(p=o[2])A.onComment(p);}if(n.length>q)A.onText(n.substring(q,n.length));}};})();a.htmlParser.comment=function(l){this.value=l;this._={isBlockLike:false};};a.htmlParser.comment.prototype={type:8,writeHtml:function(l,m){var n=this.value;if(m){if(!(n=m.onComment(n,this)))return;if(typeof n!='string'){n.parent=this.parent;n.writeHtml(l,m);
return;}}l.comment(n);}};(function(){a.htmlParser.text=function(l){this.value=l;this._={isBlockLike:false};};a.htmlParser.text.prototype={type:3,writeHtml:function(l,m){var n=this.value;if(m&&!(n=m.onText(n,this)))return;l.text(n);}};})();(function(){a.htmlParser.cdata=function(l){this.value=l;};a.htmlParser.cdata.prototype={type:3,writeHtml:function(l){l.write(this.value);}};})();a.htmlParser.fragment=function(){this.children=[];this.parent=null;this._={isBlockLike:true,hasInlineStarted:false};};(function(){var l=e.extend({table:1,ul:1,ol:1,dl:1},f.table,f.ul,f.ol,f.dl),m=c&&b.version<8?{dd:1,dt:1}:{},n={ol:1,ul:1},o=e.extend({},{html:1},f.html,f.body,f.head,{style:1,script:1});function p(q){return q.name=='a'&&q.attributes.href||f.$removeEmpty[q.name];};a.htmlParser.fragment.fromHtml=function(q,r,s){var t=new a.htmlParser(),u=s||new a.htmlParser.fragment(),v=[],w=[],x=u,y=false,z=false;function A(D){var E;if(v.length>0)for(var F=0;F<v.length;F++){var G=v[F],H=G.name,I=f[H],J=x.name&&f[x.name];if((!J||J[H])&&(!D||!I||I[D]||!f[D])){if(!E){B();E=1;}G=G.clone();G.parent=x;x=G;v.splice(F,1);F--;}else if(H==x.name)C(x,x.parent,1),F--;}};function B(){while(w.length)C(w.shift(),x);};function C(D,E,F){if(D.previous!==undefined)return;E=E||x||u;var G=x;if(r&&(!E.type||E.name=='body')){var H,I;if(D.attributes&&(I=D.attributes['data-cke-real-element-type']))H=I;else H=D.name;if(H&&!(H in f.$body||H=='body'||D.isOrphan)){x=E;t.onTagOpen(r,{});D.returnPoint=E=x;}}if(D._.isBlockLike&&D.name!='pre'&&D.name!='textarea'){var J=D.children.length,K=D.children[J-1],L;if(K&&K.type==3)if(!(L=e.rtrim(K.value)))D.children.length=J-1;else K.value=L;}E.add(D);if(D.name=='pre')z=false;if(D.name=='textarea')y=false;if(D.returnPoint){x=D.returnPoint;delete D.returnPoint;}else x=F?E:G;};t.onTagOpen=function(D,E,F,G){var H=new a.htmlParser.element(D,E);if(H.isUnknown&&F)H.isEmpty=true;H.isOptionalClose=D in m||G;if(p(H)){v.push(H);return;}else if(D=='pre')z=true;else if(D=='br'&&z){x.add(new a.htmlParser.text('\n'));return;}else if(D=='textarea')y=true;if(D=='br'){w.push(H);return;}while(1){var I=x.name,J=I?f[I]||(x._.isBlockLike?f.div:f.span):o;if(!H.isUnknown&&!x.isUnknown&&!J[D]){if(x.isOptionalClose)t.onTagClose(I);else if(D in n&&I in n){var K=x.children,L=K[K.length-1];if(!(L&&L.name=='li'))C(L=new a.htmlParser.element('li'),x);!H.returnPoint&&(H.returnPoint=x);x=L;}else if(D in f.$listItem&&I!=D)t.onTagOpen(D=='li'?'ul':'dl',{},0,1);else if(I in l&&I!=D){!H.returnPoint&&(H.returnPoint=x);
x=x.parent;}else{if(I in f.$inline)v.unshift(x);if(x.parent)C(x,x.parent,1);else{H.isOrphan=1;break;}}}else break;}A(D);B();H.parent=x;if(H.isEmpty)C(H);else x=H;};t.onTagClose=function(D){for(var E=v.length-1;E>=0;E--){if(D==v[E].name){v.splice(E,1);return;}}var F=[],G=[],H=x;while(H!=u&&H.name!=D){if(!H._.isBlockLike)G.unshift(H);F.push(H);H=H.returnPoint||H.parent;}if(H!=u){for(E=0;E<F.length;E++){var I=F[E];C(I,I.parent);}x=H;if(H._.isBlockLike)B();C(H,H.parent);if(H==x)x=x.parent;v=v.concat(G);}if(D=='body')r=false;};t.onText=function(D){if((!x._.hasInlineStarted||w.length)&&!z&&!y){D=e.ltrim(D);if(D.length===0)return;}var E=x.name,F=E?f[E]||(x._.isBlockLike?f.div:f.span):o;if(!y&&!F['#']&&E in l){t.onTagOpen(E in n?'li':E=='dl'?'dd':E=='table'?'tr':E=='tr'?'td':'');t.onText(D);return;}B();A();if(r&&(!x.type||x.name=='body')&&e.trim(D))this.onTagOpen(r,{},0,1);if(!z&&!y)D=D.replace(/[\t\r\n ]{2,}|[\t\r\n]/g,' ');x.add(new a.htmlParser.text(D));};t.onCDATA=function(D){x.add(new a.htmlParser.cdata(D));};t.onComment=function(D){B();A();x.add(new a.htmlParser.comment(D));};t.parse(q);B(!c&&1);while(x!=u)C(x,x.parent,1);return u;};a.htmlParser.fragment.prototype={add:function(q,r){var t=this;isNaN(r)&&(r=t.children.length);var s=r>0?t.children[r-1]:null;if(s){if(q._.isBlockLike&&s.type==3){s.value=e.rtrim(s.value);if(s.value.length===0){t.children.pop();t.add(q);return;}}s.next=q;}q.previous=s;q.parent=t;t.children.splice(r,0,q);t._.hasInlineStarted=q.type==3||q.type==1&&!q._.isBlockLike;},writeHtml:function(q,r){var s;this.filterChildren=function(){var t=new a.htmlParser.basicWriter();this.writeChildrenHtml.call(this,t,r,true);var u=t.getHtml();this.children=new a.htmlParser.fragment.fromHtml(u).children;s=1;};!this.name&&r&&r.onFragment(this);this.writeChildrenHtml(q,s?null:r);},writeChildrenHtml:function(q,r){for(var s=0;s<this.children.length;s++)this.children[s].writeHtml(q,r);}};})();a.htmlParser.element=function(l,m){var q=this;q.name=l;q.attributes=m||{};q.children=[];var n=l||'',o=n.match(/^cke:(.*)/);o&&(n=o[1]);var p=!!(f.$nonBodyContent[n]||f.$block[n]||f.$listItem[n]||f.$tableContent[n]||f.$nonEditable[n]||n=='br');q.isEmpty=!!f.$empty[l];q.isUnknown=!f[l];q._={isBlockLike:p,hasInlineStarted:q.isEmpty||!p};};a.htmlParser.cssStyle=function(){var l,m=arguments[0],n={};l=m instanceof a.htmlParser.element?m.attributes.style:m;(l||'').replace(/&quot;/g,'"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g,function(o,p,q){p=='font-family'&&(q=q.replace(/["']/g,''));
n[p.toLowerCase()]=q;});return{rules:n,populate:function(o){var p=this.toString();if(p)o instanceof h?o.setAttribute('style',p):o instanceof a.htmlParser.element?o.attributes.style=p:o.style=p;},'toString':function(){var o=[];for(var p in n)n[p]&&o.push(p,':',n[p],';');return o.join('');}};};(function(){var l=function(m,n){m=m[0];n=n[0];return m<n?-1:m>n?1:0;};a.htmlParser.element.prototype={type:1,add:a.htmlParser.fragment.prototype.add,clone:function(){return new a.htmlParser.element(this.name,this.attributes);},writeHtml:function(m,n){var o=this.attributes,p=this,q=p.name,r,s,t,u;p.filterChildren=function(){if(!u){var B=new a.htmlParser.basicWriter();a.htmlParser.fragment.prototype.writeChildrenHtml.call(p,B,n);p.children=new a.htmlParser.fragment.fromHtml(B.getHtml(),0,p.clone()).children;u=1;}};if(n){for(;;){if(!(q=n.onElementName(q)))return;p.name=q;if(!(p=n.onElement(p)))return;p.parent=this.parent;if(p.name==q)break;if(p.type!=1){p.writeHtml(m,n);return;}q=p.name;if(!q){for(var v=0,w=this.children.length;v<w;v++)this.children[v].parent=p.parent;this.writeChildrenHtml.call(p,m,u?null:n);return;}}o=p.attributes;}m.openTag(q,o);var x=[];for(var y=0;y<2;y++)for(r in o){s=r;t=o[r];if(y==1)x.push([r,t]);else if(n){for(;;){if(!(s=n.onAttributeName(r))){delete o[r];break;}else if(s!=r){delete o[r];r=s;continue;}else break;}if(s)if((t=n.onAttribute(p,s,t))===false)delete o[s];else o[s]=t;}}if(m.sortAttributes)x.sort(l);var z=x.length;for(y=0;y<z;y++){var A=x[y];m.attribute(A[0],A[1]);}m.openTagClose(q,p.isEmpty);if(!p.isEmpty){this.writeChildrenHtml.call(p,m,u?null:n);m.closeTag(q);}},writeChildrenHtml:function(m,n){a.htmlParser.fragment.prototype.writeChildrenHtml.apply(this,arguments);}};})();(function(){a.htmlParser.filter=e.createClass({$:function(q){this._={elementNames:[],attributeNames:[],elements:{$length:0},attributes:{$length:0}};if(q)this.addRules(q,10);},proto:{addRules:function(q,r){var s=this;if(typeof r!='number')r=10;m(s._.elementNames,q.elementNames,r);m(s._.attributeNames,q.attributeNames,r);n(s._.elements,q.elements,r);n(s._.attributes,q.attributes,r);s._.text=o(s._.text,q.text,r)||s._.text;s._.comment=o(s._.comment,q.comment,r)||s._.comment;s._.root=o(s._.root,q.root,r)||s._.root;},onElementName:function(q){return l(q,this._.elementNames);},onAttributeName:function(q){return l(q,this._.attributeNames);},onText:function(q){var r=this._.text;return r?r.filter(q):q;},onComment:function(q,r){var s=this._.comment;return s?s.filter(q,r):q;},onFragment:function(q){var r=this._.root;
return r?r.filter(q):q;},onElement:function(q){var v=this;var r=[v._.elements['^'],v._.elements[q.name],v._.elements.$],s,t;for(var u=0;u<3;u++){s=r[u];if(s){t=s.filter(q,v);if(t===false)return null;if(t&&t!=q)return v.onNode(t);if(q.parent&&!q.name)break;}}return q;},onNode:function(q){var r=q.type;return r==1?this.onElement(q):r==3?new a.htmlParser.text(this.onText(q.value)):r==8?new a.htmlParser.comment(this.onComment(q.value)):null;},onAttribute:function(q,r,s){var t=this._.attributes[r];if(t){var u=t.filter(s,q,this);if(u===false)return false;if(typeof u!='undefined')return u;}return s;}}});function l(q,r){for(var s=0;q&&s<r.length;s++){var t=r[s];q=q.replace(t[0],t[1]);}return q;};function m(q,r,s){if(typeof r=='function')r=[r];var t,u,v=q.length,w=r&&r.length;if(w){for(t=0;t<v&&q[t].pri<s;t++){}for(u=w-1;u>=0;u--){var x=r[u];if(x){x.pri=s;q.splice(t,0,x);}}}};function n(q,r,s){if(r)for(var t in r){var u=q[t];q[t]=o(u,r[t],s);if(!u)q.$length++;}};function o(q,r,s){if(r){r.pri=s;if(q){if(!q.splice){if(q.pri>s)q=[r,q];else q=[q,r];q.filter=p;}else m(q,r,s);return q;}else{r.filter=r;return r;}}};function p(q){var r=q.type||q instanceof a.htmlParser.fragment;for(var s=0;s<this.length;s++){if(r)var t=q.type,u=q.name;var v=this[s],w=v.apply(window,arguments);if(w===false)return w;if(r){if(w&&(w.name!=u||w.type!=t))return w;}else if(typeof w!='string')return w;w!=undefined&&(q=w);}return q;};})();a.htmlParser.basicWriter=e.createClass({$:function(){this._={output:[]};},proto:{openTag:function(l,m){this._.output.push('<',l);},openTagClose:function(l,m){if(m)this._.output.push(' />');else this._.output.push('>');},attribute:function(l,m){if(typeof m=='string')m=e.htmlEncodeAttr(m);this._.output.push(' ',l,'="',m,'"');},closeTag:function(l){this._.output.push('</',l,'>');},text:function(l){this._.output.push(l);},comment:function(l){this._.output.push('<!--',l,'-->');},write:function(l){this._.output.push(l);},reset:function(){this._.output=[];this._.indent=false;},getHtml:function(l){var m=this._.output.join('');if(l)this.reset();return m;}}});delete a.loadFullCore;a.instances={};a.document=new g(document);a.add=function(l){a.instances[l.name]=l;l.on('focus',function(){if(a.currentInstance!=l){a.currentInstance=l;a.fire('currentInstance');}});l.on('blur',function(){if(a.currentInstance==l){a.currentInstance=null;a.fire('currentInstance');}});};a.remove=function(l){delete a.instances[l.name];};a.on('instanceDestroyed',function(){if(e.isEmpty(this.instances))a.fire('reset');
});a.TRISTATE_ON=1;a.TRISTATE_OFF=2;a.TRISTATE_DISABLED=0;d.comment=function(l,m){if(typeof l=='string')l=(m?m.$:document).createComment(l);d.domObject.call(this,l);};d.comment.prototype=new d.node();e.extend(d.comment.prototype,{type:8,getOuterHtml:function(){return '<!--'+this.$.nodeValue+'-->';}});(function(){var l={address:1,blockquote:1,dl:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,p:1,pre:1,li:1,dt:1,dd:1,legend:1,caption:1},m={body:1,div:1,table:1,tbody:1,tr:1,td:1,th:1,form:1,fieldset:1},n=function(o){var p=o.getChildren();for(var q=0,r=p.count();q<r;q++){var s=p.getItem(q);if(s.type==1&&f.$block[s.getName()])return true;}return false;};d.elementPath=function(o){var u=this;var p=null,q=null,r=[],s=o;while(s){if(s.type==1){if(!u.lastElement)u.lastElement=s;var t=s.getName();if(!q){if(!p&&l[t])p=s;if(m[t])if(!p&&t=='div'&&!n(s))p=s;else q=s;}r.push(s);if(t=='body')break;}s=s.getParent();}u.block=p;u.blockLimit=q;u.elements=r;};})();d.elementPath.prototype={compare:function(l){var m=this.elements,n=l&&l.elements;if(!n||m.length!=n.length)return false;for(var o=0;o<m.length;o++){if(!m[o].equals(n[o]))return false;}return true;},contains:function(l){var m=this.elements;for(var n=0;n<m.length;n++){if(m[n].getName() in l)return m[n];}return null;}};d.text=function(l,m){if(typeof l=='string')l=(m?m.$:document).createTextNode(l);this.$=l;};d.text.prototype=new d.node();e.extend(d.text.prototype,{type:3,getLength:function(){return this.$.nodeValue.length;},getText:function(){return this.$.nodeValue;},setText:function(l){this.$.nodeValue=l;},split:function(l){var q=this;if(c&&l==q.getLength()){var m=q.getDocument().createText('');m.insertAfter(q);return m;}var n=q.getDocument(),o=new d.text(q.$.splitText(l),n);if(b.ie8){var p=new d.text('',n);p.insertAfter(o);p.remove();}return o;},substring:function(l,m){if(typeof m!='number')return this.$.nodeValue.substr(l);else return this.$.nodeValue.substring(l,m);}});d.documentFragment=function(l){l=l||a.document;this.$=l.$.createDocumentFragment();};e.extend(d.documentFragment.prototype,h.prototype,{type:11,insertAfterNode:function(l){l=l.$;l.parentNode.insertBefore(this.$,l.nextSibling);}},true,{append:1,appendBogus:1,getFirst:1,getLast:1,appendTo:1,moveChildren:1,insertBefore:1,insertAfterNode:1,replace:1,trim:1,type:1,ltrim:1,rtrim:1,getDocument:1,getChildCount:1,getChild:1,getChildren:1});(function(){function l(s,t){var u=this.range;if(this._.end)return null;if(!this._.start){this._.start=1;if(u.collapsed){this.end();return null;
}u.optimize();}var v,w=u.startContainer,x=u.endContainer,y=u.startOffset,z=u.endOffset,A,B=this.guard,C=this.type,D=s?'getPreviousSourceNode':'getNextSourceNode';if(!s&&!this._.guardLTR){var E=x.type==1?x:x.getParent(),F=x.type==1?x.getChild(z):x.getNext();this._.guardLTR=function(J,K){return(!K||!E.equals(J))&&(!F||!J.equals(F))&&(J.type!=1||!K||J.getName()!='body');};}if(s&&!this._.guardRTL){var G=w.type==1?w:w.getParent(),H=w.type==1?y?w.getChild(y-1):null:w.getPrevious();this._.guardRTL=function(J,K){return(!K||!G.equals(J))&&(!H||!J.equals(H))&&(J.type!=1||!K||J.getName()!='body');};}var I=s?this._.guardRTL:this._.guardLTR;if(B)A=function(J,K){if(I(J,K)===false)return false;return B(J,K);};else A=I;if(this.current)v=this.current[D](false,C,A);else{if(s){v=x;if(v.type==1)if(z>0)v=v.getChild(z-1);else v=A(v,true)===false?null:v.getPreviousSourceNode(true,C,A);}else{v=w;if(v.type==1)if(!(v=v.getChild(y)))v=A(w,true)===false?null:w.getNextSourceNode(true,C,A);}if(v&&A(v)===false)v=null;}while(v&&!this._.end){this.current=v;if(!this.evaluator||this.evaluator(v)!==false){if(!t)return v;}else if(t&&this.evaluator)return false;v=v[D](false,C,A);}this.end();return this.current=null;};function m(s){var t,u=null;while(t=l.call(this,s))u=t;return u;};d.walker=e.createClass({$:function(s){this.range=s;this._={};},proto:{end:function(){this._.end=1;},next:function(){return l.call(this);},previous:function(){return l.call(this,1);},checkForward:function(){return l.call(this,0,1)!==false;},checkBackward:function(){return l.call(this,1,1)!==false;},lastForward:function(){return m.call(this);},lastBackward:function(){return m.call(this,1);},reset:function(){delete this.current;this._={};}}});var n={block:1,'list-item':1,table:1,'table-row-group':1,'table-header-group':1,'table-footer-group':1,'table-row':1,'table-column-group':1,'table-column':1,'table-cell':1,'table-caption':1};h.prototype.isBlockBoundary=function(s){var t=s?e.extend({},f.$block,s||{}):f.$block;return this.getComputedStyle('float')=='none'&&n[this.getComputedStyle('display')]||t[this.getName()];};d.walker.blockBoundary=function(s){return function(t,u){return!(t.type==1&&t.isBlockBoundary(s));};};d.walker.listItemBoundary=function(){return this.blockBoundary({br:1});};d.walker.bookmark=function(s,t){function u(v){return v&&v.getName&&v.getName()=='span'&&v.data('cke-bookmark');};return function(v){var w,x;w=v&&!v.getName&&(x=v.getParent())&&u(x);w=s?w:w||u(v);return!!(t^w);};};d.walker.whitespaces=function(s){return function(t){var u=t&&t.type==3&&!e.trim(t.getText());
return!!(s^u);};};d.walker.invisible=function(s){var t=d.walker.whitespaces();return function(u){var v=t(u)||u.is&&!u.$.offsetHeight;return!!(s^v);};};d.walker.nodeType=function(s,t){return function(u){return!!(t^u.type==s);};};d.walker.bogus=function(s){function t(u){return!p(u)&&!q(u);};return function(u){var v=!c?u.is&&u.is('br'):u.getText&&o.test(u.getText());if(v){var w=u.getParent(),x=u.getNext(t);v=w.isBlockBoundary()&&(!x||x.type==1&&x.isBlockBoundary());}return!!(s^v);};};var o=/^[\t\r\n ]*(?:&nbsp;|\xa0)$/,p=d.walker.whitespaces(),q=d.walker.bookmark(),r=function(s){return q(s)||p(s)||s.type==1&&s.getName() in f.$inline&&!(s.getName() in f.$empty);};h.prototype.getBogus=function(){var s=this;do s=s.getPreviousSourceNode();while(r(s));if(s&&(!c?s.is&&s.is('br'):s.getText&&o.test(s.getText())))return s;return false;};})();d.range=function(l){var m=this;m.startContainer=null;m.startOffset=null;m.endContainer=null;m.endOffset=null;m.collapsed=true;m.document=l;};(function(){var l=function(u){u.collapsed=u.startContainer&&u.endContainer&&u.startContainer.equals(u.endContainer)&&u.startOffset==u.endOffset;},m=function(u,v,w,x){u.optimizeBookmark();var y=u.startContainer,z=u.endContainer,A=u.startOffset,B=u.endOffset,C,D;if(z.type==3)z=z.split(B);else if(z.getChildCount()>0)if(B>=z.getChildCount()){z=z.append(u.document.createText(''));D=true;}else z=z.getChild(B);if(y.type==3){y.split(A);if(y.equals(z))z=y.getNext();}else if(!A){y=y.getFirst().insertBeforeMe(u.document.createText(''));C=true;}else if(A>=y.getChildCount()){y=y.append(u.document.createText(''));C=true;}else y=y.getChild(A).getPrevious();var E=y.getParents(),F=z.getParents(),G,H,I;for(G=0;G<E.length;G++){H=E[G];I=F[G];if(!H.equals(I))break;}var J=w,K,L,M,N;for(var O=G;O<E.length;O++){K=E[O];if(J&&!K.equals(y))L=J.append(K.clone());M=K.getNext();while(M){if(M.equals(F[O])||M.equals(z))break;N=M.getNext();if(v==2)J.append(M.clone(true));else{M.remove();if(v==1)J.append(M);}M=N;}if(J)J=L;}J=w;for(var P=G;P<F.length;P++){K=F[P];if(v>0&&!K.equals(z))L=J.append(K.clone());if(!E[P]||K.$.parentNode!=E[P].$.parentNode){M=K.getPrevious();while(M){if(M.equals(E[P])||M.equals(y))break;N=M.getPrevious();if(v==2)J.$.insertBefore(M.$.cloneNode(true),J.$.firstChild);else{M.remove();if(v==1)J.$.insertBefore(M.$,J.$.firstChild);}M=N;}}if(J)J=L;}if(v==2){var Q=u.startContainer;if(Q.type==3){Q.$.data+=Q.$.nextSibling.data;Q.$.parentNode.removeChild(Q.$.nextSibling);}var R=u.endContainer;if(R.type==3&&R.$.nextSibling){R.$.data+=R.$.nextSibling.data;
R.$.parentNode.removeChild(R.$.nextSibling);}}else{if(H&&I&&(y.$.parentNode!=H.$.parentNode||z.$.parentNode!=I.$.parentNode)){var S=I.getIndex();if(C&&I.$.parentNode==y.$.parentNode)S--;if(x&&H.type==1){var T=h.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>',u.document);T.insertAfter(H);H.mergeSiblings(false);u.moveToBookmark({startNode:T});}else u.setStart(I.getParent(),S);}u.collapse(true);}if(C)y.remove();if(D&&z.$.parentNode)z.remove();},n={abbr:1,acronym:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,samp:1,small:1,span:1,strike:1,strong:1,sub:1,sup:1,tt:1,u:1,'var':1};function o(u){var v=false,w=d.walker.bookmark(true),x=/^[\t\r\n ]*(?:&nbsp;|\xa0)$/;return function(y){if(w(y))return true;if(y.type==3){if(c&&x.test(y.getText())&&!v&&!(u&&y.getNext()))v=true;else if(y.hasAscendant('pre')||e.trim(y.getText()).length)return false;}else if(y.type==1)if(!n[y.getName()])if(!c&&y.is('br')&&!v&&!(u&&y.getNext()))v=true;else return false;return true;};};var p=d.walker.bogus();function q(u){return function(v){return!u&&p(v)||(v.type==3?!e.trim(v.getText())||!!v.getParent().data('cke-bookmark'):v.getName() in f.$removeEmpty);};};var r=new d.walker.whitespaces(),s=new d.walker.bookmark();function t(u){return!r(u)&&!s(u);};d.range.prototype={clone:function(){var v=this;var u=new d.range(v.document);u.startContainer=v.startContainer;u.startOffset=v.startOffset;u.endContainer=v.endContainer;u.endOffset=v.endOffset;u.collapsed=v.collapsed;return u;},collapse:function(u){var v=this;if(u){v.endContainer=v.startContainer;v.endOffset=v.startOffset;}else{v.startContainer=v.endContainer;v.startOffset=v.endOffset;}v.collapsed=true;},cloneContents:function(){var u=new d.documentFragment(this.document);if(!this.collapsed)m(this,2,u);return u;},deleteContents:function(u){if(this.collapsed)return;m(this,0,null,u);},extractContents:function(u){var v=new d.documentFragment(this.document);if(!this.collapsed)m(this,1,v,u);return v;},createBookmark:function(u){var A=this;var v,w,x,y,z=A.collapsed;v=A.document.createElement('span');v.data('cke-bookmark',1);v.setStyle('display','none');v.setHtml('&nbsp;');if(u){x='cke_bm_'+e.getNextNumber();v.setAttribute('id',x+(z?'C':'S'));}if(!z){w=v.clone();w.setHtml('&nbsp;');if(u)w.setAttribute('id',x+'E');y=A.clone();y.collapse();y.insertNode(w);}y=A.clone();y.collapse(true);y.insertNode(v);if(w){A.setStartAfter(v);A.setEndBefore(w);}else A.moveToPosition(v,4);return{startNode:u?x+(z?'C':'S'):v,endNode:u?x+'E':w,serializable:u,collapsed:z};
},createBookmark2:function(u){var C=this;var v=C.startContainer,w=C.endContainer,x=C.startOffset,y=C.endOffset,z=C.collapsed,A,B;if(!v||!w)return{start:0,end:0};if(u){if(v.type==1){A=v.getChild(x);if(A&&A.type==3&&x>0&&A.getPrevious().type==3){v=A;x=0;}if(A&&A.type==1)x=A.getIndex(1);}while(v.type==3&&(B=v.getPrevious())&&B.type==3){v=B;x+=B.getLength();}if(!z){if(w.type==1){A=w.getChild(y);if(A&&A.type==3&&y>0&&A.getPrevious().type==3){w=A;y=0;}if(A&&A.type==1)y=A.getIndex(1);}while(w.type==3&&(B=w.getPrevious())&&B.type==3){w=B;y+=B.getLength();}}}return{start:v.getAddress(u),end:z?null:w.getAddress(u),startOffset:x,endOffset:y,normalized:u,collapsed:z,is2:true};},moveToBookmark:function(u){var C=this;if(u.is2){var v=C.document.getByAddress(u.start,u.normalized),w=u.startOffset,x=u.end&&C.document.getByAddress(u.end,u.normalized),y=u.endOffset;C.setStart(v,w);if(x)C.setEnd(x,y);else C.collapse(true);}else{var z=u.serializable,A=z?C.document.getById(u.startNode):u.startNode,B=z?C.document.getById(u.endNode):u.endNode;C.setStartBefore(A);A.remove();if(B){C.setEndBefore(B);B.remove();}else C.collapse(true);}},getBoundaryNodes:function(){var z=this;var u=z.startContainer,v=z.endContainer,w=z.startOffset,x=z.endOffset,y;if(u.type==1){y=u.getChildCount();if(y>w)u=u.getChild(w);else if(y<1)u=u.getPreviousSourceNode();else{u=u.$;while(u.lastChild)u=u.lastChild;u=new d.node(u);u=u.getNextSourceNode()||u;}}if(v.type==1){y=v.getChildCount();if(y>x)v=v.getChild(x).getPreviousSourceNode(true);else if(y<1)v=v.getPreviousSourceNode();else{v=v.$;while(v.lastChild)v=v.lastChild;v=new d.node(v);}}if(u.getPosition(v)&2)u=v;return{startNode:u,endNode:v};},getCommonAncestor:function(u,v){var z=this;var w=z.startContainer,x=z.endContainer,y;if(w.equals(x)){if(u&&w.type==1&&z.startOffset==z.endOffset-1)y=w.getChild(z.startOffset);else y=w;}else y=w.getCommonAncestor(x);return v&&!y.is?y.getParent():y;},optimize:function(){var w=this;var u=w.startContainer,v=w.startOffset;if(u.type!=1)if(!v)w.setStartBefore(u);else if(v>=u.getLength())w.setStartAfter(u);u=w.endContainer;v=w.endOffset;if(u.type!=1)if(!v)w.setEndBefore(u);else if(v>=u.getLength())w.setEndAfter(u);},optimizeBookmark:function(){var w=this;var u=w.startContainer,v=w.endContainer;if(u.is&&u.is('span')&&u.data('cke-bookmark'))w.setStartAt(u,3);if(v&&v.is&&v.is('span')&&v.data('cke-bookmark'))w.setEndAt(v,4);},trim:function(u,v){var C=this;var w=C.startContainer,x=C.startOffset,y=C.collapsed;if((!u||y)&&w&&w.type==3){if(!x){x=w.getIndex();
w=w.getParent();}else if(x>=w.getLength()){x=w.getIndex()+1;w=w.getParent();}else{var z=w.split(x);x=w.getIndex()+1;w=w.getParent();if(C.startContainer.equals(C.endContainer))C.setEnd(z,C.endOffset-C.startOffset);else if(w.equals(C.endContainer))C.endOffset+=1;}C.setStart(w,x);if(y){C.collapse(true);return;}}var A=C.endContainer,B=C.endOffset;if(!(v||y)&&A&&A.type==3){if(!B){B=A.getIndex();A=A.getParent();}else if(B>=A.getLength()){B=A.getIndex()+1;A=A.getParent();}else{A.split(B);B=A.getIndex()+1;A=A.getParent();}C.setEnd(A,B);}},enlarge:function(u,v){switch(u){case 1:if(this.collapsed)return;var w=this.getCommonAncestor(),x=this.document.getBody(),y,z,A,B,C,D=false,E,F,G=this.startContainer,H=this.startOffset;if(G.type==3){if(H){G=!e.trim(G.substring(0,H)).length&&G;D=!!G;}if(G)if(!(B=G.getPrevious()))A=G.getParent();}else{if(H)B=G.getChild(H-1)||G.getLast();if(!B)A=G;}while(A||B){if(A&&!B){if(!C&&A.equals(w))C=true;if(!x.contains(A))break;if(!D||A.getComputedStyle('display')!='inline'){D=false;if(C)y=A;else this.setStartBefore(A);}B=A.getPrevious();}while(B){E=false;if(B.type==8){B=B.getPrevious();continue;}else if(B.type==3){F=B.getText();if(/[^\s\ufeff]/.test(F))B=null;E=/[\s\ufeff]$/.test(F);}else if((B.$.offsetWidth>0||v&&B.is('br'))&&!B.data('cke-bookmark'))if(D&&f.$removeEmpty[B.getName()]){F=B.getText();if(/[^\s\ufeff]/.test(F))B=null;else{var I=B.$.getElementsByTagName('*');for(var J=0,K;K=I[J++];){if(!f.$removeEmpty[K.nodeName.toLowerCase()]){B=null;break;}}}if(B)E=!!F.length;}else B=null;if(E)if(D){if(C)y=A;else if(A)this.setStartBefore(A);}else D=true;if(B){var L=B.getPrevious();if(!A&&!L){A=B;B=null;break;}B=L;}else A=null;}if(A)A=A.getParent();}G=this.endContainer;H=this.endOffset;A=B=null;C=D=false;if(G.type==3){G=!e.trim(G.substring(H)).length&&G;D=!(G&&G.getLength());if(G)if(!(B=G.getNext()))A=G.getParent();}else{B=G.getChild(H);if(!B)A=G;}while(A||B){if(A&&!B){if(!C&&A.equals(w))C=true;if(!x.contains(A))break;if(!D||A.getComputedStyle('display')!='inline'){D=false;if(C)z=A;else if(A)this.setEndAfter(A);}B=A.getNext();}while(B){E=false;if(B.type==3){F=B.getText();if(/[^\s\ufeff]/.test(F))B=null;E=/^[\s\ufeff]/.test(F);}else if(B.type==1){if((B.$.offsetWidth>0||v&&B.is('br'))&&!B.data('cke-bookmark'))if(D&&f.$removeEmpty[B.getName()]){F=B.getText();if(/[^\s\ufeff]/.test(F))B=null;else{I=B.$.getElementsByTagName('*');for(J=0;K=I[J++];){if(!f.$removeEmpty[K.nodeName.toLowerCase()]){B=null;break;}}}if(B)E=!!F.length;}else B=null;}else E=1;if(E)if(D)if(C)z=A;
else this.setEndAfter(A);if(B){L=B.getNext();if(!A&&!L){A=B;B=null;break;}B=L;}else A=null;}if(A)A=A.getParent();}if(y&&z){w=y.contains(z)?z:y;this.setStartBefore(w);this.setEndAfter(w);}break;case 2:case 3:var M=new d.range(this.document);x=this.document.getBody();M.setStartAt(x,1);M.setEnd(this.startContainer,this.startOffset);var N=new d.walker(M),O,P,Q=d.walker.blockBoundary(u==3?{br:1}:null),R=function(X){var Y=Q(X);if(!Y)O=X;return Y;},S=function(X){var Y=R(X);if(!Y&&X.is&&X.is('br'))P=X;return Y;};N.guard=R;A=N.lastBackward();O=O||x;this.setStartAt(O,!O.is('br')&&(!A&&this.checkStartOfBlock()||A&&O.contains(A))?1:4);if(u==3){var T=this.clone();N=new d.walker(T);var U=d.walker.whitespaces(),V=d.walker.bookmark();N.evaluator=function(X){return!U(X)&&!V(X);};var W=N.previous();if(W&&W.type==1&&W.is('br'))return;}M=this.clone();M.collapse();M.setEndAt(x,2);N=new d.walker(M);N.guard=u==3?S:R;O=null;A=N.lastForward();O=O||x;this.setEndAt(O,!A&&this.checkEndOfBlock()||A&&O.contains(A)?2:3);if(P)this.setEndAfter(P);}},shrink:function(u,v){if(!this.collapsed){u=u||2;var w=this.clone(),x=this.startContainer,y=this.endContainer,z=this.startOffset,A=this.endOffset,B=this.collapsed,C=1,D=1;if(x&&x.type==3)if(!z)w.setStartBefore(x);else if(z>=x.getLength())w.setStartAfter(x);else{w.setStartBefore(x);C=0;}if(y&&y.type==3)if(!A)w.setEndBefore(y);else if(A>=y.getLength())w.setEndAfter(y);else{w.setEndAfter(y);D=0;}var E=new d.walker(w),F=d.walker.bookmark();E.evaluator=function(J){return J.type==(u==1?1:3);};var G;E.guard=function(J,K){if(F(J))return true;if(u==1&&J.type==3)return false;if(K&&J.equals(G))return false;if(!K&&J.type==1)G=J;return true;};if(C){var H=E[u==1?'lastForward':'next']();H&&this.setStartAt(H,v?1:3);}if(D){E.reset();var I=E[u==1?'lastBackward':'previous']();I&&this.setEndAt(I,v?2:4);}return!!(C||D);}},insertNode:function(u){var y=this;y.optimizeBookmark();y.trim(false,true);var v=y.startContainer,w=y.startOffset,x=v.getChild(w);if(x)u.insertBefore(x);else v.append(u);if(u.getParent().equals(y.endContainer))y.endOffset++;y.setStartBefore(u);},moveToPosition:function(u,v){this.setStartAt(u,v);this.collapse(true);},selectNodeContents:function(u){this.setStart(u,0);this.setEnd(u,u.type==3?u.getLength():u.getChildCount());},setStart:function(u,v){var w=this;if(u.type==1&&f.$empty[u.getName()])v=u.getIndex(),u=u.getParent();w.startContainer=u;w.startOffset=v;if(!w.endContainer){w.endContainer=u;w.endOffset=v;}l(w);},setEnd:function(u,v){var w=this;if(u.type==1&&f.$empty[u.getName()])v=u.getIndex()+1,u=u.getParent();
w.endContainer=u;w.endOffset=v;if(!w.startContainer){w.startContainer=u;w.startOffset=v;}l(w);},setStartAfter:function(u){this.setStart(u.getParent(),u.getIndex()+1);},setStartBefore:function(u){this.setStart(u.getParent(),u.getIndex());},setEndAfter:function(u){this.setEnd(u.getParent(),u.getIndex()+1);},setEndBefore:function(u){this.setEnd(u.getParent(),u.getIndex());},setStartAt:function(u,v){var w=this;switch(v){case 1:w.setStart(u,0);break;case 2:if(u.type==3)w.setStart(u,u.getLength());else w.setStart(u,u.getChildCount());break;case 3:w.setStartBefore(u);break;case 4:w.setStartAfter(u);}l(w);},setEndAt:function(u,v){var w=this;switch(v){case 1:w.setEnd(u,0);break;case 2:if(u.type==3)w.setEnd(u,u.getLength());else w.setEnd(u,u.getChildCount());break;case 3:w.setEndBefore(u);break;case 4:w.setEndAfter(u);}l(w);},fixBlock:function(u,v){var y=this;var w=y.createBookmark(),x=y.document.createElement(v);y.collapse(u);y.enlarge(2);y.extractContents().appendTo(x);x.trim();if(!c)x.appendBogus();y.insertNode(x);y.moveToBookmark(w);return x;},splitBlock:function(u){var E=this;var v=new d.elementPath(E.startContainer),w=new d.elementPath(E.endContainer),x=v.blockLimit,y=w.blockLimit,z=v.block,A=w.block,B=null;if(!x.equals(y))return null;if(u!='br'){if(!z){z=E.fixBlock(true,u);A=new d.elementPath(E.endContainer).block;}if(!A)A=E.fixBlock(false,u);}var C=z&&E.checkStartOfBlock(),D=A&&E.checkEndOfBlock();E.deleteContents();if(z&&z.equals(A))if(D){B=new d.elementPath(E.startContainer);E.moveToPosition(A,4);A=null;}else if(C){B=new d.elementPath(E.startContainer);E.moveToPosition(z,3);z=null;}else{A=E.splitElement(z);if(!c&&!z.is('ul','ol'))z.appendBogus();}return{previousBlock:z,nextBlock:A,wasStartOfBlock:C,wasEndOfBlock:D,elementPath:B};},splitElement:function(u){var x=this;if(!x.collapsed)return null;x.setEndAt(u,2);var v=x.extractContents(),w=u.clone(false);v.appendTo(w);w.insertAfter(u);x.moveToPosition(u,4);return w;},checkBoundaryOfElement:function(u,v){var w=v==1,x=this.clone();x.collapse(w);x[w?'setStartAt':'setEndAt'](u,w?1:2);var y=new d.walker(x);y.evaluator=q(w);return y[w?'checkBackward':'checkForward']();},checkStartOfBlock:function(){var A=this;var u=A.startContainer,v=A.startOffset;if(v&&u.type==3){var w=e.ltrim(u.substring(0,v));if(w.length)return false;}var x=new d.elementPath(A.startContainer),y=A.clone();y.collapse(true);y.setStartAt(x.block||x.blockLimit,1);var z=new d.walker(y);z.evaluator=o(true);return z.checkBackward();},checkEndOfBlock:function(){var A=this;
var u=A.endContainer,v=A.endOffset;if(u.type==3){var w=e.rtrim(u.substring(v));if(w.length)return false;}var x=new d.elementPath(A.endContainer),y=A.clone();y.collapse(false);y.setEndAt(x.block||x.blockLimit,2);var z=new d.walker(y);z.evaluator=o(false);return z.checkForward();},checkReadOnly:(function(){function u(v,w){while(v){if(v.type==1)if(v.getAttribute('contentEditable')=='false'&&!v.data('cke-editable'))return 0;else if(v.is('html')||v.getAttribute('contentEditable')=='true'&&(v.contains(w)||v.equals(w)))break;v=v.getParent();}return 1;};return function(){var v=this.startContainer,w=this.endContainer;return!(u(v,w)&&u(w,v));};})(),moveToElementEditablePosition:function(u,v){var w=/^[\t\r\n ]*(?:&nbsp;|\xa0)$/;function x(z,A){var B;if(z.type==1&&z.isEditable(false))B=z[v?'getLast':'getFirst'](t);if(!A&&!B)B=z[v?'getPrevious':'getNext'](t);return B;};if(u.type==1&&!u.isEditable(false)){this.moveToPosition(u,v?4:3);return true;}var y=0;while(u){if(u.type==3){if(v&&this.checkEndOfBlock()&&w.test(u.getText()))this.moveToPosition(u,3);else this.moveToPosition(u,v?4:3);y=1;break;}if(u.type==1)if(u.isEditable()){this.moveToPosition(u,v?2:1);y=1;}else if(v&&u.is('br')&&this.checkEndOfBlock())this.moveToPosition(u,3);u=x(u,y);}return!!y;},moveToElementEditStart:function(u){return this.moveToElementEditablePosition(u);},moveToElementEditEnd:function(u){return this.moveToElementEditablePosition(u,true);},getEnclosedNode:function(){var u=this.clone();u.optimize();if(u.startContainer.type!=1||u.endContainer.type!=1)return null;var v=new d.walker(u),w=d.walker.bookmark(true),x=d.walker.whitespaces(true),y=function(A){return x(A)&&w(A);};u.evaluator=y;var z=v.next();v.reset();return z&&z.equals(v.previous())?z:null;},getTouchedStartNode:function(){var u=this.startContainer;if(this.collapsed||u.type!=1)return u;return u.getChild(this.startOffset)||u;},getTouchedEndNode:function(){var u=this.endContainer;if(this.collapsed||u.type!=1)return u;return u.getChild(this.endOffset-1)||u;}};})();a.POSITION_AFTER_START=1;a.POSITION_BEFORE_END=2;a.POSITION_BEFORE_START=3;a.POSITION_AFTER_END=4;a.ENLARGE_ELEMENT=1;a.ENLARGE_BLOCK_CONTENTS=2;a.ENLARGE_LIST_ITEM_CONTENTS=3;a.START=1;a.END=2;a.STARTEND=3;a.SHRINK_ELEMENT=1;a.SHRINK_TEXT=2;(function(){d.rangeList=function(n){if(n instanceof d.rangeList)return n;if(!n)n=[];else if(n instanceof d.range)n=[n];return e.extend(n,l);};var l={createIterator:function(){var n=this,o=d.walker.bookmark(),p=function(s){return!(s.is&&s.is('tr'));
},q=[],r;return{getNextRange:function(s){r=r==undefined?0:r+1;var t=n[r];if(t&&n.length>1){if(!r)for(var u=n.length-1;u>=0;u--)q.unshift(n[u].createBookmark(true));if(s){var v=0;while(n[r+v+1]){var w=t.document,x=0,y=w.getById(q[v].endNode),z=w.getById(q[v+1].startNode),A;while(1){A=y.getNextSourceNode(false);if(!z.equals(A)){if(o(A)||A.type==1&&A.isBlockBoundary()){y=A;continue;}}else x=1;break;}if(!x)break;v++;}}t.moveToBookmark(q.shift());while(v--){A=n[++r];A.moveToBookmark(q.shift());t.setEnd(A.endContainer,A.endOffset);}}return t;}};},createBookmarks:function(n){var s=this;var o=[],p;for(var q=0;q<s.length;q++){o.push(p=s[q].createBookmark(n,true));for(var r=q+1;r<s.length;r++){s[r]=m(p,s[r]);s[r]=m(p,s[r],true);}}return o;},createBookmarks2:function(n){var o=[];for(var p=0;p<this.length;p++)o.push(this[p].createBookmark2(n));return o;},moveToBookmarks:function(n){for(var o=0;o<this.length;o++)this[o].moveToBookmark(n[o]);}};function m(n,o,p){var q=n.serializable,r=o[p?'endContainer':'startContainer'],s=p?'endOffset':'startOffset',t=q?o.document.getById(n.startNode):n.startNode,u=q?o.document.getById(n.endNode):n.endNode;if(r.equals(t.getPrevious())){o.startOffset=o.startOffset-r.getLength()-u.getPrevious().getLength();r=u.getNext();}else if(r.equals(u.getPrevious())){o.startOffset=o.startOffset-r.getLength();r=u.getNext();}r.equals(t.getParent())&&o[s]++;r.equals(u.getParent())&&o[s]++;o[p?'endContainer':'startContainer']=r;return o;};})();(function(){if(b.webkit){b.hc=false;return;}var l=h.createFromHtml('<div style="width:0px;height:0px;position:absolute;left:-10000px;border: 1px solid;border-color: red blue;"></div>',a.document);l.appendTo(a.document.getHead());try{b.hc=l.getComputedStyle('border-top-color')==l.getComputedStyle('border-right-color');}catch(m){b.hc=false;}if(b.hc)b.cssClass+=' cke_hc';l.remove();})();j.load(i.corePlugins.split(','),function(){a.status='loaded';a.fire('loaded');var l=a._.pending;if(l){delete a._.pending;for(var m=0;m<l.length;m++)a.add(l[m]);}});if(c)try{document.execCommand('BackgroundImageCache',false,true);}catch(l){}a.skins.add('kama',(function(){var m='cke_ui_color';return{editor:{css:['editor.css']},dialog:{css:['dialog.css']},richcombo:{canGroup:false},templates:{css:['templates.css']},margins:[0,0,0,0],init:function(n){if(n.config.width&&!isNaN(n.config.width))n.config.width-=12;var o=[],p=/\$color/g,q='/* UI Color Support */.cke_skin_kama .cke_menuitem .cke_icon_wrapper{\tbackground-color: $color !important;\tborder-color: $color !important;}.cke_skin_kama .cke_menuitem a:hover .cke_icon_wrapper,.cke_skin_kama .cke_menuitem a:focus .cke_icon_wrapper,.cke_skin_kama .cke_menuitem a:active .cke_icon_wrapper{\tbackground-color: $color !important;\tborder-color: $color !important;}.cke_skin_kama .cke_menuitem a:hover .cke_label,.cke_skin_kama .cke_menuitem a:focus .cke_label,.cke_skin_kama .cke_menuitem a:active .cke_label{\tbackground-color: $color !important;}.cke_skin_kama .cke_menuitem a.cke_disabled:hover .cke_label,.cke_skin_kama .cke_menuitem a.cke_disabled:focus .cke_label,.cke_skin_kama .cke_menuitem a.cke_disabled:active .cke_label{\tbackground-color: transparent !important;}.cke_skin_kama .cke_menuitem a.cke_disabled:hover .cke_icon_wrapper,.cke_skin_kama .cke_menuitem a.cke_disabled:focus .cke_icon_wrapper,.cke_skin_kama .cke_menuitem a.cke_disabled:active .cke_icon_wrapper{\tbackground-color: $color !important;\tborder-color: $color !important;}.cke_skin_kama .cke_menuitem a.cke_disabled .cke_icon_wrapper{\tbackground-color: $color !important;\tborder-color: $color !important;}.cke_skin_kama .cke_menuseparator{\tbackground-color: $color !important;}.cke_skin_kama .cke_menuitem a:hover,.cke_skin_kama .cke_menuitem a:focus,.cke_skin_kama .cke_menuitem a:active{\tbackground-color: $color !important;}';
if(b.webkit){q=q.split('}').slice(0,-1);for(var r=0;r<q.length;r++)q[r]=q[r].split('{');}function s(v){var w=v.getById(m);if(!w){w=v.getHead().append('style');w.setAttribute('id',m);w.setAttribute('type','text/css');}return w;};function t(v,w,x){var y,z,A;for(var B=0;B<v.length;B++){if(b.webkit)for(z=0;z<w.length;z++){A=w[z][1];for(y=0;y<x.length;y++)A=A.replace(x[y][0],x[y][1]);v[B].$.sheet.addRule(w[z][0],A);}else{A=w;for(y=0;y<x.length;y++)A=A.replace(x[y][0],x[y][1]);if(c)v[B].$.styleSheet.cssText+=A;else v[B].$.innerHTML+=A;}}};var u=/\$color/g;e.extend(n,{uiColor:null,getUiColor:function(){return this.uiColor;},setUiColor:function(v){var w,x=s(a.document),y='.'+n.id,z=[y+' .cke_wrapper',y+'_dialog .cke_dialog_contents',y+'_dialog a.cke_dialog_tab',y+'_dialog .cke_dialog_footer'].join(','),A='background-color: $color !important;';if(b.webkit)w=[[z,A]];else w=z+'{'+A+'}';return(this.setUiColor=function(B){var C=[[u,B]];n.uiColor=B;t([x],w,C);t(o,q,C);})(v);}});n.on('menuShow',function(v){var w=v.data[0],x=w.element.getElementsByTag('iframe').getItem(0).getFrameDocument();if(!x.getById('cke_ui_color')){var y=s(x);o.push(y);var z=n.getUiColor();if(z)t([y],q,[[u,z]]);}});if(n.config.uiColor)n.setUiColor(n.config.uiColor);}};})());(function(){a.dialog?m():a.on('dialogPluginReady',m);function m(){a.dialog.on('resize',function(n){var o=n.data,p=o.width,q=o.height,r=o.dialog,s=r.parts.contents;if(o.skin!='kama')return;s.setStyles({width:p+'px',height:q+'px'});});};})();j.add('about',{requires:['dialog'],init:function(m){var n=m.addCommand('about',new a.dialogCommand('about'));n.modes={wysiwyg:1,source:1};n.canUndo=false;n.readOnly=1;m.ui.addButton('About',{label:m.lang.about.title,command:'about'});a.dialog.add('about',this.path+'dialogs/about.js');}});(function(){var m='a11yhelp',n='a11yHelp';j.add(m,{requires:['dialog'],availableLangs:{cs:1,cy:1,da:1,de:1,el:1,en:1,eo:1,fa:1,fi:1,fr:1,gu:1,he:1,it:1,mk:1,nb:1,nl:1,no:1,'pt-br':1,ro:1,tr:1,ug:1,vi:1,'zh-cn':1},init:function(o){var p=this;o.addCommand(n,{exec:function(){var q=o.langCode;q=p.availableLangs[q]?q:'en';a.scriptLoader.load(a.getUrl(p.path+'lang/'+q+'.js'),function(){e.extend(o.lang,p.langEntries[q]);o.openDialog(n);});},modes:{wysiwyg:1,source:1},readOnly:1,canUndo:false});a.dialog.add(n,this.path+'dialogs/a11yhelp.js');}});})();j.add('basicstyles',{requires:['styles','button'],init:function(m){var n=function(q,r,s,t){var u=new a.style(t);m.attachStyleStateChange(u,function(v){!m.readOnly&&m.getCommand(s).setState(v);
});m.addCommand(s,new a.styleCommand(u));m.ui.addButton(q,{label:r,command:s});},o=m.config,p=m.lang;n('Bold',p.bold,'bold',o.coreStyles_bold);n('Italic',p.italic,'italic',o.coreStyles_italic);n('Underline',p.underline,'underline',o.coreStyles_underline);n('Strike',p.strike,'strike',o.coreStyles_strike);n('Subscript',p.subscript,'subscript',o.coreStyles_subscript);n('Superscript',p.superscript,'superscript',o.coreStyles_superscript);}});i.coreStyles_bold={element:'strong',overrides:'b'};i.coreStyles_italic={element:'em',overrides:'i'};i.coreStyles_underline={element:'u'};i.coreStyles_strike={element:'strike'};i.coreStyles_subscript={element:'sub'};i.coreStyles_superscript={element:'sup'};(function(){var m={table:1,ul:1,ol:1,blockquote:1,div:1},n={},o={};e.extend(n,m,{tr:1,p:1,div:1,li:1});e.extend(o,n,{td:1});function p(B){q(B);r(B);};function q(B){var C=B.editor,D=B.data.path;if(C.readOnly)return;var E=C.config.useComputedState,F;E=E===undefined||E;if(!E)F=s(D.lastElement);F=F||D.block||D.blockLimit;if(F.is('body')){var G=C.getSelection().getRanges()[0].getEnclosedNode();G&&G.type==1&&(F=G);}if(!F)return;var H=E?F.getComputedStyle('direction'):F.getStyle('direction')||F.getAttribute('dir');C.getCommand('bidirtl').setState(H=='rtl'?1:2);C.getCommand('bidiltr').setState(H=='ltr'?1:2);};function r(B){var C=B.editor,D=B.data.path.block||B.data.path.blockLimit;C.fire('contentDirChanged',D?D.getComputedStyle('direction'):C.lang.dir);};function s(B){while(B&&!(B.getName() in o||B.is('body'))){var C=B.getParent();if(!C)break;B=C;}return B;};function t(B,C,D,E){if(B.isReadOnly())return;h.setMarker(E,B,'bidi_processed',1);var F=B;while((F=F.getParent())&&!F.is('body')){if(F.getCustomData('bidi_processed')){B.removeStyle('direction');B.removeAttribute('dir');return;}}var G='useComputedState' in D.config?D.config.useComputedState:1,H=G?B.getComputedStyle('direction'):B.getStyle('direction')||B.hasAttribute('dir');if(H==C)return;B.removeStyle('direction');if(G){B.removeAttribute('dir');if(C!=B.getComputedStyle('direction'))B.setAttribute('dir',C);}else B.setAttribute('dir',C);D.forceNextSelectionCheck();};function u(B,C,D){var E=B.getCommonAncestor(false,true);B=B.clone();B.enlarge(D==2?3:2);if(B.checkBoundaryOfElement(E,1)&&B.checkBoundaryOfElement(E,2)){var F;while(E&&E.type==1&&(F=E.getParent())&&F.getChildCount()==1&&!(E.getName() in C))E=F;return E.type==1&&E.getName() in C&&E;}};function v(B){return function(C){var D=C.getSelection(),E=C.config.enterMode,F=D.getRanges();
if(F&&F.length){var G={},H=D.createBookmarks(),I=F.createIterator(),J,K=0;while(J=I.getNextRange(1)){var L=J.getEnclosedNode();if(!L||L&&!(L.type==1&&L.getName() in n))L=u(J,m,E);L&&t(L,B,C,G);var M,N,O=new d.walker(J),P=H[K].startNode,Q=H[K++].endNode;O.evaluator=function(R){return!!(R.type==1&&R.getName() in m&&!(R.getName()==(E==1?'p':'div')&&R.getParent().type==1&&R.getParent().getName()=='blockquote')&&R.getPosition(P)&2&&(R.getPosition(Q)&4+16)==4);};while(N=O.next())t(N,B,C,G);M=J.createIterator();M.enlargeBr=E!=2;while(N=M.getNextParagraph(E==1?'p':'div'))t(N,B,C,G);}h.clearAllMarkers(G);C.forceNextSelectionCheck();D.selectBookmarks(H);C.focus();}};};j.add('bidi',{requires:['styles','button'],init:function(B){var C=function(E,F,G,H){B.addCommand(G,new a.command(B,{exec:H}));B.ui.addButton(E,{label:F,command:G});},D=B.lang.bidi;C('BidiLtr',D.ltr,'bidiltr',v('ltr'));C('BidiRtl',D.rtl,'bidirtl',v('rtl'));B.on('selectionChange',p);B.on('contentDom',function(){B.document.on('dirChanged',function(E){B.fire('dirChanged',{node:E.data,dir:E.data.getDirection(1)});});});}});function w(B){var C=B.getDocument().getBody().getParent();while(B){if(B.equals(C))return false;B=B.getParent();}return true;};function x(B){var C=B==y.setAttribute,D=B==y.removeAttribute,E=/\bdirection\s*:\s*(.*?)\s*(:?$|;)/;return function(F,G){var J=this;if(!J.getDocument().equals(a.document)){var H;if((F==(C||D?'dir':'direction')||F=='style'&&(D||E.test(G)))&&!w(J)){H=J.getDirection(1);var I=B.apply(J,arguments);if(H!=J.getDirection(1)){J.getDocument().fire('dirChanged',J);return I;}}}return B.apply(J,arguments);};};var y=h.prototype,z=['setStyle','removeStyle','setAttribute','removeAttribute'];for(var A=0;A<z.length;A++)y[z[A]]=e.override(y[z[A]],x);})();(function(){function m(q,r){var s=r.block||r.blockLimit;if(!s||s.getName()=='body')return 2;if(s.getAscendant('blockquote',true))return 1;return 2;};function n(q){var r=q.editor;if(r.readOnly)return;var s=r.getCommand('blockquote');s.state=m(r,q.data.path);s.fire('state');};function o(q){for(var r=0,s=q.getChildCount(),t;r<s&&(t=q.getChild(r));r++){if(t.type==1&&t.isBlockBoundary())return false;}return true;};var p={exec:function(q){var r=q.getCommand('blockquote').state,s=q.getSelection(),t=s&&s.getRanges(true)[0];if(!t)return;var u=s.createBookmarks();if(c){var v=u[0].startNode,w=u[0].endNode,x;if(v&&v.getParent().getName()=='blockquote'){x=v;while(x=x.getNext()){if(x.type==1&&x.isBlockBoundary()){v.move(x,true);break;}}}if(w&&w.getParent().getName()=='blockquote'){x=w;
while(x=x.getPrevious()){if(x.type==1&&x.isBlockBoundary()){w.move(x);break;}}}}var y=t.createIterator(),z;y.enlargeBr=q.config.enterMode!=2;if(r==2){var A=[];while(z=y.getNextParagraph())A.push(z);if(A.length<1){var B=q.document.createElement(q.config.enterMode==1?'p':'div'),C=u.shift();t.insertNode(B);B.append(new d.text('\ufeff',q.document));t.moveToBookmark(C);t.selectNodeContents(B);t.collapse(true);C=t.createBookmark();A.push(B);u.unshift(C);}var D=A[0].getParent(),E=[];for(var F=0;F<A.length;F++){z=A[F];D=D.getCommonAncestor(z.getParent());}var G={table:1,tbody:1,tr:1,ol:1,ul:1};while(G[D.getName()])D=D.getParent();var H=null;while(A.length>0){z=A.shift();while(!z.getParent().equals(D))z=z.getParent();if(!z.equals(H))E.push(z);H=z;}while(E.length>0){z=E.shift();if(z.getName()=='blockquote'){var I=new d.documentFragment(q.document);while(z.getFirst()){I.append(z.getFirst().remove());A.push(I.getLast());}I.replace(z);}else A.push(z);}var J=q.document.createElement('blockquote');J.insertBefore(A[0]);while(A.length>0){z=A.shift();J.append(z);}}else if(r==1){var K=[],L={};while(z=y.getNextParagraph()){var M=null,N=null;while(z.getParent()){if(z.getParent().getName()=='blockquote'){M=z.getParent();N=z;break;}z=z.getParent();}if(M&&N&&!N.getCustomData('blockquote_moveout')){K.push(N);h.setMarker(L,N,'blockquote_moveout',true);}}h.clearAllMarkers(L);var O=[],P=[];L={};while(K.length>0){var Q=K.shift();J=Q.getParent();if(!Q.getPrevious())Q.remove().insertBefore(J);else if(!Q.getNext())Q.remove().insertAfter(J);else{Q.breakParent(Q.getParent());P.push(Q.getNext());}if(!J.getCustomData('blockquote_processed')){P.push(J);h.setMarker(L,J,'blockquote_processed',true);}O.push(Q);}h.clearAllMarkers(L);for(F=P.length-1;F>=0;F--){J=P[F];if(o(J))J.remove();}if(q.config.enterMode==2){var R=true;while(O.length){Q=O.shift();if(Q.getName()=='div'){I=new d.documentFragment(q.document);var S=R&&Q.getPrevious()&&!(Q.getPrevious().type==1&&Q.getPrevious().isBlockBoundary());if(S)I.append(q.document.createElement('br'));var T=Q.getNext()&&!(Q.getNext().type==1&&Q.getNext().isBlockBoundary());while(Q.getFirst())Q.getFirst().remove().appendTo(I);if(T)I.append(q.document.createElement('br'));I.replace(Q);R=false;}}}}s.selectBookmarks(u);q.focus();}};j.add('blockquote',{init:function(q){q.addCommand('blockquote',p);q.ui.addButton('Blockquote',{label:q.lang.blockquote,command:'blockquote'});q.on('selectionChange',n);},requires:['domiterator']});})();j.add('button',{beforeInit:function(m){m.ui.addHandler('button',k.button.handler);
}});a.UI_BUTTON='button';k.button=function(m){e.extend(this,m,{title:m.label,className:m.className||m.command&&'cke_button_'+m.command||'',click:m.click||(function(n){n.execCommand(m.command);})});this._={};};k.button.handler={create:function(m){return new k.button(m);}};(function(){k.button.prototype={render:function(m,n){var o=b,p=this._.id=e.getNextId(),q='',r=this.command,s;this._.editor=m;var t={id:p,button:this,editor:m,focus:function(){var z=a.document.getById(p);z.focus();},execute:function(){if(c&&b.version<7)e.setTimeout(function(){this.button.click(m);},0,this);else this.button.click(m);}},u=e.addFunction(function(z){if(t.onkey){z=new d.event(z);return t.onkey(t,z.getKeystroke())!==false;}}),v=e.addFunction(function(z){var A;if(t.onfocus)A=t.onfocus(t,new d.event(z))!==false;if(b.gecko&&b.version<10900)z.preventBubble();return A;});t.clickFn=s=e.addFunction(t.execute,t);if(this.modes){var w={};function x(){var z=m.mode;if(z){var A=this.modes[z]?w[z]!=undefined?w[z]:2:0;this.setState(m.readOnly&&!this.readOnly?0:A);}};m.on('beforeModeUnload',function(){if(m.mode&&this._.state!=0)w[m.mode]=this._.state;},this);m.on('mode',x,this);!this.readOnly&&m.on('readOnly',x,this);}else if(r){r=m.getCommand(r);if(r){r.on('state',function(){this.setState(r.state);},this);q+='cke_'+(r.state==1?'on':r.state==0?'disabled':'off');}}if(!r)q+='cke_off';if(this.className)q+=' '+this.className;n.push('<span class="cke_button'+(this.icon&&this.icon.indexOf('.png')==-1?' cke_noalphafix':'')+'">','<a id="',p,'" class="',q,'"',o.gecko&&o.version>=10900&&!o.hc?'':'" href="javascript:void(\''+(this.title||'').replace("'",'')+"')\"",' title="',this.title,'" tabindex="-1" hidefocus="true" role="button" aria-labelledby="'+p+'_label"'+(this.hasArrow?' aria-haspopup="true"':''));if(o.opera||o.gecko&&o.mac)n.push(' onkeypress="return false;"');if(o.gecko)n.push(' onblur="this.style.cssText = this.style.cssText;"');n.push(' onkeydown="return CKEDITOR.tools.callFunction(',u,', event);" onfocus="return CKEDITOR.tools.callFunction(',v,', event);" '+(c?'onclick="return false;" onmouseup':'onclick')+'="CKEDITOR.tools.callFunction(',s,', this); return false;"><span class="cke_icon"');if(this.icon){var y=(this.iconOffset||0)*-16;n.push(' style="background-image:url(',a.getUrl(this.icon),');background-position:0 '+y+'px;"');}n.push('>&nbsp;</span><span id="',p,'_label" class="cke_label">',this.label,'</span>');if(this.hasArrow)n.push('<span class="cke_buttonarrow">'+(b.hc?'&#9660;':'&nbsp;')+'</span>');
n.push('</a>','</span>');if(this.onRender)this.onRender();return t;},setState:function(m){if(this._.state==m)return false;this._.state=m;var n=a.document.getById(this._.id);if(n){n.setState(m);m==0?n.setAttribute('aria-disabled',true):n.removeAttribute('aria-disabled');m==1?n.setAttribute('aria-pressed',true):n.removeAttribute('aria-pressed');return true;}else return false;}};})();k.prototype.addButton=function(m,n){this.add(m,'button',n);};(function(){var m=function(y,z){var A=y.document,B=A.getBody(),C=false,D=function(){C=true;};B.on(z,D);(b.version>7?A.$:A.$.selection.createRange()).execCommand(z);B.removeListener(z,D);return C;},n=c?function(y,z){return m(y,z);}:function(y,z){try{return y.document.$.execCommand(z,false,null);}catch(A){return false;}},o=function(y){var z=this;z.type=y;z.canUndo=z.type=='cut';z.startDisabled=true;};o.prototype={exec:function(y,z){this.type=='cut'&&t(y);var A=n(y,this.type);if(!A)alert(y.lang.clipboard[this.type+'Error']);return A;}};var p={canUndo:false,exec:c?function(y){y.focus();if(!y.document.getBody().fire('beforepaste')&&!m(y,'paste')){y.fire('pasteDialog');return false;}}:function(y){try{if(!y.document.getBody().fire('beforepaste')&&!y.document.$.execCommand('Paste',false,null))throw 0;}catch(z){setTimeout(function(){y.fire('pasteDialog');},0);return false;}}},q=function(y){if(this.mode!='wysiwyg')return;switch(y.data.keyCode){case 1114112+86:case 2228224+45:var z=this.document.getBody();if(b.opera||b.gecko)z.fire('paste');return;case 1114112+88:case 2228224+46:var A=this;this.fire('saveSnapshot');setTimeout(function(){A.fire('saveSnapshot');},0);}};function r(y){y.cancel();};function s(y,z,A){var B=this.document;if(B.getById('cke_pastebin'))return;if(z=='text'&&y.data&&y.data.$.clipboardData){var C=y.data.$.clipboardData.getData('text/plain');if(C){y.data.preventDefault();A(C);return;}}var D=this.getSelection(),E=new d.range(B),F=new h(z=='text'?'textarea':b.webkit?'body':'div',B);F.setAttribute('id','cke_pastebin');b.webkit&&F.append(B.createText('\xa0'));B.getBody().append(F);F.setStyles({position:'absolute',top:D.getStartElement().getDocumentPosition().y+'px',width:'1px',height:'1px',overflow:'hidden'});F.setStyle(this.config.contentsLangDirection=='ltr'?'left':'right','-1000px');var G=D.createBookmarks();this.on('selectionChange',r,null,null,0);if(z=='text')F.$.focus();else{E.setStartAt(F,1);E.setEndAt(F,2);E.select(true);}var H=this;window.setTimeout(function(){H.document.getBody().focus();H.removeListener('selectionChange',r);
if(b.ie7Compat){D.selectBookmarks(G);F.remove();}else{F.remove();D.selectBookmarks(G);}var I;F=b.webkit&&(I=F.getFirst())&&I.is&&I.hasClass('Apple-style-span')?I:F;A(F['get'+(z=='text'?'Value':'Html')]());},0);};function t(y){if(!c||b.quirks)return;var z=y.getSelection(),A;if(z.getType()==3&&(A=z.getSelectedElement())){var B=z.getRanges()[0],C=y.document.createText('');C.insertBefore(A);B.setStartBefore(C);B.setEndAfter(A);z.selectRanges([B]);setTimeout(function(){if(A.getParent()){C.remove();z.selectElement(A);}},0);}};var u,v;function w(y,z){var A;if(v&&y in {Paste:1,Cut:1})return 0;if(y=='Paste'){c&&(u=1);try{A=z.document.$.queryCommandEnabled(y)||b.webkit;}catch(D){}u=0;}else{var B=z.getSelection(),C=B&&B.getRanges();A=B&&!(C.length==1&&C[0].collapsed);}return A?2:0;};function x(){var z=this;if(z.mode!='wysiwyg')return;var y=w('Paste',z);z.getCommand('cut').setState(w('Cut',z));z.getCommand('copy').setState(w('Copy',z));z.getCommand('paste').setState(y);z.fire('pasteState',y);};j.add('clipboard',{requires:['dialog','htmldataprocessor'],init:function(y){y.on('paste',function(A){var B=A.data;if(B.html)y.insertHtml(B.html);else if(B.text)y.insertText(B.text);setTimeout(function(){y.fire('afterPaste');},0);},null,null,1000);y.on('pasteDialog',function(A){setTimeout(function(){y.openDialog('paste');},0);});y.on('pasteState',function(A){y.getCommand('paste').setState(A.data);});function z(A,B,C,D){var E=y.lang[B];y.addCommand(B,C);y.ui.addButton(A,{label:E,command:B});if(y.addMenuItems)y.addMenuItem(B,{label:E,command:B,group:'clipboard',order:D});};z('Cut','cut',new o('cut'),1);z('Copy','copy',new o('copy'),4);z('Paste','paste',p,8);a.dialog.add('paste',a.getUrl(this.path+'dialogs/paste.js'));y.on('key',q,y);y.on('contentDom',function(){var A=y.document.getBody();A.on(!c?'paste':'beforepaste',function(B){if(u)return;var C=B.data&&B.data.$;if(c&&C&&!C.ctrlKey)return;var D={mode:'html'};y.fire('beforePaste',D);s.call(y,B,D.mode,function(E){if(!(E=e.trim(E.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig,''))))return;var F={};F[D.mode]=E;y.fire('paste',F);});});if(c){A.on('contextmenu',function(){u=1;setTimeout(function(){u=0;},0);});A.on('paste',function(B){if(!y.document.getById('cke_pastebin')){B.data.preventDefault();u=0;p.exec(y);}});}A.on('beforecut',function(){!u&&t(y);});A.on('mouseup',function(){setTimeout(function(){x.call(y);},0);},y);A.on('keyup',x,y);});y.on('selectionChange',function(A){v=A.data.selection.getRanges()[0].checkReadOnly();x.call(y);
});if(y.contextMenu)y.contextMenu.addListener(function(A,B){var C=B.getRanges()[0].checkReadOnly();return{cut:w('Cut',y),copy:w('Copy',y),paste:w('Paste',y)};});}});})();j.add('colorbutton',{requires:['panelbutton','floatpanel','styles'],init:function(m){var n=m.config,o=m.lang.colorButton,p;if(!b.hc){q('TextColor','fore',o.textColorTitle);q('BGColor','back',o.bgColorTitle);}function q(t,u,v){var w=e.getNextId()+'_colorBox';m.ui.add(t,'panelbutton',{label:v,title:v,className:'cke_button_'+t.toLowerCase(),modes:{wysiwyg:1},panel:{css:m.skin.editor.css,attributes:{role:'listbox','aria-label':o.panelTitle}},onBlock:function(x,y){y.autoSize=true;y.element.addClass('cke_colorblock');y.element.setHtml(r(x,u,w));y.element.getDocument().getBody().setStyle('overflow','hidden');k.fire('ready',this);var z=y.keys,A=m.lang.dir=='rtl';z[A?37:39]='next';z[40]='next';z[9]='next';z[A?39:37]='prev';z[38]='prev';z[2228224+9]='prev';z[32]='click';},onOpen:function(){var x=m.getSelection(),y=x&&x.getStartElement(),z=new d.elementPath(y),A;y=z.block||z.blockLimit||m.document.getBody();do A=y&&y.getComputedStyle(u=='back'?'background-color':'color')||'transparent';while(u=='back'&&A=='transparent'&&y&&(y=y.getParent()));if(!A||A=='transparent')A='#ffffff';this._.panel._.iframe.getFrameDocument().getById(w).setStyle('background-color',A);}});};function r(t,u,v){var w=[],x=n.colorButton_colors.split(','),y=e.addFunction(function(E,F){if(E=='?'){var G=arguments.callee;function H(J){this.removeListener('ok',H);this.removeListener('cancel',H);J.name=='ok'&&G(this.getContentElement('picker','selectedColor').getValue(),F);};m.openDialog('colordialog',function(){this.on('ok',H);this.on('cancel',H);});return;}m.focus();t.hide(false);m.fire('saveSnapshot');new a.style(n['colorButton_'+F+'Style'],{color:'inherit'}).remove(m.document);if(E){var I=n['colorButton_'+F+'Style'];I.childRule=F=='back'?function(J){return s(J);}:function(J){return!(J.is('a')||J.getElementsByTag('a').count())||s(J);};new a.style(I,{color:E}).apply(m.document);}m.fire('saveSnapshot');});w.push('<a class="cke_colorauto" _cke_focus=1 hidefocus=true title="',o.auto,'" onclick="CKEDITOR.tools.callFunction(',y,",null,'",u,"');return false;\" href=\"javascript:void('",o.auto,'\')" role="option"><table role="presentation" cellspacing=0 cellpadding=0 width="100%"><tr><td><span class="cke_colorbox" id="',v,'"></span></td><td colspan=7 align=center>',o.auto,'</td></tr></table></a><table role="presentation" cellspacing=0 cellpadding=0 width="100%">');
for(var z=0;z<x.length;z++){if(z%8===0)w.push('</tr><tr>');var A=x[z].split('/'),B=A[0],C=A[1]||B;if(!A[1])B='#'+B.replace(/^(.)(.)(.)$/,'$1$1$2$2$3$3');var D=m.lang.colors[C]||C;w.push('<td><a class="cke_colorbox" _cke_focus=1 hidefocus=true title="',D,'" onclick="CKEDITOR.tools.callFunction(',y,",'",B,"','",u,"'); return false;\" href=\"javascript:void('",D,'\')" role="option"><span class="cke_colorbox" style="background-color:#',C,'"></span></a></td>');}if(n.colorButton_enableMore===undefined||n.colorButton_enableMore)w.push('</tr><tr><td colspan=8 align=center><a class="cke_colormore" _cke_focus=1 hidefocus=true title="',o.more,'" onclick="CKEDITOR.tools.callFunction(',y,",'?','",u,"');return false;\" href=\"javascript:void('",o.more,"')\"",' role="option">',o.more,'</a></td>');w.push('</tr></table>');return w.join('');};function s(t){return t.getAttribute('contentEditable')=='false'||t.getAttribute('data-nostyle');};}});i.colorButton_colors='000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF';i.colorButton_foreStyle={element:'span',styles:{color:'#(color)'},overrides:[{element:'font',attributes:{color:null}}]};i.colorButton_backStyle={element:'span',styles:{'background-color':'#(color)'}};j.colordialog={requires:['dialog'],init:function(m){m.addCommand('colordialog',new a.dialogCommand('colordialog'));a.dialog.add('colordialog',this.path+'dialogs/colordialog.js');}};j.add('colordialog',j.colordialog);j.add('contextmenu',{requires:['menu'],onLoad:function(){j.contextMenu=e.createClass({base:a.menu,$:function(m){this.base.call(this,m,{panel:{className:m.skinClass+' cke_contextmenu',attributes:{'aria-label':m.lang.contextmenu.options}}});},proto:{addTarget:function(m,n){if(b.opera&&!('oncontextmenu' in document.body)){var o;m.on('mousedown',function(s){s=s.data;if(s.$.button!=2){if(s.getKeystroke()==1114112+1)m.fire('contextmenu',s);return;}if(n&&(b.mac?s.$.metaKey:s.$.ctrlKey))return;var t=s.getTarget();if(!o){var u=t.getDocument();o=u.createElement('input');o.$.type='button';u.getBody().append(o);}o.setAttribute('style','position:absolute;top:'+(s.$.clientY-2)+'px;left:'+(s.$.clientX-2)+'px;width:5px;height:5px;opacity:0.01');});m.on('mouseup',function(s){if(o){o.remove();o=undefined;m.fire('contextmenu',s.data);}});}m.on('contextmenu',function(s){var t=s.data;
if(n&&(b.webkit?p:b.mac?t.$.metaKey:t.$.ctrlKey))return;t.preventDefault();var u=t.getTarget().getDocument().getDocumentElement(),v=t.$.clientX,w=t.$.clientY;e.setTimeout(function(){this.open(u,null,v,w);},c?200:0,this);},this);if(b.opera)m.on('keypress',function(s){var t=s.data;if(t.$.keyCode===0)t.preventDefault();});if(b.webkit){var p,q=function(s){p=b.mac?s.data.$.metaKey:s.data.$.ctrlKey;},r=function(){p=0;};m.on('keydown',q);m.on('keyup',r);m.on('contextmenu',r);}},open:function(m,n,o,p){this.editor.focus();m=m||a.document.getDocumentElement();this.show(m,n,o,p);}}});},beforeInit:function(m){m.contextMenu=new j.contextMenu(m);m.addCommand('contextMenu',{exec:function(){m.contextMenu.open(m.document.getBody());}});}});(function(){function m(o){var p=this.att,q=o&&o.hasAttribute(p)&&o.getAttribute(p)||'';if(q!==undefined)this.setValue(q);};function n(){var o;for(var p=0;p<arguments.length;p++){if(arguments[p] instanceof h){o=arguments[p];break;}}if(o){var q=this.att,r=this.getValue();if(r)o.setAttribute(q,r);else o.removeAttribute(q,r);}};j.add('dialogadvtab',{createAdvancedTab:function(o,p){if(!p)p={id:1,dir:1,classes:1,styles:1};var q=o.lang.common,r={id:'advanced',label:q.advancedTab,title:q.advancedTab,elements:[{type:'vbox',padding:1,children:[]}]},s=[];if(p.id||p.dir){if(p.id)s.push({id:'advId',att:'id',type:'text',label:q.id,setup:m,commit:n});if(p.dir)s.push({id:'advLangDir',att:'dir',type:'select',label:q.langDir,'default':'',style:'width:100%',items:[[q.notSet,''],[q.langDirLTR,'ltr'],[q.langDirRTL,'rtl']],setup:m,commit:n});r.elements[0].children.push({type:'hbox',widths:['50%','50%'],children:[].concat(s)});}if(p.styles||p.classes){s=[];if(p.styles)s.push({id:'advStyles',att:'style',type:'text',label:q.styles,'default':'',validate:a.dialog.validate.inlineStyle(q.invalidInlineStyle),onChange:function(){},getStyle:function(t,u){var v=this.getValue().match(new RegExp(t+'\\s*:\\s*([^;]*)','i'));return v?v[1]:u;},updateStyle:function(t,u){var v=this.getValue();if(v)v=v.replace(new RegExp('\\s*'+t+'s*:[^;]*(?:$|;s*)','i'),'').replace(/^[;\s]+/,'').replace(/\s+$/,'');if(u){v&&!/;\s*$/.test(v)&&(v+='; ');v+=t+': '+u;}this.setValue(v,1);},setup:m,commit:n});if(p.classes)s.push({type:'hbox',widths:['45%','55%'],children:[{id:'advCSSClasses',att:'class',type:'text',label:q.cssClasses,'default':'',setup:m,commit:n}]});r.elements[0].children.push({type:'hbox',widths:['50%','50%'],children:[].concat(s)});}return r;}});})();(function(){j.add('div',{requires:['editingblock','dialog','domiterator','styles'],init:function(m){var n=m.lang.div;
m.addCommand('creatediv',new a.dialogCommand('creatediv'));m.addCommand('editdiv',new a.dialogCommand('editdiv'));m.addCommand('removediv',{exec:function(o){var p=o.getSelection(),q=p&&p.getRanges(),r,s=p.createBookmarks(),t,u=[];function v(x){var y=new d.elementPath(x),z=y.blockLimit,A=z.is('div')&&z;if(A&&!A.data('cke-div-added')){u.push(A);A.data('cke-div-added');}};for(var w=0;w<q.length;w++){r=q[w];if(r.collapsed)v(p.getStartElement());else{t=new d.walker(r);t.evaluator=v;t.lastForward();}}for(w=0;w<u.length;w++)u[w].remove(true);p.selectBookmarks(s);}});m.ui.addButton('CreateDiv',{label:n.toolbar,command:'creatediv'});if(m.addMenuItems){m.addMenuItems({editdiv:{label:n.edit,command:'editdiv',group:'div',order:1},removediv:{label:n.remove,command:'removediv',group:'div',order:5}});if(m.contextMenu)m.contextMenu.addListener(function(o,p){if(!o||o.isReadOnly())return null;var q=new d.elementPath(o),r=q.blockLimit;if(r&&r.getAscendant('div',true))return{editdiv:2,removediv:2};return null;});}a.dialog.add('creatediv',this.path+'dialogs/div.js');a.dialog.add('editdiv',this.path+'dialogs/div.js');}});})();(function(){var m={toolbarFocus:{editorFocus:false,readOnly:1,exec:function(o){var p=o._.elementsPath.idBase,q=a.document.getById(p+'0');q&&q.focus(c||b.air);}}},n='<span class="cke_empty">&nbsp;</span>';j.add('elementspath',{requires:['selection'],init:function(o){var p='cke_path_'+o.name,q,r=function(){if(!q)q=a.document.getById(p);return q;},s='cke_elementspath_'+e.getNextNumber()+'_';o._.elementsPath={idBase:s,filters:[]};o.on('themeSpace',function(x){if(x.data.space=='bottom')x.data.html+='<span id="'+p+'_label" class="cke_voice_label">'+o.lang.elementsPath.eleLabel+'</span>'+'<div id="'+p+'" class="cke_path" role="group" aria-labelledby="'+p+'_label">'+n+'</div>';});function t(x){o.focus();var y=o._.elementsPath.list[x];if(y.is('body')){var z=new d.range(o.document);z.selectNodeContents(y);z.select();}else o.getSelection().selectElement(y);};var u=e.addFunction(t),v=e.addFunction(function(x,y){var z=o._.elementsPath.idBase,A;y=new d.event(y);var B=o.lang.dir=='rtl';switch(y.getKeystroke()){case B?39:37:case 9:A=a.document.getById(z+(x+1));if(!A)A=a.document.getById(z+'0');A.focus();return false;case B?37:39:case 2228224+9:A=a.document.getById(z+(x-1));if(!A)A=a.document.getById(z+(o._.elementsPath.list.length-1));A.focus();return false;case 27:o.focus();return false;case 13:case 32:t(x);return false;}return true;});o.on('selectionChange',function(x){var y=b,z=x.data.selection,A=z.getStartElement(),B=[],C=x.editor,D=C._.elementsPath.list=[],E=C._.elementsPath.filters;
while(A){var F=0,G;if(A.data('cke-display-name'))G=A.data('cke-display-name');else if(A.data('cke-real-element-type'))G=A.data('cke-real-element-type');else G=A.getName();for(var H=0;H<E.length;H++){var I=E[H](A,G);if(I===false){F=1;break;}G=I||G;}if(!F){var J=D.push(A)-1,K='';if(y.opera||y.gecko&&y.mac)K+=' onkeypress="return false;"';if(y.gecko)K+=' onblur="this.style.cssText = this.style.cssText;"';var L=C.lang.elementsPath.eleTitle.replace(/%1/,G);B.unshift('<a id="',s,J,'" href="javascript:void(\'',G,'\')" tabindex="-1" title="',L,'"'+(b.gecko&&b.version<10900?' onfocus="event.preventBubble();"':'')+' hidefocus="true" '+' onkeydown="return CKEDITOR.tools.callFunction(',v,',',J,', event );"'+K,' onclick="CKEDITOR.tools.callFunction('+u,',',J,'); return false;"',' role="button" aria-labelledby="'+s+J+'_label">',G,'<span id="',s,J,'_label" class="cke_label">'+L+'</span>','</a>');}if(G=='body')break;A=A.getParent();}var M=r();M.setHtml(B.join('')+n);C.fire('elementsPathUpdate',{space:M});});function w(){q&&q.setHtml(n);delete o._.elementsPath.list;};o.on('readOnly',w);o.on('contentDomUnload',w);o.addCommand('elementsPathFocus',m.toolbarFocus);}});})();(function(){j.add('enterkey',{requires:['keystrokes','indent'],init:function(t){t.addCommand('enter',{modes:{wysiwyg:1},editorFocus:false,exec:function(v){r(v);}});t.addCommand('shiftEnter',{modes:{wysiwyg:1},editorFocus:false,exec:function(v){q(v);}});var u=t.keystrokeHandler.keystrokes;u[13]='enter';u[2228224+13]='shiftEnter';}});j.enterkey={enterBlock:function(t,u,v,w){v=v||s(t);if(!v)return;var x=v.document,y=v.checkStartOfBlock(),z=v.checkEndOfBlock(),A=new d.elementPath(v.startContainer),B=A.block;if(y&&z){if(B&&(B.is('li')||B.getParent().is('li'))){t.execCommand('outdent');return;}if(B&&B.getParent().is('blockquote')){B.breakParent(B.getParent());if(!B.getPrevious().getFirst(d.walker.invisible(1)))B.getPrevious().remove();if(!B.getNext().getFirst(d.walker.invisible(1)))B.getNext().remove();v.moveToElementEditStart(B);v.select();return;}}else if(B&&B.is('pre')){if(!z){n(t,u,v,w);return;}}else if(B&&f.$captionBlock[B.getName()]){n(t,u,v,w);return;}var C=u==3?'div':'p',D=v.splitBlock(C);if(!D)return;var E=D.previousBlock,F=D.nextBlock,G=D.wasStartOfBlock,H=D.wasEndOfBlock,I;if(F){I=F.getParent();if(I.is('li')){F.breakParent(I);F.move(F.getNext(),1);}}else if(E&&(I=E.getParent())&&I.is('li')){E.breakParent(I);I=E.getNext();v.moveToElementEditStart(I);E.move(E.getPrevious());}if(!G&&!H){if(F.is('li')&&(I=F.getFirst(d.walker.invisible(true)))&&I.is&&I.is('ul','ol'))(c?x.createText('\xa0'):x.createElement('br')).insertBefore(I);
if(F)v.moveToElementEditStart(F);}else{var J,K;if(E){if(E.is('li')||!(p.test(E.getName())||E.is('pre')))J=E.clone();}else if(F)J=F.clone();if(!J){if(I&&I.is('li'))J=I;else{J=x.createElement(C);if(E&&(K=E.getDirection()))J.setAttribute('dir',K);}}else if(w&&!J.is('li'))J.renameNode(C);var L=D.elementPath;if(L)for(var M=0,N=L.elements.length;M<N;M++){var O=L.elements[M];if(O.equals(L.block)||O.equals(L.blockLimit))break;if(f.$removeEmpty[O.getName()]){O=O.clone();J.moveChildren(O);J.append(O);}}if(!c)J.appendBogus();if(!J.getParent())v.insertNode(J);J.is('li')&&J.removeAttribute('value');if(c&&G&&(!H||!E.getChildCount())){v.moveToElementEditStart(H?E:J);v.select();}v.moveToElementEditStart(G&&!H?F:J);}if(!c)if(F){var P=x.createElement('span');P.setHtml('&nbsp;');v.insertNode(P);P.scrollIntoView();v.deleteContents();}else J.scrollIntoView();v.select();},enterBr:function(t,u,v,w){v=v||s(t);if(!v)return;var x=v.document,y=u==3?'div':'p',z=v.checkEndOfBlock(),A=new d.elementPath(t.getSelection().getStartElement()),B=A.block,C=B&&A.block.getName(),D=false;if(!w&&C=='li'){o(t,u,v,w);return;}if(!w&&z&&p.test(C)){var E,F;if(F=B.getDirection()){E=x.createElement('div');E.setAttribute('dir',F);E.insertAfter(B);v.setStart(E,0);}else{x.createElement('br').insertAfter(B);if(b.gecko)x.createText('').insertAfter(B);v.setStartAt(B.getNext(),c?3:1);}}else{var G;D=C=='pre';if(D&&!b.gecko)G=x.createText(c?'\r':'\n');else G=x.createElement('br');v.deleteContents();v.insertNode(G);if(c)v.setStartAt(G,4);else{x.createText('\ufeff').insertAfter(G);if(z)G.getParent().appendBogus();G.getNext().$.nodeValue='';v.setStartAt(G.getNext(),1);var H=null;if(!b.gecko){H=x.createElement('span');H.setHtml('&nbsp;');}else H=x.createElement('br');H.insertBefore(G.getNext());H.scrollIntoView();H.remove();}}v.collapse(true);v.select(D);}};var m=j.enterkey,n=m.enterBr,o=m.enterBlock,p=/^h[1-6]$/;function q(t){if(t.mode!='wysiwyg')return false;return r(t,t.config.shiftEnterMode,1);};function r(t,u,v){v=t.config.forceEnterMode||v;if(t.mode!='wysiwyg')return false;if(!u)u=t.config.enterMode;setTimeout(function(){t.fire('saveSnapshot');if(u==2)n(t,u,null,v);else o(t,u,null,v);t.fire('saveSnapshot');},0);return true;};function s(t){var u=t.getSelection().getRanges(true);for(var v=u.length-1;v>0;v--)u[v].deleteContents();return u[0];};})();(function(){var m='nbsp,gt,lt,amp',n='quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro',o='Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml',p='Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv';
function q(r,s){var t={},u=[],v={nbsp:'\xa0',shy:'­',gt:'>',lt:'<',amp:'&',apos:"'",quot:'"'};r=r.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g,function(A,B){var C=s?'&'+B+';':v[B],D=s?v[B]:'&'+B+';';t[C]=D;u.push(C);return '';});if(!s&&r){r=r.split(',');var w=document.createElement('div'),x;w.innerHTML='&'+r.join(';&')+';';x=w.innerHTML;w=null;for(var y=0;y<x.length;y++){var z=x.charAt(y);t[z]='&'+r[y]+';';u.push(z);}}t.regex=u.join(s?'|':'');return t;};j.add('entities',{afterInit:function(r){var s=r.config,t=r.dataProcessor,u=t&&t.htmlFilter;if(u){var v=[];if(s.basicEntities!==false)v.push(m);if(s.entities){if(v.length)v.push(n);if(s.entities_latin)v.push(o);if(s.entities_greek)v.push(p);if(s.entities_additional)v.push(s.entities_additional);}var w=q(v.join(',')),x=w.regex?'['+w.regex+']':'a^';delete w.regex;if(s.entities&&s.entities_processNumerical)x='[^ -~]|'+x;x=new RegExp(x,'g');function y(C){return s.entities_processNumerical=='force'||!w[C]?'&#'+C.charCodeAt(0)+';':w[C];};var z=q([m,'shy'].join(','),true),A=new RegExp(z.regex,'g');function B(C){return z[C];};u.addRules({text:function(C){return C.replace(A,B).replace(x,y);}});}}});})();i.basicEntities=true;i.entities=true;i.entities_latin=true;i.entities_greek=true;i.entities_additional='#39';(function(){function m(v,w){var x=[];if(!w)return v;else for(var y in w)x.push(y+'='+encodeURIComponent(w[y]));return v+(v.indexOf('?')!=-1?'&':'?')+x.join('&');};function n(v){v+='';var w=v.charAt(0).toUpperCase();return w+v.substr(1);};function o(v){var C=this;var w=C.getDialog(),x=w.getParentEditor();x._.filebrowserSe=C;var y=x.config['filebrowser'+n(w.getName())+'WindowWidth']||x.config.filebrowserWindowWidth||'80%',z=x.config['filebrowser'+n(w.getName())+'WindowHeight']||x.config.filebrowserWindowHeight||'70%',A=C.filebrowser.params||{};A.CKEditor=x.name;A.CKEditorFuncNum=x._.filebrowserFn;if(!A.langCode)A.langCode=x.langCode;var B=m(C.filebrowser.url,A);x.popup(B,y,z,x.config.filebrowserWindowFeatures||x.config.fileBrowserWindowFeatures);};function p(v){var y=this;var w=y.getDialog(),x=w.getParentEditor();x._.filebrowserSe=y;if(!w.getContentElement(y['for'][0],y['for'][1]).getInputElement().$.value)return false;if(!w.getContentElement(y['for'][0],y['for'][1]).getAction())return false;return true;};function q(v,w,x){var y=x.params||{};y.CKEditor=v.name;y.CKEditorFuncNum=v._.filebrowserFn;if(!y.langCode)y.langCode=v.langCode;w.action=m(x.url,y);w.filebrowser=x;};function r(v,w,x,y){var z,A;for(var B in y){z=y[B];
if(z.type=='hbox'||z.type=='vbox'||z.type=='fieldset')r(v,w,x,z.children);if(!z.filebrowser)continue;if(typeof z.filebrowser=='string'){var C={action:z.type=='fileButton'?'QuickUpload':'Browse',target:z.filebrowser};z.filebrowser=C;}if(z.filebrowser.action=='Browse'){var D=z.filebrowser.url;if(D===undefined){D=v.config['filebrowser'+n(w)+'BrowseUrl'];if(D===undefined)D=v.config.filebrowserBrowseUrl;}if(D){z.onClick=o;z.filebrowser.url=D;z.hidden=false;}}else if(z.filebrowser.action=='QuickUpload'&&z['for']){D=z.filebrowser.url;if(D===undefined){D=v.config['filebrowser'+n(w)+'UploadUrl'];if(D===undefined)D=v.config.filebrowserUploadUrl;}if(D){var E=z.onClick;z.onClick=function(F){var G=F.sender;if(E&&E.call(G,F)===false)return false;return p.call(G,F);};z.filebrowser.url=D;z.hidden=false;q(v,x.getContents(z['for'][0]).get(z['for'][1]),z.filebrowser);}}}};function s(v,w){var x=w.getDialog(),y=w.filebrowser.target||null;if(y){var z=y.split(':'),A=x.getContentElement(z[0],z[1]);if(A){A.setValue(v);x.selectPage(z[0]);}}};function t(v,w,x){if(x.indexOf(';')!==-1){var y=x.split(';');for(var z=0;z<y.length;z++){if(t(v,w,y[z]))return true;}return false;}var A=v.getContents(w).get(x).filebrowser;return A&&A.url;};function u(v,w){var A=this;var x=A._.filebrowserSe.getDialog(),y=A._.filebrowserSe['for'],z=A._.filebrowserSe.filebrowser.onSelect;if(y)x.getContentElement(y[0],y[1]).reset();if(typeof w=='function'&&w.call(A._.filebrowserSe)===false)return;if(z&&z.call(A._.filebrowserSe,v,w)===false)return;if(typeof w=='string'&&w)alert(w);if(v)s(v,A._.filebrowserSe);};j.add('filebrowser',{init:function(v,w){v._.filebrowserFn=e.addFunction(u,v);v.on('destroy',function(){e.removeFunction(this._.filebrowserFn);});}});a.on('dialogDefinition',function(v){var w=v.data.definition,x;for(var y in w.contents){if(x=w.contents[y]){r(v.editor,v.data.name,w,x.elements);if(x.hidden&&x.filebrowser)x.hidden=!t(w,x.id,x.filebrowser);}}});})();j.add('find',{requires:['dialog'],init:function(m){var n=j.find;m.ui.addButton('Find',{label:m.lang.findAndReplace.find,command:'find'});var o=m.addCommand('find',new a.dialogCommand('find'));o.canUndo=false;o.readOnly=1;m.ui.addButton('Replace',{label:m.lang.findAndReplace.replace,command:'replace'});var p=m.addCommand('replace',new a.dialogCommand('replace'));p.canUndo=false;a.dialog.add('find',this.path+'dialogs/find.js');a.dialog.add('replace',this.path+'dialogs/find.js');},requires:['styles']});i.find_highlight={element:'span',styles:{'background-color':'#004',color:'#fff'}};
(function(){var m=/\.swf(?:$|\?)/i;function n(p){var q=p.attributes;return q.type=='application/x-shockwave-flash'||m.test(q.src||'');};function o(p,q){return p.createFakeParserElement(q,'cke_flash','flash',true);};j.add('flash',{init:function(p){p.addCommand('flash',new a.dialogCommand('flash'));p.ui.addButton('Flash',{label:p.lang.common.flash,command:'flash'});a.dialog.add('flash',this.path+'dialogs/flash.js');p.addCss('img.cke_flash{background-image: url('+a.getUrl(this.path+'images/placeholder.png')+');'+'background-position: center center;'+'background-repeat: no-repeat;'+'border: 1px solid #a9a9a9;'+'width: 80px;'+'height: 80px;'+'}');if(p.addMenuItems)p.addMenuItems({flash:{label:p.lang.flash.properties,command:'flash',group:'flash'}});p.on('doubleclick',function(q){var r=q.data.element;if(r.is('img')&&r.data('cke-real-element-type')=='flash')q.data.dialog='flash';});if(p.contextMenu)p.contextMenu.addListener(function(q,r){if(q&&q.is('img')&&!q.isReadOnly()&&q.data('cke-real-element-type')=='flash')return{flash:2};});},afterInit:function(p){var q=p.dataProcessor,r=q&&q.dataFilter;if(r)r.addRules({elements:{'cke:object':function(s){var t=s.attributes,u=t.classid&&String(t.classid).toLowerCase();if(!u&&!n(s)){for(var v=0;v<s.children.length;v++){if(s.children[v].name=='cke:embed'){if(!n(s.children[v]))return null;return o(p,s);}}return null;}return o(p,s);},'cke:embed':function(s){if(!n(s))return null;return o(p,s);}}},5);},requires:['fakeobjects']});})();e.extend(i,{flashEmbedTagOnly:false,flashAddEmbedTag:true,flashConvertOnEdit:false});(function(){function m(n,o,p,q,r,s,t){var u=n.config,v=r.split(';'),w=[],x={};for(var y=0;y<v.length;y++){var z=v[y];if(z){z=z.split('/');var A={},B=v[y]=z[0];A[p]=w[y]=z[1]||B;x[B]=new a.style(t,A);x[B]._.definition.name=B;}else v.splice(y--,1);}n.ui.addRichCombo(o,{label:q.label,title:q.panelTitle,className:'cke_'+(p=='size'?'fontSize':'font'),panel:{css:n.skin.editor.css.concat(u.contentsCss),multiSelect:false,attributes:{'aria-label':q.panelTitle}},init:function(){this.startGroup(q.panelTitle);for(var C=0;C<v.length;C++){var D=v[C];this.add(D,x[D].buildPreview(),D);}},onClick:function(C){n.focus();n.fire('saveSnapshot');var D=x[C];if(this.getValue()==C)D.remove(n.document);else D.apply(n.document);n.fire('saveSnapshot');},onRender:function(){n.on('selectionChange',function(C){var D=this.getValue(),E=C.data.path,F=E.elements;for(var G=0,H;G<F.length;G++){H=F[G];for(var I in x){if(x[I].checkElementMatch(H,true)){if(I!=D)this.setValue(I);
return;}}}this.setValue('',s);},this);}});};j.add('font',{requires:['richcombo','styles'],init:function(n){var o=n.config;m(n,'Font','family',n.lang.font,o.font_names,o.font_defaultLabel,o.font_style);m(n,'FontSize','size',n.lang.fontSize,o.fontSize_sizes,o.fontSize_defaultLabel,o.fontSize_style);}});})();i.font_names='Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif';i.font_defaultLabel='';i.font_style={element:'span',styles:{'font-family':'#(family)'},overrides:[{element:'font',attributes:{face:null}}]};i.fontSize_sizes='8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px';i.fontSize_defaultLabel='';i.fontSize_style={element:'span',styles:{'font-size':'#(size)'},overrides:[{element:'font',attributes:{size:null}}]};j.add('format',{requires:['richcombo','styles'],init:function(m){var n=m.config,o=m.lang.format,p=n.format_tags.split(';'),q={};for(var r=0;r<p.length;r++){var s=p[r];q[s]=new a.style(n['format_'+s]);q[s]._.enterMode=m.config.enterMode;}m.ui.addRichCombo('Format',{label:o.label,title:o.panelTitle,className:'cke_format',panel:{css:m.skin.editor.css.concat(n.contentsCss),multiSelect:false,attributes:{'aria-label':o.panelTitle}},init:function(){this.startGroup(o.panelTitle);for(var t in q){var u=o['tag_'+t];this.add(t,q[t].buildPreview(u),u);}},onClick:function(t){m.focus();m.fire('saveSnapshot');var u=q[t],v=new d.elementPath(m.getSelection().getStartElement());u[u.checkActive(v)?'remove':'apply'](m.document);setTimeout(function(){m.fire('saveSnapshot');},0);},onRender:function(){m.on('selectionChange',function(t){var u=this.getValue(),v=t.data.path;for(var w in q){if(q[w].checkActive(v)){if(w!=u)this.setValue(w,m.lang.format['tag_'+w]);return;}}this.setValue('');},this);}});}});i.format_tags='p;h1;h2;h3;h4;h5;h6;pre;address;div';i.format_p={element:'p'};i.format_div={element:'div'};i.format_pre={element:'pre'};i.format_address={element:'address'};i.format_h1={element:'h1'};i.format_h2={element:'h2'};i.format_h3={element:'h3'};i.format_h4={element:'h4'};i.format_h5={element:'h5'};i.format_h6={element:'h6'};j.add('forms',{requires:['dialog'],init:function(m){var n=m.lang;
m.addCss('form{border: 1px dotted #FF0000;padding: 2px;}\n');m.addCss('img.cke_hidden{background-image: url('+a.getUrl(this.path+'images/hiddenfield.gif')+');'+'background-position: center center;'+'background-repeat: no-repeat;'+'border: 1px solid #a9a9a9;'+'width: 16px !important;'+'height: 16px !important;'+'}');var o=function(q,r,s){m.addCommand(r,new a.dialogCommand(r));m.ui.addButton(q,{label:n.common[q.charAt(0).toLowerCase()+q.slice(1)],command:r});a.dialog.add(r,s);},p=this.path+'dialogs/';o('Form','form',p+'form.js');o('Checkbox','checkbox',p+'checkbox.js');o('Radio','radio',p+'radio.js');o('TextField','textfield',p+'textfield.js');o('Textarea','textarea',p+'textarea.js');o('Select','select',p+'select.js');o('Button','button',p+'button.js');o('ImageButton','imagebutton',j.getPath('image')+'dialogs/image.js');o('HiddenField','hiddenfield',p+'hiddenfield.js');if(m.addMenuItems)m.addMenuItems({form:{label:n.form.menu,command:'form',group:'form'},checkbox:{label:n.checkboxAndRadio.checkboxTitle,command:'checkbox',group:'checkbox'},radio:{label:n.checkboxAndRadio.radioTitle,command:'radio',group:'radio'},textfield:{label:n.textfield.title,command:'textfield',group:'textfield'},hiddenfield:{label:n.hidden.title,command:'hiddenfield',group:'hiddenfield'},imagebutton:{label:n.image.titleButton,command:'imagebutton',group:'imagebutton'},button:{label:n.button.title,command:'button',group:'button'},select:{label:n.select.title,command:'select',group:'select'},textarea:{label:n.textarea.title,command:'textarea',group:'textarea'}});if(m.contextMenu){m.contextMenu.addListener(function(q){if(q&&q.hasAscendant('form',true)&&!q.isReadOnly())return{form:2};});m.contextMenu.addListener(function(q){if(q&&!q.isReadOnly()){var r=q.getName();if(r=='select')return{select:2};if(r=='textarea')return{textarea:2};if(r=='input')switch(q.getAttribute('type')){case 'button':case 'submit':case 'reset':return{button:2};case 'checkbox':return{checkbox:2};case 'radio':return{radio:2};case 'image':return{imagebutton:2};default:return{textfield:2};}if(r=='img'&&q.data('cke-real-element-type')=='hiddenfield')return{hiddenfield:2};}});}m.on('doubleclick',function(q){var r=q.data.element;if(r.is('form'))q.data.dialog='form';else if(r.is('select'))q.data.dialog='select';else if(r.is('textarea'))q.data.dialog='textarea';else if(r.is('img')&&r.data('cke-real-element-type')=='hiddenfield')q.data.dialog='hiddenfield';else if(r.is('input'))switch(r.getAttribute('type')){case 'button':case 'submit':case 'reset':q.data.dialog='button';
break;case 'checkbox':q.data.dialog='checkbox';break;case 'radio':q.data.dialog='radio';break;case 'image':q.data.dialog='imagebutton';break;default:q.data.dialog='textfield';break;}});},afterInit:function(m){var n=m.dataProcessor,o=n&&n.htmlFilter,p=n&&n.dataFilter;if(c)o&&o.addRules({elements:{input:function(q){var r=q.attributes,s=r.type;if(!s)r.type='text';if(s=='checkbox'||s=='radio')r.value=='on'&&delete r.value;}}});if(p)p.addRules({elements:{input:function(q){if(q.attributes.type=='hidden')return m.createFakeParserElement(q,'cke_hidden','hiddenfield');}}});},requires:['image','fakeobjects']});if(c)h.prototype.hasAttribute=e.override(h.prototype.hasAttribute,function(m){return function(n){var q=this;var o=q.$.attributes.getNamedItem(n);if(q.getName()=='input')switch(n){case 'class':return q.$.className.length>0;case 'checked':return!!q.$.checked;case 'value':var p=q.getAttribute('type');return p=='checkbox'||p=='radio'?q.$.value!='on':q.$.value;}return m.apply(q,arguments);};});(function(){var m={canUndo:false,exec:function(o){var p=o.document.createElement('hr');o.insertElement(p);}},n='horizontalrule';j.add(n,{init:function(o){o.addCommand(n,m);o.ui.addButton('HorizontalRule',{label:o.lang.horizontalrule,command:n});}});})();(function(){var m=/^[\t\r\n ]*(?:&nbsp;|\xa0)$/,n='{cke_protected}';function o(T){var U=T.children.length,V=T.children[U-1];while(V&&V.type==3&&!e.trim(V.value))V=T.children[--U];return V;};function p(T,U){var V=T.children,W=o(T);if(W){if((U||!c)&&W.type==1&&W.name=='br')V.pop();if(W.type==3&&m.test(W.value))V.pop();}};function q(T,U,V){if(!U&&(!V||typeof V=='function'&&V(T)===false))return false;if(U&&c&&(document.documentMode>7||T.name in f.tr||T.name in f.$listItem))return false;var W=o(T);return!W||W&&(W.type==1&&W.name=='br'||T.name=='form'&&W.name=='input');};function r(T,U){return function(V){p(V,!T);if(q(V,!T,U))if(T||c)V.add(new a.htmlParser.text('\xa0'));else V.add(new a.htmlParser.element('br',{}));};};var s=f,t=['caption','colgroup','col','thead','tfoot','tbody'],u=e.extend({},s.$block,s.$listItem,s.$tableContent);for(var v in u){if(!('br' in s[v]))delete u[v];}delete u.pre;var w={elements:{},attributeNames:[[/^on/,'data-cke-pa-on']]},x={elements:{}};for(v in u)x.elements[v]=r();var y={elementNames:[[/^cke:/,''],[/^\?xml:namespace$/,'']],attributeNames:[[/^data-cke-(saved|pa)-/,''],[/^data-cke-.*/,''],['hidefocus','']],elements:{$:function(T){var U=T.attributes;if(U){if(U['data-cke-temp'])return false;var V=['name','href','src'],W;
for(var X=0;X<V.length;X++){W='data-cke-saved-'+V[X];W in U&&delete U[V[X]];}}return T;},table:function(T){var U=T.children;U.sort(function(V,W){return V.type==1&&W.type==V.type?e.indexOf(t,V.name)>e.indexOf(t,W.name)?1:-1:0;});},embed:function(T){var U=T.parent;if(U&&U.name=='object'){var V=U.attributes.width,W=U.attributes.height;V&&(T.attributes.width=V);W&&(T.attributes.height=W);}},param:function(T){T.children=[];T.isEmpty=true;return T;},a:function(T){if(!(T.children.length||T.attributes.name||T.attributes['data-cke-saved-name']))return false;},span:function(T){if(T.attributes['class']=='Apple-style-span')delete T.name;},pre:function(T){c&&p(T);},html:function(T){delete T.attributes.contenteditable;delete T.attributes['class'];},body:function(T){delete T.attributes.spellcheck;delete T.attributes.contenteditable;},style:function(T){var U=T.children[0];U&&U.value&&(U.value=e.trim(U.value));if(!T.attributes.type)T.attributes.type='text/css';},title:function(T){var U=T.children[0];U&&(U.value=T.attributes['data-cke-title']||'');}},attributes:{'class':function(T,U){return e.ltrim(T.replace(/(?:^|\s+)cke_[^\s]*/g,''))||false;}}};if(c)y.attributes.style=function(T,U){return T.replace(/(^|;)([^\:]+)/g,function(V){return V.toLowerCase();});};function z(T){var U=T.attributes;if(U.contenteditable!='false')U['data-cke-editable']=U.contenteditable?'true':1;U.contenteditable='false';};function A(T){var U=T.attributes;switch(U['data-cke-editable']){case 'true':U.contenteditable='true';break;case '1':delete U.contenteditable;break;}};for(v in {input:1,textarea:1}){w.elements[v]=z;y.elements[v]=A;}var B=/<(a|area|img|input)\b([^>]*)>/gi,C=/\b(on\w+|href|src|name)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi,D=/(?:<style(?=[ >])[^>]*>[\s\S]*<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,E=/<cke:encoded>([^<]*)<\/cke:encoded>/gi,F=/(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi,G=/(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi,H=/<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi;function I(T){return T.replace(B,function(U,V,W){return '<'+V+W.replace(C,function(X,Y){if(!/^on/.test(Y)&&W.indexOf('data-cke-saved-'+Y)==-1)return ' data-cke-saved-'+X+' data-cke-'+a.rnd+'-'+X;return X;})+'>';});};function J(T){return T.replace(D,function(U){return '<cke:encoded>'+encodeURIComponent(U)+'</cke:encoded>';});};function K(T){return T.replace(E,function(U,V){return decodeURIComponent(V);});};function L(T){return T.replace(F,'$1cke:$2');};function M(T){return T.replace(G,'$1$2');
};function N(T){return T.replace(H,'<cke:$1$2></cke:$1>');};function O(T){return T.replace(/(<pre\b[^>]*>)(\r\n|\n)/g,'$1$2$2');};function P(T){return T.replace(/<!--(?!{cke_protected})[\s\S]+?-->/g,function(U){return '<!--'+n+'{C}'+encodeURIComponent(U).replace(/--/g,'%2D%2D')+'-->';});};function Q(T){return T.replace(/<!--\{cke_protected\}\{C\}([\s\S]+?)-->/g,function(U,V){return decodeURIComponent(V);});};function R(T,U){var V=U._.dataStore;return T.replace(/<!--\{cke_protected\}([\s\S]+?)-->/g,function(W,X){return decodeURIComponent(X);}).replace(/\{cke_protected_(\d+)\}/g,function(W,X){return V&&V[X]||'';});};function S(T,U){var V=[],W=U.config.protectedSource,X=U._.dataStore||(U._.dataStore={id:1}),Y=/<\!--\{cke_temp(comment)?\}(\d*?)-->/g,Z=[/<script[\s\S]*?<\/script>/gi,/<noscript[\s\S]*?<\/noscript>/gi].concat(W);T=T.replace(/<!--[\s\S]*?-->/g,function(ab){return '<!--{cke_tempcomment}'+(V.push(ab)-1)+'-->';});for(var aa=0;aa<Z.length;aa++)T=T.replace(Z[aa],function(ab){ab=ab.replace(Y,function(ac,ad,ae){return V[ae];});return/cke_temp(comment)?/.test(ab)?ab:'<!--{cke_temp}'+(V.push(ab)-1)+'-->';});T=T.replace(Y,function(ab,ac,ad){return '<!--'+n+(ac?'{C}':'')+encodeURIComponent(V[ad]).replace(/--/g,'%2D%2D')+'-->';});return T.replace(/(['"]).*?\1/g,function(ab){return ab.replace(/<!--\{cke_protected\}([\s\S]+?)-->/g,function(ac,ad){X[X.id]=decodeURIComponent(ad);return '{cke_protected_'+X.id++ +'}';});});};j.add('htmldataprocessor',{requires:['htmlwriter'],init:function(T){var U=T.dataProcessor=new a.htmlDataProcessor(T);U.writer.forceSimpleAmpersand=T.config.forceSimpleAmpersand;U.dataFilter.addRules(w);U.dataFilter.addRules(x);U.htmlFilter.addRules(y);var V={elements:{}};for(v in u)V.elements[v]=r(true,T.config.fillEmptyBlocks);U.htmlFilter.addRules(V);},onLoad:function(){!('fillEmptyBlocks' in i)&&(i.fillEmptyBlocks=1);}});a.htmlDataProcessor=function(T){var U=this;U.editor=T;U.writer=new a.htmlWriter();U.dataFilter=new a.htmlParser.filter();U.htmlFilter=new a.htmlParser.filter();};a.htmlDataProcessor.prototype={toHtml:function(T,U){T=S(T,this.editor);T=I(T);T=J(T);T=L(T);T=N(T);T=O(T);var V=new h('div');V.setHtml('a'+T);T=V.getHtml().substr(1);T=T.replace(new RegExp(' data-cke-'+a.rnd+'-','ig'),' ');T=M(T);T=K(T);T=Q(T);var W=a.htmlParser.fragment.fromHtml(T,U),X=new a.htmlParser.basicWriter();W.writeHtml(X,this.dataFilter);T=X.getHtml(true);T=P(T);return T;},toDataFormat:function(T,U){var V=this.writer,W=a.htmlParser.fragment.fromHtml(T,U);V.reset();
W.writeHtml(V,this.htmlFilter);var X=V.getHtml(true);X=Q(X);X=R(X,this.editor);return X;}};})();(function(){j.add('iframe',{requires:['dialog','fakeobjects'],init:function(m){var n='iframe',o=m.lang.iframe;a.dialog.add(n,this.path+'dialogs/iframe.js');m.addCommand(n,new a.dialogCommand(n));m.addCss('img.cke_iframe{background-image: url('+a.getUrl(this.path+'images/placeholder.png')+');'+'background-position: center center;'+'background-repeat: no-repeat;'+'border: 1px solid #a9a9a9;'+'width: 80px;'+'height: 80px;'+'}');m.ui.addButton('Iframe',{label:o.toolbar,command:n});m.on('doubleclick',function(p){var q=p.data.element;if(q.is('img')&&q.data('cke-real-element-type')=='iframe')p.data.dialog='iframe';});if(m.addMenuItems)m.addMenuItems({iframe:{label:o.title,command:'iframe',group:'image'}});if(m.contextMenu)m.contextMenu.addListener(function(p,q){if(p&&p.is('img')&&p.data('cke-real-element-type')=='iframe')return{iframe:2};});},afterInit:function(m){var n=m.dataProcessor,o=n&&n.dataFilter;if(o)o.addRules({elements:{iframe:function(p){return m.createFakeParserElement(p,'cke_iframe','iframe',true);}}});}});})();(function(){j.add('image',{requires:['dialog'],init:function(o){var p='image';a.dialog.add(p,this.path+'dialogs/image.js');o.addCommand(p,new a.dialogCommand(p));o.ui.addButton('Image',{label:o.lang.common.image,command:p});o.on('doubleclick',function(q){var r=q.data.element;if(r.is('img')&&!r.data('cke-realelement')&&!r.isReadOnly())q.data.dialog='image';});if(o.addMenuItems)o.addMenuItems({image:{label:o.lang.image.menu,command:'image',group:'image'}});if(o.contextMenu)o.contextMenu.addListener(function(q,r){if(m(o,q))return{image:2};});},afterInit:function(o){p('left');p('right');p('center');p('block');function p(q){var r=o.getCommand('justify'+q);if(r){if(q=='left'||q=='right')r.on('exec',function(s){var t=m(o),u;if(t){u=n(t);if(u==q){t.removeStyle('float');if(q==n(t))t.removeAttribute('align');}else t.setStyle('float',q);s.cancel();}});r.on('refresh',function(s){var t=m(o),u;if(t){u=n(t);this.setState(u==q?1:q=='right'||q=='left'?2:0);s.cancel();}});}};}});function m(o,p){if(!p){var q=o.getSelection();p=q.getType()==3&&q.getSelectedElement();}if(p&&p.is('img')&&!p.data('cke-realelement')&&!p.isReadOnly())return p;};function n(o){var p=o.getStyle('float');if(p=='inherit'||p=='none')p=0;if(!p)p=o.getAttribute('align');return p;};})();i.image_removeLinkByEmptyURL=true;(function(){var m={ol:1,ul:1},n=d.walker.whitespaces(true),o=d.walker.bookmark(false,true);
function p(t){var B=this;if(t.editor.readOnly)return null;var u=t.editor,v=t.data.path,w=v&&v.contains(m),x=v.block||v.blockLimit;if(w)return B.setState(2);if(!B.useIndentClasses&&B.name=='indent')return B.setState(2);if(!x)return B.setState(0);if(B.useIndentClasses){var y=x.$.className.match(B.classNameRegex),z=0;if(y){y=y[1];z=B.indentClassMap[y];}if(B.name=='outdent'&&!z||B.name=='indent'&&z==u.config.indentClasses.length)return B.setState(0);return B.setState(2);}else{var A=parseInt(x.getStyle(r(x)),10);if(isNaN(A))A=0;if(A<=0)return B.setState(0);return B.setState(2);}};function q(t,u){var w=this;w.name=u;w.useIndentClasses=t.config.indentClasses&&t.config.indentClasses.length>0;if(w.useIndentClasses){w.classNameRegex=new RegExp('(?:^|\\s+)('+t.config.indentClasses.join('|')+')(?=$|\\s)');w.indentClassMap={};for(var v=0;v<t.config.indentClasses.length;v++)w.indentClassMap[t.config.indentClasses[v]]=v+1;}w.startDisabled=u=='outdent';};function r(t,u){return(u||t.getComputedStyle('direction'))=='ltr'?'margin-left':'margin-right';};function s(t){return t.type==1&&t.is('li');};q.prototype={exec:function(t){var u=this,v={};function w(M){var N=C.startContainer,O=C.endContainer;while(N&&!N.getParent().equals(M))N=N.getParent();while(O&&!O.getParent().equals(M))O=O.getParent();if(!N||!O)return;var P=N,Q=[],R=false;while(!R){if(P.equals(O))R=true;Q.push(P);P=P.getNext();}if(Q.length<1)return;var S=M.getParents(true);for(var T=0;T<S.length;T++){if(S[T].getName&&m[S[T].getName()]){M=S[T];break;}}var U=u.name=='indent'?1:-1,V=Q[0],W=Q[Q.length-1],X=j.list.listToArray(M,v),Y=X[W.getCustomData('listarray_index')].indent;for(T=V.getCustomData('listarray_index');T<=W.getCustomData('listarray_index');T++){X[T].indent+=U;if(U>0){var Z=X[T].parent;X[T].parent=new h(Z.getName(),Z.getDocument());}}for(T=W.getCustomData('listarray_index')+1;T<X.length&&X[T].indent>Y;T++)X[T].indent+=U;var aa=j.list.arrayToList(X,v,null,t.config.enterMode,M.getDirection());if(u.name=='outdent'){var ab;if((ab=M.getParent())&&ab.is('li')){var ac=aa.listNode.getChildren(),ad=[],ae=ac.count(),af;for(T=ae-1;T>=0;T--){if((af=ac.getItem(T))&&af.is&&af.is('li'))ad.push(af);}}}if(aa)aa.listNode.replace(M);if(ad&&ad.length)for(T=0;T<ad.length;T++){var ag=ad[T],ah=ag;while((ah=ah.getNext())&&ah.is&&ah.getName() in m){if(c&&!ag.getFirst(function(ai){return n(ai)&&o(ai);}))ag.append(C.document.createText('\xa0'));ag.append(ah);}ag.insertAfter(ab);}};function x(){var M=C.createIterator(),N=t.config.enterMode;
M.enforceRealBlocks=true;M.enlargeBr=N!=2;var O;while(O=M.getNextParagraph(N==1?'p':'div'))y(O);};function y(M,N){if(M.getCustomData('indent_processed'))return false;if(u.useIndentClasses){var O=M.$.className.match(u.classNameRegex),P=0;if(O){O=O[1];P=u.indentClassMap[O];}if(u.name=='outdent')P--;else P++;if(P<0)return false;P=Math.min(P,t.config.indentClasses.length);P=Math.max(P,0);M.$.className=e.ltrim(M.$.className.replace(u.classNameRegex,''));if(P>0)M.addClass(t.config.indentClasses[P-1]);}else{var Q=r(M,N),R=parseInt(M.getStyle(Q),10);if(isNaN(R))R=0;var S=t.config.indentOffset||40;R+=(u.name=='indent'?1:-1)*S;if(R<0)return false;R=Math.max(R,0);R=Math.ceil(R/S)*S;M.setStyle(Q,R?R+(t.config.indentUnit||'px'):'');if(M.getAttribute('style')==='')M.removeAttribute('style');}h.setMarker(v,M,'indent_processed',1);return true;};var z=t.getSelection(),A=z.createBookmarks(1),B=z&&z.getRanges(1),C,D=B.createIterator();while(C=D.getNextRange()){var E=C.getCommonAncestor(),F=E;while(F&&!(F.type==1&&m[F.getName()]))F=F.getParent();if(!F){var G=C.getEnclosedNode();if(G&&G.type==1&&G.getName() in m){C.setStartAt(G,1);C.setEndAt(G,2);F=G;}}if(F&&C.startContainer.type==1&&C.startContainer.getName() in m){var H=new d.walker(C);H.evaluator=s;C.startContainer=H.next();}if(F&&C.endContainer.type==1&&C.endContainer.getName() in m){H=new d.walker(C);H.evaluator=s;C.endContainer=H.previous();}if(F){var I=F.getFirst(s),J=!!I.getNext(s),K=C.startContainer,L=I.equals(K)||I.contains(K);if(!(L&&(u.name=='indent'||u.useIndentClasses||parseInt(F.getStyle(r(F)),10))&&y(F,!J&&I.getDirection())))w(F);}else x();}h.clearAllMarkers(v);t.forceNextSelectionCheck();z.selectBookmarks(A);}};j.add('indent',{init:function(t){var u=t.addCommand('indent',new q(t,'indent')),v=t.addCommand('outdent',new q(t,'outdent'));t.ui.addButton('Indent',{label:t.lang.indent,command:'indent'});t.ui.addButton('Outdent',{label:t.lang.outdent,command:'outdent'});t.on('selectionChange',e.bind(p,u));t.on('selectionChange',e.bind(p,v));if(b.ie6Compat||b.ie7Compat)t.addCss('ul,ol{\tmargin-left: 0px;\tpadding-left: 40px;}');t.on('dirChanged',function(w){var x=new d.range(t.document);x.setStartBefore(w.data.node);x.setEndAfter(w.data.node);var y=new d.walker(x),z;while(z=y.next()){if(z.type==1){if(!z.equals(w.data.node)&&z.getDirection()){x.setStartAfter(z);y=new d.walker(x);continue;}var A=t.config.indentClasses;if(A){var B=w.data.dir=='ltr'?['_rtl','']:['','_rtl'];for(var C=0;C<A.length;C++){if(z.hasClass(A[C]+B[0])){z.removeClass(A[C]+B[0]);
z.addClass(A[C]+B[1]);}}}var D=z.getStyle('margin-right'),E=z.getStyle('margin-left');D?z.setStyle('margin-left',D):z.removeStyle('margin-left');E?z.setStyle('margin-right',E):z.removeStyle('margin-right');}}});},requires:['domiterator','list']});})();(function(){function m(q,r){r=r===undefined||r;var s;if(r)s=q.getComputedStyle('text-align');else{while(!q.hasAttribute||!(q.hasAttribute('align')||q.getStyle('text-align'))){var t=q.getParent();if(!t)break;q=t;}s=q.getStyle('text-align')||q.getAttribute('align')||'';}s&&(s=s.replace(/(?:-(?:moz|webkit)-)?(?:start|auto)/i,''));!s&&r&&(s=q.getComputedStyle('direction')=='rtl'?'right':'left');return s;};function n(q){if(q.editor.readOnly)return;q.editor.getCommand(this.name).refresh(q.data.path);};function o(q,r,s){var u=this;u.editor=q;u.name=r;u.value=s;var t=q.config.justifyClasses;if(t){switch(s){case 'left':u.cssClassName=t[0];break;case 'center':u.cssClassName=t[1];break;case 'right':u.cssClassName=t[2];break;case 'justify':u.cssClassName=t[3];break;}u.cssClassRegex=new RegExp('(?:^|\\s+)(?:'+t.join('|')+')(?=$|\\s)');}};function p(q){var r=q.editor,s=new d.range(r.document);s.setStartBefore(q.data.node);s.setEndAfter(q.data.node);var t=new d.walker(s),u;while(u=t.next()){if(u.type==1){if(!u.equals(q.data.node)&&u.getDirection()){s.setStartAfter(u);t=new d.walker(s);continue;}var v=r.config.justifyClasses;if(v)if(u.hasClass(v[0])){u.removeClass(v[0]);u.addClass(v[2]);}else if(u.hasClass(v[2])){u.removeClass(v[2]);u.addClass(v[0]);}var w='text-align',x=u.getStyle(w);if(x=='left')u.setStyle(w,'right');else if(x=='right')u.setStyle(w,'left');}}};o.prototype={exec:function(q){var C=this;var r=q.getSelection(),s=q.config.enterMode;if(!r)return;var t=r.createBookmarks(),u=r.getRanges(true),v=C.cssClassName,w,x,y=q.config.useComputedState;y=y===undefined||y;for(var z=u.length-1;z>=0;z--){w=u[z].createIterator();w.enlargeBr=s!=2;while(x=w.getNextParagraph(s==1?'p':'div')){x.removeAttribute('align');x.removeStyle('text-align');var A=v&&(x.$.className=e.ltrim(x.$.className.replace(C.cssClassRegex,''))),B=C.state==2&&(!y||m(x,true)!=C.value);if(v){if(B)x.addClass(v);else if(!A)x.removeAttribute('class');}else if(B)x.setStyle('text-align',C.value);}}q.focus();q.forceNextSelectionCheck();r.selectBookmarks(t);},refresh:function(q){var r=q.block||q.blockLimit;this.setState(r.getName()!='body'&&m(r,this.editor.config.useComputedState)==this.value?1:2);}};j.add('justify',{init:function(q){var r=new o(q,'justifyleft','left'),s=new o(q,'justifycenter','center'),t=new o(q,'justifyright','right'),u=new o(q,'justifyblock','justify');
q.addCommand('justifyleft',r);q.addCommand('justifycenter',s);q.addCommand('justifyright',t);q.addCommand('justifyblock',u);q.ui.addButton('JustifyLeft',{label:q.lang.justify.left,command:'justifyleft'});q.ui.addButton('JustifyCenter',{label:q.lang.justify.center,command:'justifycenter'});q.ui.addButton('JustifyRight',{label:q.lang.justify.right,command:'justifyright'});q.ui.addButton('JustifyBlock',{label:q.lang.justify.block,command:'justifyblock'});q.on('selectionChange',e.bind(n,r));q.on('selectionChange',e.bind(n,t));q.on('selectionChange',e.bind(n,s));q.on('selectionChange',e.bind(n,u));q.on('dirChanged',p);},requires:['domiterator']});})();j.add('keystrokes',{beforeInit:function(m){m.keystrokeHandler=new a.keystrokeHandler(m);m.specialKeys={};},init:function(m){var n=m.config.keystrokes,o=m.config.blockedKeystrokes,p=m.keystrokeHandler.keystrokes,q=m.keystrokeHandler.blockedKeystrokes;for(var r=0;r<n.length;r++)p[n[r][0]]=n[r][1];for(r=0;r<o.length;r++)q[o[r]]=1;}});a.keystrokeHandler=function(m){var n=this;if(m.keystrokeHandler)return m.keystrokeHandler;n.keystrokes={};n.blockedKeystrokes={};n._={editor:m};return n;};(function(){var m,n=function(p){p=p.data;var q=p.getKeystroke(),r=this.keystrokes[q],s=this._.editor;m=s.fire('key',{keyCode:q})===true;if(!m){if(r){var t={from:'keystrokeHandler'};m=s.execCommand(r,t)!==false;}if(!m){var u=s.specialKeys[q];m=u&&u(s)===true;if(!m)m=!!this.blockedKeystrokes[q];}}if(m)p.preventDefault(true);return!m;},o=function(p){if(m){m=false;p.data.preventDefault(true);}};a.keystrokeHandler.prototype={attach:function(p){p.on('keydown',n,this);if(b.opera||b.gecko&&b.mac)p.on('keypress',o,this);}};})();i.blockedKeystrokes=[1114112+66,1114112+73,1114112+85];i.keystrokes=[[4456448+121,'toolbarFocus'],[4456448+122,'elementsPathFocus'],[2228224+121,'contextMenu'],[1114112+2228224+121,'contextMenu'],[1114112+90,'undo'],[1114112+89,'redo'],[1114112+2228224+90,'redo'],[1114112+76,'link'],[1114112+66,'bold'],[1114112+73,'italic'],[1114112+85,'underline'],[4456448+(c||b.webkit?189:109),'toolbarCollapse'],[4456448+48,'a11yHelp']];j.add('link',{requires:['fakeobjects','dialog'],init:function(m){m.addCommand('link',new a.dialogCommand('link'));m.addCommand('anchor',new a.dialogCommand('anchor'));m.addCommand('unlink',new a.unlinkCommand());m.addCommand('removeAnchor',new a.removeAnchorCommand());m.ui.addButton('Link',{label:m.lang.link.toolbar,command:'link'});m.ui.addButton('Unlink',{label:m.lang.unlink,command:'unlink'});m.ui.addButton('Anchor',{label:m.lang.anchor.toolbar,command:'anchor'});
a.dialog.add('link',this.path+'dialogs/link.js');a.dialog.add('anchor',this.path+'dialogs/anchor.js');var n=m.lang.dir=='rtl'?'right':'left',o='background:url('+a.getUrl(this.path+'images/anchor.gif')+') no-repeat '+n+' center;'+'border:1px dotted #00f;';m.addCss('a.cke_anchor,a.cke_anchor_empty'+(c&&b.version<7?'':',a[name],a[data-cke-saved-name]')+'{'+o+'padding-'+n+':18px;'+'cursor:auto;'+'}'+(c?'a.cke_anchor_empty{display:inline-block;}':'')+'img.cke_anchor'+'{'+o+'width:16px;'+'min-height:15px;'+'height:1.15em;'+'vertical-align:'+(b.opera?'middle':'text-bottom')+';'+'}');m.on('selectionChange',function(p){if(m.readOnly)return;var q=m.getCommand('unlink'),r=p.data.path.lastElement&&p.data.path.lastElement.getAscendant('a',true);if(r&&r.getName()=='a'&&r.getAttribute('href')&&r.getChildCount())q.setState(2);else q.setState(0);});m.on('doubleclick',function(p){var q=j.link.getSelectedLink(m)||p.data.element;if(!q.isReadOnly())if(q.is('a')){p.data.dialog=q.getAttribute('name')&&(!q.getAttribute('href')||!q.getChildCount())?'anchor':'link';m.getSelection().selectElement(q);}else if(j.link.tryRestoreFakeAnchor(m,q))p.data.dialog='anchor';});if(m.addMenuItems)m.addMenuItems({anchor:{label:m.lang.anchor.menu,command:'anchor',group:'anchor',order:1},removeAnchor:{label:m.lang.anchor.remove,command:'removeAnchor',group:'anchor',order:5},link:{label:m.lang.link.menu,command:'link',group:'link',order:1},unlink:{label:m.lang.unlink,command:'unlink',group:'link',order:5}});if(m.contextMenu)m.contextMenu.addListener(function(p,q){if(!p||p.isReadOnly())return null;var r=j.link.tryRestoreFakeAnchor(m,p);if(!r&&!(r=j.link.getSelectedLink(m)))return null;var s={};if(r.getAttribute('href')&&r.getChildCount())s={link:2,unlink:2};if(r&&r.hasAttribute('name'))s.anchor=s.removeAnchor=2;return s;});},afterInit:function(m){var n=m.dataProcessor,o=n&&n.dataFilter,p=n&&n.htmlFilter,q=m._.elementsPath&&m._.elementsPath.filters;if(o)o.addRules({elements:{a:function(r){var s=r.attributes;if(!s.name)return null;var t=!r.children.length;if(j.link.synAnchorSelector){var u=t?'cke_anchor_empty':'cke_anchor',v=s['class'];if(s.name&&(!v||v.indexOf(u)<0))s['class']=(v||'')+' '+u;if(t&&j.link.emptyAnchorFix){s.contenteditable='false';s['data-cke-editable']=1;}}else if(j.link.fakeAnchor&&t)return m.createFakeParserElement(r,'cke_anchor','anchor');return null;}}});if(j.link.emptyAnchorFix&&p)p.addRules({elements:{a:function(r){delete r.attributes.contenteditable;}}});if(q)q.push(function(r,s){if(s=='a')if(j.link.tryRestoreFakeAnchor(m,r)||r.getAttribute('name')&&(!r.getAttribute('href')||!r.getChildCount()))return 'anchor';
});}});j.link={getSelectedLink:function(m){try{var n=m.getSelection();if(n.getType()==3){var o=n.getSelectedElement();if(o.is('a'))return o;}var p=n.getRanges(true)[0];p.shrink(2);var q=p.getCommonAncestor();return q.getAscendant('a',true);}catch(r){return null;}},fakeAnchor:b.opera||b.webkit,synAnchorSelector:c,emptyAnchorFix:c&&b.version<8,tryRestoreFakeAnchor:function(m,n){if(n&&n.data('cke-real-element-type')&&n.data('cke-real-element-type')=='anchor'){var o=m.restoreRealElement(n);if(o.data('cke-saved-name'))return o;}}};a.unlinkCommand=function(){};a.unlinkCommand.prototype={exec:function(m){var n=m.getSelection(),o=n.createBookmarks(),p=n.getRanges(),q,r;for(var s=0;s<p.length;s++){q=p[s].getCommonAncestor(true);r=q.getAscendant('a',true);if(!r)continue;p[s].selectNodeContents(r);}n.selectRanges(p);m.document.$.execCommand('unlink',false,null);n.selectBookmarks(o);},startDisabled:true};a.removeAnchorCommand=function(){};a.removeAnchorCommand.prototype={exec:function(m){var n=m.getSelection(),o=n.createBookmarks(),p;if(n&&(p=n.getSelectedElement())&&(j.link.fakeAnchor&&!p.getChildCount()?j.link.tryRestoreFakeAnchor(m,p):p.is('a')))p.remove(1);else if(p=j.link.getSelectedLink(m))if(p.hasAttribute('href')){p.removeAttributes({name:1,'data-cke-saved-name':1});p.removeClass('cke_anchor');}else p.remove(1);n.selectBookmarks(o);}};e.extend(i,{linkShowAdvancedTab:true,linkShowTargetTab:true});(function(){var m={ol:1,ul:1},n=/^[\n\r\t ]*$/,o=d.walker.whitespaces(),p=d.walker.bookmark(),q=function(N){return!(o(N)||p(N));},r=d.walker.bogus();function s(N){var O,P,Q;if(O=N.getDirection()){P=N.getParent();while(P&&!(Q=P.getDirection()))P=P.getParent();if(O==Q)N.removeAttribute('dir');}};function t(N,O){var P=N.getAttribute('style');P&&O.setAttribute('style',P.replace(/([^;])$/,'$1;')+(O.getAttribute('style')||''));};j.list={listToArray:function(N,O,P,Q,R){if(!m[N.getName()])return[];if(!Q)Q=0;if(!P)P=[];for(var S=0,T=N.getChildCount();S<T;S++){var U=N.getChild(S);if(U.type==1&&U.getName() in f.$list)j.list.listToArray(U,O,P,Q+1);if(U.$.nodeName.toLowerCase()!='li')continue;var V={parent:N,indent:Q,element:U,contents:[]};if(!R){V.grandparent=N.getParent();if(V.grandparent&&V.grandparent.$.nodeName.toLowerCase()=='li')V.grandparent=V.grandparent.getParent();}else V.grandparent=R;if(O)h.setMarker(O,U,'listarray_index',P.length);P.push(V);for(var W=0,X=U.getChildCount(),Y;W<X;W++){Y=U.getChild(W);if(Y.type==1&&m[Y.getName()])j.list.listToArray(Y,O,P,Q+1,V.grandparent);
else V.contents.push(Y);}}return P;},arrayToList:function(N,O,P,Q,R){if(!P)P=0;if(!N||N.length<P+1)return null;var S,T=N[P].parent.getDocument(),U=new d.documentFragment(T),V=null,W=P,X=Math.max(N[P].indent,0),Y=null,Z,aa,ab=Q==1?'p':'div';while(1){var ac=N[W],ad=ac.grandparent;Z=ac.element.getDirection(1);if(ac.indent==X){if(!V||N[W].parent.getName()!=V.getName()){V=N[W].parent.clone(false,1);R&&V.setAttribute('dir',R);U.append(V);}Y=V.append(ac.element.clone(0,1));if(Z!=V.getDirection(1))Y.setAttribute('dir',Z);for(S=0;S<ac.contents.length;S++)Y.append(ac.contents[S].clone(1,1));W++;}else if(ac.indent==Math.max(X,0)+1){var ae=N[W-1].element.getDirection(1),af=j.list.arrayToList(N,null,W,Q,ae!=Z?Z:null);if(!Y.getChildCount()&&c&&!(T.$.documentMode>7))Y.append(T.createText('\xa0'));Y.append(af.listNode);W=af.nextIndex;}else if(ac.indent==-1&&!P&&ad){if(m[ad.getName()]){Y=ac.element.clone(false,true);if(Z!=ad.getDirection(1))Y.setAttribute('dir',Z);}else Y=new d.documentFragment(T);var ag=ad.getDirection(1)!=Z,ah=ac.element,ai=ah.getAttribute('class'),aj=ah.getAttribute('style'),ak=Y.type==11&&(Q!=2||ag||aj||ai),al,am=ac.contents.length;for(S=0;S<am;S++){al=ac.contents[S];if(al.type==1&&al.isBlockBoundary()){if(ag&&!al.getDirection())al.setAttribute('dir',Z);t(ah,al);ai&&al.addClass(ai);}else if(ak){if(!aa){aa=T.createElement(ab);ag&&aa.setAttribute('dir',Z);}aj&&aa.setAttribute('style',aj);ai&&aa.setAttribute('class',ai);aa.append(al.clone(1,1));}Y.append(aa||al.clone(1,1));}if(Y.type==11&&W!=N.length-1){var an=Y.getLast();if(an&&an.type==1&&an.getAttribute('type')=='_moz')an.remove();if(!(an=Y.getLast(q)&&an.type==1&&an.getName() in f.$block))Y.append(T.createElement('br'));}var ao=Y.$.nodeName.toLowerCase();if(!c&&(ao=='div'||ao=='p'))Y.appendBogus();U.append(Y);V=null;W++;}else return null;aa=null;if(N.length<=W||Math.max(N[W].indent,0)<X)break;}if(O){var ap=U.getFirst(),aq=N[0].parent;while(ap){if(ap.type==1){h.clearMarkers(O,ap);if(ap.getName() in f.$listItem)s(ap);}ap=ap.getNextSourceNode();}}return{listNode:U,nextIndex:W};}};function u(N){if(N.editor.readOnly)return null;var O=N.data.path,P=O.blockLimit,Q=O.elements,R,S;for(S=0;S<Q.length&&(R=Q[S])&&!R.equals(P);S++){if(m[Q[S].getName()])return this.setState(this.type==Q[S].getName()?1:2);}return this.setState(2);};function v(N,O,P,Q){var R=j.list.listToArray(O.root,P),S=[];for(var T=0;T<O.contents.length;T++){var U=O.contents[T];U=U.getAscendant('li',true);if(!U||U.getCustomData('list_item_processed'))continue;
S.push(U);h.setMarker(P,U,'list_item_processed',true);}var V=O.root,W=V.getDocument(),X,Y;for(T=0;T<S.length;T++){var Z=S[T].getCustomData('listarray_index');X=R[Z].parent;if(!X.is(this.type)){Y=W.createElement(this.type);X.copyAttributes(Y,{start:1,type:1});Y.removeStyle('list-style-type');R[Z].parent=Y;}}var aa=j.list.arrayToList(R,P,null,N.config.enterMode),ab,ac=aa.listNode.getChildCount();for(T=0;T<ac&&(ab=aa.listNode.getChild(T));T++){if(ab.getName()==this.type)Q.push(ab);}aa.listNode.replace(O.root);};var w=/^h[1-6]$/;function x(N,O,P){var Q=O.contents,R=O.root.getDocument(),S=[];if(Q.length==1&&Q[0].equals(O.root)){var T=R.createElement('div');Q[0].moveChildren&&Q[0].moveChildren(T);Q[0].append(T);Q[0]=T;}var U=O.contents[0].getParent();for(var V=0;V<Q.length;V++)U=U.getCommonAncestor(Q[V].getParent());var W=N.config.useComputedState,X,Y;W=W===undefined||W;for(V=0;V<Q.length;V++){var Z=Q[V],aa;while(aa=Z.getParent()){if(aa.equals(U)){S.push(Z);if(!Y&&Z.getDirection())Y=1;var ab=Z.getDirection(W);if(X!==null)if(X&&X!=ab)X=null;else X=ab;break;}Z=aa;}}if(S.length<1)return;var ac=S[S.length-1].getNext(),ad=R.createElement(this.type);P.push(ad);var ae,af;while(S.length){ae=S.shift();af=R.createElement('li');if(ae.is('pre')||w.test(ae.getName()))ae.appendTo(af);else{ae.copyAttributes(af);if(X&&ae.getDirection()){af.removeStyle('direction');af.removeAttribute('dir');}ae.moveChildren(af);ae.remove();}af.appendTo(ad);}if(X&&Y)ad.setAttribute('dir',X);if(ac)ad.insertBefore(ac);else ad.appendTo(U);};function y(N,O,P){var Q=j.list.listToArray(O.root,P),R=[];for(var S=0;S<O.contents.length;S++){var T=O.contents[S];T=T.getAscendant('li',true);if(!T||T.getCustomData('list_item_processed'))continue;R.push(T);h.setMarker(P,T,'list_item_processed',true);}var U=null;for(S=0;S<R.length;S++){var V=R[S].getCustomData('listarray_index');Q[V].indent=-1;U=V;}for(S=U+1;S<Q.length;S++){if(Q[S].indent>Q[S-1].indent+1){var W=Q[S-1].indent+1-Q[S].indent,X=Q[S].indent;while(Q[S]&&Q[S].indent>=X){Q[S].indent+=W;S++;}S--;}}var Y=j.list.arrayToList(Q,P,null,N.config.enterMode,O.root.getAttribute('dir')),Z=Y.listNode,aa,ab;function ac(ad){if((aa=Z[ad?'getFirst':'getLast']())&&!(aa.is&&aa.isBlockBoundary())&&(ab=O.root[ad?'getPrevious':'getNext'](d.walker.whitespaces(true)))&&!(ab.is&&ab.isBlockBoundary({br:1})))N.document.createElement('br')[ad?'insertBefore':'insertAfter'](aa);};ac(true);ac();Z.replace(O.root);};function z(N,O){this.name=N;this.type=O;};var A=d.walker.nodeType(1);function B(N,O,P,Q){var R,S;
while(R=N[Q?'getLast':'getFirst'](A)){if((S=R.getDirection(1))!==O.getDirection(1))R.setAttribute('dir',S);R.remove();P?R[Q?'insertBefore':'insertAfter'](P):O.append(R,Q);}};z.prototype={exec:function(N){var aq=this;var O=N.document,P=N.config,Q=N.getSelection(),R=Q&&Q.getRanges(true);if(!R||R.length<1)return;if(aq.state==2){var S=O.getBody();if(!S.getFirst(q)){P.enterMode==2?S.appendBogus():R[0].fixBlock(1,P.enterMode==1?'p':'div');Q.selectRanges(R);}else{var T=R.length==1&&R[0],U=T&&T.getEnclosedNode();if(U&&U.is&&aq.type==U.getName())aq.setState(1);}}var V=Q.createBookmarks(true),W=[],X={},Y=R.createIterator(),Z=0;while((T=Y.getNextRange())&&++Z){var aa=T.getBoundaryNodes(),ab=aa.startNode,ac=aa.endNode;if(ab.type==1&&ab.getName()=='td')T.setStartAt(aa.startNode,1);if(ac.type==1&&ac.getName()=='td')T.setEndAt(aa.endNode,2);var ad=T.createIterator(),ae;ad.forceBrBreak=aq.state==2;while(ae=ad.getNextParagraph()){if(ae.getCustomData('list_block'))continue;else h.setMarker(X,ae,'list_block',1);var af=new d.elementPath(ae),ag=af.elements,ah=ag.length,ai=null,aj=0,ak=af.blockLimit,al;for(var am=ah-1;am>=0&&(al=ag[am]);am--){if(m[al.getName()]&&ak.contains(al)){ak.removeCustomData('list_group_object_'+Z);var an=al.getCustomData('list_group_object');if(an)an.contents.push(ae);else{an={root:al,contents:[ae]};W.push(an);h.setMarker(X,al,'list_group_object',an);}aj=1;break;}}if(aj)continue;var ao=ak;if(ao.getCustomData('list_group_object_'+Z))ao.getCustomData('list_group_object_'+Z).contents.push(ae);else{an={root:ao,contents:[ae]};h.setMarker(X,ao,'list_group_object_'+Z,an);W.push(an);}}}var ap=[];while(W.length>0){an=W.shift();if(aq.state==2){if(m[an.root.getName()])v.call(aq,N,an,X,ap);else x.call(aq,N,an,ap);}else if(aq.state==1&&m[an.root.getName()])y.call(aq,N,an,X);}for(am=0;am<ap.length;am++)C(ap[am]);h.clearAllMarkers(X);Q.selectBookmarks(V);N.focus();}};function C(N){var O;(O=function(P){var Q=N[P?'getPrevious':'getNext'](q);if(Q&&Q.type==1&&Q.is(N.getName())){B(N,Q,null,!P);N.remove();N=Q;}})();O(1);};var D=f,E=/[\t\r\n ]*(?:&nbsp;|\xa0)$/;function F(N,O){var P,Q=N.children,R=Q.length;for(var S=0;S<R;S++){P=Q[S];if(P.name&&P.name in O)return S;}return R;};function G(N){return function(O){var P=O.children,Q=F(O,D.$list),R=P[Q],S=R&&R.previous,T;if(S&&(S.name&&S.name=='br'||S.value&&(T=S.value.match(E)))){var U=S;if(!(T&&T.index)&&U==P[0])P[0]=N||c?new a.htmlParser.text('\xa0'):new a.htmlParser.element('br',{});else if(U.name=='br')P.splice(Q-1,1);else U.value=U.value.replace(E,'');
}};};var H={elements:{}};for(var I in D.$listItem)H.elements[I]=G();var J={elements:{}};for(I in D.$listItem)J.elements[I]=G(true);function K(N){return N.type==1&&(N.getName() in f.$block||N.getName() in f.$listItem)&&f[N.getName()]['#'];};function L(N,O,P){N.fire('saveSnapshot');P.enlarge(3);var Q=P.extractContents();O.trim(false,true);var R=O.createBookmark(),S=new d.elementPath(O.startContainer),T=S.lastElement.getAscendant('li',1),U=S.block.getBogus();U&&U.remove();var V=Q.getLast();if(V&&V.type==1&&V.is('br'))V.remove();var W=O.startContainer.getChild(O.startOffset);if(W)Q.insertBefore(W);else O.startContainer.append(Q);var X=new d.elementPath(P.startContainer),Y=P.startContainer.getAscendant('li',1);if(Y){var Z=M(Y);if(Z)if(T.contains(Y)){B(Z,Y.getParent(),Y);Z.remove();}else T.append(Z);}while(P.checkStartOfBlock()&&P.checkEndOfBlock()){X=new d.elementPath(P.startContainer);var aa=X.block,ab;if(aa.is('li')){ab=aa.getParent();if(aa.equals(ab.getLast(q))&&aa.equals(ab.getFirst(q)))aa=ab;}P.moveToPosition(aa,3);aa.remove();}var ac=P.clone(),ad=N.document.getBody();ac.setEndAt(ad,2);var ae=new d.walker(ac);ae.evaluator=function(ag){return q(ag)&&!r(ag);};var af=ae.next();if(af&&af.type==1&&af.getName() in f.$list)C(af);O.moveToBookmark(R);O.select();N.selectionChange(1);N.fire('saveSnapshot');};function M(N){var O=N.getLast(q);return O&&O.type==1&&O.getName() in m?O:null;};j.add('list',{init:function(N){var O=N.addCommand('numberedlist',new z('numberedlist','ol')),P=N.addCommand('bulletedlist',new z('bulletedlist','ul'));N.ui.addButton('NumberedList',{label:N.lang.numberedlist,command:'numberedlist'});N.ui.addButton('BulletedList',{label:N.lang.bulletedlist,command:'bulletedlist'});N.on('selectionChange',e.bind(u,O));N.on('selectionChange',e.bind(u,P));N.on('key',function(Q){var R=Q.data.keyCode;if(N.mode=='wysiwyg'&&R in {8:1,46:1}){var S=N.getSelection(),T=S.getRanges()[0];if(!T.collapsed)return;var U=R==8,V=N.document.getBody(),W=new d.walker(T.clone());W.evaluator=function(ah){return q(ah)&&!r(ah);};var X=T.clone();if(U){var Y,Z,aa=new d.elementPath(T.startContainer);if((Y=aa.contains(m))&&T.checkBoundaryOfElement(Y,1)&&(Y=Y.getParent())&&Y.is('li')&&(Y=M(Y))){Z=Y;Y=Y.getPrevious(q);X.moveToPosition(Y&&r(Y)?Y:Z,3);}else{W.range.setStartAt(V,1);W.range.setEnd(T.startContainer,T.startOffset);Y=W.previous();if(Y&&Y.type==1&&(Y.getName() in m||Y.is('li'))){if(!Y.is('li')){W.range.selectNodeContents(Y);W.reset();W.evaluator=K;Y=W.previous();}Z=Y;X.moveToElementEditEnd(Z);
}}if(Z){L(N,X,T);Q.cancel();}}else{var ab=T.startContainer.getAscendant('li',1);if(ab){W.range.setEndAt(V,2);var ac=ab.getLast(q),ad=ac&&K(ac)?ac:ab,ae=0,af=W.next();if(af&&af.type==1&&af.getName() in m&&af.equals(ac)){ae=1;af=W.next();}else if(T.checkBoundaryOfElement(ad,2))ae=1;if(ae&&af){var ag=T.clone();ag.moveToElementEditStart(af);L(N,X,ag);Q.cancel();}}}setTimeout(function(){N.selectionChange(1);});}});},afterInit:function(N){var O=N.dataProcessor;if(O){O.dataFilter.addRules(H);O.htmlFilter.addRules(J);}},requires:['domiterator']});})();(function(){j.liststyle={requires:['dialog'],init:function(m){m.addCommand('numberedListStyle',new a.dialogCommand('numberedListStyle'));a.dialog.add('numberedListStyle',this.path+'dialogs/liststyle.js');m.addCommand('bulletedListStyle',new a.dialogCommand('bulletedListStyle'));a.dialog.add('bulletedListStyle',this.path+'dialogs/liststyle.js');if(m.addMenuItems){m.addMenuGroup('list',108);m.addMenuItems({numberedlist:{label:m.lang.list.numberedTitle,group:'list',command:'numberedListStyle'},bulletedlist:{label:m.lang.list.bulletedTitle,group:'list',command:'bulletedListStyle'}});}if(m.contextMenu)m.contextMenu.addListener(function(n,o){if(!n||n.isReadOnly())return null;while(n){var p=n.getName();if(p=='ol')return{numberedlist:2};else if(p=='ul')return{bulletedlist:2};n=n.getParent();}return null;});}};j.add('liststyle',j.liststyle);})();(function(){function m(s){if(!s||s.type!=1||s.getName()!='form')return[];var t=[],u=['style','className'];for(var v=0;v<u.length;v++){var w=u[v],x=s.$.elements.namedItem(w);if(x){var y=new h(x);t.push([y,y.nextSibling]);y.remove();}}return t;};function n(s,t){if(!s||s.type!=1||s.getName()!='form')return;if(t.length>0)for(var u=t.length-1;u>=0;u--){var v=t[u][0],w=t[u][1];if(w)v.insertBefore(w);else v.appendTo(s);}};function o(s,t){var u=m(s),v={},w=s.$;if(!t){v['class']=w.className||'';w.className='';}v.inline=w.style.cssText||'';if(!t)w.style.cssText='position: static; overflow: visible';n(u);return v;};function p(s,t){var u=m(s),v=s.$;if('class' in t)v.className=t['class'];if('inline' in t)v.style.cssText=t.inline;n(u);};function q(s){var t=a.instances;for(var u in t){var v=t[u];if(v.mode=='wysiwyg'&&!v.readOnly){var w=v.document.getBody();w.setAttribute('contentEditable',false);w.setAttribute('contentEditable',true);}}if(s.focusManager.hasFocus){s.toolbox.focus();s.focus();}};function r(s){if(!c||b.version>6)return null;var t=h.createFromHtml('<iframe frameborder="0" tabindex="-1" src="javascript:void((function(){document.open();'+(b.isCustomDomain()?"document.domain='"+this.getDocument().$.domain+"';":'')+'document.close();'+'})())"'+' style="display:block;position:absolute;z-index:-1;'+'progid:DXImageTransform.Microsoft.Alpha(opacity=0);'+'"></iframe>');
return s.append(t,true);};j.add('maximize',{init:function(s){var t=s.lang,u=a.document,v=u.getWindow(),w,x,y,z;function A(){var C=v.getViewPaneSize();z&&z.setStyles({width:C.width+'px',height:C.height+'px'});s.resize(C.width,C.height,null,true);};var B=2;s.addCommand('maximize',{modes:{wysiwyg:!b.iOS,source:!b.iOS},readOnly:1,editorFocus:false,exec:function(){var C=s.container.getChild(1),D=s.getThemeSpace('contents');if(s.mode=='wysiwyg'){var E=s.getSelection();w=E&&E.getRanges();x=v.getScrollPosition();}else{var F=s.textarea.$;w=!c&&[F.selectionStart,F.selectionEnd];x=[F.scrollLeft,F.scrollTop];}if(this.state==2){v.on('resize',A);y=v.getScrollPosition();var G=s.container;while(G=G.getParent()){G.setCustomData('maximize_saved_styles',o(G));G.setStyle('z-index',s.config.baseFloatZIndex-1);}D.setCustomData('maximize_saved_styles',o(D,true));C.setCustomData('maximize_saved_styles',o(C,true));var H={overflow:b.webkit?'':'hidden',width:0,height:0};u.getDocumentElement().setStyles(H);!b.gecko&&u.getDocumentElement().setStyle('position','fixed');!(b.gecko&&b.quirks)&&u.getBody().setStyles(H);c?setTimeout(function(){v.$.scrollTo(0,0);},0):v.$.scrollTo(0,0);C.setStyle('position',b.gecko&&b.quirks?'fixed':'absolute');C.$.offsetLeft;C.setStyles({'z-index':s.config.baseFloatZIndex-1,left:'0px',top:'0px'});z=r(C);C.addClass('cke_maximized');A();var I=C.getDocumentPosition();C.setStyles({left:-1*I.x+'px',top:-1*I.y+'px'});b.gecko&&q(s);}else if(this.state==1){v.removeListener('resize',A);var J=[D,C];for(var K=0;K<J.length;K++){p(J[K],J[K].getCustomData('maximize_saved_styles'));J[K].removeCustomData('maximize_saved_styles');}G=s.container;while(G=G.getParent()){p(G,G.getCustomData('maximize_saved_styles'));G.removeCustomData('maximize_saved_styles');}c?setTimeout(function(){v.$.scrollTo(y.x,y.y);},0):v.$.scrollTo(y.x,y.y);C.removeClass('cke_maximized');if(b.webkit){C.setStyle('display','inline');setTimeout(function(){C.setStyle('display','block');},0);}if(z){z.remove();z=null;}s.fire('resize');}this.toggleState();var L=this.uiItems[0];if(L){var M=this.state==2?t.maximize:t.minimize,N=s.element.getDocument().getById(L._.id);N.getChild(1).setHtml(M);N.setAttribute('title',M);N.setAttribute('href','javascript:void("'+M+'");');}if(s.mode=='wysiwyg'){if(w){b.gecko&&q(s);s.getSelection().selectRanges(w);var O=s.getSelection().getStartElement();O&&O.scrollIntoView(true);}else v.$.scrollTo(x.x,x.y);}else{if(w){F.selectionStart=w[0];F.selectionEnd=w[1];}F.scrollLeft=x[0];F.scrollTop=x[1];
}w=x=null;B=this.state;},canUndo:false});s.ui.addButton('Maximize',{label:t.maximize,command:'maximize'});s.on('mode',function(){var C=s.getCommand('maximize');C.setState(C.state==0?0:B);},null,null,100);}});})();j.add('newpage',{init:function(m){m.addCommand('newpage',{modes:{wysiwyg:1,source:1},exec:function(n){var o=this;n.setData(n.config.newpage_html||'',function(){setTimeout(function(){n.fire('afterCommandExec',{name:'newpage',command:o});n.selectionChange();},200);});n.focus();},async:true});m.ui.addButton('NewPage',{label:m.lang.newPage,command:'newpage'});}});j.add('pagebreak',{init:function(m){m.addCommand('pagebreak',j.pagebreakCmd);m.ui.addButton('PageBreak',{label:m.lang.pagebreak,command:'pagebreak'});var n=['{','background: url('+a.getUrl(this.path+'images/pagebreak.gif')+') no-repeat center center;','clear: both;','width:100%; _width:99.9%;','border-top: #999999 1px dotted;','border-bottom: #999999 1px dotted;','padding:0;','height: 5px;','cursor: default;','}'].join('').replace(/;/g,' !important;');m.addCss('div.cke_pagebreak'+n);b.opera&&m.on('contentDom',function(){m.document.on('click',function(o){var p=o.data.getTarget();if(p.is('div')&&p.hasClass('cke_pagebreak'))m.getSelection().selectElement(p);});});},afterInit:function(m){var n=m.lang.pagebreakAlt,o=m.dataProcessor,p=o&&o.dataFilter,q=o&&o.htmlFilter;if(q)q.addRules({attributes:{'class':function(r,s){var t=r.replace('cke_pagebreak','');if(t!=r){var u=a.htmlParser.fragment.fromHtml('<span style="display: none;">&nbsp;</span>');s.children.length=0;s.add(u);var v=s.attributes;delete v['aria-label'];delete v.contenteditable;delete v.title;}return t;}}},5);if(p)p.addRules({elements:{div:function(r){var s=r.attributes,t=s&&s.style,u=t&&r.children.length==1&&r.children[0],v=u&&u.name=='span'&&u.attributes.style;if(v&&/page-break-after\s*:\s*always/i.test(t)&&/display\s*:\s*none/i.test(v)){s.contenteditable='false';s['class']='cke_pagebreak';s['data-cke-display-name']='pagebreak';s['aria-label']=n;s.title=n;r.children.length=0;}}}});},requires:['fakeobjects']});j.pagebreakCmd={exec:function(m){var n=m.lang.pagebreakAlt,o=h.createFromHtml('<div style="page-break-after: always;"contenteditable="false" title="'+n+'" '+'aria-label="'+n+'" '+'data-cke-display-name="pagebreak" '+'class="cke_pagebreak">'+'</div>',m.document),p=m.getSelection().getRanges(true);m.fire('saveSnapshot');for(var q,r=p.length-1;r>=0;r--){q=p[r];if(r<p.length-1)o=o.clone(true);q.splitBlock('p');q.insertNode(o);if(r==p.length-1){var s=o.getNext();
q.moveToPosition(o,4);if(!s||s.type==1&&!s.isEditable())q.fixBlock(true,m.config.enterMode==3?'div':'p');q.select();}}m.fire('saveSnapshot');}};(function(){function m(n){n.data.mode='html';};j.add('pastefromword',{init:function(n){var o=0,p=function(q){q&&q.removeListener();n.removeListener('beforePaste',m);o&&setTimeout(function(){o=0;},0);};n.addCommand('pastefromword',{canUndo:false,exec:function(){o=1;n.on('beforePaste',m);if(n.execCommand('paste','html')===false){n.on('dialogShow',function(q){q.removeListener();q.data.on('cancel',p);});n.on('dialogHide',function(q){q.data.removeListener('cancel',p);});}n.on('afterPaste',p);}});n.ui.addButton('PasteFromWord',{label:n.lang.pastefromword.toolbar,command:'pastefromword'});n.on('pasteState',function(q){n.getCommand('pastefromword').setState(q.data);});n.on('paste',function(q){var r=q.data,s;if((s=r.html)&&(o||/(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/.test(s))){var t=this.loadFilterRules(function(){if(t)n.fire('paste',r);else if(!n.config.pasteFromWordPromptCleanup||o||confirm(n.lang.pastefromword.confirmCleanup))r.html=a.cleanWord(s,n);});t&&q.cancel();}},this);},loadFilterRules:function(n){var o=a.cleanWord;if(o)n();else{var p=a.getUrl(i.pasteFromWordCleanupFile||this.path+'filter/default.js');a.scriptLoader.load(p,n,null,true);}return!o;},requires:['clipboard']});})();(function(){var m={exec:function(n){var o=e.tryThese(function(){var p=window.clipboardData.getData('Text');if(!p)throw 0;return p;});if(!o){n.openDialog('pastetext');return false;}else n.fire('paste',{text:o});return true;}};j.add('pastetext',{init:function(n){var o='pastetext',p=n.addCommand(o,m);n.ui.addButton('PasteText',{label:n.lang.pasteText.button,command:o});a.dialog.add(o,a.getUrl(this.path+'dialogs/pastetext.js'));if(n.config.forcePasteAsPlainText){n.on('beforeCommandExec',function(q){var r=q.data.commandData;if(q.data.name=='paste'&&r!='html'){n.execCommand('pastetext');q.cancel();}},null,null,0);n.on('beforePaste',function(q){q.data.mode='text';});}n.on('pasteState',function(q){n.getCommand('pastetext').setState(q.data);});},requires:['clipboard']});})();j.add('popup');e.extend(a.editor.prototype,{popup:function(m,n,o,p){n=n||'80%';o=o||'70%';if(typeof n=='string'&&n.length>1&&n.substr(n.length-1,1)=='%')n=parseInt(window.screen.width*parseInt(n,10)/100,10);if(typeof o=='string'&&o.length>1&&o.substr(o.length-1,1)=='%')o=parseInt(window.screen.height*parseInt(o,10)/100,10);if(n<640)n=640;if(o<420)o=420;var q=parseInt((window.screen.height-o)/2,10),r=parseInt((window.screen.width-n)/2,10);
p=(p||'location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes')+',width='+n+',height='+o+',top='+q+',left='+r;var s=window.open('',null,p,true);if(!s)return false;try{var t=navigator.userAgent.toLowerCase();if(t.indexOf(' chrome/')==-1){s.moveTo(r,q);s.resizeTo(n,o);}s.focus();s.location.href=m;}catch(u){s=window.open(m,null,p,true);}return true;}});(function(){var m,n={modes:{wysiwyg:1,source:1},canUndo:false,readOnly:1,exec:function(p){var q,r=p.config,s=r.baseHref?'<base href="'+r.baseHref+'"/>':'',t=b.isCustomDomain();if(r.fullPage)q=p.getData().replace(/<head>/,'$&'+s).replace(/[^>]*(?=<\/title>)/,'$& &mdash; '+p.lang.preview);else{var u='<body ',v=p.document&&p.document.getBody();if(v){if(v.getAttribute('id'))u+='id="'+v.getAttribute('id')+'" ';if(v.getAttribute('class'))u+='class="'+v.getAttribute('class')+'" ';}u+='>';q=p.config.docType+'<html dir="'+p.config.contentsLangDirection+'">'+'<head>'+s+'<title>'+p.lang.preview+'</title>'+e.buildStyleHtml(p.config.contentsCss)+'</head>'+u+p.getData()+'</body></html>';}var w=640,x=420,y=80;try{var z=window.screen;w=Math.round(z.width*0.8);x=Math.round(z.height*0.7);y=Math.round(z.width*0.1);}catch(D){}var A='';if(t){window._cke_htmlToLoad=q;A='javascript:void( (function(){document.open();document.domain="'+document.domain+'";'+'document.write( window.opener._cke_htmlToLoad );'+'document.close();'+'window.opener._cke_htmlToLoad = null;'+'})() )';}if(b.gecko){window._cke_htmlToLoad=q;A=m+'preview.html';}var B=window.open(A,null,'toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width='+w+',height='+x+',left='+y);if(!t&&!b.gecko){var C=B.document;C.open();C.write(q);C.close();b.webkit&&setTimeout(function(){C.body.innerHTML+='';},0);}}},o='preview';j.add(o,{init:function(p){m=this.path;p.addCommand(o,n);p.ui.addButton('Preview',{label:p.lang.preview,command:o});}});})();j.add('print',{init:function(m){var n='print',o=m.addCommand(n,j.print);m.ui.addButton('Print',{label:m.lang.print,command:n});}});j.print={exec:function(m){if(b.opera)return;else if(b.gecko)m.window.$.print();else m.document.$.execCommand('Print');},canUndo:false,readOnly:1,modes:{wysiwyg:!b.opera}};j.add('removeformat',{requires:['selection'],init:function(m){m.addCommand('removeFormat',j.removeformat.commands.removeformat);m.ui.addButton('RemoveFormat',{label:m.lang.removeFormat,command:'removeFormat'});m._.removeFormat={filters:[]};}});j.removeformat={commands:{removeformat:{exec:function(m){var n=m._.removeFormatRegex||(m._.removeFormatRegex=new RegExp('^(?:'+m.config.removeFormatTags.replace(/,/g,'|')+')$','i')),o=m._.removeAttributes||(m._.removeAttributes=m.config.removeFormatAttributes.split(',')),p=j.removeformat.filter,q=m.getSelection().getRanges(1),r=q.createIterator(),s;
while(s=r.getNextRange()){if(!s.collapsed)s.enlarge(1);var t=s.createBookmark(),u=t.startNode,v=t.endNode,w,x=function(z){var A=new d.elementPath(z),B=A.elements;for(var C=1,D;D=B[C];C++){if(D.equals(A.block)||D.equals(A.blockLimit))break;if(n.test(D.getName())&&p(m,D))z.breakParent(D);}};x(u);if(v){x(v);w=u.getNextSourceNode(true,1);while(w){if(w.equals(v))break;var y=w.getNextSourceNode(false,1);if(!(w.getName()=='img'&&w.data('cke-realelement'))&&p(m,w))if(n.test(w.getName()))w.remove(1);else{w.removeAttributes(o);m.fire('removeFormatCleanup',w);}w=y;}}s.moveToBookmark(t);}m.getSelection().selectRanges(q);}}},filter:function(m,n){var o=m._.removeFormat.filters;for(var p=0;p<o.length;p++){if(o[p](n)===false)return false;}return true;}};a.editor.prototype.addRemoveFormatFilter=function(m){this._.removeFormat.filters.push(m);};i.removeFormatTags='b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var';i.removeFormatAttributes='class,style,lang,width,height,align,hspace,valign';j.add('resize',{init:function(m){var n=m.config,o=m.element.getDirection(1);!n.resize_dir&&(n.resize_dir='both');n.resize_maxWidth==undefined&&(n.resize_maxWidth=3000);n.resize_maxHeight==undefined&&(n.resize_maxHeight=3000);n.resize_minWidth==undefined&&(n.resize_minWidth=750);n.resize_minHeight==undefined&&(n.resize_minHeight=250);if(n.resize_enabled!==false){var p=null,q,r,s=(n.resize_dir=='both'||n.resize_dir=='horizontal')&&n.resize_minWidth!=n.resize_maxWidth,t=(n.resize_dir=='both'||n.resize_dir=='vertical')&&n.resize_minHeight!=n.resize_maxHeight;function u(x){var y=x.data.$.screenX-q.x,z=x.data.$.screenY-q.y,A=r.width,B=r.height,C=A+y*(o=='rtl'?-1:1),D=B+z;if(s)A=Math.max(n.resize_minWidth,Math.min(C,n.resize_maxWidth));if(t)B=Math.max(n.resize_minHeight,Math.min(D,n.resize_maxHeight));m.resize(s?A:null,B);};function v(x){a.document.removeListener('mousemove',u);a.document.removeListener('mouseup',v);if(m.document){m.document.removeListener('mousemove',u);m.document.removeListener('mouseup',v);}};var w=e.addFunction(function(x){if(!p)p=m.getResizable();r={width:p.$.offsetWidth||0,height:p.$.offsetHeight||0};q={x:x.screenX,y:x.screenY};n.resize_minWidth>r.width&&(n.resize_minWidth=r.width);n.resize_minHeight>r.height&&(n.resize_minHeight=r.height);a.document.on('mousemove',u);a.document.on('mouseup',v);if(m.document){m.document.on('mousemove',u);m.document.on('mouseup',v);}});m.on('destroy',function(){e.removeFunction(w);});m.on('themeSpace',function(x){if(x.data.space=='bottom'){var y='';
if(s&&!t)y=' cke_resizer_horizontal';if(!s&&t)y=' cke_resizer_vertical';var z='<div class="cke_resizer'+y+' cke_resizer_'+o+'"'+' title="'+e.htmlEncode(m.lang.resize)+'"'+' onmousedown="CKEDITOR.tools.callFunction('+w+', event)"'+'></div>';o=='ltr'&&y=='ltr'?x.data.html+=z:x.data.html=z+x.data.html;}},m,null,100);}}});(function(){var m={modes:{wysiwyg:1,source:1},readOnly:1,exec:function(o){var p=o.element.$.form;if(p)try{p.submit();}catch(q){if(p.submit.click)p.submit.click();}}},n='save';j.add(n,{init:function(o){var p=o.addCommand(n,m);p.modes={wysiwyg:!!o.element.$.form};o.ui.addButton('Save',{label:o.lang.save,command:n});}});})();(function(){var m='scaytcheck',n='';function o(t,u){var v=0,w;for(w in u){if(u[w]==t){v=1;break;}}return v;};var p=function(){var t=this,u=function(){var y=t.config,z={};z.srcNodeRef=t.document.getWindow().$.frameElement;z.assocApp='CKEDITOR.'+a.version+'@'+a.revision;z.customerid=y.scayt_customerid||'1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2';z.customDictionaryIds=y.scayt_customDictionaryIds||'';z.userDictionaryName=y.scayt_userDictionaryName||'';z.sLang=y.scayt_sLang||'en_US';z.onLoad=function(){if(!(c&&b.version<8))this.addStyle(this.selectorCss(),'padding-bottom: 2px !important;');if(t.focusManager.hasFocus&&!q.isControlRestored(t))this.focus();};z.onBeforeChange=function(){if(q.getScayt(t)&&!t.checkDirty())setTimeout(function(){t.resetDirty();},0);};var A=window.scayt_custom_params;if(typeof A=='object')for(var B in A)z[B]=A[B];if(q.getControlId(t))z.id=q.getControlId(t);var C=new window.scayt(z);C.afterMarkupRemove.push(function(E){new h(E,C.document).mergeSiblings();});var D=q.instances[t.name];if(D){C.sLang=D.sLang;C.option(D.option());C.paused=D.paused;}q.instances[t.name]=C;try{C.setDisabled(q.isPaused(t)===false);}catch(E){}t.fire('showScaytState');};t.on('contentDom',u);t.on('contentDomUnload',function(){var y=a.document.getElementsByTag('script'),z=/^dojoIoScript(\d+)$/i,A=/^https?:\/\/svc\.webspellchecker\.net\/spellcheck\/script\/ssrv\.cgi/i;for(var B=0;B<y.count();B++){var C=y.getItem(B),D=C.getId(),E=C.getAttribute('src');if(D&&E&&D.match(z)&&E.match(A))C.remove();}});t.on('beforeCommandExec',function(y){if((y.data.name=='source'||y.data.name=='newpage')&&t.mode=='wysiwyg'){var z=q.getScayt(t);if(z){q.setPaused(t,!z.disabled);q.setControlId(t,z.id);z.destroy(true);delete q.instances[t.name];}}else if(y.data.name=='source'&&t.mode=='source')q.markControlRestore(t);});t.on('afterCommandExec',function(y){if(!q.isScaytEnabled(t))return;
if(t.mode=='wysiwyg'&&(y.data.name=='undo'||y.data.name=='redo'))window.setTimeout(function(){q.getScayt(t).refresh();},10);});t.on('destroy',function(y){var z=y.editor,A=q.getScayt(z);if(!A)return;delete q.instances[z.name];q.setControlId(z,A.id);A.destroy(true);});t.on('afterSetData',function(){if(q.isScaytEnabled(t))window.setTimeout(function(){var y=q.getScayt(t);y&&y.refresh();},10);});t.on('insertElement',function(){var y=q.getScayt(t);if(q.isScaytEnabled(t)){if(c)t.getSelection().unlock(true);window.setTimeout(function(){y.focus();y.refresh();},10);}},this,null,50);t.on('insertHtml',function(){var y=q.getScayt(t);if(q.isScaytEnabled(t)){if(c)t.getSelection().unlock(true);window.setTimeout(function(){y.focus();y.refresh();},10);}},this,null,50);t.on('scaytDialog',function(y){y.data.djConfig=window.djConfig;y.data.scayt_control=q.getScayt(t);y.data.tab=n;y.data.scayt=window.scayt;});var v=t.dataProcessor,w=v&&v.htmlFilter;if(w)w.addRules({elements:{span:function(y){if(y.attributes['data-scayt_word']&&y.attributes['data-scaytid']){delete y.name;return y;}}}});var x=j.undo.Image.prototype;x.equals=e.override(x.equals,function(y){return function(z){var E=this;var A=E.contents,B=z.contents,C=q.getScayt(E.editor);if(C&&q.isScaytReady(E.editor)){E.contents=C.reset(A)||'';z.contents=C.reset(B)||'';}var D=y.apply(E,arguments);E.contents=A;z.contents=B;return D;};});if(t.document)u();};j.scayt={engineLoaded:false,instances:{},controlInfo:{},setControlInfo:function(t,u){if(t&&t.name&&typeof this.controlInfo[t.name]!='object')this.controlInfo[t.name]={};for(var v in u)this.controlInfo[t.name][v]=u[v];},isControlRestored:function(t){if(t&&t.name&&this.controlInfo[t.name])return this.controlInfo[t.name].restored;return false;},markControlRestore:function(t){this.setControlInfo(t,{restored:true});},setControlId:function(t,u){this.setControlInfo(t,{id:u});},getControlId:function(t){if(t&&t.name&&this.controlInfo[t.name]&&this.controlInfo[t.name].id)return this.controlInfo[t.name].id;return null;},setPaused:function(t,u){this.setControlInfo(t,{paused:u});},isPaused:function(t){if(t&&t.name&&this.controlInfo[t.name])return this.controlInfo[t.name].paused;return undefined;},getScayt:function(t){return this.instances[t.name];},isScaytReady:function(t){return this.engineLoaded===true&&'undefined'!==typeof window.scayt&&this.getScayt(t);},isScaytEnabled:function(t){var u=this.getScayt(t);return u?u.disabled===false:false;},getUiTabs:function(t){var u=[],v=t.config.scayt_uiTabs||'1,1,1';
v=v.split(',');v[3]='1';for(var w=0;w<4;w++)u[w]=typeof window.scayt!='undefined'&&typeof window.scayt.uiTags!='undefined'?parseInt(v[w],10)&&window.scayt.uiTags[w]:parseInt(v[w],10);return u;},loadEngine:function(t){if(b.gecko&&b.version<10900||b.opera||b.air)return t.fire('showScaytState');if(this.engineLoaded===true)return p.apply(t);else if(this.engineLoaded==-1)return a.on('scaytReady',function(){p.apply(t);});a.on('scaytReady',p,t);a.on('scaytReady',function(){this.engineLoaded=true;},this,null,0);this.engineLoaded=-1;var u=document.location.protocol;u=u.search(/https?:/)!=-1?u:'http:';var v='svc.webspellchecker.net/scayt26/loader__base.js',w=t.config.scayt_srcUrl||u+'//'+v,x=q.parseUrl(w).path+'/';if(window.scayt==undefined){a._djScaytConfig={baseUrl:x,addOnLoad:[function(){a.fireOnce('scaytReady');}],isDebug:false};a.document.getHead().append(a.document.createElement('script',{attributes:{type:'text/javascript',async:'true',src:w}}));}else a.fireOnce('scaytReady');return null;},parseUrl:function(t){var u;if(t.match&&(u=t.match(/(.*)[\/\\](.*?\.\w+)$/)))return{path:u[1],file:u[2]};else return t;}};var q=j.scayt,r=function(t,u,v,w,x,y,z){t.addCommand(w,x);t.addMenuItem(w,{label:v,command:w,group:y,order:z});},s={preserveState:true,editorFocus:false,canUndo:false,exec:function(t){if(q.isScaytReady(t)){var u=q.isScaytEnabled(t);this.setState(u?2:1);var v=q.getScayt(t);v.focus();v.setDisabled(u);}else if(!t.config.scayt_autoStartup&&q.engineLoaded>=0){this.setState(0);q.loadEngine(t);}}};j.add('scayt',{requires:['menubutton'],beforeInit:function(t){var u=t.config.scayt_contextMenuItemsOrder||'suggest|moresuggest|control',v='';u=u.split('|');if(u&&u.length)for(var w=0;w<u.length;w++)v+='scayt_'+u[w]+(u.length!=parseInt(w,10)+1?',':'');t.config.menu_groups=v+','+t.config.menu_groups;},init:function(t){var u=t.dataProcessor&&t.dataProcessor.dataFilter,v={elements:{span:function(E){var F=E.attributes;if(F&&F['data-scaytid'])delete E.name;}}};u&&u.addRules(v);var w={},x={},y=t.addCommand(m,s);a.dialog.add(m,a.getUrl(this.path+'dialogs/options.js'));var z=q.getUiTabs(t),A='scaytButton';t.addMenuGroup(A);var B={},C=t.lang.scayt;B.scaytToggle={label:C.enable,command:m,group:A};if(z[0]==1)B.scaytOptions={label:C.options,group:A,onClick:function(){n='options';t.openDialog(m);}};if(z[1]==1)B.scaytLangs={label:C.langs,group:A,onClick:function(){n='langs';t.openDialog(m);}};if(z[2]==1)B.scaytDict={label:C.dictionariesTab,group:A,onClick:function(){n='dictionaries';t.openDialog(m);
}};B.scaytAbout={label:t.lang.scayt.about,group:A,onClick:function(){n='about';t.openDialog(m);}};t.addMenuItems(B);t.ui.add('Scayt','menubutton',{label:C.title,title:b.opera?C.opera_title:C.title,className:'cke_button_scayt',modes:{wysiwyg:1},onRender:function(){y.on('state',function(){this.setState(y.state);},this);},onMenu:function(){var E=q.isScaytEnabled(t);t.getMenuItem('scaytToggle').label=C[E?'disable':'enable'];var F=q.getUiTabs(t);return{scaytToggle:2,scaytOptions:E&&F[0]?2:0,scaytLangs:E&&F[1]?2:0,scaytDict:E&&F[2]?2:0,scaytAbout:E&&F[3]?2:0};}});if(t.contextMenu&&t.addMenuItems)t.contextMenu.addListener(function(E,F){if(!q.isScaytEnabled(t)||F.getRanges()[0].checkReadOnly())return null;var G=q.getScayt(t),H=G.getScaytNode();if(!H)return null;var I=G.getWord(H);if(!I)return null;var J=G.getLang(),K={},L=window.scayt.getSuggestion(I,J);if(!L||!L.length)return null;for(var M in w){delete t._.menuItems[M];delete t._.commands[M];}for(M in x){delete t._.menuItems[M];delete t._.commands[M];}w={};x={};var N=t.config.scayt_moreSuggestions||'on',O=false,P=t.config.scayt_maxSuggestions;typeof P!='number'&&(P=5);!P&&(P=L.length);var Q=t.config.scayt_contextCommands||'all';Q=Q.split('|');for(var R=0,S=L.length;R<S;R+=1){var T='scayt_suggestion_'+L[R].replace(' ','_'),U=(function(Y,Z){return{exec:function(){G.replace(Y,Z);}};})(H,L[R]);if(R<P){r(t,'button_'+T,L[R],T,U,'scayt_suggest',R+1);K[T]=2;x[T]=2;}else if(N=='on'){r(t,'button_'+T,L[R],T,U,'scayt_moresuggest',R+1);w[T]=2;O=true;}}if(O){t.addMenuItem('scayt_moresuggest',{label:C.moreSuggestions,group:'scayt_moresuggest',order:10,getItems:function(){return w;}});x.scayt_moresuggest=2;}if(o('all',Q)||o('ignore',Q)){var V={exec:function(){G.ignore(H);}};r(t,'ignore',C.ignore,'scayt_ignore',V,'scayt_control',1);x.scayt_ignore=2;}if(o('all',Q)||o('ignoreall',Q)){var W={exec:function(){G.ignoreAll(H);}};r(t,'ignore_all',C.ignoreAll,'scayt_ignore_all',W,'scayt_control',2);x.scayt_ignore_all=2;}if(o('all',Q)||o('add',Q)){var X={exec:function(){window.scayt.addWordToUserDictionary(H);}};r(t,'add_word',C.addWord,'scayt_add_word',X,'scayt_control',3);x.scayt_add_word=2;}if(G.fireOnContextMenu)G.fireOnContextMenu(t);return x;});var D=function(){t.removeListener('showScaytState',D);if(!b.opera&&!b.air)y.setState(q.isScaytEnabled(t)?1:2);else y.setState(0);};t.on('showScaytState',D);if(b.opera||b.air)t.on('instanceReady',function(){D();});if(t.config.scayt_autoStartup)t.on('instanceReady',function(){q.loadEngine(t);});
},afterInit:function(t){var u,v=function(w){if(w.hasAttribute('data-scaytid'))return false;};if(t._.elementsPath&&(u=t._.elementsPath.filters))u.push(v);t.addRemoveFormatFilter&&t.addRemoveFormatFilter(v);}});})();j.add('smiley',{requires:['dialog'],init:function(m){m.config.smiley_path=m.config.smiley_path||this.path+'images/';m.addCommand('smiley',new a.dialogCommand('smiley'));m.ui.addButton('Smiley',{label:m.lang.smiley.toolbar,command:'smiley'});a.dialog.add('smiley',this.path+'dialogs/smiley.js');}});i.smiley_images=['regular_smile.gif','sad_smile.gif','wink_smile.gif','teeth_smile.gif','confused_smile.gif','tounge_smile.gif','embaressed_smile.gif','omg_smile.gif','whatchutalkingabout_smile.gif','angry_smile.gif','angel_smile.gif','shades_smile.gif','devil_smile.gif','cry_smile.gif','lightbulb.gif','thumbs_down.gif','thumbs_up.gif','heart.gif','broken_heart.gif','kiss.gif','envelope.gif'];i.smiley_descriptions=['smiley','sad','wink','laugh','frown','cheeky','blush','surprise','indecision','angry','angel','cool','devil','crying','enlightened','no','yes','heart','broken heart','kiss','mail'];(function(){var m='.%2 p,.%2 div,.%2 pre,.%2 address,.%2 blockquote,.%2 h1,.%2 h2,.%2 h3,.%2 h4,.%2 h5,.%2 h6{background-repeat: no-repeat;background-position: top %3;border: 1px dotted gray;padding-top: 8px;padding-%3: 8px;}.%2 p{%1p.png);}.%2 div{%1div.png);}.%2 pre{%1pre.png);}.%2 address{%1address.png);}.%2 blockquote{%1blockquote.png);}.%2 h1{%1h1.png);}.%2 h2{%1h2.png);}.%2 h3{%1h3.png);}.%2 h4{%1h4.png);}.%2 h5{%1h5.png);}.%2 h6{%1h6.png);}',n=/%1/g,o=/%2/g,p=/%3/g,q={readOnly:1,preserveState:true,editorFocus:false,exec:function(r){this.toggleState();this.refresh(r);},refresh:function(r){if(r.document){var s=this.state==1?'addClass':'removeClass';r.document.getBody()[s]('cke_show_blocks');}}};j.add('showblocks',{requires:['wysiwygarea'],init:function(r){var s=r.addCommand('showblocks',q);s.canUndo=false;if(r.config.startupOutlineBlocks)s.setState(1);r.addCss(m.replace(n,'background-image: url('+a.getUrl(this.path)+'images/block_').replace(o,'cke_show_blocks ').replace(p,r.lang.dir=='rtl'?'right':'left'));r.ui.addButton('ShowBlocks',{label:r.lang.showBlocks,command:'showblocks'});r.on('mode',function(){if(s.state!=0)s.refresh(r);});r.on('contentDom',function(){if(s.state!=0)s.refresh(r);});}});})();(function(){var m='cke_show_border',n,o=(b.ie6Compat?['.%1 table.%2,','.%1 table.%2 td, .%1 table.%2 th','{','border : #d3d3d3 1px dotted','}']:['.%1 table.%2,','.%1 table.%2 > tr > td, .%1 table.%2 > tr > th,','.%1 table.%2 > tbody > tr > td, .%1 table.%2 > tbody > tr > th,','.%1 table.%2 > thead > tr > td, .%1 table.%2 > thead > tr > th,','.%1 table.%2 > tfoot > tr > td, .%1 table.%2 > tfoot > tr > th','{','border : #d3d3d3 1px dotted','}']).join('');
n=o.replace(/%2/g,m).replace(/%1/g,'cke_show_borders ');var p={preserveState:true,editorFocus:false,readOnly:1,exec:function(q){this.toggleState();this.refresh(q);},refresh:function(q){if(q.document){var r=this.state==1?'addClass':'removeClass';q.document.getBody()[r]('cke_show_borders');}}};j.add('showborders',{requires:['wysiwygarea'],modes:{wysiwyg:1},init:function(q){var r=q.addCommand('showborders',p);r.canUndo=false;if(q.config.startupShowBorders!==false)r.setState(1);q.addCss(n);q.on('mode',function(){if(r.state!=0)r.refresh(q);},null,null,100);q.on('contentDom',function(){if(r.state!=0)r.refresh(q);});q.on('removeFormatCleanup',function(s){var t=s.data;if(q.getCommand('showborders').state==1&&t.is('table')&&(!t.hasAttribute('border')||parseInt(t.getAttribute('border'),10)<=0))t.addClass(m);});},afterInit:function(q){var r=q.dataProcessor,s=r&&r.dataFilter,t=r&&r.htmlFilter;if(s)s.addRules({elements:{table:function(u){var v=u.attributes,w=v['class'],x=parseInt(v.border,10);if((!x||x<=0)&&(!w||w.indexOf(m)==-1))v['class']=(w||'')+' '+m;}}});if(t)t.addRules({elements:{table:function(u){var v=u.attributes,w=v['class'];w&&(v['class']=w.replace(m,'').replace(/\s{2}/,' ').replace(/^\s+|\s+$/,''));}}});}});a.on('dialogDefinition',function(q){var r=q.data.name;if(r=='table'||r=='tableProperties'){var s=q.data.definition,t=s.getContents('info'),u=t.get('txtBorder'),v=u.commit;u.commit=e.override(v,function(y){return function(z,A){y.apply(this,arguments);var B=parseInt(this.getValue(),10);A[!B||B<=0?'addClass':'removeClass'](m);};});var w=s.getContents('advanced'),x=w&&w.get('advCSSClasses');if(x){x.setup=e.override(x.setup,function(y){return function(){y.apply(this,arguments);this.setValue(this.getValue().replace(/cke_show_border/,''));};});x.commit=e.override(x.commit,function(y){return function(z,A){y.apply(this,arguments);if(!parseInt(A.getAttribute('border'),10))A.addClass('cke_show_border');};});}}});})();j.add('sourcearea',{requires:['editingblock'],init:function(m){var n=j.sourcearea,o=a.document.getWindow();m.on('editingBlockReady',function(){var p,q;m.addMode('source',{load:function(r,s){if(c&&b.version<8)r.setStyle('position','relative');m.textarea=p=new h('textarea');p.setAttributes({dir:'ltr',tabIndex:b.webkit?-1:m.tabIndex,role:'textbox','aria-label':m.lang.editorTitle.replace('%1',m.name)});p.addClass('cke_source');p.addClass('cke_enable_context_menu');m.readOnly&&p.setAttribute('readOnly','readonly');var t={width:b.ie7Compat?'99%':'100%',height:'100%',resize:'none',outline:'none','text-align':'left'};
if(c){q=function(){p.hide();p.setStyle('height',r.$.clientHeight+'px');p.setStyle('width',r.$.clientWidth+'px');p.show();};m.on('resize',q);o.on('resize',q);setTimeout(q,0);}r.setHtml('');r.append(p);p.setStyles(t);m.fire('ariaWidget',p);p.on('blur',function(){m.focusManager.blur();});p.on('focus',function(){m.focusManager.focus();});m.mayBeDirty=true;this.loadData(s);var u=m.keystrokeHandler;if(u)u.attach(p);setTimeout(function(){m.mode='source';m.fire('mode',{previousMode:m._.previousMode});},b.gecko||b.webkit?100:0);},loadData:function(r){p.setValue(r);m.fire('dataReady');},getData:function(){return p.getValue();},getSnapshotData:function(){return p.getValue();},unload:function(r){p.clearCustomData();m.textarea=p=null;if(q){m.removeListener('resize',q);o.removeListener('resize',q);}if(c&&b.version<8)r.removeStyle('position');},focus:function(){p.focus();}});});m.on('readOnly',function(){if(m.mode=='source')if(m.readOnly)m.textarea.setAttribute('readOnly','readonly');else m.textarea.removeAttribute('readOnly');});m.addCommand('source',n.commands.source);if(m.ui.addButton)m.ui.addButton('Source',{label:m.lang.source,command:'source'});m.on('mode',function(){m.getCommand('source').setState(m.mode=='source'?1:2);});}});j.sourcearea={commands:{source:{modes:{wysiwyg:1,source:1},editorFocus:false,readOnly:1,exec:function(m){if(m.mode=='wysiwyg')m.fire('saveSnapshot');m.getCommand('source').setState(0);m.setMode(m.mode=='source'?'wysiwyg':'source');},canUndo:false}}};(function(){j.add('stylescombo',{requires:['richcombo','styles'],init:function(n){var o=n.config,p=n.lang.stylesCombo,q={},r=[],s;function t(u){n.getStylesSet(function(v){if(!r.length){var w,x;for(var y=0,z=v.length;y<z;y++){var A=v[y];x=A.name;w=q[x]=new a.style(A);w._name=x;w._.enterMode=o.enterMode;r.push(w);}r.sort(m);}u&&u();});};n.ui.addRichCombo('Styles',{label:p.label,title:p.panelTitle,className:'cke_styles',panel:{css:n.skin.editor.css.concat(o.contentsCss),multiSelect:true,attributes:{'aria-label':p.panelTitle}},init:function(){s=this;t(function(){var u,v,w,x,y,z;for(y=0,z=r.length;y<z;y++){u=r[y];v=u._name;x=u.type;if(x!=w){s.startGroup(p['panelTitle'+String(x)]);w=x;}s.add(v,u.type==3?v:u.buildPreview(),v);}s.commit();});},onClick:function(u){n.focus();n.fire('saveSnapshot');var v=q[u],w=n.getSelection(),x=new d.elementPath(w.getStartElement());v[v.checkActive(x)?'remove':'apply'](n.document);n.fire('saveSnapshot');},onRender:function(){n.on('selectionChange',function(u){var v=this.getValue(),w=u.data.path,x=w.elements;
for(var y=0,z=x.length,A;y<z;y++){A=x[y];for(var B in q){if(q[B].checkElementRemovable(A,true)){if(B!=v)this.setValue(B);return;}}}this.setValue('');},this);},onOpen:function(){var B=this;if(c||b.webkit)n.focus();var u=n.getSelection(),v=u.getSelectedElement(),w=new d.elementPath(v||u.getStartElement()),x=[0,0,0,0];B.showAll();B.unmarkAll();for(var y in q){var z=q[y],A=z.type;if(z.checkActive(w))B.mark(y);else if(A==3&&!z.checkApplicable(w)){B.hideItem(y);x[A]--;}x[A]++;}if(!x[1])B.hideGroup(p['panelTitle'+String(1)]);if(!x[2])B.hideGroup(p['panelTitle'+String(2)]);if(!x[3])B.hideGroup(p['panelTitle'+String(3)]);},reset:function(){if(s){delete s._.panel;delete s._.list;s._.committed=0;s._.items={};s._.state=2;}q={};r=[];t();}});n.on('instanceReady',function(){t();});}});function m(n,o){var p=n.type,q=o.type;return p==q?0:p==3?-1:q==3?1:q==1?1:-1;};})();j.add('table',{requires:['dialog'],init:function(m){var n=j.table,o=m.lang.table;m.addCommand('table',new a.dialogCommand('table'));m.addCommand('tableProperties',new a.dialogCommand('tableProperties'));m.ui.addButton('Table',{label:o.toolbar,command:'table'});a.dialog.add('table',this.path+'dialogs/table.js');a.dialog.add('tableProperties',this.path+'dialogs/table.js');if(m.addMenuItems)m.addMenuItems({table:{label:o.menu,command:'tableProperties',group:'table',order:5},tabledelete:{label:o.deleteTable,command:'tableDelete',group:'table',order:1}});m.on('doubleclick',function(p){var q=p.data.element;if(q.is('table'))p.data.dialog='tableProperties';});if(m.contextMenu)m.contextMenu.addListener(function(p,q){if(!p||p.isReadOnly())return null;var r=p.hasAscendant('table',1);if(r)return{tabledelete:2,table:2};return null;});}});(function(){var m=/^(?:td|th)$/;function n(G){var H=G.getRanges(),I=[],J={};function K(S){if(I.length>0)return;if(S.type==1&&m.test(S.getName())&&!S.getCustomData('selected_cell')){h.setMarker(J,S,'selected_cell',true);I.push(S);}};for(var L=0;L<H.length;L++){var M=H[L];if(M.collapsed){var N=M.getCommonAncestor(),O=N.getAscendant('td',true)||N.getAscendant('th',true);if(O)I.push(O);}else{var P=new d.walker(M),Q;P.guard=K;while(Q=P.next()){var R=Q.getAscendant('td')||Q.getAscendant('th');if(R&&!R.getCustomData('selected_cell')){h.setMarker(J,R,'selected_cell',true);I.push(R);}}}}h.clearAllMarkers(J);return I;};function o(G){var H=0,I=G.length-1,J={},K,L,M;while(K=G[H++])h.setMarker(J,K,'delete_cell',true);H=0;while(K=G[H++]){if((L=K.getPrevious())&&!L.getCustomData('delete_cell')||(L=K.getNext())&&!L.getCustomData('delete_cell')){h.clearAllMarkers(J);
return L;}}h.clearAllMarkers(J);M=G[0].getParent();if(M=M.getPrevious())return M.getLast();M=G[I].getParent();if(M=M.getNext())return M.getChild(0);return null;};function p(G,H){var I=n(G),J=I[0],K=J.getAscendant('table'),L=J.getDocument(),M=I[0].getParent(),N=M.$.rowIndex,O=I[I.length-1],P=O.getParent().$.rowIndex+O.$.rowSpan-1,Q=new h(K.$.rows[P]),R=H?N:P,S=H?M:Q,T=e.buildTableMap(K),U=T[R],V=H?T[R-1]:T[R+1],W=T[0].length,X=L.createElement('tr');for(var Y=0;U[Y]&&Y<W;Y++){var Z;if(U[Y].rowSpan>1&&V&&U[Y]==V[Y]){Z=U[Y];Z.rowSpan+=1;}else{Z=new h(U[Y]).clone();Z.removeAttribute('rowSpan');!c&&Z.appendBogus();X.append(Z);Z=Z.$;}Y+=Z.colSpan-1;}H?X.insertBefore(S):X.insertAfter(S);};function q(G){if(G instanceof d.selection){var H=n(G),I=H[0],J=I.getAscendant('table'),K=e.buildTableMap(J),L=H[0].getParent(),M=L.$.rowIndex,N=H[H.length-1],O=N.getParent().$.rowIndex+N.$.rowSpan-1,P=[];for(var Q=M;Q<=O;Q++){var R=K[Q],S=new h(J.$.rows[Q]);for(var T=0;T<R.length;T++){var U=new h(R[T]),V=U.getParent().$.rowIndex;if(U.$.rowSpan==1)U.remove();else{U.$.rowSpan-=1;if(V==Q){var W=K[Q+1];W[T-1]?U.insertAfter(new h(W[T-1])):new h(J.$.rows[Q+1]).append(U,1);}}T+=U.$.colSpan-1;}P.push(S);}var X=J.$.rows,Y=new h(X[O+1]||(M>0?X[M-1]:null)||J.$.parentNode);for(Q=P.length;Q>=0;Q--)q(P[Q]);return Y;}else if(G instanceof h){J=G.getAscendant('table');if(J.$.rows.length==1)J.remove();else G.remove();}return null;};function r(G,H){var I=G.getParent(),J=I.$.cells,K=0;for(var L=0;L<J.length;L++){var M=J[L];K+=H?1:M.colSpan;if(M==G.$)break;}return K-1;};function s(G,H){var I=H?Infinity:0;for(var J=0;J<G.length;J++){var K=r(G[J],H);if(H?K<I:K>I)I=K;}return I;};function t(G,H){var I=n(G),J=I[0],K=J.getAscendant('table'),L=s(I,1),M=s(I),N=H?L:M,O=e.buildTableMap(K),P=[],Q=[],R=O.length;for(var S=0;S<R;S++){P.push(O[S][N]);var T=H?O[S][N-1]:O[S][N+1];T&&Q.push(T);}for(S=0;S<R;S++){var U;if(P[S].colSpan>1&&Q.length&&Q[S]==P[S]){U=P[S];U.colSpan+=1;}else{U=new h(P[S]).clone();U.removeAttribute('colSpan');!c&&U.appendBogus();U[H?'insertBefore':'insertAfter'].call(U,new h(P[S]));U=U.$;}S+=U.rowSpan-1;}};function u(G){var H=n(G),I=H[0],J=H[H.length-1],K=I.getAscendant('table'),L=e.buildTableMap(K),M,N,O=[];for(var P=0,Q=L.length;P<Q;P++)for(var R=0,S=L[P].length;R<S;R++){if(L[P][R]==I.$)M=R;if(L[P][R]==J.$)N=R;}for(P=M;P<=N;P++)for(R=0;R<L.length;R++){var T=L[R],U=new h(K.$.rows[R]),V=new h(T[P]);if(V.$){if(V.$.colSpan==1)V.remove();else V.$.colSpan-=1;R+=V.$.rowSpan-1;if(!U.$.cells.length)O.push(U);
}}var W=K.$.rows[0]&&K.$.rows[0].cells,X=new h(W[M]||(M?W[M-1]:K.$.parentNode));if(O.length==Q)K.remove();return X;};function v(G){var H=[],I=G[0]&&G[0].getAscendant('table'),J,K,L,M;for(J=0,K=G.length;J<K;J++)H.push(G[J].$.cellIndex);H.sort();for(J=1,K=H.length;J<K;J++){if(H[J]-H[J-1]>1){L=H[J-1]+1;break;}}if(!L)L=H[0]>0?H[0]-1:H[H.length-1]+1;var N=I.$.rows;for(J=0,K=N.length;J<K;J++){M=N[J].cells[L];if(M)break;}return M?new h(M):I.getPrevious();};function w(G,H){var I=G.getStartElement(),J=I.getAscendant('td',1)||I.getAscendant('th',1);if(!J)return;var K=J.clone();if(!c)K.appendBogus();if(H)K.insertBefore(J);else K.insertAfter(J);};function x(G){if(G instanceof d.selection){var H=n(G),I=H[0]&&H[0].getAscendant('table'),J=o(H);for(var K=H.length-1;K>=0;K--)x(H[K]);if(J)z(J,true);else if(I)I.remove();}else if(G instanceof h){var L=G.getParent();if(L.getChildCount()==1)L.remove();else G.remove();}};function y(G){var H=G.getBogus();H&&H.remove();G.trim();};function z(G,H){var I=new d.range(G.getDocument());if(!I['moveToElementEdit'+(H?'End':'Start')](G)){I.selectNodeContents(G);I.collapse(H?false:true);}I.select(true);};function A(G,H,I){var J=G[H];if(typeof I=='undefined')return J;for(var K=0;J&&K<J.length;K++){if(I.is&&J[K]==I.$)return K;else if(K==I)return new h(J[K]);}return I.is?-1:null;};function B(G,H){var I=[];for(var J=0;J<G.length;J++){var K=G[J];I.push(K[H]);if(K[H].rowSpan>1)J+=K[H].rowSpan-1;}return I;};function C(G,H,I){var J=n(G),K;if((H?J.length!=1:J.length<2)||(K=G.getCommonAncestor())&&K.type==1&&K.is('table'))return false;var L,M=J[0],N=M.getAscendant('table'),O=e.buildTableMap(N),P=O.length,Q=O[0].length,R=M.getParent().$.rowIndex,S=A(O,R,M);if(H){var T;try{var U=parseInt(M.getAttribute('rowspan'),10)||1,V=parseInt(M.getAttribute('colspan'),10)||1;T=O[H=='up'?R-U:H=='down'?R+U:R][H=='left'?S-V:H=='right'?S+V:S];}catch(an){return false;}if(!T||M.$==T)return false;J[H=='up'||H=='left'?'unshift':'push'](new h(T));}var W=M.getDocument(),X=R,Y=0,Z=0,aa=!I&&new d.documentFragment(W),ab=0;for(var ac=0;ac<J.length;ac++){L=J[ac];var ad=L.getParent(),ae=L.getFirst(),af=L.$.colSpan,ag=L.$.rowSpan,ah=ad.$.rowIndex,ai=A(O,ah,L);ab+=af*ag;Z=Math.max(Z,ai-S+af);Y=Math.max(Y,ah-R+ag);if(!I){if(y(L),L.getChildren().count()){if(ah!=X&&ae&&!(ae.isBlockBoundary&&ae.isBlockBoundary({br:1}))){var aj=aa.getLast(d.walker.whitespaces(true));if(aj&&!(aj.is&&aj.is('br')))aa.append('br');}L.moveChildren(aa);}ac?L.remove():L.setHtml('');}X=ah;}if(!I){aa.moveChildren(M);
if(!c)M.appendBogus();if(Z>=Q)M.removeAttribute('rowSpan');else M.$.rowSpan=Y;if(Y>=P)M.removeAttribute('colSpan');else M.$.colSpan=Z;var ak=new d.nodeList(N.$.rows),al=ak.count();for(ac=al-1;ac>=0;ac--){var am=ak.getItem(ac);if(!am.$.cells.length){am.remove();al++;continue;}}return M;}else return Y*Z==ab;};function D(G,H){var I=n(G);if(I.length>1)return false;else if(H)return true;var J=I[0],K=J.getParent(),L=K.getAscendant('table'),M=e.buildTableMap(L),N=K.$.rowIndex,O=A(M,N,J),P=J.$.rowSpan,Q,R,S,T;if(P>1){R=Math.ceil(P/2);S=Math.floor(P/2);T=N+R;var U=new h(L.$.rows[T]),V=A(M,T),W;Q=J.clone();for(var X=0;X<V.length;X++){W=V[X];if(W.parentNode==U.$&&X>O){Q.insertBefore(new h(W));break;}else W=null;}if(!W)U.append(Q,true);}else{S=R=1;U=K.clone();U.insertAfter(K);U.append(Q=J.clone());var Y=A(M,N);for(var Z=0;Z<Y.length;Z++)Y[Z].rowSpan++;}if(!c)Q.appendBogus();J.$.rowSpan=R;Q.$.rowSpan=S;if(R==1)J.removeAttribute('rowSpan');if(S==1)Q.removeAttribute('rowSpan');return Q;};function E(G,H){var I=n(G);if(I.length>1)return false;else if(H)return true;var J=I[0],K=J.getParent(),L=K.getAscendant('table'),M=e.buildTableMap(L),N=K.$.rowIndex,O=A(M,N,J),P=J.$.colSpan,Q,R,S;if(P>1){R=Math.ceil(P/2);S=Math.floor(P/2);}else{S=R=1;var T=B(M,O);for(var U=0;U<T.length;U++)T[U].colSpan++;}Q=J.clone();Q.insertAfter(J);if(!c)Q.appendBogus();J.$.colSpan=R;Q.$.colSpan=S;if(R==1)J.removeAttribute('colSpan');if(S==1)Q.removeAttribute('colSpan');return Q;};var F={thead:1,tbody:1,tfoot:1,td:1,tr:1,th:1};j.tabletools={requires:['table','dialog','contextmenu'],init:function(G){var H=G.lang.table;G.addCommand('cellProperties',new a.dialogCommand('cellProperties'));a.dialog.add('cellProperties',this.path+'dialogs/tableCell.js');G.addCommand('tableDelete',{exec:function(I){var J=I.getSelection(),K=J&&J.getStartElement(),L=K&&K.getAscendant('table',1);if(!L)return;var M=L.getParent();if(M.getChildCount()==1&&!M.is('body','td','th'))L=M;var N=new d.range(I.document);N.moveToPosition(L,3);L.remove();N.select();}});G.addCommand('rowDelete',{exec:function(I){var J=I.getSelection();z(q(J));}});G.addCommand('rowInsertBefore',{exec:function(I){var J=I.getSelection();p(J,true);}});G.addCommand('rowInsertAfter',{exec:function(I){var J=I.getSelection();p(J);}});G.addCommand('columnDelete',{exec:function(I){var J=I.getSelection(),K=u(J);K&&z(K,true);}});G.addCommand('columnInsertBefore',{exec:function(I){var J=I.getSelection();t(J,true);}});G.addCommand('columnInsertAfter',{exec:function(I){var J=I.getSelection();
t(J);}});G.addCommand('cellDelete',{exec:function(I){var J=I.getSelection();x(J);}});G.addCommand('cellMerge',{exec:function(I){z(C(I.getSelection()),true);}});G.addCommand('cellMergeRight',{exec:function(I){z(C(I.getSelection(),'right'),true);}});G.addCommand('cellMergeDown',{exec:function(I){z(C(I.getSelection(),'down'),true);}});G.addCommand('cellVerticalSplit',{exec:function(I){z(D(I.getSelection()));}});G.addCommand('cellHorizontalSplit',{exec:function(I){z(E(I.getSelection()));}});G.addCommand('cellInsertBefore',{exec:function(I){var J=I.getSelection();w(J,true);}});G.addCommand('cellInsertAfter',{exec:function(I){var J=I.getSelection();w(J);}});if(G.addMenuItems)G.addMenuItems({tablecell:{label:H.cell.menu,group:'tablecell',order:1,getItems:function(){var I=G.getSelection(),J=n(I);return{tablecell_insertBefore:2,tablecell_insertAfter:2,tablecell_delete:2,tablecell_merge:C(I,null,true)?2:0,tablecell_merge_right:C(I,'right',true)?2:0,tablecell_merge_down:C(I,'down',true)?2:0,tablecell_split_vertical:D(I,true)?2:0,tablecell_split_horizontal:E(I,true)?2:0,tablecell_properties:J.length>0?2:0};}},tablecell_insertBefore:{label:H.cell.insertBefore,group:'tablecell',command:'cellInsertBefore',order:5},tablecell_insertAfter:{label:H.cell.insertAfter,group:'tablecell',command:'cellInsertAfter',order:10},tablecell_delete:{label:H.cell.deleteCell,group:'tablecell',command:'cellDelete',order:15},tablecell_merge:{label:H.cell.merge,group:'tablecell',command:'cellMerge',order:16},tablecell_merge_right:{label:H.cell.mergeRight,group:'tablecell',command:'cellMergeRight',order:17},tablecell_merge_down:{label:H.cell.mergeDown,group:'tablecell',command:'cellMergeDown',order:18},tablecell_split_horizontal:{label:H.cell.splitHorizontal,group:'tablecell',command:'cellHorizontalSplit',order:19},tablecell_split_vertical:{label:H.cell.splitVertical,group:'tablecell',command:'cellVerticalSplit',order:20},tablecell_properties:{label:H.cell.title,group:'tablecellproperties',command:'cellProperties',order:21},tablerow:{label:H.row.menu,group:'tablerow',order:1,getItems:function(){return{tablerow_insertBefore:2,tablerow_insertAfter:2,tablerow_delete:2};}},tablerow_insertBefore:{label:H.row.insertBefore,group:'tablerow',command:'rowInsertBefore',order:5},tablerow_insertAfter:{label:H.row.insertAfter,group:'tablerow',command:'rowInsertAfter',order:10},tablerow_delete:{label:H.row.deleteRow,group:'tablerow',command:'rowDelete',order:15},tablecolumn:{label:H.column.menu,group:'tablecolumn',order:1,getItems:function(){return{tablecolumn_insertBefore:2,tablecolumn_insertAfter:2,tablecolumn_delete:2};
}},tablecolumn_insertBefore:{label:H.column.insertBefore,group:'tablecolumn',command:'columnInsertBefore',order:5},tablecolumn_insertAfter:{label:H.column.insertAfter,group:'tablecolumn',command:'columnInsertAfter',order:10},tablecolumn_delete:{label:H.column.deleteColumn,group:'tablecolumn',command:'columnDelete',order:15}});if(G.contextMenu)G.contextMenu.addListener(function(I,J){if(!I||I.isReadOnly())return null;while(I){if(I.getName() in F)return{tablecell:2,tablerow:2,tablecolumn:2};I=I.getParent();}return null;});},getSelectedCells:n};j.add('tabletools',j.tabletools);})();e.buildTableMap=function(m){var n=m.$.rows,o=-1,p=[];for(var q=0;q<n.length;q++){o++;!p[o]&&(p[o]=[]);var r=-1;for(var s=0;s<n[q].cells.length;s++){var t=n[q].cells[s];r++;while(p[o][r])r++;var u=isNaN(t.colSpan)?1:t.colSpan,v=isNaN(t.rowSpan)?1:t.rowSpan;for(var w=0;w<v;w++){if(!p[o+w])p[o+w]=[];for(var x=0;x<u;x++)p[o+w][r+x]=n[q].cells[s];}r+=u-1;}}return p;};j.add('specialchar',{requires:['dialog'],availableLangs:{cs:1,cy:1,de:1,el:1,en:1,eo:1,et:1,fa:1,fi:1,fr:1,he:1,hr:1,it:1,nb:1,nl:1,no:1,'pt-br':1,tr:1,ug:1,'zh-cn':1},init:function(m){var n='specialchar',o=this;a.dialog.add(n,this.path+'dialogs/specialchar.js');m.addCommand(n,{exec:function(){var p=m.langCode;p=o.availableLangs[p]?p:'en';a.scriptLoader.load(a.getUrl(o.path+'lang/'+p+'.js'),function(){e.extend(m.lang.specialChar,o.langEntries[p]);m.openDialog(n);});},modes:{wysiwyg:1},canUndo:false});m.ui.addButton('SpecialChar',{label:m.lang.specialChar.toolbar,command:n});}});i.specialChars=['!','&quot;','#','$','%','&amp;',"'",'(',')','*','+','-','.','/','0','1','2','3','4','5','6','7','8','9',':',';','&lt;','=','&gt;','?','@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','[',']','^','_','`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','{','|','}','~','&euro;','&lsquo;','&rsquo;','&ldquo;','&rdquo;','&ndash;','&mdash;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&reg;','&macr;','&deg;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&AElig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&OElig;','&oelig;','&#372;','&#374','&#373','&#375;','&sbquo;','&#8219;','&bdquo;','&hellip;','&trade;','&#9658;','&bull;','&rarr;','&rArr;','&hArr;','&diams;','&asymp;'];
(function(){var m={editorFocus:false,modes:{wysiwyg:1,source:1}},n={exec:function(q){q.container.focusNext(true,q.tabIndex);}},o={exec:function(q){q.container.focusPrevious(true,q.tabIndex);}};function p(q){return{editorFocus:false,canUndo:false,modes:{wysiwyg:1},exec:function(r){if(r.focusManager.hasFocus){var s=r.getSelection(),t=s.getCommonAncestor(),u;if(u=t.getAscendant('td',true)||t.getAscendant('th',true)){var v=new d.range(r.document),w=e.tryThese(function(){var D=u.getParent(),E=D.$.cells[u.$.cellIndex+(q?-1:1)];E.parentNode.parentNode;return E;},function(){var D=u.getParent(),E=D.getAscendant('table'),F=E.$.rows[D.$.rowIndex+(q?-1:1)];return F.cells[q?F.cells.length-1:0];});if(!(w||q)){var x=u.getAscendant('table').$,y=u.getParent().$.cells,z=new h(x.insertRow(-1),r.document);for(var A=0,B=y.length;A<B;A++){var C=z.append(new h(y[A],r.document).clone(false,false));!c&&C.appendBogus();}v.moveToElementEditStart(z);}else if(w){w=new h(w);v.moveToElementEditStart(w);if(!(v.checkStartOfBlock()&&v.checkEndOfBlock()))v.selectNodeContents(w);}else return true;v.select(true);return true;}}return false;}};};j.add('tab',{requires:['keystrokes'],init:function(q){var r=q.config.enableTabKeyTools!==false,s=q.config.tabSpaces||0,t='';while(s--)t+='\xa0';if(t)q.on('key',function(u){if(u.data.keyCode==9){q.insertHtml(t);u.cancel();}});if(r)q.on('key',function(u){if(u.data.keyCode==9&&q.execCommand('selectNextCell')||u.data.keyCode==2228224+9&&q.execCommand('selectPreviousCell'))u.cancel();});if(b.webkit||b.gecko)q.on('key',function(u){var v=u.data.keyCode;if(v==9&&!t){u.cancel();q.execCommand('blur');}if(v==2228224+9){q.execCommand('blurBack');u.cancel();}});q.addCommand('blur',e.extend(n,m));q.addCommand('blurBack',e.extend(o,m));q.addCommand('selectNextCell',p());q.addCommand('selectPreviousCell',p(true));}});})();h.prototype.focusNext=function(m,n){var w=this;var o=w.$,p=n===undefined?w.getTabIndex():n,q,r,s,t,u,v;if(p<=0){u=w.getNextSourceNode(m,1);while(u){if(u.isVisible()&&u.getTabIndex()===0){s=u;break;}u=u.getNextSourceNode(false,1);}}else{u=w.getDocument().getBody().getFirst();while(u=u.getNextSourceNode(false,1)){if(!q)if(!r&&u.equals(w)){r=true;if(m){if(!(u=u.getNextSourceNode(true,1)))break;q=1;}}else if(r&&!w.contains(u))q=1;if(!u.isVisible()||(v=u.getTabIndex())<0)continue;if(q&&v==p){s=u;break;}if(v>p&&(!s||!t||v<t)){s=u;t=v;}else if(!s&&v===0){s=u;t=v;}}}if(s)s.focus();};h.prototype.focusPrevious=function(m,n){var w=this;var o=w.$,p=n===undefined?w.getTabIndex():n,q,r,s,t=0,u,v=w.getDocument().getBody().getLast();
while(v=v.getPreviousSourceNode(false,1)){if(!q)if(!r&&v.equals(w)){r=true;if(m){if(!(v=v.getPreviousSourceNode(true,1)))break;q=1;}}else if(r&&!w.contains(v))q=1;if(!v.isVisible()||(u=v.getTabIndex())<0)continue;if(p<=0){if(q&&u===0){s=v;break;}if(u>t){s=v;t=u;}}else{if(q&&u==p){s=v;break;}if(u<p&&(!s||u>t)){s=v;t=u;}}}if(s)s.focus();};(function(){j.add('templates',{requires:['dialog'],init:function(o){a.dialog.add('templates',a.getUrl(this.path+'dialogs/templates.js'));o.addCommand('templates',new a.dialogCommand('templates'));o.ui.addButton('Templates',{label:o.lang.templates.button,command:'templates'});}});var m={},n={};a.addTemplates=function(o,p){m[o]=p;};a.getTemplates=function(o){return m[o];};a.loadTemplates=function(o,p){var q=[];for(var r=0,s=o.length;r<s;r++){if(!n[o[r]]){q.push(o[r]);n[o[r]]=1;}}if(q.length)a.scriptLoader.load(q,p);else setTimeout(p,0);};})();i.templates_files=[a.getUrl('plugins/templates/templates/default.js')];i.templates_replaceContent=true;(function(){var m=function(){this.toolbars=[];this.focusCommandExecuted=false;};m.prototype.focus=function(){for(var o=0,p;p=this.toolbars[o++];)for(var q=0,r;r=p.items[q++];){if(r.focus){r.focus();return;}}};var n={toolbarFocus:{modes:{wysiwyg:1,source:1},readOnly:1,exec:function(o){if(o.toolbox){o.toolbox.focusCommandExecuted=true;if(c||b.air)setTimeout(function(){o.toolbox.focus();},100);else o.toolbox.focus();}}}};j.add('toolbar',{requires:['button'],init:function(o){var p,q=function(r,s){var t,u,v=o.lang.dir=='rtl',w=o.config.toolbarGroupCycling;w=w===undefined||w;switch(s){case 9:case 2228224+9:while(!u||!u.items.length){u=s==9?(u?u.next:r.toolbar.next)||o.toolbox.toolbars[0]:(u?u.previous:r.toolbar.previous)||o.toolbox.toolbars[o.toolbox.toolbars.length-1];if(u.items.length){r=u.items[p?u.items.length-1:0];while(r&&!r.focus){r=p?r.previous:r.next;if(!r)u=0;}}}if(r)r.focus();return false;case v?37:39:case 40:t=r;do{t=t.next;if(!t&&w)t=r.toolbar.items[0];}while(t&&!t.focus);if(t)t.focus();else q(r,9);return false;case v?39:37:case 38:t=r;do{t=t.previous;if(!t&&w)t=r.toolbar.items[r.toolbar.items.length-1];}while(t&&!t.focus);if(t)t.focus();else{p=1;q(r,2228224+9);p=0;}return false;case 27:o.focus();return false;case 13:case 32:r.execute();return false;}return true;};o.on('themeSpace',function(r){if(r.data.space==o.config.toolbarLocation){o.toolbox=new m();var s=e.getNextId(),t=['<div class="cke_toolbox" role="group" aria-labelledby="',s,'" onmousedown="return false;"'],u=o.config.toolbarStartupExpanded!==false,v;
t.push(u?'>':' style="display:none">');t.push('<span id="',s,'" class="cke_voice_label">',o.lang.toolbars,'</span>');var w=o.toolbox.toolbars,x=o.config.toolbar instanceof Array?o.config.toolbar:o.config['toolbar_'+o.config.toolbar];for(var y=0;y<x.length;y++){var z,A=0,B,C=x[y],D;if(!C)continue;if(v){t.push('</div>');v=0;}if(C==='/'){t.push('<div class="cke_break"></div>');continue;}D=C.items||C;for(var E=0;E<D.length;E++){var F,G=D[E],H;F=o.ui.create(G);if(F){H=F.canGroup!==false;if(!A){z=e.getNextId();A={id:z,items:[]};B=C.name&&(o.lang.toolbarGroups[C.name]||C.name);t.push('<span id="',z,'" class="cke_toolbar"',B?' aria-labelledby="'+z+'_label"':'',' role="toolbar">');B&&t.push('<span id="',z,'_label" class="cke_voice_label">',B,'</span>');t.push('<span class="cke_toolbar_start"></span>');var I=w.push(A)-1;if(I>0){A.previous=w[I-1];A.previous.next=A;}}if(H){if(!v){t.push('<span class="cke_toolgroup" role="presentation">');v=1;}}else if(v){t.push('</span>');v=0;}var J=F.render(o,t);I=A.items.push(J)-1;if(I>0){J.previous=A.items[I-1];J.previous.next=J;}J.toolbar=A;J.onkey=q;J.onfocus=function(){if(!o.toolbox.focusCommandExecuted)o.focus();};}}if(v){t.push('</span>');v=0;}if(A)t.push('<span class="cke_toolbar_end"></span></span>');}t.push('</div>');if(o.config.toolbarCanCollapse){var K=e.addFunction(function(){o.execCommand('toolbarCollapse');});o.on('destroy',function(){e.removeFunction(K);});var L=e.getNextId();o.addCommand('toolbarCollapse',{readOnly:1,exec:function(M){var N=a.document.getById(L),O=N.getPrevious(),P=M.getThemeSpace('contents'),Q=O.getParent(),R=parseInt(P.$.style.height,10),S=Q.$.offsetHeight,T=!O.isVisible();if(!T){O.hide();N.addClass('cke_toolbox_collapser_min');N.setAttribute('title',M.lang.toolbarExpand);}else{O.show();N.removeClass('cke_toolbox_collapser_min');N.setAttribute('title',M.lang.toolbarCollapse);}N.getFirst().setText(T?'▲':'◀');var U=Q.$.offsetHeight-S;P.setStyle('height',R-U+'px');M.fire('resize');},modes:{wysiwyg:1,source:1}});t.push('<a title="'+(u?o.lang.toolbarCollapse:o.lang.toolbarExpand)+'" id="'+L+'" tabIndex="-1" class="cke_toolbox_collapser');if(!u)t.push(' cke_toolbox_collapser_min');t.push('" onclick="CKEDITOR.tools.callFunction('+K+')">','<span>&#9650;</span>','</a>');}r.data.html+=t.join('');}});o.on('destroy',function(){var r,s=0,t,u,v;r=this.toolbox.toolbars;for(;s<r.length;s++){u=r[s].items;for(t=0;t<u.length;t++){v=u[t];if(v.clickFn)e.removeFunction(v.clickFn);if(v.keyDownFn)e.removeFunction(v.keyDownFn);
}}});o.addCommand('toolbarFocus',n.toolbarFocus);o.ui.add('-',a.UI_SEPARATOR,{});o.ui.addHandler(a.UI_SEPARATOR,{create:function(){return{render:function(r,s){s.push('<span class="cke_separator" role="separator"></span>');return{};}};}});}});})();a.UI_SEPARATOR='separator';i.toolbarLocation='top';i.toolbar_Basic=[['Bold','Italic','-','NumberedList','BulletedList','-','Link','Unlink','-','About']];i.toolbar_Full=[{name:'document',items:['Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates']},{name:'clipboard',items:['Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo']},{name:'editing',items:['Find','Replace','-','SelectAll','-','SpellChecker','Scayt']},{name:'forms',items:['Form','Checkbox','Radio','TextField','Textarea','Select','Button','ImageButton','HiddenField']},'/',{name:'basicstyles',items:['Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat']},{name:'paragraph',items:['NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl']},{name:'links',items:['Link','Unlink','Anchor']},{name:'insert',items:['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe']},'/',{name:'styles',items:['Styles','Format','Font','FontSize']},{name:'colors',items:['TextColor','BGColor']},{name:'tools',items:['Maximize','ShowBlocks','-','About']}];i.toolbar='Full';i.toolbarCanCollapse=true;(function(){j.add('undo',{requires:['selection','wysiwygarea'],init:function(s){var t=new o(s),u=s.addCommand('undo',{exec:function(){if(t.undo()){s.selectionChange();this.fire('afterUndo');}},state:0,canUndo:false}),v=s.addCommand('redo',{exec:function(){if(t.redo()){s.selectionChange();this.fire('afterRedo');}},state:0,canUndo:false});t.onChange=function(){u.setState(t.undoable()?2:0);v.setState(t.redoable()?2:0);};function w(x){if(t.enabled&&x.data.command.canUndo!==false)t.save();};s.on('beforeCommandExec',w);s.on('afterCommandExec',w);s.on('saveSnapshot',function(x){t.save(x.data&&x.data.contentOnly);});s.on('contentDom',function(){s.document.on('keydown',function(x){if(!x.data.$.ctrlKey&&!x.data.$.metaKey)t.type(x);});});s.on('beforeModeUnload',function(){s.mode=='wysiwyg'&&t.save(true);});s.on('mode',function(){t.enabled=s.readOnly?false:s.mode=='wysiwyg';t.onChange();});s.ui.addButton('Undo',{label:s.lang.undo,command:'undo'});s.ui.addButton('Redo',{label:s.lang.redo,command:'redo'});
s.resetUndo=function(){t.reset();s.fire('saveSnapshot');};s.on('updateSnapshot',function(){if(t.currentImage)t.update();});}});j.undo={};var m=j.undo.Image=function(s){this.editor=s;s.fire('beforeUndoImage');var t=s.getSnapshot(),u=t&&s.getSelection();c&&t&&(t=t.replace(/\s+data-cke-expando=".*?"/g,''));this.contents=t;this.bookmarks=u&&u.createBookmarks2(true);s.fire('afterUndoImage');},n=/\b(?:href|src|name)="[^"]*?"/gi;m.prototype={equals:function(s,t){var u=this.contents,v=s.contents;if(c&&(b.ie7Compat||b.ie6Compat)){u=u.replace(n,'');v=v.replace(n,'');}if(u!=v)return false;if(t)return true;var w=this.bookmarks,x=s.bookmarks;if(w||x){if(!w||!x||w.length!=x.length)return false;for(var y=0;y<w.length;y++){var z=w[y],A=x[y];if(z.startOffset!=A.startOffset||z.endOffset!=A.endOffset||!e.arrayCompare(z.start,A.start)||!e.arrayCompare(z.end,A.end))return false;}}return true;}};function o(s){this.editor=s;this.reset();};var p={8:1,46:1},q={16:1,17:1,18:1},r={37:1,38:1,39:1,40:1};o.prototype={type:function(s){var t=s&&s.data.getKey(),u=t in q,v=t in p,w=this.lastKeystroke in p,x=v&&t==this.lastKeystroke,y=t in r,z=this.lastKeystroke in r,A=!v&&!y,B=v&&!x,C=!(u||this.typing)||A&&(w||z);if(C||B){var D=new m(this.editor),E=this.snapshots.length;e.setTimeout(function(){var G=this;var F=G.editor.getSnapshot();if(c)F=F.replace(/\s+data-cke-expando=".*?"/g,'');if(D.contents!=F&&E==G.snapshots.length){G.typing=true;if(!G.save(false,D,false))G.snapshots.splice(G.index+1,G.snapshots.length-G.index-1);G.hasUndo=true;G.hasRedo=false;G.typesCount=1;G.modifiersCount=1;G.onChange();}},0,this);}this.lastKeystroke=t;if(v){this.typesCount=0;this.modifiersCount++;if(this.modifiersCount>25){this.save(false,null,false);this.modifiersCount=1;}}else if(!y){this.modifiersCount=0;this.typesCount++;if(this.typesCount>25){this.save(false,null,false);this.typesCount=1;}}},reset:function(){var s=this;s.lastKeystroke=0;s.snapshots=[];s.index=-1;s.limit=s.editor.config.undoStackSize||20;s.currentImage=null;s.hasUndo=false;s.hasRedo=false;s.resetType();},resetType:function(){var s=this;s.typing=false;delete s.lastKeystroke;s.typesCount=0;s.modifiersCount=0;},fireChange:function(){var s=this;s.hasUndo=!!s.getNextImage(true);s.hasRedo=!!s.getNextImage(false);s.resetType();s.onChange();},save:function(s,t,u){var w=this;var v=w.snapshots;if(!t)t=new m(w.editor);if(t.contents===false)return false;if(w.currentImage&&t.equals(w.currentImage,s))return false;v.splice(w.index+1,v.length-w.index-1);if(v.length==w.limit)v.shift();
w.index=v.push(t)-1;w.currentImage=t;if(u!==false)w.fireChange();return true;},restoreImage:function(s){var w=this;var t=w.editor,u;if(s.bookmarks){t.focus();u=t.getSelection();}w.editor.loadSnapshot(s.contents);if(s.bookmarks)u.selectBookmarks(s.bookmarks);else if(c){var v=w.editor.document.getBody().$.createTextRange();v.collapse(true);v.select();}w.index=s.index;w.update();w.fireChange();},getNextImage:function(s){var x=this;var t=x.snapshots,u=x.currentImage,v,w;if(u)if(s)for(w=x.index-1;w>=0;w--){v=t[w];if(!u.equals(v,true)){v.index=w;return v;}}else for(w=x.index+1;w<t.length;w++){v=t[w];if(!u.equals(v,true)){v.index=w;return v;}}return null;},redoable:function(){return this.enabled&&this.hasRedo;},undoable:function(){return this.enabled&&this.hasUndo;},undo:function(){var t=this;if(t.undoable()){t.save(true);var s=t.getNextImage(true);if(s)return t.restoreImage(s),true;}return false;},redo:function(){var t=this;if(t.redoable()){t.save(true);if(t.redoable()){var s=t.getNextImage(false);if(s)return t.restoreImage(s),true;}}return false;},update:function(){var s=this;s.snapshots.splice(s.index,1,s.currentImage=new m(s.editor));}};})();(function(){var m=/(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi,n=d.walker.whitespaces(true),o=d.walker.bogus(true),p=function(E){return n(E)&&o(E);};function q(E){return E.isBlockBoundary()&&f.$empty[E.getName()];};function r(E){return function(F){if(this.mode=='wysiwyg'){this.focus();var G=this.getSelection(),H=G.isLocked;H&&G.unlock();this.fire('saveSnapshot');E.call(this,F.data);H&&this.getSelection().lock();e.setTimeout(function(){this.fire('saveSnapshot');},0,this);}};};function s(E){var N=this;if(N.dataProcessor)E=N.dataProcessor.toHtml(E);if(!E)return;var F=N.getSelection(),G=F.getRanges()[0];if(G.checkReadOnly())return;if(b.opera){var H=new d.elementPath(G.startContainer);if(H.block){var I=a.htmlParser.fragment.fromHtml(E,false).children;for(var J=0,K=I.length;J<K;J++){if(I[J]._.isBlockLike){G.splitBlock(N.enterMode==3?'div':'p');G.insertNode(G.document.createText(''));G.select();break;}}}}if(c){var L=F.getNative();if(L.type=='Control')L.clear();else if(F.getType()==2){G=F.getRanges()[0];var M=G&&G.endContainer;if(M&&M.type==1&&M.getAttribute('contenteditable')=='false'&&G.checkBoundaryOfElement(M,2)){G.setEndAfter(G.endContainer);G.deleteContents();}}L.createRange().pasteHTML(E);}else N.document.$.execCommand('inserthtml',false,E);
if(b.webkit){F=N.getSelection();F.scrollIntoView();}};function t(E){var F=this.getSelection(),G=F.getStartElement().hasAscendant('pre',true)?2:this.config.enterMode,H=G==2,I=e.htmlEncode(E.replace(/\r\n|\r/g,'\n'));I=I.replace(/^[ \t]+|[ \t]+$/g,function(O,P,Q){if(O.length==1)return '&nbsp;';else if(!P)return e.repeat('&nbsp;',O.length-1)+' ';else return ' '+e.repeat('&nbsp;',O.length-1);});I=I.replace(/[ \t]{2,}/g,function(O){return e.repeat('&nbsp;',O.length-1)+' ';});var J=G==1?'p':'div';if(!H)I=I.replace(/(\n{2})([\s\S]*?)(?:$|\1)/g,function(O,P,Q){return '<'+J+'>'+Q+'</'+J+'>';});I=I.replace(/\n/g,'<br>');if(!(H||c))I=I.replace(new RegExp('<br>(?=</'+J+'>)'),function(O){return e.repeat(O,2);});if(b.gecko||b.webkit){var K=new d.elementPath(F.getStartElement()),L=[];for(var M=0;M<K.elements.length;M++){var N=K.elements[M].getName();if(N in f.$inline)L.unshift(K.elements[M].getOuterHtml().match(/^<.*?>/));else if(N in f.$block)break;}I=L.join('')+I;}s.call(this,I);};function u(E){var F=this.getSelection(),G=F.getRanges(),H=E.getName(),I=f.$block[H],J=F.isLocked;if(J)F.unlock();var K,L,M,N;for(var O=G.length-1;O>=0;O--){K=G[O];if(!K.checkReadOnly()){K.deleteContents(1);L=!O&&E||E.clone(1);var P,Q;if(I)while((P=K.getCommonAncestor(0,1))&&(Q=f[P.getName()])&&!(Q&&Q[H])){if(P.getName() in f.span)K.splitElement(P);else if(K.checkStartOfBlock()&&K.checkEndOfBlock()){K.setStartBefore(P);K.collapse(true);P.remove();}else K.splitBlock();}K.insertNode(L);if(!M)M=L;}}if(M){K.moveToPosition(M,4);if(I){var R=M.getNext(p),S=R&&R.type==1&&R.getName();if(S&&f.$block[S]){if(f[S]['#'])K.moveToElementEditStart(R);else K.moveToElementEditEnd(M);}else if(!R){R=K.fixBlock(true,this.config.enterMode==3?'div':'p');K.moveToElementEditStart(R);}}}F.selectRanges([K]);if(J)this.getSelection().lock();};function v(E){if(!E.checkDirty())setTimeout(function(){E.resetDirty();},0);};var w=d.walker.whitespaces(true),x=d.walker.bookmark(false,true);function y(E){return w(E)&&x(E);};function z(E){return E.type==3&&e.trim(E.getText()).match(/^(?:&nbsp;|\xa0)$/);};function A(E){if(E.isLocked){E.unlock();setTimeout(function(){E.lock();},0);}};function B(E){return E.getOuterHtml().match(m);};w=d.walker.whitespaces(true);function C(E){var F=E.window,G=E.document,H=E.document.getBody(),I=H.getFirst(),J=H.getChildren().count();if(!J||J==1&&I.type==1&&I.hasAttribute('_moz_editor_bogus_node')){v(E);var K=E.element.getDocument(),L=K.getDocumentElement(),M=L.$.scrollTop,N=L.$.scrollLeft,O=G.$.createEvent('KeyEvents');
O.initKeyEvent('keypress',true,true,F.$,false,false,false,false,0,32);G.$.dispatchEvent(O);if(M!=L.$.scrollTop||N!=L.$.scrollLeft)K.getWindow().$.scrollTo(N,M);J&&H.getFirst().remove();G.getBody().appendBogus();var P=new d.range(G);P.setStartAt(H,1);P.select();}};function D(E){var F=E.editor,G=E.data.path,H=G.blockLimit,I=E.data.selection,J=I.getRanges()[0],K=F.document.getBody(),L=F.config.enterMode;if(b.gecko){C(F);var M=G.block||G.blockLimit,N=M&&M.getLast(y);if(M&&M.isBlockBoundary()&&!(N&&N.type==1&&N.isBlockBoundary())&&!M.is('pre')&&!M.getBogus())M.appendBogus();}if(F.config.autoParagraph!==false&&L!=2&&J.collapsed&&H.getName()=='body'&&!G.block){var O=J.fixBlock(true,F.config.enterMode==3?'div':'p');if(c){var P=O.getFirst(y);P&&z(P)&&P.remove();}if(B(O)){var Q=O.getNext(w);if(Q&&Q.type==1&&!q(Q)){J.moveToElementEditStart(Q);O.remove();}else{Q=O.getPrevious(w);if(Q&&Q.type==1&&!q(Q)){J.moveToElementEditEnd(Q);O.remove();}}}J.select();E.cancel();}var R=new d.range(F.document);R.moveToElementEditEnd(F.document.getBody());var S=new d.elementPath(R.startContainer);if(!S.blockLimit.is('body')){var T;if(L!=2)T=K.append(F.document.createElement(L==1?'p':'div'));else T=K;if(!c)T.appendBogus();}};j.add('wysiwygarea',{requires:['editingblock'],init:function(E){var F=E.config.enterMode!=2&&E.config.autoParagraph!==false?E.config.enterMode==3?'div':'p':false,G=E.lang.editorTitle.replace('%1',E.name),H=E.lang.editorHelp;if(c)G+=', '+H;var I=a.document.getWindow(),J;E.on('editingBlockReady',function(){var M,N,O,P,Q,R,S,T=b.isCustomDomain(),U=function(X){if(N)N.remove();var Y='document.open();'+(T?'document.domain="'+document.domain+'";':'')+'document.close();';Y=b.air?'javascript:void(0)':c?'javascript:void(function(){'+encodeURIComponent(Y)+'}())':'';var Z=e.getNextId();N=h.createFromHtml('<iframe style="width:100%;height:100%" frameBorder="0" aria-describedby="'+Z+'"'+' title="'+G+'"'+' src="'+Y+'"'+' tabIndex="'+(b.webkit?-1:E.tabIndex)+'"'+' allowTransparency="true"'+'></iframe>');if(document.location.protocol=='chrome:')a.event.useCapture=true;N.on('load',function(aa){Q=1;aa.removeListener();var ab=N.getFrameDocument();ab.write(X);b.air&&W(ab.getWindow().$);});if(document.location.protocol=='chrome:')a.event.useCapture=false;M.append(h.createFromHtml('<span id="'+Z+'" class="cke_voice_label">'+H+'</span>'));M.append(N);if(b.webkit){S=function(){M.setStyle('width','100%');N.hide();N.setSize('width',M.getSize('width'));M.removeStyle('width');N.show();};I.on('resize',S);
}};J=e.addFunction(W);var V='<script id="cke_actscrpt" type="text/javascript" data-cke-temp="1">'+(T?'document.domain="'+document.domain+'";':'')+'window.parent.CKEDITOR.tools.callFunction( '+J+', window );'+'</script>';function W(X){if(!Q)return;Q=0;E.fire('ariaWidget',N);var Y=X.document,Z=Y.body,aa=Y.getElementById('cke_actscrpt');aa&&aa.parentNode.removeChild(aa);Z.spellcheck=!E.config.disableNativeSpellChecker;var ab=!E.readOnly;if(c){Z.hideFocus=true;Z.disabled=true;Z.contentEditable=ab;Z.removeAttribute('disabled');}else setTimeout(function(){if(b.gecko&&b.version>=10900||b.opera)Y.$.body.contentEditable=ab;else if(b.webkit)Y.$.body.parentNode.contentEditable=ab;else Y.$.designMode=ab?'off':'on';},0);ab&&b.gecko&&e.setTimeout(C,0,null,E);X=E.window=new d.window(X);Y=E.document=new g(Y);ab&&Y.on('dblclick',function(ag){var ah=ag.data.getTarget(),ai={element:ah,dialog:''};E.fire('doubleclick',ai);ai.dialog&&E.openDialog(ai.dialog);});c&&Y.on('click',function(ag){var ah=ag.data.getTarget();if(ah.is('input')){var ai=ah.getAttribute('type');if(ai=='submit'||ai=='reset')ag.data.preventDefault();}});if(!(c||b.opera))Y.on('mousedown',function(ag){var ah=ag.data.getTarget();if(ah.is('img','hr','input','textarea','select'))E.getSelection().selectElement(ah);});if(b.gecko)Y.on('mouseup',function(ag){if(ag.data.$.button==2){var ah=ag.data.getTarget();if(!ah.getOuterHtml().replace(m,'')){var ai=new d.range(Y);ai.moveToElementEditStart(ah);ai.select(true);}}});Y.on('click',function(ag){ag=ag.data;if(ag.getTarget().is('a')&&ag.$.button!=2)ag.preventDefault();});if(b.webkit){Y.on('mousedown',function(){ad=1;});Y.on('click',function(ag){if(ag.data.getTarget().is('input','select'))ag.data.preventDefault();});Y.on('mouseup',function(ag){if(ag.data.getTarget().is('input','textarea'))ag.data.preventDefault();});}var ac=c?N:X;ac.on('blur',function(){E.focusManager.blur();});var ad;ac.on('focus',function(){var ag=E.document;if(b.gecko||b.opera)ag.getBody().focus();else if(b.webkit)if(!ad){E.document.getDocumentElement().focus();ad=1;}E.focusManager.focus();});var ae=E.keystrokeHandler;ae.blockedKeystrokes[8]=!ab;ae.attach(Y);Y.getDocumentElement().addClass(Y.$.compatMode);ab&&Y.on('keydown',function(ag){var ah=ag.data.getKeystroke();if(ah in {8:1,46:1}){var ai=E.getSelection(),aj=ai.getSelectedElement(),ak=ai.getRanges()[0],al=new d.elementPath(ak.startContainer),am,an,ao,ap=ah==8;if(aj){E.fire('saveSnapshot');ak.moveToPosition(aj,3);aj.remove();ak.select();E.fire('saveSnapshot');
ag.data.preventDefault();}else if((am=al.block)&&ak[ap?'checkStartOfBlock':'checkEndOfBlock']()&&(ao=am[ap?'getPrevious':'getNext'](n))&&ao.is('table')){E.fire('saveSnapshot');if(ak[ap?'checkEndOfBlock':'checkStartOfBlock']())am.remove();ak['moveToElementEdit'+(ap?'End':'Start')](ao);ak.select();E.fire('saveSnapshot');ag.data.preventDefault();}else if(al.blockLimit.is('td')&&(an=al.blockLimit.getAscendant('table'))&&ak.checkBoundaryOfElement(an,ap?1:2)&&(ao=an[ap?'getPrevious':'getNext'](n))){E.fire('saveSnapshot');ak['moveToElementEdit'+(ap?'End':'Start')](ao);if(ak.checkStartOfBlock()&&ak.checkEndOfBlock())ao.remove();else ak.select();E.fire('saveSnapshot');ag.data.preventDefault();}}if(ah==33||ah==34)if(b.gecko){var aq=Y.getBody();if(X.$.innerHeight>aq.$.offsetHeight){ak=new d.range(Y);ak[ah==33?'moveToElementEditStart':'moveToElementEditEnd'](aq);ak.select();ag.data.preventDefault();}}});if(c&&Y.$.compatMode=='CSS1Compat'){var af={33:1,34:1};Y.on('keydown',function(ag){if(ag.data.getKeystroke() in af)setTimeout(function(){E.getSelection().scrollIntoView();},0);});}if(c&&E.config.enterMode!=1)Y.on('selectionchange',function(){var ag=Y.getBody(),ah=E.getSelection(),ai=ah&&ah.getRanges()[0];if(ai&&ag.getHtml().match(/^<p>&nbsp;<\/p>$/i)&&ai.startContainer.equals(ag))setTimeout(function(){ai=E.getSelection().getRanges()[0];if(!ai.startContainer.equals('body')){ag.getFirst().remove(1);ai.moveToElementEditEnd(ag);ai.select(1);}},0);});if(E.contextMenu)E.contextMenu.addTarget(Y,E.config.browserContextMenuOnCtrl!==false);setTimeout(function(){E.fire('contentDom');if(R){E.mode='wysiwyg';E.fire('mode',{previousMode:E._.previousMode});R=false;}O=false;if(P){E.focus();P=false;}setTimeout(function(){E.fire('dataReady');},0);try{E.document.$.execCommand('2D-position',false,true);}catch(ag){}try{E.document.$.execCommand('enableInlineTableEditing',false,!E.config.disableNativeTableHandles);}catch(ah){}if(E.config.disableObjectResizing)try{E.document.$.execCommand('enableObjectResizing',false,false);}catch(ai){E.document.getBody().on(c?'resizestart':'resize',function(aj){aj.data.preventDefault();});}if(c)setTimeout(function(){if(E.document){var aj=E.document.$.body;aj.runtimeStyle.marginBottom='0px';aj.runtimeStyle.marginBottom='';}},1000);},0);};E.addMode('wysiwyg',{load:function(X,Y,Z){M=X;if(c&&b.quirks)X.setStyle('position','relative');E.mayBeDirty=true;R=true;if(Z)this.loadSnapshotData(Y);else this.loadData(Y);},loadData:function(X){O=true;E._.dataStore={id:1};var Y=E.config,Z=Y.fullPage,aa=Y.docType,ab='<style type="text/css" data-cke-temp="1">'+E._.styles.join('\n')+'</style>';
!Z&&(ab=e.buildStyleHtml(E.config.contentsCss)+ab);var ac=Y.baseHref?'<base href="'+Y.baseHref+'" data-cke-temp="1" />':'';if(Z)X=X.replace(/<!DOCTYPE[^>]*>/i,function(ad){E.docType=aa=ad;return '';}).replace(/<\?xml\s[^\?]*\?>/i,function(ad){E.xmlDeclaration=ad;return '';});if(E.dataProcessor)X=E.dataProcessor.toHtml(X,F);if(Z){if(!/<body[\s|>]/.test(X))X='<body>'+X;if(!/<html[\s|>]/.test(X))X='<html>'+X+'</html>';if(!/<head[\s|>]/.test(X))X=X.replace(/<html[^>]*>/,'$&<head><title></title></head>');else if(!/<title[\s|>]/.test(X))X=X.replace(/<head[^>]*>/,'$&<title></title>');ac&&(X=X.replace(/<head>/,'$&'+ac));X=X.replace(/<\/head\s*>/,ab+'$&');X=aa+X;}else X=Y.docType+'<html dir="'+Y.contentsLangDirection+'"'+' lang="'+(Y.contentsLanguage||E.langCode)+'">'+'<head>'+'<title>'+G+'</title>'+ac+ab+'</head>'+'<body'+(Y.bodyId?' id="'+Y.bodyId+'"':'')+(Y.bodyClass?' class="'+Y.bodyClass+'"':'')+'>'+X+'</html>';if(b.gecko)X=X.replace(/<br \/>(?=\s*<\/(:?html|body)>)/,'$&<br type="_moz" />');X+=V;this.onDispose();U(X);},getData:function(){var X=E.config,Y=X.fullPage,Z=Y&&E.docType,aa=Y&&E.xmlDeclaration,ab=N.getFrameDocument(),ac=Y?ab.getDocumentElement().getOuterHtml():ab.getBody().getHtml();if(b.gecko)ac=ac.replace(/<br>(?=\s*(:?$|<\/body>))/,'');if(E.dataProcessor)ac=E.dataProcessor.toDataFormat(ac,F);if(X.ignoreEmptyParagraph)ac=ac.replace(m,function(ad,ae){return ae;});if(aa)ac=aa+'\n'+ac;if(Z)ac=Z+'\n'+ac;return ac;},getSnapshotData:function(){return N.getFrameDocument().getBody().getHtml();},loadSnapshotData:function(X){N.getFrameDocument().getBody().setHtml(X);},onDispose:function(){if(!E.document)return;E.document.getDocumentElement().clearCustomData();E.document.getBody().clearCustomData();E.window.clearCustomData();E.document.clearCustomData();N.clearCustomData();N.remove();},unload:function(X){this.onDispose();if(S)I.removeListener('resize',S);E.window=E.document=N=M=P=null;E.fire('contentDomUnload');},focus:function(){var X=E.window;if(O)P=true;else if(X){var Y=E.getSelection(),Z=Y&&Y.getNative();if(Z&&Z.type=='Control')return;b.air?setTimeout(function(){X.focus();},0):X.focus();E.selectionChange();}}});E.on('insertHtml',r(s),null,null,20);E.on('insertElement',r(u),null,null,20);E.on('insertText',r(t),null,null,20);E.on('selectionChange',function(X){if(E.readOnly)return;var Y=E.getSelection();if(Y&&!Y.isLocked){var Z=E.checkDirty();E.fire('saveSnapshot',{contentOnly:1});D.call(this,X);E.fire('updateSnapshot');!Z&&E.resetDirty();}},null,null,1);});E.on('contentDom',function(){var M=E.document.getElementsByTag('title').getItem(0);
M.data('cke-title',E.document.$.title);c&&(E.document.$.title=G);});E.on('readOnly',function(){if(E.mode=='wysiwyg'){var M=E.getMode();M.loadData(M.getData());}});if(a.document.$.documentMode>=8){E.addCss('html.CSS1Compat [contenteditable=false]{ min-height:0 !important;}');var K=[];for(var L in f.$removeEmpty)K.push('html.CSS1Compat '+L+'[contenteditable=false]');E.addCss(K.join(',')+'{ display:inline-block;}');}else if(b.gecko){E.addCss('html { height: 100% !important; }');E.addCss('img:-moz-broken { -moz-force-broken-image-icon : 1;\tmin-width : 24px; min-height : 24px; }');}else if(c&&b.version<8&&E.config.contentsLangDirection=='ltr')E.addCss('body{margin-right:0;}');E.addCss('html {\t_overflow-y: scroll; cursor: text;\t*cursor:auto;}');E.addCss('img, input, textarea { cursor: default;}');E.on('insertElement',function(M){var N=M.data;if(N.type==1&&(N.is('input')||N.is('textarea'))){var O=N.getAttribute('contenteditable')=='false';if(!O){N.data('cke-editable',N.hasAttribute('contenteditable')?'true':'1');N.setAttribute('contenteditable',false);}}});}});if(b.gecko)(function(){var E=document.body;if(!E)window.addEventListener('load',arguments.callee,false);else{var F=E.getAttribute('onpageshow');E.setAttribute('onpageshow',(F?F+';':'')+'event.persisted && (function(){'+'var allInstances = CKEDITOR.instances, editor, doc;'+'for ( var i in allInstances )'+'{'+'\teditor = allInstances[ i ];'+'\tdoc = editor.document;'+'\tif ( doc )'+'\t{'+'\t\tdoc.$.designMode = "off";'+'\t\tdoc.$.designMode = "on";'+'\t}'+'}'+'})();');}})();})();i.disableObjectResizing=false;i.disableNativeTableHandles=true;i.disableNativeSpellChecker=true;i.ignoreEmptyParagraph=true;j.add('wsc',{requires:['dialog'],init:function(m){var n='checkspell',o=m.addCommand(n,new a.dialogCommand(n));o.modes={wysiwyg:!b.opera&&!b.air&&document.domain==window.location.hostname};m.ui.addButton('SpellChecker',{label:m.lang.spellCheck.toolbar,command:n});a.dialog.add(n,this.path+'dialogs/wsc.js');}});i.wsc_customerId=i.wsc_customerId||'1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk';i.wsc_customLoaderScript=i.wsc_customLoaderScript||null;a.DIALOG_RESIZE_NONE=0;a.DIALOG_RESIZE_WIDTH=1;a.DIALOG_RESIZE_HEIGHT=2;a.DIALOG_RESIZE_BOTH=3;(function(){var m=e.cssLength;function n(Q){return!!this._.tabs[Q][0].$.offsetHeight;};function o(){var U=this;var Q=U._.currentTabId,R=U._.tabIdList.length,S=e.indexOf(U._.tabIdList,Q)+R;for(var T=S-1;T>S-R;T--){if(n.call(U,U._.tabIdList[T%R]))return U._.tabIdList[T%R];
}return null;};function p(){var U=this;var Q=U._.currentTabId,R=U._.tabIdList.length,S=e.indexOf(U._.tabIdList,Q);for(var T=S+1;T<S+R;T++){if(n.call(U,U._.tabIdList[T%R]))return U._.tabIdList[T%R];}return null;};function q(Q,R){var S=Q.$.getElementsByTagName('input');for(var T=0,U=S.length;T<U;T++){var V=new h(S[T]);if(V.getAttribute('type').toLowerCase()=='text')if(R){V.setAttribute('value',V.getCustomData('fake_value')||'');V.removeCustomData('fake_value');}else{V.setCustomData('fake_value',V.getAttribute('value'));V.setAttribute('value','');}}};function r(Q,R){var T=this;var S=T.getInputElement();if(S)Q?S.removeAttribute('aria-invalid'):S.setAttribute('aria-invalid',true);if(!Q)if(T.select)T.select();else T.focus();R&&alert(R);T.fire('validated',{valid:Q,msg:R});};function s(){var Q=this.getInputElement();Q&&Q.removeAttribute('aria-invalid');};a.dialog=function(Q,R){var S=a.dialog._.dialogDefinitions[R],T=e.clone(u),U=Q.config.dialog_buttonsOrder||'OS',V=Q.lang.dir,W={},X,Y,Z;if(U=='OS'&&b.mac||U=='rtl'&&V=='ltr'||U=='ltr'&&V=='rtl')T.buttons.reverse();S=e.extend(S(Q),T);S=e.clone(S);S=new y(this,S);var aa=a.document,ab=Q.theme.buildDialog(Q);this._={editor:Q,element:ab.element,name:R,contentSize:{width:0,height:0},size:{width:0,height:0},contents:{},buttons:{},accessKeyMap:{},tabs:{},tabIdList:[],currentTabId:null,currentTabIndex:null,pageCount:0,lastTab:null,tabBarMode:false,focusList:[],currentFocusIndex:0,hasFocus:false};this.parts=ab.parts;e.setTimeout(function(){Q.fire('ariaWidget',this.parts.contents);},0,this);var ac={position:b.ie6Compat?'absolute':'fixed',top:0,visibility:'hidden'};ac[V=='rtl'?'right':'left']=0;this.parts.dialog.setStyles(ac);a.event.call(this);this.definition=S=a.fire('dialogDefinition',{name:R,definition:S},Q).definition;if(!('removeDialogTabs' in Q._)&&Q.config.removeDialogTabs){var ad=Q.config.removeDialogTabs.split(';');for(X=0;X<ad.length;X++){var ae=ad[X].split(':');if(ae.length==2){var af=ae[0];if(!W[af])W[af]=[];W[af].push(ae[1]);}}Q._.removeDialogTabs=W;}if(Q._.removeDialogTabs&&(W=Q._.removeDialogTabs[R]))for(X=0;X<W.length;X++)S.removeContents(W[X]);if(S.onLoad)this.on('load',S.onLoad);if(S.onShow)this.on('show',S.onShow);if(S.onHide)this.on('hide',S.onHide);if(S.onOk)this.on('ok',function(aq){Q.fire('saveSnapshot');setTimeout(function(){Q.fire('saveSnapshot');},0);if(S.onOk.call(this,aq)===false)aq.data.hide=false;});if(S.onCancel)this.on('cancel',function(aq){if(S.onCancel.call(this,aq)===false)aq.data.hide=false;
});var ag=this,ah=function(aq){var ar=ag._.contents,as=false;for(var at in ar)for(var au in ar[at]){as=aq.call(this,ar[at][au]);if(as)return;}};this.on('ok',function(aq){ah(function(ar){if(ar.validate){var as=ar.validate(this),at=typeof as=='string'||as===false;if(at){aq.data.hide=false;aq.stop();}r.call(ar,!at,typeof as=='string'?as:undefined);return at;}});},this,null,0);this.on('cancel',function(aq){ah(function(ar){if(ar.isChanged()){if(!confirm(Q.lang.common.confirmCancel))aq.data.hide=false;return true;}});},this,null,0);this.parts.close.on('click',function(aq){if(this.fire('cancel',{hide:true}).hide!==false)this.hide();aq.data.preventDefault();},this);function ai(){var aq=ag._.focusList;aq.sort(function(at,au){if(at.tabIndex!=au.tabIndex)return au.tabIndex-at.tabIndex;else return at.focusIndex-au.focusIndex;});var ar=aq.length;for(var as=0;as<ar;as++)aq[as].focusIndex=as;};function aj(aq){var ar=ag._.focusList;aq=aq||0;if(ar.length<1)return;var as=ag._.currentFocusIndex;try{ar[as].getInputElement().$.blur();}catch(av){}var at=(as+aq+ar.length)%ar.length,au=at;while(aq&&!ar[au].isFocusable()){au=(au+aq+ar.length)%ar.length;if(au==at)break;}ar[au].focus();if(ar[au].type=='text')ar[au].select();};this.changeFocus=aj;function ak(aq){var ax=this;if(ag!=a.dialog._.currentTop)return;var ar=aq.data.getKeystroke(),as=Q.lang.dir=='rtl',at;Y=Z=0;if(ar==9||ar==2228224+9){var au=ar==2228224+9;if(ag._.tabBarMode){var av=au?o.call(ag):p.call(ag);ag.selectPage(av);ag._.tabs[av][0].focus();}else aj(au?-1:1);Y=1;}else if(ar==4456448+121&&!ag._.tabBarMode&&ag.getPageCount()>1){ag._.tabBarMode=true;ag._.tabs[ag._.currentTabId][0].focus();Y=1;}else if((ar==37||ar==39)&&ag._.tabBarMode){av=ar==(as?39:37)?o.call(ag):p.call(ag);ag.selectPage(av);ag._.tabs[av][0].focus();Y=1;}else if((ar==13||ar==32)&&ag._.tabBarMode){ax.selectPage(ax._.currentTabId);ax._.tabBarMode=false;ax._.currentFocusIndex=-1;aj(1);Y=1;}else if(ar==13){var aw=aq.data.getTarget();if(!aw.is('a','button','select')&&(!aw.is('input')||aw.$.type!='button')){at=ax.getButton('ok');at&&e.setTimeout(at.click,0,at);Y=1;}Z=1;}else if(ar==27){at=ax.getButton('cancel');if(at)e.setTimeout(at.click,0,at);else if(ax.fire('cancel',{hide:true}).hide!==false)ax.hide();Z=1;}else return;al(aq);};function al(aq){if(Y)aq.data.preventDefault(1);else if(Z)aq.data.stopPropagation();};var am=this._.element;this.on('show',function(){am.on('keydown',ak,this);if(b.opera||b.gecko)am.on('keypress',al,this);});this.on('hide',function(){am.removeListener('keydown',ak);
if(b.opera||b.gecko)am.removeListener('keypress',al);ah(function(aq){s.apply(aq);});});this.on('iframeAdded',function(aq){var ar=new g(aq.data.iframe.$.contentWindow.document);ar.on('keydown',ak,this,null,0);});this.on('show',function(){var au=this;ai();if(Q.config.dialog_startupFocusTab&&ag._.pageCount>1){ag._.tabBarMode=true;ag._.tabs[ag._.currentTabId][0].focus();}else if(!au._.hasFocus){au._.currentFocusIndex=-1;if(S.onFocus){var aq=S.onFocus.call(au);aq&&aq.focus();}else aj(1);if(au._.editor.mode=='wysiwyg'&&c){var ar=Q.document.$.selection,as=ar.createRange();if(as)if(as.parentElement&&as.parentElement().ownerDocument==Q.document.$||as.item&&as.item(0).ownerDocument==Q.document.$){var at=document.body.createTextRange();at.moveToElementText(au.getElement().getFirst().$);at.collapse(true);at.select();}}}},this,null,4294967295);if(b.ie6Compat)this.on('load',function(aq){var ar=this.getElement(),as=ar.getFirst();as.remove();as.appendTo(ar);},this);A(this);B(this);new d.text(S.title,a.document).appendTo(this.parts.title);for(X=0;X<S.contents.length;X++){var an=S.contents[X];an&&this.addPage(an);}this.parts.tabs.on('click',function(aq){var at=this;var ar=aq.data.getTarget();if(ar.hasClass('cke_dialog_tab')){var as=ar.$.id;at.selectPage(as.substring(4,as.lastIndexOf('_')));if(at._.tabBarMode){at._.tabBarMode=false;at._.currentFocusIndex=-1;aj(1);}aq.data.preventDefault();}},this);var ao=[],ap=a.dialog._.uiElementBuilders.hbox.build(this,{type:'hbox',className:'cke_dialog_footer_buttons',widths:[],children:S.buttons},ao).getChild();this.parts.footer.setHtml(ao.join(''));for(X=0;X<ap.length;X++)this._.buttons[ap[X].id]=ap[X];};function t(Q,R,S){this.element=R;this.focusIndex=S;this.tabIndex=0;this.isFocusable=function(){return!R.getAttribute('disabled')&&R.isVisible();};this.focus=function(){Q._.currentFocusIndex=this.focusIndex;this.element.focus();};R.on('keydown',function(T){if(T.data.getKeystroke() in {32:1,13:1})this.fire('click');});R.on('focus',function(){this.fire('mouseover');});R.on('blur',function(){this.fire('mouseout');});};a.dialog.prototype={destroy:function(){this.hide();this._.element.remove();},resize:(function(){return function(Q,R){var S=this;if(S._.contentSize&&S._.contentSize.width==Q&&S._.contentSize.height==R)return;a.dialog.fire('resize',{dialog:S,skin:S._.editor.skinName,width:Q,height:R},S._.editor);S.fire('resize',{skin:S._.editor.skinName,width:Q,height:R},S._.editor);if(S._.editor.lang.dir=='rtl'&&S._.position)S._.position.x=a.document.getWindow().getViewPaneSize().width-S._.contentSize.width-parseInt(S._.element.getFirst().getStyle('right'),10);
S._.contentSize={width:Q,height:R};};})(),getSize:function(){var Q=this._.element.getFirst();return{width:Q.$.offsetWidth||0,height:Q.$.offsetHeight||0};},move:(function(){var Q;return function(R,S,T){var aa=this;var U=aa._.element.getFirst(),V=aa._.editor.lang.dir=='rtl';if(Q===undefined)Q=U.getComputedStyle('position')=='fixed';if(Q&&aa._.position&&aa._.position.x==R&&aa._.position.y==S)return;aa._.position={x:R,y:S};if(!Q){var W=a.document.getWindow().getScrollPosition();R+=W.x;S+=W.y;}if(V){var X=aa.getSize(),Y=a.document.getWindow().getViewPaneSize();R=Y.width-X.width-R;}var Z={top:(S>0?S:0)+'px'};Z[V?'right':'left']=(R>0?R:0)+'px';U.setStyles(Z);T&&(aa._.moved=1);};})(),getPosition:function(){return e.extend({},this._.position);},show:function(){var Q=this._.element,R=this.definition;if(!(Q.getParent()&&Q.getParent().equals(a.document.getBody())))Q.appendTo(a.document.getBody());else Q.setStyle('display','block');if(b.gecko&&b.version<10900){var S=this.parts.dialog;S.setStyle('position','absolute');setTimeout(function(){S.setStyle('position','fixed');},0);}this.resize(this._.contentSize&&this._.contentSize.width||R.width||R.minWidth,this._.contentSize&&this._.contentSize.height||R.height||R.minHeight);this.reset();this.selectPage(this.definition.contents[0].id);if(a.dialog._.currentZIndex===null)a.dialog._.currentZIndex=this._.editor.config.baseFloatZIndex;this._.element.getFirst().setStyle('z-index',a.dialog._.currentZIndex+=10);if(a.dialog._.currentTop===null){a.dialog._.currentTop=this;this._.parentDialog=null;G(this._.editor);}else{this._.parentDialog=a.dialog._.currentTop;var T=this._.parentDialog.getElement().getFirst();T.$.style.zIndex-=Math.floor(this._.editor.config.baseFloatZIndex/2);a.dialog._.currentTop=this;}Q.on('keydown',K);Q.on(b.opera?'keypress':'keyup',L);this._.hasFocus=false;e.setTimeout(function(){this.layout();this.parts.dialog.setStyle('visibility','');this.fireOnce('load',{});k.fire('ready',this);this.fire('show',{});this._.editor.fire('dialogShow',this);this.foreach(function(U){U.setInitValue&&U.setInitValue();});},100,this);},layout:function(){var S=this;var Q=a.document.getWindow().getViewPaneSize(),R=S.getSize();S.move(S._.moved?S._.position.x:(Q.width-R.width)/2,S._.moved?S._.position.y:(Q.height-R.height)/2);},foreach:function(Q){var T=this;for(var R in T._.contents)for(var S in T._.contents[R])Q.call(T,T._.contents[R][S]);return T;},reset:(function(){var Q=function(R){if(R.reset)R.reset(1);};return function(){this.foreach(Q);
return this;};})(),setupContent:function(){var Q=arguments;this.foreach(function(R){if(R.setup)R.setup.apply(R,Q);});},commitContent:function(){var Q=arguments;this.foreach(function(R){if(c&&this._.currentFocusIndex==R.focusIndex)R.getInputElement().$.blur();if(R.commit)R.commit.apply(R,Q);});},hide:function(){if(!this.parts.dialog.isVisible())return;this.fire('hide',{});this._.editor.fire('dialogHide',this);this.selectPage(this._.tabIdList[0]);var Q=this._.element;Q.setStyle('display','none');this.parts.dialog.setStyle('visibility','hidden');N(this);while(a.dialog._.currentTop!=this)a.dialog._.currentTop.hide();if(!this._.parentDialog)H();else{var R=this._.parentDialog.getElement().getFirst();R.setStyle('z-index',parseInt(R.$.style.zIndex,10)+Math.floor(this._.editor.config.baseFloatZIndex/2));}a.dialog._.currentTop=this._.parentDialog;if(!this._.parentDialog){a.dialog._.currentZIndex=null;Q.removeListener('keydown',K);Q.removeListener(b.opera?'keypress':'keyup',L);var S=this._.editor;S.focus();if(S.mode=='wysiwyg'&&c){var T=S.getSelection();T&&T.unlock(true);}}else a.dialog._.currentZIndex-=10;delete this._.parentDialog;this.foreach(function(U){U.resetInitValue&&U.resetInitValue();});},addPage:function(Q){var ac=this;var R=[],S=Q.label?' title="'+e.htmlEncode(Q.label)+'"':'',T=Q.elements,U=a.dialog._.uiElementBuilders.vbox.build(ac,{type:'vbox',className:'cke_dialog_page_contents',children:Q.elements,expand:!!Q.expand,padding:Q.padding,style:Q.style||'width: 100%;height:100%'},R),V=h.createFromHtml(R.join(''));V.setAttribute('role','tabpanel');var W=b,X='cke_'+Q.id+'_'+e.getNextNumber(),Y=h.createFromHtml(['<a class="cke_dialog_tab"',ac._.pageCount>0?' cke_last':'cke_first',S,!!Q.hidden?' style="display:none"':'',' id="',X,'"',W.gecko&&W.version>=10900&&!W.hc?'':' href="javascript:void(0)"',' tabIndex="-1"',' hidefocus="true"',' role="tab">',Q.label,'</a>'].join(''));V.setAttribute('aria-labelledby',X);ac._.tabs[Q.id]=[Y,V];ac._.tabIdList.push(Q.id);!Q.hidden&&ac._.pageCount++;ac._.lastTab=Y;ac.updateStyle();var Z=ac._.contents[Q.id]={},aa,ab=U.getChild();while(aa=ab.shift()){Z[aa.id]=aa;if(typeof aa.getChild=='function')ab.push.apply(ab,aa.getChild());}V.setAttribute('name',Q.id);V.appendTo(ac.parts.contents);Y.unselectable();ac.parts.tabs.append(Y);if(Q.accessKey){M(ac,ac,'CTRL+'+Q.accessKey,P,O);ac._.accessKeyMap['CTRL+'+Q.accessKey]=Q.id;}},selectPage:function(Q){if(this._.currentTabId==Q)return;if(this.fire('selectPage',{page:Q,currentPage:this._.currentTabId})===true)return;
for(var R in this._.tabs){var S=this._.tabs[R][0],T=this._.tabs[R][1];if(R!=Q){S.removeClass('cke_dialog_tab_selected');T.hide();}T.setAttribute('aria-hidden',R!=Q);}var U=this._.tabs[Q];U[0].addClass('cke_dialog_tab_selected');if(b.ie6Compat||b.ie7Compat){q(U[1]);U[1].show();setTimeout(function(){q(U[1],1);},0);}else U[1].show();this._.currentTabId=Q;this._.currentTabIndex=e.indexOf(this._.tabIdList,Q);},updateStyle:function(){this.parts.dialog[(this._.pageCount===1?'add':'remove')+'Class']('cke_single_page');},hidePage:function(Q){var S=this;var R=S._.tabs[Q]&&S._.tabs[Q][0];if(!R||S._.pageCount==1||!R.isVisible())return;else if(Q==S._.currentTabId)S.selectPage(o.call(S));R.hide();S._.pageCount--;S.updateStyle();},showPage:function(Q){var S=this;var R=S._.tabs[Q]&&S._.tabs[Q][0];if(!R)return;R.show();S._.pageCount++;S.updateStyle();},getElement:function(){return this._.element;},getName:function(){return this._.name;},getContentElement:function(Q,R){var S=this._.contents[Q];return S&&S[R];},getValueOf:function(Q,R){return this.getContentElement(Q,R).getValue();},setValueOf:function(Q,R,S){return this.getContentElement(Q,R).setValue(S);},getButton:function(Q){return this._.buttons[Q];},click:function(Q){return this._.buttons[Q].click();},disableButton:function(Q){return this._.buttons[Q].disable();},enableButton:function(Q){return this._.buttons[Q].enable();},getPageCount:function(){return this._.pageCount;},getParentEditor:function(){return this._.editor;},getSelectedElement:function(){return this.getParentEditor().getSelection().getSelectedElement();},addFocusable:function(Q,R){var T=this;if(typeof R=='undefined'){R=T._.focusList.length;T._.focusList.push(new t(T,Q,R));}else{T._.focusList.splice(R,0,new t(T,Q,R));for(var S=R+1;S<T._.focusList.length;S++)T._.focusList[S].focusIndex++;}}};e.extend(a.dialog,{add:function(Q,R){if(!this._.dialogDefinitions[Q]||typeof R=='function')this._.dialogDefinitions[Q]=R;},exists:function(Q){return!!this._.dialogDefinitions[Q];},getCurrent:function(){return a.dialog._.currentTop;},okButton:(function(){var Q=function(R,S){S=S||{};return e.extend({id:'ok',type:'button',label:R.lang.common.ok,'class':'cke_dialog_ui_button_ok',onClick:function(T){var U=T.data.dialog;if(U.fire('ok',{hide:true}).hide!==false)U.hide();}},S,true);};Q.type='button';Q.override=function(R){return e.extend(function(S){return Q(S,R);},{type:'button'},true);};return Q;})(),cancelButton:(function(){var Q=function(R,S){S=S||{};return e.extend({id:'cancel',type:'button',label:R.lang.common.cancel,'class':'cke_dialog_ui_button_cancel',onClick:function(T){var U=T.data.dialog;
if(U.fire('cancel',{hide:true}).hide!==false)U.hide();}},S,true);};Q.type='button';Q.override=function(R){return e.extend(function(S){return Q(S,R);},{type:'button'},true);};return Q;})(),addUIElement:function(Q,R){this._.uiElementBuilders[Q]=R;}});a.dialog._={uiElementBuilders:{},dialogDefinitions:{},currentTop:null,currentZIndex:null};a.event.implementOn(a.dialog);a.event.implementOn(a.dialog.prototype,true);var u={resizable:3,minWidth:600,minHeight:400,buttons:[a.dialog.okButton,a.dialog.cancelButton]},v=function(Q,R,S){for(var T=0,U;U=Q[T];T++){if(U.id==R)return U;if(S&&U[S]){var V=v(U[S],R,S);if(V)return V;}}return null;},w=function(Q,R,S,T,U){if(S){for(var V=0,W;W=Q[V];V++){if(W.id==S){Q.splice(V,0,R);return R;}if(T&&W[T]){var X=w(W[T],R,S,T,true);if(X)return X;}}if(U)return null;}Q.push(R);return R;},x=function(Q,R,S){for(var T=0,U;U=Q[T];T++){if(U.id==R)return Q.splice(T,1);if(S&&U[S]){var V=x(U[S],R,S);if(V)return V;}}return null;},y=function(Q,R){this.dialog=Q;var S=R.contents;for(var T=0,U;U=S[T];T++)S[T]=U&&new z(Q,U);e.extend(this,R);};y.prototype={getContents:function(Q){return v(this.contents,Q);},getButton:function(Q){return v(this.buttons,Q);},addContents:function(Q,R){return w(this.contents,Q,R);},addButton:function(Q,R){return w(this.buttons,Q,R);},removeContents:function(Q){x(this.contents,Q);},removeButton:function(Q){x(this.buttons,Q);}};function z(Q,R){this._={dialog:Q};e.extend(this,R);};z.prototype={get:function(Q){return v(this.elements,Q,'children');},add:function(Q,R){return w(this.elements,Q,R,'children');},remove:function(Q){x(this.elements,Q,'children');}};function A(Q){var R=null,S=null,T=Q.getElement().getFirst(),U=Q.getParentEditor(),V=U.config.dialog_magnetDistance,W=U.skin.margins||[0,0,0,0];if(typeof V=='undefined')V=20;function X(Z){var aa=Q.getSize(),ab=a.document.getWindow().getViewPaneSize(),ac=Z.data.$.screenX,ad=Z.data.$.screenY,ae=ac-R.x,af=ad-R.y,ag,ah;R={x:ac,y:ad};S.x+=ae;S.y+=af;if(S.x+W[3]<V)ag=-W[3];else if(S.x-W[1]>ab.width-aa.width-V)ag=ab.width-aa.width+(U.lang.dir=='rtl'?0:W[1]);else ag=S.x;if(S.y+W[0]<V)ah=-W[0];else if(S.y-W[2]>ab.height-aa.height-V)ah=ab.height-aa.height+W[2];else ah=S.y;Q.move(ag,ah,1);Z.data.preventDefault();};function Y(Z){a.document.removeListener('mousemove',X);a.document.removeListener('mouseup',Y);if(b.ie6Compat){var aa=E.getChild(0).getFrameDocument();aa.removeListener('mousemove',X);aa.removeListener('mouseup',Y);}};Q.parts.title.on('mousedown',function(Z){R={x:Z.data.$.screenX,y:Z.data.$.screenY};
a.document.on('mousemove',X);a.document.on('mouseup',Y);S=Q.getPosition();if(b.ie6Compat){var aa=E.getChild(0).getFrameDocument();aa.on('mousemove',X);aa.on('mouseup',Y);}Z.data.preventDefault();},Q);};function B(Q){var R=Q.definition,S=R.resizable;if(S==0)return;var T=Q.getParentEditor(),U,V,W,X,Y,Z,aa=e.addFunction(function(ad){Y=Q.getSize();var ae=Q.parts.contents,af=ae.$.getElementsByTagName('iframe').length;if(af){Z=h.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>');ae.append(Z);}V=Y.height-Q.parts.contents.getSize('height',!(b.gecko||b.opera||c&&b.quirks));U=Y.width-Q.parts.contents.getSize('width',1);X={x:ad.screenX,y:ad.screenY};W=a.document.getWindow().getViewPaneSize();a.document.on('mousemove',ab);a.document.on('mouseup',ac);if(b.ie6Compat){var ag=E.getChild(0).getFrameDocument();ag.on('mousemove',ab);ag.on('mouseup',ac);}ad.preventDefault&&ad.preventDefault();});Q.on('load',function(){var ad='';if(S==1)ad=' cke_resizer_horizontal';else if(S==2)ad=' cke_resizer_vertical';var ae=h.createFromHtml('<div class="cke_resizer'+ad+' cke_resizer_'+T.lang.dir+'"'+' title="'+e.htmlEncode(T.lang.resize)+'"'+' onmousedown="CKEDITOR.tools.callFunction('+aa+', event )"></div>');Q.parts.footer.append(ae,1);});T.on('destroy',function(){e.removeFunction(aa);});function ab(ad){var ae=T.lang.dir=='rtl',af=(ad.data.$.screenX-X.x)*(ae?-1:1),ag=ad.data.$.screenY-X.y,ah=Y.width,ai=Y.height,aj=ah+af*(Q._.moved?1:2),ak=ai+ag*(Q._.moved?1:2),al=Q._.element.getFirst(),am=ae&&al.getComputedStyle('right'),an=Q.getPosition();if(an.y+ak>W.height)ak=W.height-an.y;if((ae?am:an.x)+aj>W.width)aj=W.width-(ae?am:an.x);if(S==1||S==3)ah=Math.max(R.minWidth||0,aj-U);if(S==2||S==3)ai=Math.max(R.minHeight||0,ak-V);Q.resize(ah,ai);if(!Q._.moved)Q.layout();ad.data.preventDefault();};function ac(){a.document.removeListener('mouseup',ac);a.document.removeListener('mousemove',ab);if(Z){Z.remove();Z=null;}if(b.ie6Compat){var ad=E.getChild(0).getFrameDocument();ad.removeListener('mouseup',ac);ad.removeListener('mousemove',ab);}};};var C,D={},E;function F(Q){Q.data.preventDefault(1);};function G(Q){var R=a.document.getWindow(),S=Q.config,T=S.dialog_backgroundCoverColor||'white',U=S.dialog_backgroundCoverOpacity,V=S.baseFloatZIndex,W=e.genKey(T,U,V),X=D[W];if(!X){var Y=['<div tabIndex="-1" style="position: ',b.ie6Compat?'absolute':'fixed','; z-index: ',V,'; top: 0px; left: 0px; ',!b.ie6Compat?'background-color: '+T:'','" class="cke_dialog_background_cover">'];
if(b.ie6Compat){var Z=b.isCustomDomain(),aa="<html><body style=\\'background-color:"+T+";\\'></body></html>";Y.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:');Y.push('void((function(){document.open();'+(Z?"document.domain='"+document.domain+"';":'')+"document.write( '"+aa+"' );"+'document.close();'+'})())');Y.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>');}Y.push('</div>');X=h.createFromHtml(Y.join(''));X.setOpacity(U!=undefined?U:0.5);X.on('keydown',F);X.on('keypress',F);X.on('keyup',F);X.appendTo(a.document.getBody());D[W]=X;}else X.show();E=X;var ab=function(){var ae=R.getViewPaneSize();X.setStyles({width:ae.width+'px',height:ae.height+'px'});},ac=function(){var ae=R.getScrollPosition(),af=a.dialog._.currentTop;X.setStyles({left:ae.x+'px',top:ae.y+'px'});if(af)do{var ag=af.getPosition();af.move(ag.x,ag.y);}while(af=af._.parentDialog)};C=ab;R.on('resize',ab);ab();if(!(b.mac&&b.webkit))X.focus();if(b.ie6Compat){var ad=function(){ac();arguments.callee.prevScrollHandler.apply(this,arguments);};R.$.setTimeout(function(){ad.prevScrollHandler=window.onscroll||(function(){});window.onscroll=ad;},0);ac();}};function H(){if(!E)return;var Q=a.document.getWindow();E.hide();Q.removeListener('resize',C);if(b.ie6Compat)Q.$.setTimeout(function(){var R=window.onscroll&&window.onscroll.prevScrollHandler;window.onscroll=R||null;},0);C=null;};function I(){for(var Q in D)D[Q].remove();D={};};var J={},K=function(Q){var R=Q.data.$.ctrlKey||Q.data.$.metaKey,S=Q.data.$.altKey,T=Q.data.$.shiftKey,U=String.fromCharCode(Q.data.$.keyCode),V=J[(R?'CTRL+':'')+(S?'ALT+':'')+(T?'SHIFT+':'')+U];if(!V||!V.length)return;V=V[V.length-1];V.keydown&&V.keydown.call(V.uiElement,V.dialog,V.key);Q.data.preventDefault();},L=function(Q){var R=Q.data.$.ctrlKey||Q.data.$.metaKey,S=Q.data.$.altKey,T=Q.data.$.shiftKey,U=String.fromCharCode(Q.data.$.keyCode),V=J[(R?'CTRL+':'')+(S?'ALT+':'')+(T?'SHIFT+':'')+U];if(!V||!V.length)return;V=V[V.length-1];if(V.keyup){V.keyup.call(V.uiElement,V.dialog,V.key);Q.data.preventDefault();}},M=function(Q,R,S,T,U){var V=J[S]||(J[S]=[]);V.push({uiElement:Q,dialog:R,key:S,keyup:U||Q.accessKeyUp,keydown:T||Q.accessKeyDown});},N=function(Q){for(var R in J){var S=J[R];for(var T=S.length-1;T>=0;T--){if(S[T].dialog==Q||S[T].uiElement==Q)S.splice(T,1);}if(S.length===0)delete J[R];}},O=function(Q,R){if(Q._.accessKeyMap[R])Q.selectPage(Q._.accessKeyMap[R]);
},P=function(Q,R){};(function(){k.dialog={uiElement:function(Q,R,S,T,U,V,W){if(arguments.length<4)return;var X=(T.call?T(R):T)||'div',Y=['<',X,' '],Z=(U&&U.call?U(R):U)||{},aa=(V&&V.call?V(R):V)||{},ab=(W&&W.call?W.call(this,Q,R):W)||'',ac=this.domId=aa.id||e.getNextId()+'_uiElement',ad=this.id=R.id,ae;aa.id=ac;var af={};if(R.type)af['cke_dialog_ui_'+R.type]=1;if(R.className)af[R.className]=1;if(R.disabled)af.cke_disabled=1;var ag=aa['class']&&aa['class'].split?aa['class'].split(' '):[];for(ae=0;ae<ag.length;ae++){if(ag[ae])af[ag[ae]]=1;}var ah=[];for(ae in af)ah.push(ae);aa['class']=ah.join(' ');if(R.title)aa.title=R.title;var ai=(R.style||'').split(';');if(R.align){var aj=R.align;Z['margin-left']=aj=='left'?0:'auto';Z['margin-right']=aj=='right'?0:'auto';}for(ae in Z)ai.push(ae+':'+Z[ae]);if(R.hidden)ai.push('display:none');for(ae=ai.length-1;ae>=0;ae--){if(ai[ae]==='')ai.splice(ae,1);}if(ai.length>0)aa.style=(aa.style?aa.style+'; ':'')+ai.join('; ');for(ae in aa)Y.push(ae+'="'+e.htmlEncode(aa[ae])+'" ');Y.push('>',ab,'</',X,'>');S.push(Y.join(''));(this._||(this._={})).dialog=Q;if(typeof R.isChanged=='boolean')this.isChanged=function(){return R.isChanged;};if(typeof R.isChanged=='function')this.isChanged=R.isChanged;if(typeof R.setValue=='function')this.setValue=e.override(this.setValue,function(al){return function(am){al.call(this,R.setValue.call(this,am));};});if(typeof R.getValue=='function')this.getValue=e.override(this.getValue,function(al){return function(){return R.getValue.call(this,al.call(this));};});a.event.implementOn(this);this.registerEvents(R);if(this.accessKeyUp&&this.accessKeyDown&&R.accessKey)M(this,Q,'CTRL+'+R.accessKey);var ak=this;Q.on('load',function(){var al=ak.getInputElement();if(al){var am=ak.type in {checkbox:1,ratio:1}&&c&&b.version<8?'cke_dialog_ui_focused':'';al.on('focus',function(){Q._.tabBarMode=false;Q._.hasFocus=true;ak.fire('focus');am&&this.addClass(am);});al.on('blur',function(){ak.fire('blur');am&&this.removeClass(am);});}});if(this.keyboardFocusable){this.tabIndex=R.tabIndex||0;this.focusIndex=Q._.focusList.push(this)-1;this.on('focus',function(){Q._.currentFocusIndex=ak.focusIndex;});}e.extend(this,R);},hbox:function(Q,R,S,T,U){if(arguments.length<4)return;this._||(this._={});var V=this._.children=R,W=U&&U.widths||null,X=U&&U.height||null,Y={},Z,aa=function(){var ac=['<tbody><tr class="cke_dialog_ui_hbox">'];for(Z=0;Z<S.length;Z++){var ad='cke_dialog_ui_hbox_child',ae=[];if(Z===0)ad='cke_dialog_ui_hbox_first';if(Z==S.length-1)ad='cke_dialog_ui_hbox_last';
ac.push('<td class="',ad,'" role="presentation" ');if(W){if(W[Z])ae.push('width:'+m(W[Z]));}else ae.push('width:'+Math.floor(100/S.length)+'%');if(X)ae.push('height:'+m(X));if(U&&U.padding!=undefined)ae.push('padding:'+m(U.padding));if(c&&b.quirks&&V[Z].align)ae.push('text-align:'+V[Z].align);if(ae.length>0)ac.push('style="'+ae.join('; ')+'" ');ac.push('>',S[Z],'</td>');}ac.push('</tr></tbody>');return ac.join('');},ab={role:'presentation'};U&&U.align&&(ab.align=U.align);k.dialog.uiElement.call(this,Q,U||{type:'hbox'},T,'table',Y,ab,aa);},vbox:function(Q,R,S,T,U){if(arguments.length<3)return;this._||(this._={});var V=this._.children=R,W=U&&U.width||null,X=U&&U.heights||null,Y=function(){var Z=['<table role="presentation" cellspacing="0" border="0" '];Z.push('style="');if(U&&U.expand)Z.push('height:100%;');Z.push('width:'+m(W||'100%'),';');Z.push('"');Z.push('align="',e.htmlEncode(U&&U.align||(Q.getParentEditor().lang.dir=='ltr'?'left':'right')),'" ');Z.push('><tbody>');for(var aa=0;aa<S.length;aa++){var ab=[];Z.push('<tr><td role="presentation" ');if(W)ab.push('width:'+m(W||'100%'));if(X)ab.push('height:'+m(X[aa]));else if(U&&U.expand)ab.push('height:'+Math.floor(100/S.length)+'%');if(U&&U.padding!=undefined)ab.push('padding:'+m(U.padding));if(c&&b.quirks&&V[aa].align)ab.push('text-align:'+V[aa].align);if(ab.length>0)Z.push('style="',ab.join('; '),'" ');Z.push(' class="cke_dialog_ui_vbox_child">',S[aa],'</td></tr>');}Z.push('</tbody></table>');return Z.join('');};k.dialog.uiElement.call(this,Q,U||{type:'vbox'},T,'div',null,{role:'presentation'},Y);}};})();k.dialog.uiElement.prototype={getElement:function(){return a.document.getById(this.domId);},getInputElement:function(){return this.getElement();},getDialog:function(){return this._.dialog;},setValue:function(Q,R){this.getInputElement().setValue(Q);!R&&this.fire('change',{value:Q});return this;},getValue:function(){return this.getInputElement().getValue();},isChanged:function(){return false;},selectParentTab:function(){var T=this;var Q=T.getInputElement(),R=Q,S;while((R=R.getParent())&&R.$.className.search('cke_dialog_page_contents')==-1){}if(!R)return T;S=R.getAttribute('name');if(T._.dialog._.currentTabId!=S)T._.dialog.selectPage(S);return T;},focus:function(){this.selectParentTab().getInputElement().focus();return this;},registerEvents:function(Q){var R=/^on([A-Z]\w+)/,S,T=function(V,W,X,Y){W.on('load',function(){V.getInputElement().on(X,Y,V);});};for(var U in Q){if(!(S=U.match(R)))continue;if(this.eventProcessors[U])this.eventProcessors[U].call(this,this._.dialog,Q[U]);
else T(this,this._.dialog,S[1].toLowerCase(),Q[U]);}return this;},eventProcessors:{onLoad:function(Q,R){Q.on('load',R,this);},onShow:function(Q,R){Q.on('show',R,this);},onHide:function(Q,R){Q.on('hide',R,this);}},accessKeyDown:function(Q,R){this.focus();},accessKeyUp:function(Q,R){},disable:function(){var Q=this.getElement(),R=this.getInputElement();R.setAttribute('disabled','true');Q.addClass('cke_disabled');},enable:function(){var Q=this.getElement(),R=this.getInputElement();R.removeAttribute('disabled');Q.removeClass('cke_disabled');},isEnabled:function(){return!this.getElement().hasClass('cke_disabled');},isVisible:function(){return this.getInputElement().isVisible();},isFocusable:function(){if(!this.isEnabled()||!this.isVisible())return false;return true;}};k.dialog.hbox.prototype=e.extend(new k.dialog.uiElement(),{getChild:function(Q){var R=this;if(arguments.length<1)return R._.children.concat();if(!Q.splice)Q=[Q];if(Q.length<2)return R._.children[Q[0]];else return R._.children[Q[0]]&&R._.children[Q[0]].getChild?R._.children[Q[0]].getChild(Q.slice(1,Q.length)):null;}},true);k.dialog.vbox.prototype=new k.dialog.hbox();(function(){var Q={build:function(R,S,T){var U=S.children,V,W=[],X=[];for(var Y=0;Y<U.length&&(V=U[Y]);Y++){var Z=[];W.push(Z);X.push(a.dialog._.uiElementBuilders[V.type].build(R,V,Z));}return new k.dialog[S.type](R,X,W,T,S);}};a.dialog.addUIElement('hbox',Q);a.dialog.addUIElement('vbox',Q);})();a.dialogCommand=function(Q){this.dialogName=Q;};a.dialogCommand.prototype={exec:function(Q){b.opera?e.setTimeout(function(){Q.openDialog(this.dialogName);},0,this):Q.openDialog(this.dialogName);},canUndo:false,editorFocus:c||b.webkit};(function(){var Q=/^([a]|[^a])+$/,R=/^\d*$/,S=/^\d*(?:\.\d+)?$/,T=/^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/,U=/^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i,V=/^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;a.VALIDATE_OR=1;a.VALIDATE_AND=2;a.dialog.validate={functions:function(){var W=arguments;return function(){var X=this&&this.getValue?this.getValue():W[0],Y=undefined,Z=2,aa=[],ab;for(ab=0;ab<W.length;ab++){if(typeof W[ab]=='function')aa.push(W[ab]);else break;}if(ab<W.length&&typeof W[ab]=='string'){Y=W[ab];ab++;}if(ab<W.length&&typeof W[ab]=='number')Z=W[ab];var ac=Z==2?true:false;for(ab=0;ab<aa.length;ab++){if(Z==2)ac=ac&&aa[ab](X);else ac=ac||aa[ab](X);}return!ac?Y:true;};},regex:function(W,X){return function(){var Y=this&&this.getValue?this.getValue():arguments[0];return!W.test(Y)?X:true;};},notEmpty:function(W){return this.regex(Q,W);
},integer:function(W){return this.regex(R,W);},number:function(W){return this.regex(S,W);},cssLength:function(W){return this.functions(function(X){return U.test(e.trim(X));},W);},htmlLength:function(W){return this.functions(function(X){return T.test(e.trim(X));},W);},inlineStyle:function(W){return this.functions(function(X){return V.test(e.trim(X));},W);},equals:function(W,X){return this.functions(function(Y){return Y==W;},X);},notEqual:function(W,X){return this.functions(function(Y){return Y!=W;},X);}};a.on('instanceDestroyed',function(W){if(e.isEmpty(a.instances)){var X;while(X=a.dialog._.currentTop)X.hide();I();}var Y=W.editor._.storedDialogs;for(var Z in Y)Y[Z].destroy();});})();e.extend(a.editor.prototype,{openDialog:function(Q,R){if(this.mode=='wysiwyg'&&c){var S=this.getSelection();S&&S.lock();}var T=a.dialog._.dialogDefinitions[Q],U=this.skin.dialog;if(a.dialog._.currentTop===null)G(this);if(typeof T=='function'&&U._isLoaded){var V=this._.storedDialogs||(this._.storedDialogs={}),W=V[Q]||(V[Q]=new a.dialog(this,Q));R&&R.call(W,W);W.show();return W;}else if(T=='failed'){H();throw new Error('[CKEDITOR.dialog.openDialog] Dialog "'+Q+'" failed when loading definition.');}var X=this;function Y(aa){var ab=a.dialog._.dialogDefinitions[Q],ac=X.skin.dialog;if(!ac._isLoaded||Z&&typeof aa=='undefined')return;if(typeof ab!='function')a.dialog._.dialogDefinitions[Q]='failed';X.openDialog(Q,R);};if(typeof T=='string'){var Z=1;a.scriptLoader.load(a.getUrl(T),Y,null,0,1);}a.skins.load(this,'dialog',Y);return null;}});})();j.add('dialog',{requires:['dialogui']});j.add('styles',{requires:['selection'],init:function(m){m.on('contentDom',function(){m.document.setCustomData('cke_includeReadonly',!m.config.disableReadonlyStyling);});}});a.editor.prototype.attachStyleStateChange=function(m,n){var o=this._.styleStateChangeCallbacks;if(!o){o=this._.styleStateChangeCallbacks=[];this.on('selectionChange',function(p){for(var q=0;q<o.length;q++){var r=o[q],s=r.style.checkActive(p.data.path)?1:2;r.fn.call(this,s);}});}o.push({style:m,fn:n});};a.STYLE_BLOCK=1;a.STYLE_INLINE=2;a.STYLE_OBJECT=3;(function(){var m={address:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,p:1,pre:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,time:1,meter:1,menu:1,command:1,keygen:1,output:1,progress:1,details:1,datagrid:1,datalist:1},n={a:1,embed:1,hr:1,img:1,li:1,object:1,ol:1,table:1,td:1,tr:1,th:1,ul:1,dl:1,dt:1,dd:1,form:1,audio:1,video:1},o=/\s*(?:;\s*|$)/,p=/#\((.+?)\)/g,q=d.walker.bookmark(0,1),r=d.walker.whitespaces(1);
a.style=function(T,U){var W=this;if(U){T=e.clone(T);L(T.attributes,U);L(T.styles,U);}var V=W.element=T.element?typeof T.element=='string'?T.element.toLowerCase():T.element:'*';W.type=m[V]?1:n[V]?3:2;if(typeof W.element=='object')W.type=3;W._={definition:T};};a.style.prototype={apply:function(T){S.call(this,T,false);},remove:function(T){S.call(this,T,true);},applyToRange:function(T){var U=this;return(U.applyToRange=U.type==2?t:U.type==1?x:U.type==3?v:null).call(U,T);},removeFromRange:function(T){var U=this;return(U.removeFromRange=U.type==2?u:U.type==1?y:U.type==3?w:null).call(U,T);},applyToObject:function(T){K(T,this);},checkActive:function(T){var Y=this;switch(Y.type){case 1:return Y.checkElementRemovable(T.block||T.blockLimit,true);case 3:case 2:var U=T.elements;for(var V=0,W;V<U.length;V++){W=U[V];if(Y.type==2&&(W==T.block||W==T.blockLimit))continue;if(Y.type==3){var X=W.getName();if(!(typeof Y.element=='string'?X==Y.element:X in Y.element))continue;}if(Y.checkElementRemovable(W,true))return true;}}return false;},checkApplicable:function(T){switch(this.type){case 2:case 1:break;case 3:return T.lastElement.getAscendant(this.element,true);}return true;},checkElementMatch:function(T,U){var aa=this;var V=aa._.definition;if(!T||!V.ignoreReadonly&&T.isReadOnly())return false;var W,X=T.getName();if(typeof aa.element=='string'?X==aa.element:X in aa.element){if(!U&&!T.hasAttributes())return true;W=M(V);if(W._length){for(var Y in W){if(Y=='_length')continue;var Z=T.getAttribute(Y)||'';if(Y=='style'?R(W[Y],P(Z,false)):W[Y]==Z){if(!U)return true;}else if(U)return false;}if(U)return true;}else return true;}return false;},checkElementRemovable:function(T,U){if(this.checkElementMatch(T,U))return true;var V=N(this)[T.getName()];if(V){var W,X;if(!(W=V.attributes))return true;for(var Y=0;Y<W.length;Y++){X=W[Y][0];var Z=T.getAttribute(X);if(Z){var aa=W[Y][1];if(aa===null||typeof aa=='string'&&Z==aa||aa.test(Z))return true;}}}return false;},buildPreview:function(T){var U=this._.definition,V=[],W=U.element;if(W=='bdo')W='span';V=['<',W];var X=U.attributes;if(X)for(var Y in X)V.push(' ',Y,'="',X[Y],'"');var Z=a.style.getStyleText(U);if(Z)V.push(' style="',Z,'"');V.push('>',T||U.name,'</',W,'>');return V.join('');}};a.style.getStyleText=function(T){var U=T._ST;if(U)return U;U=T.styles;var V=T.attributes&&T.attributes.style||'',W='';if(V.length)V=V.replace(o,';');for(var X in U){var Y=U[X],Z=(X+':'+Y).replace(o,';');if(Y=='inherit')W+=Z;else V+=Z;}if(V.length)V=P(V);V+=W;return T._ST=V;
};function s(T){var U,V;while(T=T.getParent()){if(T.getName()=='body')break;if(T.getAttribute('data-nostyle'))U=T;else if(!V){var W=T.getAttribute('contentEditable');if(W=='false')U=T;else if(W=='true')V=1;}}return U;};function t(T){var ay=this;var U=T.document;if(T.collapsed){var V=J(ay,U);T.insertNode(V);T.moveToPosition(V,2);return;}var W=ay.element,X=ay._.definition,Y,Z=X.ignoreReadonly,aa=Z||X.includeReadonly;if(aa==undefined)aa=U.getCustomData('cke_includeReadonly');var ab=f[W]||(Y=true,f.span);T.enlarge(1,1);T.trim();var ac=T.createBookmark(),ad=ac.startNode,ae=ac.endNode,af=ad,ag;if(!Z){var ah=s(ad),ai=s(ae);if(ah)af=ah.getNextSourceNode(true);if(ai)ae=ai;}if(af.getPosition(ae)==2)af=0;while(af){var aj=false;if(af.equals(ae)){af=null;aj=true;}else{var ak=af.type,al=ak==1?af.getName():null,am=al&&af.getAttribute('contentEditable')=='false',an=al&&af.getAttribute('data-nostyle');if(al&&af.data('cke-bookmark')){af=af.getNextSourceNode(true);continue;}if(!al||ab[al]&&!an&&(!am||aa)&&(af.getPosition(ae)|4|0|8)==4+0+8&&(!X.childRule||X.childRule(af))){var ao=af.getParent();if(ao&&((ao.getDtd()||f.span)[W]||Y)&&(!X.parentRule||X.parentRule(ao))){if(!ag&&(!al||!f.$removeEmpty[al]||(af.getPosition(ae)|4|0|8)==4+0+8)){ag=new d.range(U);ag.setStartBefore(af);}if(ak==3||am||ak==1&&!af.getChildCount()){var ap=af,aq;while((aj=!ap.getNext(q))&&(aq=ap.getParent(),ab[aq.getName()])&&(aq.getPosition(ad)|2|0|8)==2+0+8&&(!X.childRule||X.childRule(aq)))ap=aq;ag.setEndAfter(ap);}}else aj=true;}else aj=true;af=af.getNextSourceNode(an||am);}if(aj&&ag&&!ag.collapsed){var ar=J(ay,U),as=ar.hasAttributes(),at=ag.getCommonAncestor(),au={styles:{},attrs:{},blockedStyles:{},blockedAttrs:{}},av,aw,ax;while(ar&&at){if(at.getName()==W){for(av in X.attributes){if(au.blockedAttrs[av]||!(ax=at.getAttribute(aw)))continue;if(ar.getAttribute(av)==ax)au.attrs[av]=1;else au.blockedAttrs[av]=1;}for(aw in X.styles){if(au.blockedStyles[aw]||!(ax=at.getStyle(aw)))continue;if(ar.getStyle(aw)==ax)au.styles[aw]=1;else au.blockedStyles[aw]=1;}}at=at.getParent();}for(av in au.attrs)ar.removeAttribute(av);for(aw in au.styles)ar.removeStyle(aw);if(as&&!ar.hasAttributes())ar=null;if(ar){ag.extractContents().appendTo(ar);G(ay,ar);ag.insertNode(ar);ar.mergeSiblings();if(!c)ar.$.normalize();}else{ar=new h('span');ag.extractContents().appendTo(ar);ag.insertNode(ar);G(ay,ar);ar.remove(true);}ag=null;}}T.moveToBookmark(ac);T.shrink(2);};function u(T){T.enlarge(1,1);var U=T.createBookmark(),V=U.startNode;if(T.collapsed){var W=new d.elementPath(V.getParent()),X;
for(var Y=0,Z;Y<W.elements.length&&(Z=W.elements[Y]);Y++){if(Z==W.block||Z==W.blockLimit)break;if(this.checkElementRemovable(Z)){var aa;if(T.collapsed&&(T.checkBoundaryOfElement(Z,2)||(aa=T.checkBoundaryOfElement(Z,1)))){X=Z;X.match=aa?'start':'end';}else{Z.mergeSiblings();if(Z.getName()==this.element)F(this,Z);else H(Z,N(this)[Z.getName()]);}}}if(X){var ab=V;for(Y=0;true;Y++){var ac=W.elements[Y];if(ac.equals(X))break;else if(ac.match)continue;else ac=ac.clone();ac.append(ab);ab=ac;}ab[X.match=='start'?'insertBefore':'insertAfter'](X);}}else{var ad=U.endNode,ae=this;function af(){var ai=new d.elementPath(V.getParent()),aj=new d.elementPath(ad.getParent()),ak=null,al=null;for(var am=0;am<ai.elements.length;am++){var an=ai.elements[am];if(an==ai.block||an==ai.blockLimit)break;if(ae.checkElementRemovable(an))ak=an;}for(am=0;am<aj.elements.length;am++){an=aj.elements[am];if(an==aj.block||an==aj.blockLimit)break;if(ae.checkElementRemovable(an))al=an;}if(al)ad.breakParent(al);if(ak)V.breakParent(ak);};af();var ag=V;while(!ag.equals(ad)){var ah=ag.getNextSourceNode();if(ag.type==1&&this.checkElementRemovable(ag)){if(ag.getName()==this.element)F(this,ag);else H(ag,N(this)[ag.getName()]);if(ah.type==1&&ah.contains(V)){af();ah=V.getNext();}}ag=ah;}}T.moveToBookmark(U);};function v(T){var U=T.getCommonAncestor(true,true),V=U.getAscendant(this.element,true);V&&!V.isReadOnly()&&K(V,this);};function w(T){var U=T.getCommonAncestor(true,true),V=U.getAscendant(this.element,true);if(!V)return;var W=this,X=W._.definition,Y=X.attributes;if(Y)for(var Z in Y)V.removeAttribute(Z,Y[Z]);if(X.styles)for(var aa in X.styles){if(!X.styles.hasOwnProperty(aa))continue;V.removeStyle(aa);}};function x(T){var U=T.createBookmark(true),V=T.createIterator();V.enforceRealBlocks=true;if(this._.enterMode)V.enlargeBr=this._.enterMode!=2;var W,X=T.document,Y;while(W=V.getNextParagraph()){if(!W.isReadOnly()){var Z=J(this,X,W);z(W,Z);}}T.moveToBookmark(U);};function y(T){var Y=this;var U=T.createBookmark(1),V=T.createIterator();V.enforceRealBlocks=true;V.enlargeBr=Y._.enterMode!=2;var W;while(W=V.getNextParagraph()){if(Y.checkElementRemovable(W))if(W.is('pre')){var X=Y._.enterMode==2?null:T.document.createElement(Y._.enterMode==1?'p':'div');X&&W.copyAttributes(X);z(W,X);}else F(Y,W,1);}T.moveToBookmark(U);};function z(T,U){var V=!U;if(V){U=T.getDocument().createElement('div');T.copyAttributes(U);}var W=U&&U.is('pre'),X=T.is('pre'),Y=W&&!X,Z=!W&&X;if(Y)U=E(T,U);else if(Z)U=D(V?[T.getHtml()]:B(T),U);else T.moveChildren(U);
U.replace(T);if(W)A(U);else if(V)I(U);};function A(T){var U;if(!((U=T.getPrevious(r))&&U.is&&U.is('pre')))return;var V=C(U.getHtml(),/\n$/,'')+'\n\n'+C(T.getHtml(),/^\n/,'');if(c)T.$.outerHTML='<pre>'+V+'</pre>';else T.setHtml(V);U.remove();};function B(T){var U=/(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi,V=T.getName(),W=C(T.getOuterHtml(),U,function(Y,Z,aa){return Z+'</pre>'+aa+'<pre>';}),X=[];W.replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi,function(Y,Z){X.push(Z);});return X;};function C(T,U,V){var W='',X='';T=T.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi,function(Y,Z,aa){Z&&(W=Z);aa&&(X=aa);return '';});return W+T.replace(U,V)+X;};function D(T,U){var V;if(T.length>1)V=new d.documentFragment(U.getDocument());for(var W=0;W<T.length;W++){var X=T[W];X=X.replace(/(\r\n|\r)/g,'\n');X=C(X,/^[ \t]*\n/,'');X=C(X,/\n$/,'');X=C(X,/^[ \t]+|[ \t]+$/g,function(Z,aa,ab){if(Z.length==1)return '&nbsp;';else if(!aa)return e.repeat('&nbsp;',Z.length-1)+' ';else return ' '+e.repeat('&nbsp;',Z.length-1);});X=X.replace(/\n/g,'<br>');X=X.replace(/[ \t]{2,}/g,function(Z){return e.repeat('&nbsp;',Z.length-1)+' ';});if(V){var Y=U.clone();Y.setHtml(X);V.append(Y);}else U.setHtml(X);}return V||U;};function E(T,U){var V=T.getBogus();V&&V.remove();var W=T.getHtml();W=C(W,/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g,'');W=W.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi,'$1');W=W.replace(/([ \t\n\r]+|&nbsp;)/g,' ');W=W.replace(/<br\b[^>]*>/gi,'\n');if(c){var X=T.getDocument().createElement('div');X.append(U);U.$.outerHTML='<pre>'+W+'</pre>';U.copyAttributes(X.getFirst());U=X.getFirst().remove();}else U.setHtml(W);return U;};function F(T,U){var V=T._.definition,W=V.attributes,X=V.styles,Y=N(T)[U.getName()],Z=e.isEmpty(W)&&e.isEmpty(X);for(var aa in W){if((aa=='class'||T._.definition.fullMatch)&&U.getAttribute(aa)!=O(aa,W[aa]))continue;Z=U.hasAttribute(aa);U.removeAttribute(aa);}for(var ab in X){if(T._.definition.fullMatch&&U.getStyle(ab)!=O(ab,X[ab],true))continue;Z=Z||!!U.getStyle(ab);U.removeStyle(ab);}H(U,Y,m[U.getName()]);if(Z)!f.$block[U.getName()]||T._.enterMode==2&&!U.hasAttributes()?I(U):U.renameNode(T._.enterMode==1?'p':'div');};function G(T,U){var V=T._.definition,W=V.attributes,X=V.styles,Y=N(T),Z=U.getElementsByTag(T.element);for(var aa=Z.count();--aa>=0;)F(T,Z.getItem(aa));for(var ab in Y){if(ab!=T.element){Z=U.getElementsByTag(ab);for(aa=Z.count()-1;aa>=0;aa--){var ac=Z.getItem(aa);H(ac,Y[ab]);}}}};function H(T,U,V){var W=U&&U.attributes;
if(W)for(var X=0;X<W.length;X++){var Y=W[X][0],Z;if(Z=T.getAttribute(Y)){var aa=W[X][1];if(aa===null||aa.test&&aa.test(Z)||typeof aa=='string'&&Z==aa)T.removeAttribute(Y);}}if(!V)I(T);};function I(T){if(!T.hasAttributes())if(f.$block[T.getName()]){var U=T.getPrevious(r),V=T.getNext(r);if(U&&(U.type==3||!U.isBlockBoundary({br:1})))T.append('br',1);if(V&&(V.type==3||!V.isBlockBoundary({br:1})))T.append('br');T.remove(true);}else{var W=T.getFirst(),X=T.getLast();T.remove(true);if(W){W.type==1&&W.mergeSiblings();if(X&&!W.equals(X)&&X.type==1)X.mergeSiblings();}}};function J(T,U,V){var W,X=T._.definition,Y=T.element;if(Y=='*')Y='span';W=new h(Y,U);if(V)V.copyAttributes(W);W=K(W,T);if(U.getCustomData('doc_processing_style')&&W.hasAttribute('id'))W.removeAttribute('id');else U.setCustomData('doc_processing_style',1);return W;};function K(T,U){var V=U._.definition,W=V.attributes,X=a.style.getStyleText(V);if(W)for(var Y in W)T.setAttribute(Y,W[Y]);if(X)T.setAttribute('style',X);return T;};function L(T,U){for(var V in T)T[V]=T[V].replace(p,function(W,X){return U[X];});};function M(T){var U=T._AC;if(U)return U;U={};var V=0,W=T.attributes;if(W)for(var X in W){V++;U[X]=W[X];}var Y=a.style.getStyleText(T);if(Y){if(!U.style)V++;U.style=Y;}U._length=V;return T._AC=U;};function N(T){if(T._.overrides)return T._.overrides;var U=T._.overrides={},V=T._.definition.overrides;if(V){if(!e.isArray(V))V=[V];for(var W=0;W<V.length;W++){var X=V[W],Y,Z,aa;if(typeof X=='string')Y=X.toLowerCase();else{Y=X.element?X.element.toLowerCase():T.element;aa=X.attributes;}Z=U[Y]||(U[Y]={});if(aa){var ab=Z.attributes=Z.attributes||[];for(var ac in aa)ab.push([ac.toLowerCase(),aa[ac]]);}}}return U;};function O(T,U,V){var W=new h('span');W[V?'setStyle':'setAttribute'](T,U);return W[V?'getStyle':'getAttribute'](T);};function P(T,U){var V;if(U!==false){var W=new h('span');W.setAttribute('style',T);V=W.getAttribute('style')||'';}else V=T;V=V.replace(/(font-family:)(.*?)(?=;|$)/,function(X,Y,Z){var aa=Z.split(',');for(var ab=0;ab<aa.length;ab++)aa[ab]=e.trim(aa[ab].replace(/["']/g,''));return Y+aa.join(',');});return V.replace(/\s*([;:])\s*/,'$1').replace(/([^\s;])$/,'$1;').replace(/,\s+/g,',').replace(/\"/g,'').toLowerCase();};function Q(T){var U={};T.replace(/&quot;/g,'"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g,function(V,W,X){U[W]=X;});return U;};function R(T,U){typeof T=='string'&&(T=Q(T));typeof U=='string'&&(U=Q(U));for(var V in T){if(!(V in U&&(U[V]==T[V]||T[V]=='inherit'||U[V]=='inherit')))return false;
}return true;};function S(T,U){var V=T.getSelection(),W=V.createBookmarks(1),X=V.getRanges(),Y=U?this.removeFromRange:this.applyToRange,Z,aa=X.createIterator();while(Z=aa.getNextRange())Y.call(this,Z);if(W.length==1&&W[0].collapsed){V.selectRanges(X);T.getById(W[0].startNode).remove();}else V.selectBookmarks(W);T.removeCustomData('doc_processing_style');};})();a.styleCommand=function(m){this.style=m;};a.styleCommand.prototype.exec=function(m){var o=this;m.focus();var n=m.document;if(n)if(o.state==2)o.style.apply(n);else if(o.state==1)o.style.remove(n);return!!n;};a.stylesSet=new a.resourceManager('','stylesSet');a.addStylesSet=e.bind(a.stylesSet.add,a.stylesSet);a.loadStylesSet=function(m,n,o){a.stylesSet.addExternal(m,n,'');a.stylesSet.load(m,o);};a.editor.prototype.getStylesSet=function(m){if(!this._.stylesDefinitions){var n=this,o=n.config.stylesCombo_stylesSet||n.config.stylesSet||'default';if(o instanceof Array){n._.stylesDefinitions=o;m(o);return;}var p=o.split(':'),q=p[0],r=p[1],s=j.registered.styles.path;a.stylesSet.addExternal(q,r?p.slice(1).join(':'):s+'styles/'+q+'.js','');a.stylesSet.load(q,function(t){n._.stylesDefinitions=t[q];m(n._.stylesDefinitions);});}else m(this._.stylesDefinitions);};j.add('domiterator');(function(){function m(s){var t=this;if(arguments.length<1)return;t.range=s;t.forceBrBreak=0;t.enlargeBr=1;t.enforceRealBlocks=0;t._||(t._={});};var n=/^[\r\n\t ]+$/,o=d.walker.bookmark(false,true),p=d.walker.whitespaces(true),q=function(s){return o(s)&&p(s);};function r(s,t,u){var v=s.getNextSourceNode(t,null,u);while(!o(v))v=v.getNextSourceNode(t,null,u);return v;};m.prototype={getNextParagraph:function(s){var S=this;var t,u,v,w,x,y;if(!S._.started){u=S.range.clone();u.shrink(1,true);w=u.endContainer.hasAscendant('pre',true)||u.startContainer.hasAscendant('pre',true);u.enlarge(S.forceBrBreak&&!w||!S.enlargeBr?3:2);if(!u.collapsed){var z=new d.walker(u.clone()),A=d.walker.bookmark(true,true);z.evaluator=A;S._.nextNode=z.next();z=new d.walker(u.clone());z.evaluator=A;var B=z.previous();S._.lastNode=B.getNextSourceNode(true);if(S._.lastNode&&S._.lastNode.type==3&&!e.trim(S._.lastNode.getText())&&S._.lastNode.getParent().isBlockBoundary()){var C=new d.range(u.document);C.moveToPosition(S._.lastNode,4);if(C.checkEndOfBlock()){var D=new d.elementPath(C.endContainer),E=D.block||D.blockLimit;S._.lastNode=E.getNextSourceNode(true);}}if(!S._.lastNode){S._.lastNode=S._.docEndMarker=u.document.createText('');S._.lastNode.insertAfter(B);}u=null;}S._.started=1;
}var F=S._.nextNode;B=S._.lastNode;S._.nextNode=null;while(F){var G=0,H=F.hasAscendant('pre'),I=F.type!=1,J=0;if(!I){var K=F.getName();if(F.isBlockBoundary(S.forceBrBreak&&!H&&{br:1})){if(K=='br')I=1;else if(!u&&!F.getChildCount()&&K!='hr'){t=F;v=F.equals(B);break;}if(u){u.setEndAt(F,3);if(K!='br')S._.nextNode=F;}G=1;}else{if(F.getFirst()){if(!u){u=new d.range(S.range.document);u.setStartAt(F,3);}F=F.getFirst();continue;}I=1;}}else if(F.type==3)if(n.test(F.getText()))I=0;if(I&&!u){u=new d.range(S.range.document);u.setStartAt(F,3);}v=(!G||I)&&F.equals(B);if(u&&!G)while(!F.getNext(q)&&!v){var L=F.getParent();if(L.isBlockBoundary(S.forceBrBreak&&!H&&{br:1})){G=1;I=0;v=v||L.equals(B);u.setEndAt(L,2);break;}F=L;I=1;v=F.equals(B);J=1;}if(I)u.setEndAt(F,4);F=r(F,J,B);v=!F;if(v||G&&u)break;}if(!t){if(!u){S._.docEndMarker&&S._.docEndMarker.remove();S._.nextNode=null;return null;}var M=new d.elementPath(u.startContainer),N=M.blockLimit,O={div:1,th:1,td:1};t=M.block;if(!t&&!S.enforceRealBlocks&&O[N.getName()]&&u.checkStartOfBlock()&&u.checkEndOfBlock())t=N;else if(!t||S.enforceRealBlocks&&t.getName()=='li'){t=S.range.document.createElement(s||'p');u.extractContents().appendTo(t);t.trim();u.insertNode(t);x=y=true;}else if(t.getName()!='li'){if(!u.checkStartOfBlock()||!u.checkEndOfBlock()){t=t.clone(false);u.extractContents().appendTo(t);t.trim();var P=u.splitBlock();x=!P.wasStartOfBlock;y=!P.wasEndOfBlock;u.insertNode(t);}}else if(!v)S._.nextNode=t.equals(B)?null:r(u.getBoundaryNodes().endNode,1,B);}if(x){var Q=t.getPrevious();if(Q&&Q.type==1)if(Q.getName()=='br')Q.remove();else if(Q.getLast()&&Q.getLast().$.nodeName.toLowerCase()=='br')Q.getLast().remove();}if(y){var R=t.getLast();if(R&&R.type==1&&R.getName()=='br')if(c||R.getPrevious(o)||R.getNext(o))R.remove();}if(!S._.nextNode)S._.nextNode=v||t.equals(B)||!B?null:r(t,1,B);return t;}};d.range.prototype.createIterator=function(){return new m(this);};})();j.add('panelbutton',{requires:['button'],onLoad:function(){function m(n){var p=this;var o=p._;if(o.state==0)return;p.createPanel(n);if(o.on){o.panel.hide();return;}o.panel.showBlock(p._.id,p.document.getById(p._.id),4);};k.panelButton=e.createClass({base:k.button,$:function(n){var p=this;var o=n.panel;delete n.panel;p.base(n);p.document=o&&o.parent&&o.parent.getDocument()||a.document;o.block={attributes:o.attributes};p.hasArrow=true;p.click=m;p._={panelDefinition:o};},statics:{handler:{create:function(n){return new k.panelButton(n);}}},proto:{createPanel:function(n){var o=this._;
if(o.panel)return;var p=this._.panelDefinition||{},q=this._.panelDefinition.block,r=p.parent||a.document.getBody(),s=this._.panel=new k.floatPanel(n,r,p),t=s.addBlock(o.id,q),u=this;s.onShow=function(){if(u.className)this.element.getFirst().addClass(u.className+'_panel');u.setState(1);o.on=1;if(u.onOpen)u.onOpen();};s.onHide=function(v){if(u.className)this.element.getFirst().removeClass(u.className+'_panel');u.setState(u.modes&&u.modes[n.mode]?2:0);o.on=0;if(!v&&u.onClose)u.onClose();};s.onEscape=function(){s.hide();u.document.getById(o.id).focus();};if(this.onBlock)this.onBlock(s,t);t.onHide=function(){o.on=0;u.setState(2);};}}});},beforeInit:function(m){m.ui.addHandler('panelbutton',k.panelButton.handler);}});a.UI_PANELBUTTON='panelbutton';j.add('floatpanel',{requires:['panel']});(function(){var m={},n=false;function o(p,q,r,s,t){var u=e.genKey(q.getUniqueId(),r.getUniqueId(),p.skinName,p.lang.dir,p.uiColor||'',s.css||'',t||''),v=m[u];if(!v){v=m[u]=new k.panel(q,s);v.element=r.append(h.createFromHtml(v.renderHtml(p),q));v.element.setStyles({display:'none',position:'absolute'});}return v;};k.floatPanel=e.createClass({$:function(p,q,r,s){r.forceIFrame=1;var t=q.getDocument(),u=o(p,t,q,r,s||0),v=u.element,w=v.getFirst().getFirst();v.disableContextMenu();this.element=v;this._={editor:p,panel:u,parentElement:q,definition:r,document:t,iframe:w,children:[],dir:p.lang.dir};p.on('mode',function(){this.hide();},this);},proto:{addBlock:function(p,q){return this._.panel.addBlock(p,q);},addListBlock:function(p,q){return this._.panel.addListBlock(p,q);},getBlock:function(p){return this._.panel.getBlock(p);},showBlock:function(p,q,r,s,t){var u=this._.panel,v=u.showBlock(p);this.allowBlur(false);n=1;this._.returnFocus=this._.editor.focusManager.hasFocus?this._.editor:new h(a.document.$.activeElement);var w=this.element,x=this._.iframe,y=this._.definition,z=q.getDocumentPosition(w.getDocument()),A=this._.dir=='rtl',B=z.x+(s||0),C=z.y+(t||0);if(A&&(r==1||r==4))B+=q.$.offsetWidth;else if(!A&&(r==2||r==3))B+=q.$.offsetWidth-1;if(r==3||r==4)C+=q.$.offsetHeight-1;this._.panel._.offsetParentId=q.getId();w.setStyles({top:C+'px',left:0,display:''});w.setOpacity(0);w.getFirst().removeStyle('width');if(!this._.blurSet){var D=c?x:new d.window(x.$.contentWindow);a.event.useCapture=true;D.on('blur',function(E){var G=this;if(!G.allowBlur())return;var F=E.data.getTarget();if(F.getName&&F.getName()!='iframe')return;if(G.visible&&!G._.activeChild&&!n){delete G._.returnFocus;G.hide();}},this);
D.on('focus',function(){this._.focused=true;this.hideChild();this.allowBlur(true);},this);a.event.useCapture=false;this._.blurSet=1;}u.onEscape=e.bind(function(E){if(this.onEscape&&this.onEscape(E)===false)return false;},this);e.setTimeout(function(){var E=e.bind(function(){var F=w.getFirst();if(v.autoSize){var G=v.element.$;if(b.gecko||b.opera)G=G.parentNode;if(c)G=G.document.body;var H=G.scrollWidth;if(c&&b.quirks&&H>0)H+=(F.$.offsetWidth||0)-(F.$.clientWidth||0)+3;H+=4;F.setStyle('width',H+'px');v.element.addClass('cke_frameLoaded');var I=v.element.$.scrollHeight;if(c&&b.quirks&&I>0)I+=(F.$.offsetHeight||0)-(F.$.clientHeight||0)+3;F.setStyle('height',I+'px');u._.currentBlock.element.setStyle('display','none').removeStyle('display');}else F.removeStyle('height');if(A)B-=w.$.offsetWidth;w.setStyle('left',B+'px');var J=u.element,K=J.getWindow(),L=w.$.getBoundingClientRect(),M=K.getViewPaneSize(),N=L.width||L.right-L.left,O=L.height||L.bottom-L.top,P=A?L.right:M.width-L.left,Q=A?M.width-L.right:L.left;if(A){if(P<N)if(Q>N)B+=N;else if(M.width>N)B-=L.left;else B=B-L.right+M.width;}else if(P<N)if(Q>N)B-=N;else if(M.width>N)B=B-L.right+M.width;else B-=L.left;var R=M.height-L.top,S=L.top;if(R<O)if(S>O)C-=O;else if(M.height>O)C=C-L.bottom+M.height;else C-=L.top;if(c){var T=new h(w.$.offsetParent),U=T;if(U.getName()=='html')U=U.getDocument().getBody();if(U.getComputedStyle('direction')=='rtl')if(b.ie8Compat)B-=w.getDocument().getDocumentElement().$.scrollLeft*2;else B-=T.$.scrollWidth-T.$.clientWidth;}var V=w.getFirst(),W;if(W=V.getCustomData('activePanel'))W.onHide&&W.onHide.call(this,1);V.setCustomData('activePanel',this);w.setStyles({top:C+'px',left:B+'px'});w.setOpacity(1);},this);u.isLoaded?E():u.onLoad=E;e.setTimeout(function(){x.$.contentWindow.focus();this.allowBlur(true);},0,this);},b.air?200:0,this);this.visible=1;if(this.onShow)this.onShow.call(this);n=0;},hide:function(p){var r=this;if(r.visible&&(!r.onHide||r.onHide.call(r)!==true)){r.hideChild();b.gecko&&r._.iframe.getFrameDocument().$.activeElement.blur();r.element.setStyle('display','none');r.visible=0;r.element.getFirst().removeCustomData('activePanel');var q=p!==false&&r._.returnFocus;if(q){if(b.webkit&&q.type)q.getWindow().$.focus();q.focus();}}},allowBlur:function(p){var q=this._.panel;if(p!=undefined)q.allowBlur=p;return q.allowBlur;},showAsChild:function(p,q,r,s,t,u){if(this._.activeChild==p&&p._.panel._.offsetParentId==r.getId())return;this.hideChild();p.onHide=e.bind(function(){e.setTimeout(function(){if(!this._.focused)this.hide();
},0,this);},this);this._.activeChild=p;this._.focused=false;p.showBlock(q,r,s,t,u);if(b.ie7Compat||b.ie8&&b.ie6Compat)setTimeout(function(){p.element.getChild(0).$.style.cssText+='';},100);},hideChild:function(){var p=this._.activeChild;if(p){delete p.onHide;delete p._.returnFocus;delete this._.activeChild;p.hide();}}}});a.on('instanceDestroyed',function(){var p=e.isEmpty(a.instances);for(var q in m){var r=m[q];if(p)r.destroy();else r.element.hide();}p&&(m={});});})();j.add('menu',{beforeInit:function(m){var n=m.config.menu_groups.split(','),o=m._.menuGroups={},p=m._.menuItems={};for(var q=0;q<n.length;q++)o[n[q]]=q+1;m.addMenuGroup=function(r,s){o[r]=s||100;};m.addMenuItem=function(r,s){if(o[s.group])p[r]=new a.menuItem(this,r,s);};m.addMenuItems=function(r){for(var s in r)this.addMenuItem(s,r[s]);};m.getMenuItem=function(r){return p[r];};m.removeMenuItem=function(r){delete p[r];};},requires:['floatpanel']});(function(){a.menu=e.createClass({$:function(n,o){var r=this;o=r._.definition=o||{};r.id=e.getNextId();r.editor=n;r.items=[];r._.listeners=[];r._.level=o.level||1;var p=e.extend({},o.panel,{css:n.skin.editor.css,level:r._.level-1,block:{}}),q=p.block.attributes=p.attributes||{};!q.role&&(q.role='menu');r._.panelDefinition=p;},_:{onShow:function(){var v=this;var n=v.editor.getSelection();if(c)n&&n.lock();var o=n&&n.getStartElement(),p=v._.listeners,q=[];v.removeAll();for(var r=0;r<p.length;r++){var s=p[r](o,n);if(s)for(var t in s){var u=v.editor.getMenuItem(t);if(u&&(!u.command||v.editor.getCommand(u.command).state)){u.state=s[t];v.add(u);}}}},onClick:function(n){this.hide(false);if(n.onClick)n.onClick();else if(n.command)this.editor.execCommand(n.command);},onEscape:function(n){var o=this.parent;if(o){o._.panel.hideChild();var p=o._.panel._.panel._.currentBlock,q=p._.focusIndex;p._.markItem(q);}else if(n==27)this.hide();return false;},onHide:function(){var o=this;if(c&&!o.parent){var n=o.editor.getSelection();n&&n.unlock(true);}o.onHide&&o.onHide();},showSubMenu:function(n){var v=this;var o=v._.subMenu,p=v.items[n],q=p.getItems&&p.getItems();if(!q){v._.panel.hideChild();return;}var r=v._.panel.getBlock(v.id);r._.focusIndex=n;if(o)o.removeAll();else{o=v._.subMenu=new a.menu(v.editor,e.extend({},v._.definition,{level:v._.level+1},true));o.parent=v;o._.onClick=e.bind(v._.onClick,v);}for(var s in q){var t=v.editor.getMenuItem(s);if(t){t.state=q[s];o.add(t);}}var u=v._.panel.getBlock(v.id).element.getDocument().getById(v.id+String(n));o.show(u,2);}},proto:{add:function(n){if(!n.order)n.order=this.items.length;
this.items.push(n);},removeAll:function(){this.items=[];},show:function(n,o,p,q){if(!this.parent){this._.onShow();if(!this.items.length)return;}o=o||(this.editor.lang.dir=='rtl'?2:1);var r=this.items,s=this.editor,t=this._.panel,u=this._.element;if(!t){t=this._.panel=new k.floatPanel(this.editor,a.document.getBody(),this._.panelDefinition,this._.level);t.onEscape=e.bind(function(F){if(this._.onEscape(F)===false)return false;},this);t.onHide=e.bind(function(){this._.onHide&&this._.onHide();},this);var v=t.addBlock(this.id,this._.panelDefinition.block);v.autoSize=true;var w=v.keys;w[40]='next';w[9]='next';w[38]='prev';w[2228224+9]='prev';w[s.lang.dir=='rtl'?37:39]=c?'mouseup':'click';w[32]=c?'mouseup':'click';c&&(w[13]='mouseup');u=this._.element=v.element;u.addClass(s.skinClass);var x=u.getDocument();x.getBody().setStyle('overflow','hidden');x.getElementsByTag('html').getItem(0).setStyle('overflow','hidden');this._.itemOverFn=e.addFunction(function(F){var G=this;clearTimeout(G._.showSubTimeout);G._.showSubTimeout=e.setTimeout(G._.showSubMenu,s.config.menu_subMenuDelay||400,G,[F]);},this);this._.itemOutFn=e.addFunction(function(F){clearTimeout(this._.showSubTimeout);},this);this._.itemClickFn=e.addFunction(function(F){var H=this;var G=H.items[F];if(G.state==0){H.hide();return;}if(G.getItems)H._.showSubMenu(F);else H._.onClick(G);},this);}m(r);var y=s.container.getChild(1),z=y.hasClass('cke_mixed_dir_content')?' cke_mixed_dir_content':'',A=['<div class="cke_menu'+z+'" role="presentation">'],B=r.length,C=B&&r[0].group;for(var D=0;D<B;D++){var E=r[D];if(C!=E.group){A.push('<div class="cke_menuseparator" role="separator"></div>');C=E.group;}E.render(this,D,A);}A.push('</div>');u.setHtml(A.join(''));k.fire('ready',this);if(this.parent)this.parent._.panel.showAsChild(t,this.id,n,o,p,q);else t.showBlock(this.id,n,o,p,q);s.fire('menuShow',[t]);},addListener:function(n){this._.listeners.push(n);},hide:function(n){var o=this;o._.onHide&&o._.onHide();o._.panel&&o._.panel.hide(n);}}});function m(n){n.sort(function(o,p){if(o.group<p.group)return-1;else if(o.group>p.group)return 1;return o.order<p.order?-1:o.order>p.order?1:0;});};a.menuItem=e.createClass({$:function(n,o,p){var q=this;e.extend(q,p,{order:0,className:'cke_button_'+o});q.group=n._.menuGroups[q.group];q.editor=n;q.name=o;},proto:{render:function(n,o,p){var w=this;var q=n.id+String(o),r=typeof w.state=='undefined'?2:w.state,s=' cke_'+(r==1?'on':r==0?'disabled':'off'),t=w.label;if(w.className)s+=' '+w.className;
var u=w.getItems;p.push('<span class="cke_menuitem'+(w.icon&&w.icon.indexOf('.png')==-1?' cke_noalphafix':'')+'">'+'<a id="',q,'" class="',s,'" href="javascript:void(\'',(w.label||'').replace("'",''),'\')" title="',w.label,'" tabindex="-1"_cke_focus=1 hidefocus="true" role="menuitem"'+(u?'aria-haspopup="true"':'')+(r==0?'aria-disabled="true"':'')+(r==1?'aria-pressed="true"':''));if(b.opera||b.gecko&&b.mac)p.push(' onkeypress="return false;"');if(b.gecko)p.push(' onblur="this.style.cssText = this.style.cssText;"');var v=(w.iconOffset||0)*-16;p.push(' onmouseover="CKEDITOR.tools.callFunction(',n._.itemOverFn,',',o,');" onmouseout="CKEDITOR.tools.callFunction(',n._.itemOutFn,',',o,');" '+(c?'onclick="return false;" onmouseup':'onclick')+'="CKEDITOR.tools.callFunction(',n._.itemClickFn,',',o,'); return false;"><span class="cke_icon_wrapper"><span class="cke_icon"'+(w.icon?' style="background-image:url('+a.getUrl(w.icon)+');background-position:0 '+v+'px;"':'')+'></span></span>'+'<span class="cke_label">');if(u)p.push('<span class="cke_menuarrow">','<span>&#',w.editor.lang.dir=='rtl'?'9668':'9658',';</span>','</span>');p.push(t,'</span></a></span>');}}});})();i.menu_groups='clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div';(function(){var m;j.add('editingblock',{init:function(n){if(!n.config.editingBlock)return;n.on('themeSpace',function(o){if(o.data.space=='contents')o.data.html+='<br>';});n.on('themeLoaded',function(){n.fireOnce('editingBlockReady');});n.on('uiReady',function(){n.setMode(n.config.startupMode);});n.on('afterSetData',function(){if(!m){function o(){m=true;n.getMode().loadData(n.getData());m=false;};if(n.mode)o();else n.on('mode',function(){if(n.mode){o();n.removeListener('mode',arguments.callee);}});}});n.on('beforeGetData',function(){if(!m&&n.mode){m=true;n.setData(n.getMode().getData(),null,1);m=false;}});n.on('getSnapshot',function(o){if(n.mode)o.data=n.getMode().getSnapshotData();});n.on('loadSnapshot',function(o){if(n.mode)n.getMode().loadSnapshotData(o.data);});n.on('mode',function(o){o.removeListener();b.webkit&&n.container.on('focus',function(){n.focus();});if(n.config.startupFocus)n.focus();setTimeout(function(){n.fireOnce('instanceReady');a.fire('instanceReady',null,n);},0);});n.on('destroy',function(){var o=this;if(o.mode)o._.modes[o.mode].unload(o.getThemeSpace('contents'));});}});a.editor.prototype.mode='';a.editor.prototype.addMode=function(n,o){o.name=n;
(this._.modes||(this._.modes={}))[n]=o;};a.editor.prototype.setMode=function(n){this.fire('beforeSetMode',{newMode:n});var o,p=this.getThemeSpace('contents'),q=this.checkDirty();if(this.mode){if(n==this.mode)return;this._.previousMode=this.mode;this.fire('beforeModeUnload');var r=this.getMode();o=r.getData();r.unload(p);this.mode='';}p.setHtml('');var s=this.getMode(n);if(!s)throw '[CKEDITOR.editor.setMode] Unknown mode "'+n+'".';if(!q)this.on('mode',function(){this.resetDirty();this.removeListener('mode',arguments.callee);});s.load(p,typeof o!='string'?this.getData():o);};a.editor.prototype.getMode=function(n){return this._.modes&&this._.modes[n||this.mode];};a.editor.prototype.focus=function(){this.forceNextSelectionCheck();var n=this.getMode();if(n)n.focus();};})();i.startupMode='wysiwyg';i.editingBlock=true;(function(){function m(){var C=this;try{var z=C.getSelection();if(!z||!z.document.getWindow().$)return;var A=z.getStartElement(),B=new d.elementPath(A);if(!B.compare(C._.selectionPreviousPath)){C._.selectionPreviousPath=B;C.fire('selectionChange',{selection:z,path:B,element:A});}}catch(D){}};var n,o;function p(){o=true;if(n)return;q.call(this);n=e.setTimeout(q,200,this);};function q(){n=null;if(o){e.setTimeout(m,0,this);o=false;}};function r(z){function A(E){return E&&E.type==1&&E.getName() in f.$removeEmpty;};function B(E){var F=z.document.getBody();return!E.is('body')&&F.getChildCount()==1;};var C=z.startContainer,D=z.startOffset;if(C.type==3)return false;return!e.trim(C.getHtml())?A(C)||B(C):A(C.getChild(D-1))||A(C.getChild(D));};var s={modes:{wysiwyg:1,source:1},readOnly:c||b.webkit,exec:function(z){switch(z.mode){case 'wysiwyg':z.document.$.execCommand('SelectAll',false,null);z.forceNextSelectionCheck();z.selectionChange();break;case 'source':var A=z.textarea.$;if(c)A.createTextRange().execCommand('SelectAll');else{A.selectionStart=0;A.selectionEnd=A.value.length;}A.focus();}},canUndo:false};function t(z){w(z);var A=z.createText('​');z.setCustomData('cke-fillingChar',A);return A;};function u(z){return z&&z.getCustomData('cke-fillingChar');};function v(z){var A=z&&u(z);if(A)if(A.getCustomData('ready'))w(z);else A.setCustomData('ready',1);};function w(z){var A=z&&z.removeCustomData('cke-fillingChar');if(A){var B,C=z.getSelection().getNative(),D=C&&C.type!='None'&&C.getRangeAt(0);if(A.getLength()>1&&D&&D.intersectsNode(A.$)){B=[C.anchorOffset,C.focusOffset];var E=C.anchorNode==A.$&&C.anchorOffset>0,F=C.focusNode==A.$&&C.focusOffset>0;E&&B[0]--;F&&B[1]--;
x(C)&&B.unshift(B.pop());}A.setText(A.getText().replace(/\u200B/g,''));if(B){var G=C.getRangeAt(0);G.setStart(G.startContainer,B[0]);G.setEnd(G.startContainer,B[1]);C.removeAllRanges();C.addRange(G);}}};function x(z){if(!z.isCollapsed){var A=z.getRangeAt(0);A.setStart(z.anchorNode,z.anchorOffset);A.setEnd(z.focusNode,z.focusOffset);return A.collapsed;}};j.add('selection',{init:function(z){if(b.webkit){z.on('selectionChange',function(){v(z.document);});z.on('beforeSetMode',function(){w(z.document);});var A,B;function C(){var E=z.document,F=u(E);if(F){var G=E.$.defaultView.getSelection();if(G.type=='Caret'&&G.anchorNode==F.$)B=1;A=F.getText();F.setText(A.replace(/\u200B/g,''));}};function D(){var E=z.document,F=u(E);if(F){F.setText(A);if(B){E.$.defaultView.getSelection().setPosition(F.$,F.getLength());B=0;}}};z.on('beforeUndoImage',C);z.on('afterUndoImage',D);z.on('beforeGetData',C,null,null,0);z.on('getData',D);}z.on('contentDom',function(){var E=z.document,F=E.getBody(),G=E.getDocumentElement();if(c){var H,I,J=1;F.on('focusin',function(O){if(O.data.$.srcElement.nodeName!='BODY')return;var P=E.getCustomData('cke_locked_selection');if(P){P.unlock(1);P.lock();}else if(H&&J){try{H.select();}catch(Q){}H=null;}});F.on('focus',function(){I=1;N();});F.on('beforedeactivate',function(O){if(O.data.$.toElement)return;I=0;J=1;});c&&z.on('blur',function(){try{E.$.selection.empty();}catch(O){}});G.on('mousedown',function(){J=0;});G.on('mouseup',function(){J=1;});var K;F.on('mousedown',function(O){if(O.data.$.button==2){var P=z.document.$.selection;if(P.type=='None')K=z.window.getScrollPosition();}M();});F.on('mouseup',function(O){if(O.data.$.button==2&&K){z.document.$.documentElement.scrollLeft=K.x;z.document.$.documentElement.scrollTop=K.y;}K=null;I=1;setTimeout(function(){N(true);},0);});F.on('keydown',M);F.on('keyup',function(){I=1;N();});if((b.ie7Compat||b.ie6Compat)&&E.$.compatMode!='BackCompat'){function L(O,P,Q){try{O.moveToPoint(P,Q);}catch(R){}};G.on('mousedown',function(O){function P(R){R=R.data.$;if(Q){var S=F.$.createTextRange();L(S,R.x,R.y);Q.setEndPoint(Q.compareEndPoints('StartToStart',S)<0?'EndToEnd':'StartToStart',S);Q.select();}};O=O.data.$;if(O.y<G.$.clientHeight&&O.y>F.$.offsetTop+F.$.clientHeight&&O.x<G.$.clientWidth){var Q=F.$.createTextRange();L(Q,O.x,O.y);G.on('mousemove',P);G.on('mouseup',function(R){G.removeListener('mousemove',P);R.removeListener();Q.select();});}});}if(b.ie8)G.on('mouseup',function(O){if(O.data.getTarget().getName()=='html'){var P=a.document.$.selection,Q=P.createRange();
if(P.type!='None'&&Q.parentElement().ownerDocument==E.$)Q.select();}});E.on('selectionchange',N);function M(){I=0;};function N(O){if(I){var P=z.document,Q=z.getSelection(),R=Q&&Q.getNative();if(O&&R&&R.type=='None')if(!P.$.queryCommandEnabled('InsertImage')){e.setTimeout(N,50,this,true);return;}var S;if(R&&R.type&&R.type!='Control'&&(S=R.createRange())&&(S=S.parentElement())&&(S=S.nodeName)&&S.toLowerCase() in {input:1,textarea:1})return;H=R&&Q.getRanges()[0];p.call(z);}};}else{E.on('mouseup',p,z);E.on('keyup',p,z);E.on('selectionchange',p,z);}if(b.webkit)E.on('keydown',function(O){var P=O.data.getKey();switch(P){case 13:case 33:case 34:case 35:case 36:case 37:case 39:case 8:case 45:case 46:w(z.document);}},null,null,10);});z.on('contentDomUnload',z.forceNextSelectionCheck,z);z.addCommand('selectAll',s);z.ui.addButton('SelectAll',{label:z.lang.selectAll,command:'selectAll'});z.selectionChange=function(E){(E?m:p).call(this);};b.ie9Compat&&z.on('destroy',function(){var E=z.getSelection();E&&E.getNative().clear();},null,null,9);}});a.editor.prototype.getSelection=function(){return this.document&&this.document.getSelection();};a.editor.prototype.forceNextSelectionCheck=function(){delete this._.selectionPreviousPath;};g.prototype.getSelection=function(){var z=new d.selection(this);return!z||z.isInvalid?null:z;};a.SELECTION_NONE=1;a.SELECTION_TEXT=2;a.SELECTION_ELEMENT=3;d.selection=function(z){var C=this;var A=z.getCustomData('cke_locked_selection');if(A)return A;C.document=z;C.isLocked=0;C._={cache:{}};if(c)try{var B=C.getNative().createRange();if(!B||B.item&&B.item(0).ownerDocument!=C.document.$||B.parentElement&&B.parentElement().ownerDocument!=C.document.$)throw 0;}catch(D){C.isInvalid=true;}return C;};var y={img:1,hr:1,li:1,table:1,tr:1,td:1,th:1,embed:1,object:1,ol:1,ul:1,a:1,input:1,form:1,select:1,textarea:1,button:1,fieldset:1,thead:1,tfoot:1};d.selection.prototype={getNative:c?function(){return this._.cache.nativeSel||(this._.cache.nativeSel=this.document.$.selection);}:function(){return this._.cache.nativeSel||(this._.cache.nativeSel=this.document.getWindow().$.getSelection());},getType:c?function(){var z=this._.cache;if(z.type)return z.type;var A=1;try{var B=this.getNative(),C=B.type;if(C=='Text')A=2;if(C=='Control')A=3;if(B.createRange().parentElement)A=2;}catch(D){}return z.type=A;}:function(){var z=this._.cache;if(z.type)return z.type;var A=2,B=this.getNative();if(!B)A=1;else if(B.rangeCount==1){var C=B.getRangeAt(0),D=C.startContainer;if(D==C.endContainer&&D.nodeType==1&&C.endOffset-C.startOffset==1&&y[D.childNodes[C.startOffset].nodeName.toLowerCase()])A=3;
}return z.type=A;},getRanges:(function(){var z=c?(function(){function A(C){return new d.node(C).getIndex();};var B=function(C,D){C=C.duplicate();C.collapse(D);var E=C.parentElement(),F=E.ownerDocument;if(!E.hasChildNodes())return{container:E,offset:0};var G=E.children,H,I,J=C.duplicate(),K=0,L=G.length-1,M=-1,N,O,P;while(K<=L){M=Math.floor((K+L)/2);H=G[M];J.moveToElementText(H);N=J.compareEndPoints('StartToStart',C);if(N>0)L=M-1;else if(N<0)K=M+1;else if(b.ie9Compat&&H.tagName=='BR'){var Q=F.defaultView.getSelection();return{container:Q[D?'anchorNode':'focusNode'],offset:Q[D?'anchorOffset':'focusOffset']};}else return{container:E,offset:A(H)};}if(M==-1||M==G.length-1&&N<0){J.moveToElementText(E);J.setEndPoint('StartToStart',C);O=J.text.replace(/(\r\n|\r)/g,'\n').length;G=E.childNodes;if(!O){H=G[G.length-1];if(H.nodeType!=3)return{container:E,offset:G.length};else return{container:H,offset:H.nodeValue.length};}var R=G.length;while(O>0&&R>0){I=G[--R];if(I.nodeType==3){P=I;O-=I.nodeValue.length;}}return{container:P,offset:-O};}else{J.collapse(N>0?true:false);J.setEndPoint(N>0?'StartToStart':'EndToStart',C);O=J.text.replace(/(\r\n|\r)/g,'\n').length;if(!O)return{container:E,offset:A(H)+(N>0?0:1)};while(O>0)try{I=H[N>0?'previousSibling':'nextSibling'];if(I.nodeType==3){O-=I.nodeValue.length;P=I;}H=I;}catch(S){return{container:E,offset:A(H)};}return{container:P,offset:N>0?-O:P.nodeValue.length+O};}};return function(){var M=this;var C=M.getNative(),D=C&&C.createRange(),E=M.getType(),F;if(!C)return[];if(E==2){F=new d.range(M.document);var G=B(D,true);F.setStart(new d.node(G.container),G.offset);G=B(D);F.setEnd(new d.node(G.container),G.offset);if(F.endContainer.getPosition(F.startContainer)&4&&F.endOffset<=F.startContainer.getIndex())F.collapse();return[F];}else if(E==3){var H=[];for(var I=0;I<D.length;I++){var J=D.item(I),K=J.parentNode,L=0;F=new d.range(M.document);for(;L<K.childNodes.length&&K.childNodes[L]!=J;L++){}F.setStart(new d.node(K),L);F.setEnd(new d.node(K),L+1);H.push(F);}return H;}return[];};})():function(){var A=[],B,C=this.document,D=this.getNative();if(!D)return A;if(!D.rangeCount){B=new d.range(C);B.moveToElementEditStart(C.getBody());A.push(B);}for(var E=0;E<D.rangeCount;E++){var F=D.getRangeAt(E);B=new d.range(C);B.setStart(new d.node(F.startContainer),F.startOffset);B.setEnd(new d.node(F.endContainer),F.endOffset);A.push(B);}return A;};return function(A){var B=this._.cache;if(B.ranges&&!A)return B.ranges;else if(!B.ranges)B.ranges=new d.rangeList(z.call(this));
if(A){var C=B.ranges;for(var D=0;D<C.length;D++){var E=C[D],F=E.getCommonAncestor();if(F.isReadOnly())C.splice(D,1);if(E.collapsed)continue;if(E.startContainer.isReadOnly()){var G=E.startContainer;while(G){if(G.is('body')||!G.isReadOnly())break;if(G.type==1&&G.getAttribute('contentEditable')=='false')E.setStartAfter(G);G=G.getParent();}}var H=E.startContainer,I=E.endContainer,J=E.startOffset,K=E.endOffset,L=E.clone();if(H&&H.type==3)if(J>=H.getLength())L.setStartAfter(H);else L.setStartBefore(H);if(I&&I.type==3)if(!K)L.setEndBefore(I);else L.setEndAfter(I);var M=new d.walker(L);M.evaluator=function(N){if(N.type==1&&N.isReadOnly()){var O=E.clone();E.setEndBefore(N);if(E.collapsed)C.splice(D--,1);if(!(N.getPosition(L.endContainer)&16)){O.setStartAfter(N);if(!O.collapsed)C.splice(D+1,0,O);}return true;}return false;};M.next();}}return B.ranges;};})(),getStartElement:function(){var G=this;var z=G._.cache;if(z.startElement!==undefined)return z.startElement;var A,B=G.getNative();switch(G.getType()){case 3:return G.getSelectedElement();case 2:var C=G.getRanges()[0];if(C){if(!C.collapsed){C.optimize();while(1){var D=C.startContainer,E=C.startOffset;if(E==(D.getChildCount?D.getChildCount():D.getLength())&&!D.isBlockBoundary())C.setStartAfter(D);else break;}A=C.startContainer;if(A.type!=1)return A.getParent();A=A.getChild(C.startOffset);if(!A||A.type!=1)A=C.startContainer;else{var F=A.getFirst();while(F&&F.type==1){A=F;F=F.getFirst();}}}else{A=C.startContainer;if(A.type!=1)A=A.getParent();}A=A.$;}}return z.startElement=A?new h(A):null;},getSelectedElement:function(){var z=this._.cache;if(z.selectedElement!==undefined)return z.selectedElement;var A=this,B=e.tryThese(function(){return A.getNative().createRange().item(0);},function(){var C,D,E=A.getRanges()[0],F=E.getCommonAncestor(1,1),G={table:1,ul:1,ol:1,dl:1};for(var H in G){if(C=F.getAscendant(H,1))break;}if(C){var I=new d.range(this.document);I.setStartAt(C,1);I.setEnd(E.startContainer,E.startOffset);var J=e.extend(G,f.$listItem,f.$tableContent),K=new d.walker(I),L=function(M,N){return function(O,P){if(O.type==3&&(!e.trim(O.getText())||O.getParent().data('cke-bookmark')))return true;var Q;if(O.type==1){Q=O.getName();if(Q=='br'&&N&&O.equals(O.getParent().getBogus()))return true;if(P&&Q in J||Q in f.$removeEmpty)return true;}M.halted=1;return false;};};K.guard=L(K);if(K.checkBackward()&&!K.halted){K=new d.walker(I);I.setStart(E.endContainer,E.endOffset);I.setEndAt(C,2);K.guard=L(K,1);if(K.checkForward()&&!K.halted)D=C.$;
}}if(!D)throw 0;return D;},function(){var C=A.getRanges()[0],D,E;for(var F=2;F&&!((D=C.getEnclosedNode())&&D.type==1&&y[D.getName()]&&(E=D));F--)C.shrink(1);return E.$;});return z.selectedElement=B?new h(B):null;},getSelectedText:function(){var z=this._.cache;if(z.selectedText!==undefined)return z.selectedText;var A='',B=this.getNative();if(this.getType()==2)A=c?B.createRange().text:B.toString();return z.selectedText=A;},lock:function(){var z=this;z.getRanges();z.getStartElement();z.getSelectedElement();z.getSelectedText();z._.cache.nativeSel={};z.isLocked=1;z.document.setCustomData('cke_locked_selection',z);},unlock:function(z){var E=this;var A=E.document,B=A.getCustomData('cke_locked_selection');if(B){A.setCustomData('cke_locked_selection',null);if(z){var C=B.getSelectedElement(),D=!C&&B.getRanges();E.isLocked=0;E.reset();if(C)E.selectElement(C);else E.selectRanges(D);}}if(!B||!z){E.isLocked=0;E.reset();}},reset:function(){this._.cache={};},selectElement:function(z){var B=this;if(B.isLocked){var A=new d.range(B.document);A.setStartBefore(z);A.setEndAfter(z);B._.cache.selectedElement=z;B._.cache.startElement=z;B._.cache.ranges=new d.rangeList(A);B._.cache.type=3;return;}A=new d.range(z.getDocument());A.setStartBefore(z);A.setEndAfter(z);A.select();B.document.fire('selectionchange');B.reset();},selectRanges:function(z){var N=this;if(N.isLocked){N._.cache.selectedElement=null;N._.cache.startElement=z[0]&&z[0].getTouchedStartNode();N._.cache.ranges=new d.rangeList(z);N._.cache.type=2;return;}if(c){if(z.length>1){var A=z[z.length-1];z[0].setEnd(A.endContainer,A.endOffset);z.length=1;}if(z[0])z[0].select();N.reset();}else{var B=N.getNative();if(!B)return;if(z.length){B.removeAllRanges();b.webkit&&w(N.document);}for(var C=0;C<z.length;C++){if(C<z.length-1){var D=z[C],E=z[C+1],F=D.clone();F.setStart(D.endContainer,D.endOffset);F.setEnd(E.startContainer,E.startOffset);if(!F.collapsed){F.shrink(1,true);var G=F.getCommonAncestor(),H=F.getEnclosedNode();if(G.isReadOnly()||H&&H.isReadOnly()){E.setStart(D.startContainer,D.startOffset);z.splice(C--,1);continue;}}}var I=z[C],J=N.document.$.createRange(),K=I.startContainer;if(I.collapsed&&(b.opera||b.gecko&&b.version<10900)&&K.type==1&&!K.getChildCount())K.appendText('');if(I.collapsed&&b.webkit&&r(I)){var L=t(N.document);I.insertNode(L);var M=L.getNext();if(M&&!L.getPrevious()&&M.type==1&&M.getName()=='br'){w(N.document);I.moveToPosition(M,3);}else I.moveToPosition(L,4);}J.setStart(I.startContainer.$,I.startOffset);try{J.setEnd(I.endContainer.$,I.endOffset);
}catch(O){if(O.toString().indexOf('NS_ERROR_ILLEGAL_VALUE')>=0){I.collapse(1);J.setEnd(I.endContainer.$,I.endOffset);}else throw O;}B.addRange(J);}N.document.fire('selectionchange');N.reset();}},createBookmarks:function(z){return this.getRanges().createBookmarks(z);},createBookmarks2:function(z){return this.getRanges().createBookmarks2(z);},selectBookmarks:function(z){var A=[];for(var B=0;B<z.length;B++){var C=new d.range(this.document);C.moveToBookmark(z[B]);A.push(C);}this.selectRanges(A);return this;},getCommonAncestor:function(){var z=this.getRanges(),A=z[0].startContainer,B=z[z.length-1].endContainer;return A.getCommonAncestor(B);},scrollIntoView:function(){var z=this.getStartElement();z.scrollIntoView();}};})();(function(){var m=d.walker.whitespaces(true),n=/\ufeff|\u00a0/,o={table:1,tbody:1,tr:1};d.range.prototype.select=c?function(p){var A=this;var q=A.collapsed,r,s,t,u=A.getEnclosedNode();if(u)try{t=A.document.$.body.createControlRange();t.addElement(u.$);t.select();return;}catch(B){}if(A.startContainer.type==1&&A.startContainer.getName() in o||A.endContainer.type==1&&A.endContainer.getName() in o)A.shrink(1,true);var v=A.createBookmark(),w=v.startNode,x;if(!q)x=v.endNode;t=A.document.$.body.createTextRange();t.moveToElementText(w.$);t.moveStart('character',1);if(x){var y=A.document.$.body.createTextRange();y.moveToElementText(x.$);t.setEndPoint('EndToEnd',y);t.moveEnd('character',-1);}else{var z=w.getNext(m);r=!(z&&z.getText&&z.getText().match(n))&&(p||!w.hasPrevious()||w.getPrevious().is&&w.getPrevious().is('br'));s=A.document.createElement('span');s.setHtml('&#65279;');s.insertBefore(w);if(r)A.document.createText('\ufeff').insertBefore(w);}A.setStartBefore(w);w.remove();if(q){if(r){t.moveStart('character',-1);t.select();A.document.$.selection.clear();}else t.select();A.moveToPosition(s,3);s.remove();}else{A.setEndBefore(x);x.remove();t.select();}A.document.fire('selectionchange');}:function(){this.document.getSelection().selectRanges([this]);};})();(function(){var m=a.htmlParser.cssStyle,n=e.cssLength,o=/^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i;function p(r,s){var t=o.exec(r),u=o.exec(s);if(t){if(!t[2]&&u[2]=='px')return u[1];if(t[2]=='px'&&!u[2])return u[1]+'px';}return s;};var q={elements:{$:function(r){var s=r.attributes,t=s&&s['data-cke-realelement'],u=t&&new a.htmlParser.fragment.fromHtml(decodeURIComponent(t)),v=u&&u.children[0];if(v&&r.attributes['data-cke-resizable']){var w=new m(r).rules,x=v.attributes,y=w.width,z=w.height;y&&(x.width=p(x.width,y));
z&&(x.height=p(x.height,z));}return v;}}};j.add('fakeobjects',{requires:['htmlwriter'],afterInit:function(r){var s=r.dataProcessor,t=s&&s.htmlFilter;if(t)t.addRules(q);}});a.editor.prototype.createFakeElement=function(r,s,t,u){var v=this.lang.fakeobjects,w=v[t]||v.unknown,x={'class':s,'data-cke-realelement':encodeURIComponent(r.getOuterHtml()),'data-cke-real-node-type':r.type,alt:w,title:w,align:r.getAttribute('align')||''};if(!b.hc)x.src=a.getUrl('images/spacer.gif');if(t)x['data-cke-real-element-type']=t;if(u){x['data-cke-resizable']=u;var y=new m(),z=r.getAttribute('width'),A=r.getAttribute('height');z&&(y.rules.width=n(z));A&&(y.rules.height=n(A));y.populate(x);}return this.document.createElement('img',{attributes:x});};a.editor.prototype.createFakeParserElement=function(r,s,t,u){var v=this.lang.fakeobjects,w=v[t]||v.unknown,x,y=new a.htmlParser.basicWriter();r.writeHtml(y);x=y.getHtml();var z={'class':s,'data-cke-realelement':encodeURIComponent(x),'data-cke-real-node-type':r.type,alt:w,title:w,align:r.attributes.align||''};if(!b.hc)z.src=a.getUrl('images/spacer.gif');if(t)z['data-cke-real-element-type']=t;if(u){z['data-cke-resizable']=u;var A=r.attributes,B=new m(),C=A.width,D=A.height;C!=undefined&&(B.rules.width=n(C));D!=undefined&&(B.rules.height=n(D));B.populate(z);}return new a.htmlParser.element('img',z);};a.editor.prototype.restoreRealElement=function(r){if(r.data('cke-real-node-type')!=1)return null;var s=h.createFromHtml(decodeURIComponent(r.data('cke-realelement')),this.document);if(r.data('cke-resizable')){var t=r.getStyle('width'),u=r.getStyle('height');t&&s.setAttribute('width',p(s.getAttribute('width'),t));u&&s.setAttribute('height',p(s.getAttribute('height'),u));}return s;};})();j.add('richcombo',{requires:['floatpanel','listblock','button'],beforeInit:function(m){m.ui.addHandler('richcombo',k.richCombo.handler);}});a.UI_RICHCOMBO='richcombo';k.richCombo=e.createClass({$:function(m){var o=this;e.extend(o,m,{title:m.label,modes:{wysiwyg:1}});var n=o.panel||{};delete o.panel;o.id=e.getNextNumber();o.document=n&&n.parent&&n.parent.getDocument()||a.document;n.className=(n.className||'')+' cke_rcombopanel';n.block={multiSelect:n.multiSelect,attributes:n.attributes};o._={panelDefinition:n,items:{},state:2};},statics:{handler:{create:function(m){return new k.richCombo(m);}}},proto:{renderHtml:function(m){var n=[];this.render(m,n);return n.join('');},render:function(m,n){var o=b,p='cke_'+this.id,q=e.addFunction(function(v){var y=this;var w=y._;if(w.state==0)return;
y.createPanel(m);if(w.on){w.panel.hide();return;}y.commit();var x=y.getValue();if(x)w.list.mark(x);else w.list.unmarkAll();w.panel.showBlock(y.id,new h(v),4);},this),r={id:p,combo:this,focus:function(){var v=a.document.getById(p).getChild(1);v.focus();},clickFn:q};function s(){var w=this;var v=w.modes[m.mode]?2:0;w.setState(m.readOnly&&!w.readOnly?0:v);w.setValue('');};m.on('mode',s,this);!this.readOnly&&m.on('readOnly',s,this);var t=e.addFunction(function(v,w){v=new d.event(v);var x=v.getKeystroke();switch(x){case 13:case 32:case 40:e.callFunction(q,w);break;default:r.onkey(r,x);}v.preventDefault();}),u=e.addFunction(function(){r.onfocus&&r.onfocus();});r.keyDownFn=t;n.push('<span class="cke_rcombo" role="presentation">','<span id=',p);if(this.className)n.push(' class="',this.className,' cke_off"');n.push(' role="presentation">','<span id="'+p+'_label" class=cke_label>',this.label,'</span>','<a hidefocus=true title="',this.title,'" tabindex="-1"',o.gecko&&o.version>=10900&&!o.hc?'':" href=\"javascript:void('"+this.label+"')\"",' role="button" aria-labelledby="',p,'_label" aria-describedby="',p,'_text" aria-haspopup="true"');if(b.opera||b.gecko&&b.mac)n.push(' onkeypress="return false;"');if(b.gecko)n.push(' onblur="this.style.cssText = this.style.cssText;"');n.push(' onkeydown="CKEDITOR.tools.callFunction( ',t,', event, this );" onfocus="return CKEDITOR.tools.callFunction(',u,', event);" '+(c?'onclick="return false;" onmouseup':'onclick')+'="CKEDITOR.tools.callFunction(',q,', this); return false;"><span><span id="'+p+'_text" class="cke_text cke_inline_label">'+this.label+'</span>'+'</span>'+'<span class=cke_openbutton><span class=cke_icon>'+(b.hc?'&#9660;':b.air?'&nbsp;':'')+'</span></span>'+'</a>'+'</span>'+'</span>');if(this.onRender)this.onRender();return r;},createPanel:function(m){if(this._.panel)return;var n=this._.panelDefinition,o=this._.panelDefinition.block,p=n.parent||a.document.getBody(),q=new k.floatPanel(m,p,n),r=q.addListBlock(this.id,o),s=this;q.onShow=function(){if(s.className)this.element.getFirst().addClass(s.className+'_panel');s.setState(1);r.focus(!s.multiSelect&&s.getValue());s._.on=1;if(s.onOpen)s.onOpen();};q.onHide=function(t){if(s.className)this.element.getFirst().removeClass(s.className+'_panel');s.setState(s.modes&&s.modes[m.mode]?2:0);s._.on=0;if(!t&&s.onClose)s.onClose();};q.onEscape=function(){q.hide();};r.onClick=function(t,u){s.document.getWindow().focus();if(s.onClick)s.onClick.call(s,t,u);if(u)s.setValue(t,s._.items[t]);
else s.setValue('');q.hide(false);};this._.panel=q;this._.list=r;q.getBlock(this.id).onHide=function(){s._.on=0;s.setState(2);};if(this.init)this.init();},setValue:function(m,n){var p=this;p._.value=m;var o=p.document.getById('cke_'+p.id+'_text');if(o){if(!(m||n)){n=p.label;o.addClass('cke_inline_label');}else o.removeClass('cke_inline_label');o.setHtml(typeof n!='undefined'?n:m);}},getValue:function(){return this._.value||'';},unmarkAll:function(){this._.list.unmarkAll();},mark:function(m){this._.list.mark(m);},hideItem:function(m){this._.list.hideItem(m);},hideGroup:function(m){this._.list.hideGroup(m);},showAll:function(){this._.list.showAll();},add:function(m,n,o){this._.items[m]=o||m;this._.list.add(m,n,o);},startGroup:function(m){this._.list.startGroup(m);},commit:function(){var m=this;if(!m._.committed){m._.list.commit();m._.committed=1;k.fire('ready',m);}m._.committed=1;},setState:function(m){var n=this;if(n._.state==m)return;n.document.getById('cke_'+n.id).setState(m);n._.state=m;}}});k.prototype.addRichCombo=function(m,n){this.add(m,'richcombo',n);};j.add('htmlwriter');a.htmlWriter=e.createClass({base:a.htmlParser.basicWriter,$:function(){var o=this;o.base();o.indentationChars='\t';o.selfClosingEnd=' />';o.lineBreakChars='\n';o.forceSimpleAmpersand=0;o.sortAttributes=1;o._.indent=0;o._.indentation='';o._.inPre=0;o._.rules={};var m=f;for(var n in e.extend({},m.$nonBodyContent,m.$block,m.$listItem,m.$tableContent))o.setRules(n,{indent:1,breakBeforeOpen:1,breakAfterOpen:1,breakBeforeClose:!m[n]['#'],breakAfterClose:1});o.setRules('br',{breakAfterOpen:1});o.setRules('title',{indent:0,breakAfterOpen:0});o.setRules('style',{indent:0,breakBeforeClose:1});o.setRules('pre',{indent:0});},proto:{openTag:function(m,n){var p=this;var o=p._.rules[m];if(p._.indent)p.indentation();else if(o&&o.breakBeforeOpen){p.lineBreak();p.indentation();}p._.output.push('<',m);},openTagClose:function(m,n){var p=this;var o=p._.rules[m];if(n)p._.output.push(p.selfClosingEnd);else{p._.output.push('>');if(o&&o.indent)p._.indentation+=p.indentationChars;}if(o&&o.breakAfterOpen)p.lineBreak();m=='pre'&&(p._.inPre=1);},attribute:function(m,n){if(typeof n=='string'){this.forceSimpleAmpersand&&(n=n.replace(/&amp;/g,'&'));n=e.htmlEncodeAttr(n);}this._.output.push(' ',m,'="',n,'"');},closeTag:function(m){var o=this;var n=o._.rules[m];if(n&&n.indent)o._.indentation=o._.indentation.substr(o.indentationChars.length);if(o._.indent)o.indentation();else if(n&&n.breakBeforeClose){o.lineBreak();o.indentation();
}o._.output.push('</',m,'>');m=='pre'&&(o._.inPre=0);if(n&&n.breakAfterClose)o.lineBreak();},text:function(m){var n=this;if(n._.indent){n.indentation();!n._.inPre&&(m=e.ltrim(m));}n._.output.push(m);},comment:function(m){if(this._.indent)this.indentation();this._.output.push('<!--',m,'-->');},lineBreak:function(){var m=this;if(!m._.inPre&&m._.output.length>0)m._.output.push(m.lineBreakChars);m._.indent=1;},indentation:function(){var m=this;if(!m._.inPre)m._.output.push(m._.indentation);m._.indent=0;},setRules:function(m,n){var o=this._.rules[m];if(o)e.extend(o,n,true);else this._.rules[m]=n;}}});j.add('menubutton',{requires:['button','menu'],beforeInit:function(m){m.ui.addHandler('menubutton',k.menuButton.handler);}});a.UI_MENUBUTTON='menubutton';(function(){var m=function(n){var o=this._;if(o.state===0)return;o.previousState=o.state;var p=o.menu;if(!p){p=o.menu=new a.menu(n,{panel:{className:n.skinClass+' cke_contextmenu',attributes:{'aria-label':n.lang.common.options}}});p.onHide=e.bind(function(){this.setState(this.modes&&this.modes[n.mode]?o.previousState:0);},this);if(this.onMenu)p.addListener(this.onMenu);}if(o.on){p.hide();return;}this.setState(1);p.show(a.document.getById(this._.id),4);};k.menuButton=e.createClass({base:k.button,$:function(n){var o=n.panel;delete n.panel;this.base(n);this.hasArrow=true;this.click=m;},statics:{handler:{create:function(n){return new k.menuButton(n);}}}});})();j.add('dialogui');(function(){var m=function(u){var x=this;x._||(x._={});x._['default']=x._.initValue=u['default']||'';x._.required=u.required||false;var v=[x._];for(var w=1;w<arguments.length;w++)v.push(arguments[w]);v.push(true);e.extend.apply(e,v);return x._;},n={build:function(u,v,w){return new k.dialog.textInput(u,v,w);}},o={build:function(u,v,w){return new k.dialog[v.type](u,v,w);}},p={build:function(u,v,w){var x=v.children,y,z=[],A=[];for(var B=0;B<x.length&&(y=x[B]);B++){var C=[];z.push(C);A.push(a.dialog._.uiElementBuilders[y.type].build(u,y,C));}return new k.dialog[v.type](u,A,z,w,v);}},q={isChanged:function(){return this.getValue()!=this.getInitValue();},reset:function(u){this.setValue(this.getInitValue(),u);},setInitValue:function(){this._.initValue=this.getValue();},resetInitValue:function(){this._.initValue=this._['default'];},getInitValue:function(){return this._.initValue;}},r=e.extend({},k.dialog.uiElement.prototype.eventProcessors,{onChange:function(u,v){if(!this._.domOnChangeRegistered){u.on('load',function(){this.getInputElement().on('change',function(){if(!u.parts.dialog.isVisible())return;
this.fire('change',{value:this.getValue()});},this);},this);this._.domOnChangeRegistered=true;}this.on('change',v);}},true),s=/^on([A-Z]\w+)/,t=function(u){for(var v in u){if(s.test(v)||v=='title'||v=='type')delete u[v];}return u;};e.extend(k.dialog,{labeledElement:function(u,v,w,x){if(arguments.length<4)return;var y=m.call(this,v);y.labelId=e.getNextId()+'_label';var z=this._.children=[],A=function(){var B=[],C=v.required?' cke_required':'';if(v.labelLayout!='horizontal')B.push('<label class="cke_dialog_ui_labeled_label'+C+'" ',' id="'+y.labelId+'"',y.inputId?' for="'+y.inputId+'"':'',(v.labelStyle?' style="'+v.labelStyle+'"':'')+'>',v.label,'</label>','<div class="cke_dialog_ui_labeled_content"'+(v.controlStyle?' style="'+v.controlStyle+'"':'')+' role="presentation">',x.call(this,u,v),'</div>');else{var D={type:'hbox',widths:v.widths,padding:0,children:[{type:'html',html:'<label class="cke_dialog_ui_labeled_label'+C+'"'+' id="'+y.labelId+'"'+' for="'+y.inputId+'"'+(v.labelStyle?' style="'+v.labelStyle+'"':'')+'>'+e.htmlEncode(v.label)+'</span>'},{type:'html',html:'<span class="cke_dialog_ui_labeled_content"'+(v.controlStyle?' style="'+v.controlStyle+'"':'')+'>'+x.call(this,u,v)+'</span>'}]};a.dialog._.uiElementBuilders.hbox.build(u,D,B);}return B.join('');};k.dialog.uiElement.call(this,u,v,w,'div',null,{role:'presentation'},A);},textInput:function(u,v,w){if(arguments.length<3)return;m.call(this,v);var x=this._.inputId=e.getNextId()+'_textInput',y={'class':'cke_dialog_ui_input_'+v.type,id:x,type:v.type},z;if(v.validate)this.validate=v.validate;if(v.maxLength)y.maxlength=v.maxLength;if(v.size)y.size=v.size;if(v.inputStyle)y.style=v.inputStyle;var A=function(){var B=['<div class="cke_dialog_ui_input_',v.type,'" role="presentation"'];if(v.width)B.push('style="width:'+v.width+'" ');B.push('><input ');y['aria-labelledby']=this._.labelId;this._.required&&(y['aria-required']=this._.required);for(var C in y)B.push(C+'="'+y[C]+'" ');B.push(' /></div>');return B.join('');};k.dialog.labeledElement.call(this,u,v,w,A);},textarea:function(u,v,w){if(arguments.length<3)return;m.call(this,v);var x=this,y=this._.inputId=e.getNextId()+'_textarea',z={};if(v.validate)this.validate=v.validate;z.rows=v.rows||5;z.cols=v.cols||20;if(typeof v.inputStyle!='undefined')z.style=v.inputStyle;var A=function(){z['aria-labelledby']=this._.labelId;this._.required&&(z['aria-required']=this._.required);var B=['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea class="cke_dialog_ui_input_textarea" id="',y,'" '];
for(var C in z)B.push(C+'="'+e.htmlEncode(z[C])+'" ');B.push('>',e.htmlEncode(x._['default']),'</textarea></div>');return B.join('');};k.dialog.labeledElement.call(this,u,v,w,A);},checkbox:function(u,v,w){if(arguments.length<3)return;var x=m.call(this,v,{'default':!!v['default']});if(v.validate)this.validate=v.validate;var y=function(){var z=e.extend({},v,{id:v.id?v.id+'_checkbox':e.getNextId()+'_checkbox'},true),A=[],B=e.getNextId()+'_label',C={'class':'cke_dialog_ui_checkbox_input',type:'checkbox','aria-labelledby':B};t(z);if(v['default'])C.checked='checked';if(typeof z.inputStyle!='undefined')z.style=z.inputStyle;x.checkbox=new k.dialog.uiElement(u,z,A,'input',null,C);A.push(' <label id="',B,'" for="',C.id,'"'+(v.labelStyle?' style="'+v.labelStyle+'"':'')+'>',e.htmlEncode(v.label),'</label>');return A.join('');};k.dialog.uiElement.call(this,u,v,w,'span',null,null,y);},radio:function(u,v,w){if(arguments.length<3)return;m.call(this,v);if(!this._['default'])this._['default']=this._.initValue=v.items[0][1];if(v.validate)this.validate=v.valdiate;var x=[],y=this,z=function(){var A=[],B=[],C={'class':'cke_dialog_ui_radio_item','aria-labelledby':this._.labelId},D=v.id?v.id+'_radio':e.getNextId()+'_radio';for(var E=0;E<v.items.length;E++){var F=v.items[E],G=F[2]!==undefined?F[2]:F[0],H=F[1]!==undefined?F[1]:F[0],I=e.getNextId()+'_radio_input',J=I+'_label',K=e.extend({},v,{id:I,title:null,type:null},true),L=e.extend({},K,{title:G},true),M={type:'radio','class':'cke_dialog_ui_radio_input',name:D,value:H,'aria-labelledby':J},N=[];if(y._['default']==H)M.checked='checked';t(K);t(L);if(typeof K.inputStyle!='undefined')K.style=K.inputStyle;x.push(new k.dialog.uiElement(u,K,N,'input',null,M));N.push(' ');new k.dialog.uiElement(u,L,N,'label',null,{id:J,'for':M.id},F[0]);A.push(N.join(''));}new k.dialog.hbox(u,x,A,B);return B.join('');};k.dialog.labeledElement.call(this,u,v,w,z);this._.children=x;},button:function(u,v,w){if(!arguments.length)return;if(typeof v=='function')v=v(u.getParentEditor());m.call(this,v,{disabled:v.disabled||false});a.event.implementOn(this);var x=this;u.on('load',function(A){var B=this.getElement();(function(){B.on('click',function(C){x.fire('click',{dialog:x.getDialog()});C.data.preventDefault();});B.on('keydown',function(C){if(C.data.getKeystroke() in {32:1}){x.click();C.data.preventDefault();}});})();B.unselectable();},this);var y=e.extend({},v);delete y.style;var z=e.getNextId()+'_label';k.dialog.uiElement.call(this,u,y,w,'a',null,{style:v.style,href:'javascript:void(0)',title:v.label,hidefocus:'true','class':v['class'],role:'button','aria-labelledby':z},'<span id="'+z+'" class="cke_dialog_ui_button">'+e.htmlEncode(v.label)+'</span>');
},select:function(u,v,w){if(arguments.length<3)return;var x=m.call(this,v);if(v.validate)this.validate=v.validate;x.inputId=e.getNextId()+'_select';var y=function(){var z=e.extend({},v,{id:v.id?v.id+'_select':e.getNextId()+'_select'},true),A=[],B=[],C={id:x.inputId,'class':'cke_dialog_ui_input_select','aria-labelledby':this._.labelId};if(v.size!=undefined)C.size=v.size;if(v.multiple!=undefined)C.multiple=v.multiple;t(z);for(var D=0,E;D<v.items.length&&(E=v.items[D]);D++)B.push('<option value="',e.htmlEncode(E[1]!==undefined?E[1]:E[0]).replace(/"/g,'&quot;'),'" /> ',e.htmlEncode(E[0]));if(typeof z.inputStyle!='undefined')z.style=z.inputStyle;x.select=new k.dialog.uiElement(u,z,A,'select',null,C,B.join(''));return A.join('');};k.dialog.labeledElement.call(this,u,v,w,y);},file:function(u,v,w){if(arguments.length<3)return;if(v['default']===undefined)v['default']='';var x=e.extend(m.call(this,v),{definition:v,buttons:[]});if(v.validate)this.validate=v.validate;var y=function(){x.frameId=e.getNextId()+'_fileInput';var z=b.isCustomDomain(),A=['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="',x.frameId,'" title="',v.label,'" src="javascript:void('];A.push(z?"(function(){document.open();document.domain='"+document.domain+"';"+'document.close();'+'})()':'0');A.push(')"></iframe>');return A.join('');};u.on('load',function(){var z=a.document.getById(x.frameId),A=z.getParent();A.addClass('cke_dialog_ui_input_file');});k.dialog.labeledElement.call(this,u,v,w,y);},fileButton:function(u,v,w){if(arguments.length<3)return;var x=m.call(this,v),y=this;if(v.validate)this.validate=v.validate;var z=e.extend({},v),A=z.onClick;z.className=(z.className?z.className+' ':'')+'cke_dialog_ui_button';z.onClick=function(B){var C=v['for'];if(!A||A.call(this,B)!==false){u.getContentElement(C[0],C[1]).submit();this.disable();}};u.on('load',function(){u.getContentElement(v['for'][0],v['for'][1])._.buttons.push(y);});k.dialog.button.call(this,u,z,w);},html:(function(){var u=/^\s*<[\w:]+\s+([^>]*)?>/,v=/^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/,w=/\/$/;return function(x,y,z){if(arguments.length<3)return;var A=[],B,C=y.html,D,E;if(C.charAt(0)!='<')C='<span>'+C+'</span>';var F=y.focus;if(F){var G=this.focus;this.focus=function(){G.call(this);typeof F=='function'&&F.call(this);this.fire('focus');};if(y.isFocusable){var H=this.isFocusable;this.isFocusable=H;}this.keyboardFocusable=true;}k.dialog.uiElement.call(this,x,y,A,'span',null,null,'');B=A.join('');
D=B.match(u);E=C.match(v)||['','',''];if(w.test(E[1])){E[1]=E[1].slice(0,-1);E[2]='/'+E[2];}z.push([E[1],' ',D[1]||'',E[2]].join(''));};})(),fieldset:function(u,v,w,x,y){var z=y.label,A=function(){var B=[];z&&B.push('<legend'+(y.labelStyle?' style="'+y.labelStyle+'"':'')+'>'+z+'</legend>');for(var C=0;C<w.length;C++)B.push(w[C]);return B.join('');};this._={children:v};k.dialog.uiElement.call(this,u,y,x,'fieldset',null,null,A);}},true);k.dialog.html.prototype=new k.dialog.uiElement();k.dialog.labeledElement.prototype=e.extend(new k.dialog.uiElement(),{setLabel:function(u){var v=a.document.getById(this._.labelId);if(v.getChildCount()<1)new d.text(u,a.document).appendTo(v);else v.getChild(0).$.nodeValue=u;return this;},getLabel:function(){var u=a.document.getById(this._.labelId);if(!u||u.getChildCount()<1)return '';else return u.getChild(0).getText();},eventProcessors:r},true);k.dialog.button.prototype=e.extend(new k.dialog.uiElement(),{click:function(){var u=this;if(!u._.disabled)return u.fire('click',{dialog:u._.dialog});u.getElement().$.blur();return false;},enable:function(){this._.disabled=false;var u=this.getElement();u&&u.removeClass('cke_disabled');},disable:function(){this._.disabled=true;this.getElement().addClass('cke_disabled');},isVisible:function(){return this.getElement().getFirst().isVisible();},isEnabled:function(){return!this._.disabled;},eventProcessors:e.extend({},k.dialog.uiElement.prototype.eventProcessors,{onClick:function(u,v){this.on('click',function(){this.getElement().focus();v.apply(this,arguments);});}},true),accessKeyUp:function(){this.click();},accessKeyDown:function(){this.focus();},keyboardFocusable:true},true);k.dialog.textInput.prototype=e.extend(new k.dialog.labeledElement(),{getInputElement:function(){return a.document.getById(this._.inputId);},focus:function(){var u=this.selectParentTab();setTimeout(function(){var v=u.getInputElement();v&&v.$.focus();},0);},select:function(){var u=this.selectParentTab();setTimeout(function(){var v=u.getInputElement();if(v){v.$.focus();v.$.select();}},0);},accessKeyUp:function(){this.select();},setValue:function(u){!u&&(u='');return k.dialog.uiElement.prototype.setValue.apply(this,arguments);},keyboardFocusable:true},q,true);k.dialog.textarea.prototype=new k.dialog.textInput();k.dialog.select.prototype=e.extend(new k.dialog.labeledElement(),{getInputElement:function(){return this._.select.getElement();},add:function(u,v,w){var x=new h('option',this.getDialog().getParentEditor().document),y=this.getInputElement().$;
x.$.text=u;x.$.value=v===undefined||v===null?u:v;if(w===undefined||w===null){if(c)y.add(x.$);else y.add(x.$,null);}else y.add(x.$,w);return this;},remove:function(u){var v=this.getInputElement().$;v.remove(u);return this;},clear:function(){var u=this.getInputElement().$;while(u.length>0)u.remove(0);return this;},keyboardFocusable:true},q,true);k.dialog.checkbox.prototype=e.extend(new k.dialog.uiElement(),{getInputElement:function(){return this._.checkbox.getElement();},setValue:function(u,v){this.getInputElement().$.checked=u;!v&&this.fire('change',{value:u});},getValue:function(){return this.getInputElement().$.checked;},accessKeyUp:function(){this.setValue(!this.getValue());},eventProcessors:{onChange:function(u,v){if(!c)return r.onChange.apply(this,arguments);else{u.on('load',function(){var w=this._.checkbox.getElement();w.on('propertychange',function(x){x=x.data.$;if(x.propertyName=='checked')this.fire('change',{value:w.$.checked});},this);},this);this.on('change',v);}return null;}},keyboardFocusable:true},q,true);k.dialog.radio.prototype=e.extend(new k.dialog.uiElement(),{setValue:function(u,v){var w=this._.children,x;for(var y=0;y<w.length&&(x=w[y]);y++)x.getElement().$.checked=x.getValue()==u;!v&&this.fire('change',{value:u});},getValue:function(){var u=this._.children;for(var v=0;v<u.length;v++){if(u[v].getElement().$.checked)return u[v].getValue();}return null;},accessKeyUp:function(){var u=this._.children,v;for(v=0;v<u.length;v++){if(u[v].getElement().$.checked){u[v].getElement().focus();return;}}u[0].getElement().focus();},eventProcessors:{onChange:function(u,v){if(!c)return r.onChange.apply(this,arguments);else{u.on('load',function(){var w=this._.children,x=this;for(var y=0;y<w.length;y++){var z=w[y].getElement();z.on('propertychange',function(A){A=A.data.$;if(A.propertyName=='checked'&&this.$.checked)x.fire('change',{value:this.getAttribute('value')});});}},this);this.on('change',v);}return null;}},keyboardFocusable:true},q,true);k.dialog.file.prototype=e.extend(new k.dialog.labeledElement(),q,{getInputElement:function(){var u=a.document.getById(this._.frameId).getFrameDocument();return u.$.forms.length>0?new h(u.$.forms[0].elements[0]):this.getElement();},submit:function(){this.getInputElement().getParent().$.submit();return this;},getAction:function(){return this.getInputElement().getParent().$.action;},registerEvents:function(u){var v=/^on([A-Z]\w+)/,w,x=function(z,A,B,C){z.on('formLoaded',function(){z.getInputElement().on(B,C,z);});};for(var y in u){if(!(w=y.match(v)))continue;
if(this.eventProcessors[y])this.eventProcessors[y].call(this,this._.dialog,u[y]);else x(this,this._.dialog,w[1].toLowerCase(),u[y]);}return this;},reset:function(){var u=this._,v=a.document.getById(u.frameId),w=v.getFrameDocument(),x=u.definition,y=u.buttons,z=this.formLoadedNumber,A=this.formUnloadNumber,B=u.dialog._.editor.lang.dir,C=u.dialog._.editor.langCode;if(!z){z=this.formLoadedNumber=e.addFunction(function(){this.fire('formLoaded');},this);A=this.formUnloadNumber=e.addFunction(function(){this.getInputElement().clearCustomData();},this);this.getDialog()._.editor.on('destroy',function(){e.removeFunction(z);e.removeFunction(A);});}function D(){w.$.open();if(b.isCustomDomain())w.$.domain=document.domain;var E='';if(x.size)E=x.size-(c?7:0);var F=u.frameId+'_input';w.$.write(['<html dir="'+B+'" lang="'+C+'"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">','<form enctype="multipart/form-data" method="POST" dir="'+B+'" lang="'+C+'" action="',e.htmlEncode(x.action),'">','<label id="',u.labelId,'" for="',F,'" style="display:none">',e.htmlEncode(x.label),'</label>','<input id="',F,'" aria-labelledby="',u.labelId,'" type="file" name="',e.htmlEncode(x.id||'cke_upload'),'" size="',e.htmlEncode(E>0?E:''),'" />','</form>','</body></html>','<script>window.parent.CKEDITOR.tools.callFunction('+z+');','window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction('+A+')}</script>'].join(''));w.$.close();for(var G=0;G<y.length;G++)y[G].enable();};if(b.gecko)setTimeout(D,500);else D();},getValue:function(){return this.getInputElement().$.value||'';},setInitValue:function(){this._.initValue='';},eventProcessors:{onChange:function(u,v){if(!this._.domOnChangeRegistered){this.on('formLoaded',function(){this.getInputElement().on('change',function(){this.fire('change',{value:this.getValue()});},this);},this);this._.domOnChangeRegistered=true;}this.on('change',v);}},keyboardFocusable:true},true);k.dialog.fileButton.prototype=new k.dialog.button();k.dialog.fieldset.prototype=e.clone(k.dialog.hbox.prototype);a.dialog.addUIElement('text',n);a.dialog.addUIElement('password',n);a.dialog.addUIElement('textarea',o);a.dialog.addUIElement('checkbox',o);a.dialog.addUIElement('radio',o);a.dialog.addUIElement('button',o);a.dialog.addUIElement('select',o);a.dialog.addUIElement('file',o);a.dialog.addUIElement('fileButton',o);a.dialog.addUIElement('html',o);a.dialog.addUIElement('fieldset',p);})();j.add('panel',{beforeInit:function(m){m.ui.addHandler('panel',k.panel.handler);
}});a.UI_PANEL='panel';k.panel=function(m,n){var o=this;if(n)e.extend(o,n);e.extend(o,{className:'',css:[]});o.id=e.getNextId();o.document=m;o._={blocks:{}};};k.panel.handler={create:function(m){return new k.panel(m);}};k.panel.prototype={renderHtml:function(m){var n=[];this.render(m,n);return n.join('');},render:function(m,n){var p=this;var o=p.id;n.push('<div class="',m.skinClass,'" lang="',m.langCode,'" role="presentation" style="display:none;z-index:'+(m.config.baseFloatZIndex+1)+'">'+'<div'+' id=',o,' dir=',m.lang.dir,' role="presentation" class="cke_panel cke_',m.lang.dir);if(p.className)n.push(' ',p.className);n.push('">');if(p.forceIFrame||p.css.length){n.push('<iframe id="',o,'_frame" frameborder="0" role="application" src="javascript:void(');n.push(b.isCustomDomain()?"(function(){document.open();document.domain='"+document.domain+"';"+'document.close();'+'})()':'0');n.push(')"></iframe>');}n.push('</div></div>');return o;},getHolderElement:function(){var m=this._.holder;if(!m){if(this.forceIFrame||this.css.length){var n=this.document.getById(this.id+'_frame'),o=n.getParent(),p=o.getAttribute('dir'),q=o.getParent().getAttribute('class'),r=o.getParent().getAttribute('lang'),s=n.getFrameDocument();b.iOS&&o.setStyles({overflow:'scroll','-webkit-overflow-scrolling':'touch'});var t=e.addFunction(e.bind(function(w){this.isLoaded=true;if(this.onLoad)this.onLoad();},this)),u='<!DOCTYPE html><html dir="'+p+'" class="'+q+'_container" lang="'+r+'">'+'<head>'+'<style>.'+q+'_container{visibility:hidden}</style>'+e.buildStyleHtml(this.css)+'</head>'+'<body class="cke_'+p+' cke_panel_frame '+b.cssClass+'" style="margin:0;padding:0"'+' onload="( window.CKEDITOR || window.parent.CKEDITOR ).tools.callFunction('+t+');"></body>'+'</html>';s.write(u);var v=s.getWindow();v.$.CKEDITOR=a;s.on('key'+(b.opera?'press':'down'),function(w){var z=this;var x=w.data.getKeystroke(),y=z.document.getById(z.id).getAttribute('dir');if(z._.onKeyDown&&z._.onKeyDown(x)===false){w.data.preventDefault();return;}if(x==27||x==(y=='rtl'?39:37))if(z.onEscape&&z.onEscape(x)===false)w.data.preventDefault();},this);m=s.getBody();m.unselectable();b.air&&e.callFunction(t);}else m=this.document.getById(this.id);this._.holder=m;}return m;},addBlock:function(m,n){var o=this;n=o._.blocks[m]=n instanceof k.panel.block?n:new k.panel.block(o.getHolderElement(),n);if(!o._.currentBlock)o.showBlock(m);return n;},getBlock:function(m){return this._.blocks[m];},showBlock:function(m){var r=this;var n=r._.blocks,o=n[m],p=r._.currentBlock,q=!r.forceIFrame||c?r._.holder:r.document.getById(r.id+'_frame');
if(p){q.removeAttributes(p.attributes);p.hide();}r._.currentBlock=o;q.setAttributes(o.attributes);a.fire('ariaWidget',q);o._.focusIndex=-1;r._.onKeyDown=o.onKeyDown&&e.bind(o.onKeyDown,o);o.show();return o;},destroy:function(){this.element&&this.element.remove();}};k.panel.block=e.createClass({$:function(m,n){var o=this;o.element=m.append(m.getDocument().createElement('div',{attributes:{tabIndex:-1,'class':'cke_panel_block',role:'presentation'},styles:{display:'none'}}));if(n)e.extend(o,n);if(!o.attributes.title)o.attributes.title=o.attributes['aria-label'];o.keys={};o._.focusIndex=-1;o.element.disableContextMenu();},_:{markItem:function(m){var p=this;if(m==-1)return;var n=p.element.getElementsByTag('a'),o=n.getItem(p._.focusIndex=m);if(b.webkit||b.opera)o.getDocument().getWindow().focus();o.focus();p.onMark&&p.onMark(o);}},proto:{show:function(){this.element.setStyle('display','');},hide:function(){var m=this;if(!m.onHide||m.onHide.call(m)!==true)m.element.setStyle('display','none');},onKeyDown:function(m){var r=this;var n=r.keys[m];switch(n){case 'next':var o=r._.focusIndex,p=r.element.getElementsByTag('a'),q;while(q=p.getItem(++o)){if(q.getAttribute('_cke_focus')&&q.$.offsetWidth){r._.focusIndex=o;q.focus();break;}}return false;case 'prev':o=r._.focusIndex;p=r.element.getElementsByTag('a');while(o>0&&(q=p.getItem(--o))){if(q.getAttribute('_cke_focus')&&q.$.offsetWidth){r._.focusIndex=o;q.focus();break;}}return false;case 'click':case 'mouseup':o=r._.focusIndex;q=o>=0&&r.element.getElementsByTag('a').getItem(o);if(q)q.$[n]?q.$[n]():q.$['on'+n]();return false;}return true;}}});j.add('listblock',{requires:['panel'],onLoad:function(){k.panel.prototype.addListBlock=function(m,n){return this.addBlock(m,new k.listBlock(this.getHolderElement(),n));};k.listBlock=e.createClass({base:k.panel.block,$:function(m,n){var q=this;n=n||{};var o=n.attributes||(n.attributes={});(q.multiSelect=!!n.multiSelect)&&(o['aria-multiselectable']=true);!o.role&&(o.role='listbox');q.base.apply(q,arguments);var p=q.keys;p[40]='next';p[9]='next';p[38]='prev';p[2228224+9]='prev';p[32]=c?'mouseup':'click';c&&(p[13]='mouseup');q._.pendingHtml=[];q._.items={};q._.groups={};},_:{close:function(){if(this._.started){this._.pendingHtml.push('</ul>');delete this._.started;}},getClick:function(){if(!this._.click)this._.click=e.addFunction(function(m){var o=this;var n=true;if(o.multiSelect)n=o.toggle(m);else o.mark(m);if(o.onClick)o.onClick(m,n);},this);return this._.click;}},proto:{add:function(m,n,o){var r=this;
var p=r._.pendingHtml,q=e.getNextId();if(!r._.started){p.push('<ul role="presentation" class=cke_panel_list>');r._.started=1;r._.size=r._.size||0;}r._.items[m]=q;p.push('<li id=',q,' class=cke_panel_listItem role=presentation><a id="',q,'_option" _cke_focus=1 hidefocus=true title="',o||m,'" href="javascript:void(\'',m,"')\" "+(c?'onclick="return false;" onmouseup':'onclick')+'="CKEDITOR.tools.callFunction(',r._.getClick(),",'",m,"'); return false;\"",' role="option">',n||m,'</a></li>');},startGroup:function(m){this._.close();var n=e.getNextId();this._.groups[m]=n;this._.pendingHtml.push('<h1 role="presentation" id=',n,' class=cke_panel_grouptitle>',m,'</h1>');},commit:function(){var m=this;m._.close();m.element.appendHtml(m._.pendingHtml.join(''));delete m._.size;m._.pendingHtml=[];},toggle:function(m){var n=this.isMarked(m);if(n)this.unmark(m);else this.mark(m);return!n;},hideGroup:function(m){var n=this.element.getDocument().getById(this._.groups[m]),o=n&&n.getNext();if(n){n.setStyle('display','none');if(o&&o.getName()=='ul')o.setStyle('display','none');}},hideItem:function(m){this.element.getDocument().getById(this._.items[m]).setStyle('display','none');},showAll:function(){var m=this._.items,n=this._.groups,o=this.element.getDocument();for(var p in m)o.getById(m[p]).setStyle('display','');for(var q in n){var r=o.getById(n[q]),s=r.getNext();r.setStyle('display','');if(s&&s.getName()=='ul')s.setStyle('display','');}},mark:function(m){var p=this;if(!p.multiSelect)p.unmarkAll();var n=p._.items[m],o=p.element.getDocument().getById(n);o.addClass('cke_selected');p.element.getDocument().getById(n+'_option').setAttribute('aria-selected',true);p.onMark&&p.onMark(o);},unmark:function(m){var q=this;var n=q.element.getDocument(),o=q._.items[m],p=n.getById(o);p.removeClass('cke_selected');n.getById(o+'_option').removeAttribute('aria-selected');q.onUnmark&&q.onUnmark(p);},unmarkAll:function(){var q=this;var m=q._.items,n=q.element.getDocument();for(var o in m){var p=m[o];n.getById(p).removeClass('cke_selected');n.getById(p+'_option').removeAttribute('aria-selected');}q.onUnmark&&q.onUnmark();},isMarked:function(m){return this.element.getDocument().getById(this._.items[m]).hasClass('cke_selected');},focus:function(m){this._.focusIndex=-1;if(m){var n=this.element.getDocument().getById(this._.items[m]).getFirst(),o=this.element.getElementsByTag('a'),p,q=-1;while(p=o.getItem(++q)){if(p.equals(n)){this._.focusIndex=q;break;}}setTimeout(function(){n.focus();},0);}}}});}});a.themes.add('default',(function(){var m={};
function n(o,p){var q,r;r=o.config.sharedSpaces;r=r&&r[p];r=r&&a.document.getById(r);if(r){var s='<span class="cke_shared " dir="'+o.lang.dir+'"'+'>'+'<span class="'+o.skinClass+' '+o.id+' cke_editor_'+o.name+'">'+'<span class="'+b.cssClass+'">'+'<span class="cke_wrapper cke_'+o.lang.dir+'">'+'<span class="cke_editor">'+'<div class="cke_'+p+'">'+'</div></span></span></span></span></span>',t=r.append(h.createFromHtml(s,r.getDocument()));if(r.getCustomData('cke_hasshared'))t.hide();else r.setCustomData('cke_hasshared',1);q=t.getChild([0,0,0,0]);!o.sharedSpaces&&(o.sharedSpaces={});o.sharedSpaces[p]=q;o.on('focus',function(){for(var u=0,v,w=r.getChildren();v=w.getItem(u);u++){if(v.type==1&&!v.equals(t)&&v.hasClass('cke_shared'))v.hide();}t.show();});o.on('destroy',function(){t.remove();});}return q;};return{build:function(o,p){var q=o.name,r=o.element,s=o.elementMode;if(!r||s==0)return;if(s==1)r.hide();var t=o.fire('themeSpace',{space:'top',html:''}).html,u=o.fire('themeSpace',{space:'contents',html:''}).html,v=o.fireOnce('themeSpace',{space:'bottom',html:''}).html,w=u&&o.config.height,x=o.config.tabIndex||o.element.getAttribute('tabindex')||0;if(!u)w='auto';else if(!isNaN(w))w+='px';var y='',z=o.config.width;if(z){if(!isNaN(z))z+='px';y+='width: '+z+';';}var A=t&&n(o,'top'),B=n(o,'bottom');A&&(A.setHtml(t),t='');B&&(B.setHtml(v),v='');var C='<style>.'+o.skinClass+'{visibility:hidden;}</style>';if(m[o.skinClass])C='';else m[o.skinClass]=1;var D=h.createFromHtml(['<span id="cke_',q,'" class="',o.skinClass,' ',o.id,' cke_editor_',q,'" dir="',o.lang.dir,'" title="',b.gecko?' ':'','" lang="',o.langCode,'"'+(b.webkit?' tabindex="'+x+'"':'')+' role="application"'+' aria-labelledby="cke_',q,'_arialbl"'+(y?' style="'+y+'"':'')+'>'+'<span id="cke_',q,'_arialbl" class="cke_voice_label">'+o.lang.editor+'</span>'+'<span class="',b.cssClass,'" role="presentation"><span class="cke_wrapper cke_',o.lang.dir,'" role="presentation"><table class="cke_editor" border="0" cellspacing="0" cellpadding="0" role="presentation"><tbody><tr',t?'':' style="display:none"',' role="presentation"><td id="cke_top_',q,'" class="cke_top" role="presentation">',t,'</td></tr><tr',u?'':' style="display:none"',' role="presentation"><td id="cke_contents_',q,'" class="cke_contents" style="height:',w,'" role="presentation">',u,'</td></tr><tr',v?'':' style="display:none"',' role="presentation"><td id="cke_bottom_',q,'" class="cke_bottom" role="presentation">',v,'</td></tr></tbody></table>'+C+'</span>'+'</span>'+'</span>'].join(''));
D.getChild([1,0,0,0,0]).unselectable();D.getChild([1,0,0,0,2]).unselectable();if(s==1)D.insertAfter(r);else r.append(D);o.container=D;D.disableContextMenu();o.on('contentDirChanged',function(E){var F=(o.lang.dir!=E.data?'add':'remove')+'Class';D.getChild(1)[F]('cke_mixed_dir_content');var G=this.sharedSpaces&&this.sharedSpaces[this.config.toolbarLocation];G&&G.getParent().getParent()[F]('cke_mixed_dir_content');});o.fireOnce('themeLoaded');o.fireOnce('uiReady');},buildDialog:function(o){var p=e.getNextNumber(),q=h.createFromHtml(['<div class="',o.id,'_dialog cke_editor_',o.name.replace('.','\\.'),'_dialog cke_skin_',o.skinName,'" dir="',o.lang.dir,'" lang="',o.langCode,'" role="dialog" aria-labelledby="%title#"><table class="cke_dialog',' '+b.cssClass,' cke_',o.lang.dir,'" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="%body" role="presentation"><div id="%title#" class="%title" role="presentation"></div><a id="%close_button#" class="%close_button" href="javascript:void(0)" title="'+o.lang.common.close+'" role="button"><span class="cke_label">X</span></a>'+'<div id="%tabs#" class="%tabs" role="tablist"></div>'+'<table class="%contents" role="presentation">'+'<tr>'+'<td id="%contents#" class="%contents" role="presentation"></td>'+'</tr>'+'<tr>'+'<td id="%footer#" class="%footer" role="presentation"></td>'+'</tr>'+'</table>'+'</div>'+'<div id="%tl#" class="%tl"></div>'+'<div id="%tc#" class="%tc"></div>'+'<div id="%tr#" class="%tr"></div>'+'<div id="%ml#" class="%ml"></div>'+'<div id="%mr#" class="%mr"></div>'+'<div id="%bl#" class="%bl"></div>'+'<div id="%bc#" class="%bc"></div>'+'<div id="%br#" class="%br"></div>'+'</td></tr>'+'</table>',c?'':'<style>.cke_dialog{visibility:hidden;}</style>','</div>'].join('').replace(/#/g,'_'+p).replace(/%/g,'cke_dialog_')),r=q.getChild([0,0,0,0,0]),s=r.getChild(0),t=r.getChild(1);if(c&&!b.ie6Compat){var u=b.isCustomDomain(),v='javascript:void(function(){'+encodeURIComponent('document.open();'+(u?'document.domain="'+document.domain+'";':'')+'document.close();')+'}())',w=h.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="'+v+'"'+' tabIndex="-1"'+'></iframe>');w.appendTo(r.getParent());}s.unselectable();t.unselectable();return{element:q,parts:{dialog:q.getChild(0),title:s,close:t,tabs:r.getChild(2),contents:r.getChild([3,0,0,0]),footer:r.getChild([3,0,1,0])}};},destroy:function(o){var p=o.container,q=o.element;if(p){p.clearCustomData();p.remove();}if(q){q.clearCustomData();
o.elementMode==1&&q.show();delete o.element;}}};})());a.editor.prototype.getThemeSpace=function(m){var n='cke_'+m,o=this._[n]||(this._[n]=a.document.getById(n+'_'+this.name));return o;};a.editor.prototype.resize=function(m,n,o,p){var v=this;var q=v.container,r=a.document.getById('cke_contents_'+v.name),s=b.webkit&&v.document&&v.document.getWindow().$.frameElement,t=p?q.getChild(1):q;t.setSize('width',m,true);s&&(s.style.width='1%');var u=o?0:(t.$.offsetHeight||0)-(r.$.clientHeight||0);r.setStyle('height',Math.max(n-u,0)+'px');s&&(s.style.width='100%');v.fire('resize');};a.editor.prototype.getResizable=function(m){return m?a.document.getById('cke_contents_'+this.name):this.container;};})();
(function() {


}).call(this);
/* ==========================================================
 * bootstrap-carousel.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide')

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (typeof option == 'string' || (option = options.slide)) data[option]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 10000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function ( e ) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $(target).collapse(option)
    })
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#dropdowns
 * ============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
        }
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $('.dropdown-backdrop').remove()
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: button.js v3.0.3
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')
    var changed = true

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') === 'radio') {
        // see if clicking on current one
        if ($input.prop('checked') && this.$element.hasClass('active'))
          changed = false
        else
          $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);
$(document).ready(function() {
   if ($('#active_admin_content textarea').length > 0) {       
     var data = $('textarea');
     $.each(data, function(i) {
       CKEDITOR.replace(data[i].id);
     });     
   }  
});
/* ========================================================================
 * Bootstrap: collapse.js v3.0.3
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: dropdown.js v3.0.3
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);
/*! jQuery UI - v1.10.3 - 2013-05-03
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.ui.effect.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js, jquery.ui.menu.js, jquery.ui.position.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */

(function(t,e){function i(e,i){var n,o,a,r=e.nodeName.toLowerCase();return"area"===r?(n=e.parentNode,o=n.name,e.href&&o&&"map"===n.nodeName.toLowerCase()?(a=t("img[usemap=#"+o+"]")[0],!!a&&s(a)):!1):(/input|select|textarea|button|object/.test(r)?!e.disabled:"a"===r?e.href||i:i)&&s(e)}function s(e){return t.expr.filters.visible(e)&&!t(e).parents().addBack().filter(function(){return"hidden"===t.css(this,"visibility")}).length}var n=0,o=/^ui-id-\d+$/;t.ui=t.ui||{},t.extend(t.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),t.fn.extend({focus:function(e){return function(i,s){return"number"==typeof i?this.each(function(){var e=this;setTimeout(function(){t(e).focus(),s&&s.call(e)},i)}):e.apply(this,arguments)}}(t.fn.focus),scrollParent:function(){var e;return e=t.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(t.css(this,"position"))&&/(auto|scroll)/.test(t.css(this,"overflow")+t.css(this,"overflow-y")+t.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(t.css(this,"overflow")+t.css(this,"overflow-y")+t.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!e.length?t(document):e},zIndex:function(i){if(i!==e)return this.css("zIndex",i);if(this.length)for(var s,n,o=t(this[0]);o.length&&o[0]!==document;){if(s=o.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(n=parseInt(o.css("zIndex"),10),!isNaN(n)&&0!==n))return n;o=o.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++n)})},removeUniqueId:function(){return this.each(function(){o.test(this.id)&&t(this).removeAttr("id")})}}),t.extend(t.expr[":"],{data:t.expr.createPseudo?t.expr.createPseudo(function(e){return function(i){return!!t.data(i,e)}}):function(e,i,s){return!!t.data(e,s[3])},focusable:function(e){return i(e,!isNaN(t.attr(e,"tabindex")))},tabbable:function(e){var s=t.attr(e,"tabindex"),n=isNaN(s);return(n||s>=0)&&i(e,!n)}}),t("<a>").outerWidth(1).jquery||t.each(["Width","Height"],function(i,s){function n(e,i,s,n){return t.each(o,function(){i-=parseFloat(t.css(e,"padding"+this))||0,s&&(i-=parseFloat(t.css(e,"border"+this+"Width"))||0),n&&(i-=parseFloat(t.css(e,"margin"+this))||0)}),i}var o="Width"===s?["Left","Right"]:["Top","Bottom"],a=s.toLowerCase(),r={innerWidth:t.fn.innerWidth,innerHeight:t.fn.innerHeight,outerWidth:t.fn.outerWidth,outerHeight:t.fn.outerHeight};t.fn["inner"+s]=function(i){return i===e?r["inner"+s].call(this):this.each(function(){t(this).css(a,n(this,i)+"px")})},t.fn["outer"+s]=function(e,i){return"number"!=typeof e?r["outer"+s].call(this,e):this.each(function(){t(this).css(a,n(this,e,!0,i)+"px")})}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(t.fn.removeData=function(e){return function(i){return arguments.length?e.call(this,t.camelCase(i)):e.call(this)}}(t.fn.removeData)),t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),t.support.selectstart="onselectstart"in document.createElement("div"),t.fn.extend({disableSelection:function(){return this.bind((t.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(t){t.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),t.extend(t.ui,{plugin:{add:function(e,i,s){var n,o=t.ui[e].prototype;for(n in s)o.plugins[n]=o.plugins[n]||[],o.plugins[n].push([i,s[n]])},call:function(t,e,i){var s,n=t.plugins[e];if(n&&t.element[0].parentNode&&11!==t.element[0].parentNode.nodeType)for(s=0;n.length>s;s++)t.options[n[s][0]]&&n[s][1].apply(t.element,i)}},hasScroll:function(e,i){if("hidden"===t(e).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return e[s]>0?!0:(e[s]=1,n=e[s]>0,e[s]=0,n)}})})(jQuery),function(t,e){var i=0,s=Array.prototype.slice,n=t.cleanData;t.cleanData=function(e){for(var i,s=0;null!=(i=e[s]);s++)try{t(i).triggerHandler("remove")}catch(o){}n(e)},t.widget=function(i,s,n){var o,a,r,h,l={},c=i.split(".")[0];i=i.split(".")[1],o=c+"-"+i,n||(n=s,s=t.Widget),t.expr[":"][o.toLowerCase()]=function(e){return!!t.data(e,o)},t[c]=t[c]||{},a=t[c][i],r=t[c][i]=function(t,i){return this._createWidget?(arguments.length&&this._createWidget(t,i),e):new r(t,i)},t.extend(r,a,{version:n.version,_proto:t.extend({},n),_childConstructors:[]}),h=new s,h.options=t.widget.extend({},h.options),t.each(n,function(i,n){return t.isFunction(n)?(l[i]=function(){var t=function(){return s.prototype[i].apply(this,arguments)},e=function(t){return s.prototype[i].apply(this,t)};return function(){var i,s=this._super,o=this._superApply;return this._super=t,this._superApply=e,i=n.apply(this,arguments),this._super=s,this._superApply=o,i}}(),e):(l[i]=n,e)}),r.prototype=t.widget.extend(h,{widgetEventPrefix:a?h.widgetEventPrefix:i},l,{constructor:r,namespace:c,widgetName:i,widgetFullName:o}),a?(t.each(a._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,r,i._proto)}),delete a._childConstructors):s._childConstructors.push(r),t.widget.bridge(i,r)},t.widget.extend=function(i){for(var n,o,a=s.call(arguments,1),r=0,h=a.length;h>r;r++)for(n in a[r])o=a[r][n],a[r].hasOwnProperty(n)&&o!==e&&(i[n]=t.isPlainObject(o)?t.isPlainObject(i[n])?t.widget.extend({},i[n],o):t.widget.extend({},o):o);return i},t.widget.bridge=function(i,n){var o=n.prototype.widgetFullName||i;t.fn[i]=function(a){var r="string"==typeof a,h=s.call(arguments,1),l=this;return a=!r&&h.length?t.widget.extend.apply(null,[a].concat(h)):a,r?this.each(function(){var s,n=t.data(this,o);return n?t.isFunction(n[a])&&"_"!==a.charAt(0)?(s=n[a].apply(n,h),s!==n&&s!==e?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):e):t.error("no such method '"+a+"' for "+i+" widget instance"):t.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+a+"'")}):this.each(function(){var e=t.data(this,o);e?e.option(a||{})._init():t.data(this,o,new n(a,this))}),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(e,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=t.widget.extend({},this.options,this._getCreateOptions(),e),this.bindings=t(),this.hoverable=t(),this.focusable=t(),s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:t.noop,_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:t.noop,widget:function(){return this.element},option:function(i,s){var n,o,a,r=i;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof i)if(r={},n=i.split("."),i=n.shift(),n.length){for(o=r[i]=t.widget.extend({},this.options[i]),a=0;n.length-1>a;a++)o[n[a]]=o[n[a]]||{},o=o[n[a]];if(i=n.pop(),s===e)return o[i]===e?null:o[i];o[i]=s}else{if(s===e)return this.options[i]===e?null:this.options[i];r[i]=s}return this._setOptions(r),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return this.options[t]=e,"disabled"===t&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!e).attr("aria-disabled",e),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var o,a=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=o=t(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,o=this.widget()),t.each(n,function(n,r){function h(){return i||a.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof r?a[r]:r).apply(a,arguments):e}"string"!=typeof r&&(h.guid=r.guid=r.guid||h.guid||t.guid++);var l=n.match(/^(\w+)\s*(.*)$/),c=l[1]+a.eventNamespace,u=l[2];u?o.delegate(u,c,h):s.bind(c,h)})},_off:function(t,e){e=(e||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(e).undelegate(e)},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){t(e.currentTarget).addClass("ui-state-hover")},mouseleave:function(e){t(e.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){t(e.currentTarget).addClass("ui-state-focus")},focusout:function(e){t(e.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}})}(jQuery),function(t){var e=!1;t(document).mouseup(function(){e=!1}),t.widget("ui.mouse",{version:"1.10.3",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.bind("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).bind("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!e){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,n=1===i.which,o="string"==typeof this.options.cancel&&i.target.nodeName?t(i.target).closest(this.options.cancel).length:!1;return n&&!o&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===t.data(i.target,this.widgetName+".preventClickEvent")&&t.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return s._mouseMove(t)},this._mouseUpDelegate=function(t){return s._mouseUp(t)},t(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),e=!0,!0)):!0}},_mouseMove:function(e){return t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button?this._mouseUp(e):this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){return t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),!1},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})}(jQuery),function(t){t.widget("ui.draggable",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"!==this.options.helper||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(e){var i=this.options;return this.helper||i.disabled||t(e.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(e),this.handle?(t(i.iframeFix===!0?"iframe":i.iframeFix).each(function(){t("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(t(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(e){var i=this.options;return this.helper=this._createHelper(e),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),t.ui.ddmanager&&(t.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offsetParent=this.helper.offsetParent(),this.offsetParentCssPosition=this.offsetParent.css("position"),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},this.offset.scroll=!1,t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",e)===!1?(this._clear(),!1):(this._cacheHelperProportions(),t.ui.ddmanager&&!i.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this._mouseDrag(e,!0),t.ui.ddmanager&&t.ui.ddmanager.dragStart(this,e),!0)},_mouseDrag:function(e,i){if("fixed"===this.offsetParentCssPosition&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",e,s)===!1)return this._mouseUp({}),!1;this.position=s.position}return this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),!1},_mouseStop:function(e){var i=this,s=!1;return t.ui.ddmanager&&!this.options.dropBehaviour&&(s=t.ui.ddmanager.drop(this,e)),this.dropped&&(s=this.dropped,this.dropped=!1),"original"!==this.options.helper||t.contains(this.element[0].ownerDocument,this.element[0])?("invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||t.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?t(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",e)!==!1&&i._clear()}):this._trigger("stop",e)!==!1&&this._clear(),!1):!1},_mouseUp:function(e){return t("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),t.ui.ddmanager&&t.ui.ddmanager.dragStop(this,e),t.ui.mouse.prototype._mouseUp.call(this,e)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(e){return this.options.handle?!!t(e.target).closest(this.element.find(this.options.handle)).length:!0},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return s.parents("body").length||s.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s[0]===this.element[0]||/(fixed|absolute)/.test(s.css("position"))||s.css("position","absolute"),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.element.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;return n.containment?"window"===n.containment?(this.containment=[t(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,t(window).scrollLeft()+t(window).width()-this.helperProportions.width-this.margins.left,t(window).scrollTop()+(t(window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):"document"===n.containment?(this.containment=[0,0,t(document).width()-this.helperProportions.width-this.margins.left,(t(document).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):n.containment.constructor===Array?(this.containment=n.containment,undefined):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=t(n.containment),s=i[0],s&&(e="hidden"!==i.css("overflow"),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(e?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(e?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=i),undefined):(this.containment=null,undefined)},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent;return this.offset.scroll||(this.offset.scroll={top:n.scrollTop(),left:n.scrollLeft()}),{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top)*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)*s}},_generatePosition:function(e){var i,s,n,o,a=this.options,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=e.pageX,l=e.pageY;return this.offset.scroll||(this.offset.scroll={top:r.scrollTop(),left:r.scrollLeft()}),this.originalPosition&&(this.containment&&(this.relative_container?(s=this.relative_container.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,e.pageX-this.offset.click.left<i[0]&&(h=i[0]+this.offset.click.left),e.pageY-this.offset.click.top<i[1]&&(l=i[1]+this.offset.click.top),e.pageX-this.offset.click.left>i[2]&&(h=i[2]+this.offset.click.left),e.pageY-this.offset.click.top>i[3]&&(l=i[3]+this.offset.click.top)),a.grid&&(n=a.grid[1]?this.originalPageY+Math.round((l-this.originalPageY)/a.grid[1])*a.grid[1]:this.originalPageY,l=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-a.grid[1]:n+a.grid[1]:n,o=a.grid[0]?this.originalPageX+Math.round((h-this.originalPageX)/a.grid[0])*a.grid[0]:this.originalPageX,h=i?o-this.offset.click.left>=i[0]||o-this.offset.click.left>i[2]?o:o-this.offset.click.left>=i[0]?o-a.grid[0]:o+a.grid[0]:o)),{top:l-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top),left:h-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(e,i,s){return s=s||this._uiHash(),t.ui.plugin.call(this,e,[i,s]),"drag"===e&&(this.positionAbs=this._convertPositionTo("absolute")),t.Widget.prototype._trigger.call(this,e,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),t.ui.plugin.add("draggable","connectToSortable",{start:function(e,i){var s=t(this).data("ui-draggable"),n=s.options,o=t.extend({},i,{item:s.element});s.sortables=[],t(n.connectToSortable).each(function(){var i=t.data(this,"ui-sortable");i&&!i.options.disabled&&(s.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",e,o))})},stop:function(e,i){var s=t(this).data("ui-draggable"),n=t.extend({},i,{item:s.element});t.each(s.sortables,function(){this.instance.isOver?(this.instance.isOver=0,s.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(e),this.instance.options.helper=this.instance.options._helper,"original"===s.options.helper&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",e,n))})},drag:function(e,i){var s=t(this).data("ui-draggable"),n=this;t.each(s.sortables,function(){var o=!1,a=this;this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(o=!0,t.each(s.sortables,function(){return this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this!==a&&this.instance._intersectsWith(this.instance.containerCache)&&t.contains(a.instance.element[0],this.instance.element[0])&&(o=!1),o})),o?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=t(n).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},e.target=this.instance.currentItem[0],this.instance._mouseCapture(e,!0),this.instance._mouseStart(e,!0,!0),this.instance.offset.click.top=s.offset.click.top,this.instance.offset.click.left=s.offset.click.left,this.instance.offset.parent.left-=s.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=s.offset.parent.top-this.instance.offset.parent.top,s._trigger("toSortable",e),s.dropped=this.instance.element,s.currentItem=s.element,this.instance.fromOutside=s),this.instance.currentItem&&this.instance._mouseDrag(e)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",e,this.instance._uiHash(this.instance)),this.instance._mouseStop(e,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),s._trigger("fromSortable",e),s.dropped=!1)})}}),t.ui.plugin.add("draggable","cursor",{start:function(){var e=t("body"),i=t(this).data("ui-draggable").options;e.css("cursor")&&(i._cursor=e.css("cursor")),e.css("cursor",i.cursor)},stop:function(){var e=t(this).data("ui-draggable").options;e._cursor&&t("body").css("cursor",e._cursor)}}),t.ui.plugin.add("draggable","opacity",{start:function(e,i){var s=t(i.helper),n=t(this).data("ui-draggable").options;s.css("opacity")&&(n._opacity=s.css("opacity")),s.css("opacity",n.opacity)},stop:function(e,i){var s=t(this).data("ui-draggable").options;s._opacity&&t(i.helper).css("opacity",s._opacity)}}),t.ui.plugin.add("draggable","scroll",{start:function(){var e=t(this).data("ui-draggable");e.scrollParent[0]!==document&&"HTML"!==e.scrollParent[0].tagName&&(e.overflowOffset=e.scrollParent.offset())},drag:function(e){var i=t(this).data("ui-draggable"),s=i.options,n=!1;i.scrollParent[0]!==document&&"HTML"!==i.scrollParent[0].tagName?(s.axis&&"x"===s.axis||(i.overflowOffset.top+i.scrollParent[0].offsetHeight-e.pageY<s.scrollSensitivity?i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop+s.scrollSpeed:e.pageY-i.overflowOffset.top<s.scrollSensitivity&&(i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop-s.scrollSpeed)),s.axis&&"y"===s.axis||(i.overflowOffset.left+i.scrollParent[0].offsetWidth-e.pageX<s.scrollSensitivity?i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft+s.scrollSpeed:e.pageX-i.overflowOffset.left<s.scrollSensitivity&&(i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft-s.scrollSpeed))):(s.axis&&"x"===s.axis||(e.pageY-t(document).scrollTop()<s.scrollSensitivity?n=t(document).scrollTop(t(document).scrollTop()-s.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<s.scrollSensitivity&&(n=t(document).scrollTop(t(document).scrollTop()+s.scrollSpeed))),s.axis&&"y"===s.axis||(e.pageX-t(document).scrollLeft()<s.scrollSensitivity?n=t(document).scrollLeft(t(document).scrollLeft()-s.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<s.scrollSensitivity&&(n=t(document).scrollLeft(t(document).scrollLeft()+s.scrollSpeed)))),n!==!1&&t.ui.ddmanager&&!s.dropBehaviour&&t.ui.ddmanager.prepareOffsets(i,e)}}),t.ui.plugin.add("draggable","snap",{start:function(){var e=t(this).data("ui-draggable"),i=e.options;e.snapElements=[],t(i.snap.constructor!==String?i.snap.items||":data(ui-draggable)":i.snap).each(function(){var i=t(this),s=i.offset();this!==e.element[0]&&e.snapElements.push({item:this,width:i.outerWidth(),height:i.outerHeight(),top:s.top,left:s.left})})},drag:function(e,i){var s,n,o,a,r,h,l,c,u,d,p=t(this).data("ui-draggable"),f=p.options,g=f.snapTolerance,m=i.offset.left,v=m+p.helperProportions.width,_=i.offset.top,b=_+p.helperProportions.height;for(u=p.snapElements.length-1;u>=0;u--)r=p.snapElements[u].left,h=r+p.snapElements[u].width,l=p.snapElements[u].top,c=l+p.snapElements[u].height,r-g>v||m>h+g||l-g>b||_>c+g||!t.contains(p.snapElements[u].item.ownerDocument,p.snapElements[u].item)?(p.snapElements[u].snapping&&p.options.snap.release&&p.options.snap.release.call(p.element,e,t.extend(p._uiHash(),{snapItem:p.snapElements[u].item})),p.snapElements[u].snapping=!1):("inner"!==f.snapMode&&(s=g>=Math.abs(l-b),n=g>=Math.abs(c-_),o=g>=Math.abs(r-v),a=g>=Math.abs(h-m),s&&(i.position.top=p._convertPositionTo("relative",{top:l-p.helperProportions.height,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:c,left:0}).top-p.margins.top),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r-p.helperProportions.width}).left-p.margins.left),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:h}).left-p.margins.left)),d=s||n||o||a,"outer"!==f.snapMode&&(s=g>=Math.abs(l-_),n=g>=Math.abs(c-b),o=g>=Math.abs(r-m),a=g>=Math.abs(h-v),s&&(i.position.top=p._convertPositionTo("relative",{top:l,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:c-p.helperProportions.height,left:0}).top-p.margins.top),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r}).left-p.margins.left),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:h-p.helperProportions.width}).left-p.margins.left)),!p.snapElements[u].snapping&&(s||n||o||a||d)&&p.options.snap.snap&&p.options.snap.snap.call(p.element,e,t.extend(p._uiHash(),{snapItem:p.snapElements[u].item})),p.snapElements[u].snapping=s||n||o||a||d)}}),t.ui.plugin.add("draggable","stack",{start:function(){var e,i=this.data("ui-draggable").options,s=t.makeArray(t(i.stack)).sort(function(e,i){return(parseInt(t(e).css("zIndex"),10)||0)-(parseInt(t(i).css("zIndex"),10)||0)});s.length&&(e=parseInt(t(s[0]).css("zIndex"),10)||0,t(s).each(function(i){t(this).css("zIndex",e+i)}),this.css("zIndex",e+s.length))}}),t.ui.plugin.add("draggable","zIndex",{start:function(e,i){var s=t(i.helper),n=t(this).data("ui-draggable").options;s.css("zIndex")&&(n._zIndex=s.css("zIndex")),s.css("zIndex",n.zIndex)},stop:function(e,i){var s=t(this).data("ui-draggable").options;s._zIndex&&t(i.helper).css("zIndex",s._zIndex)}})}(jQuery),function(t){function e(t,e,i){return t>e&&e+i>t}t.widget("ui.droppable",{version:"1.10.3",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var e=this.options,i=e.accept;this.isover=!1,this.isout=!0,this.accept=t.isFunction(i)?i:function(t){return t.is(i)
},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},t.ui.ddmanager.droppables[e.scope]=t.ui.ddmanager.droppables[e.scope]||[],t.ui.ddmanager.droppables[e.scope].push(this),e.addClasses&&this.element.addClass("ui-droppable")},_destroy:function(){for(var e=0,i=t.ui.ddmanager.droppables[this.options.scope];i.length>e;e++)i[e]===this&&i.splice(e,1);this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(e,i){"accept"===e&&(this.accept=t.isFunction(i)?i:function(t){return t.is(i)}),t.Widget.prototype._setOption.apply(this,arguments)},_activate:function(e){var i=t.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),i&&this._trigger("activate",e,this.ui(i))},_deactivate:function(e){var i=t.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),i&&this._trigger("deactivate",e,this.ui(i))},_over:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",e,this.ui(i)))},_out:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",e,this.ui(i)))},_drop:function(e,i){var s=i||t.ui.ddmanager.current,n=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var e=t.data(this,"ui-droppable");return e.options.greedy&&!e.options.disabled&&e.options.scope===s.options.scope&&e.accept.call(e.element[0],s.currentItem||s.element)&&t.ui.intersect(s,t.extend(e,{offset:e.element.offset()}),e.options.tolerance)?(n=!0,!1):undefined}),n?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",e,this.ui(s)),this.element):!1):!1},ui:function(t){return{draggable:t.currentItem||t.element,helper:t.helper,position:t.position,offset:t.positionAbs}}}),t.ui.intersect=function(t,i,s){if(!i.offset)return!1;var n,o,a=(t.positionAbs||t.position.absolute).left,r=a+t.helperProportions.width,h=(t.positionAbs||t.position.absolute).top,l=h+t.helperProportions.height,c=i.offset.left,u=c+i.proportions.width,d=i.offset.top,p=d+i.proportions.height;switch(s){case"fit":return a>=c&&u>=r&&h>=d&&p>=l;case"intersect":return a+t.helperProportions.width/2>c&&u>r-t.helperProportions.width/2&&h+t.helperProportions.height/2>d&&p>l-t.helperProportions.height/2;case"pointer":return n=(t.positionAbs||t.position.absolute).left+(t.clickOffset||t.offset.click).left,o=(t.positionAbs||t.position.absolute).top+(t.clickOffset||t.offset.click).top,e(o,d,i.proportions.height)&&e(n,c,i.proportions.width);case"touch":return(h>=d&&p>=h||l>=d&&p>=l||d>h&&l>p)&&(a>=c&&u>=a||r>=c&&u>=r||c>a&&r>u);default:return!1}},t.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(e,i){var s,n,o=t.ui.ddmanager.droppables[e.options.scope]||[],a=i?i.type:null,r=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();t:for(s=0;o.length>s;s++)if(!(o[s].options.disabled||e&&!o[s].accept.call(o[s].element[0],e.currentItem||e.element))){for(n=0;r.length>n;n++)if(r[n]===o[s].element[0]){o[s].proportions.height=0;continue t}o[s].visible="none"!==o[s].element.css("display"),o[s].visible&&("mousedown"===a&&o[s]._activate.call(o[s],i),o[s].offset=o[s].element.offset(),o[s].proportions={width:o[s].element[0].offsetWidth,height:o[s].element[0].offsetHeight})}},drop:function(e,i){var s=!1;return t.each((t.ui.ddmanager.droppables[e.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&t.ui.intersect(e,this,this.options.tolerance)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],e.currentItem||e.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(e,i){e.element.parentsUntil("body").bind("scroll.droppable",function(){e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)})},drag:function(e,i){e.options.refreshPositions&&t.ui.ddmanager.prepareOffsets(e,i),t.each(t.ui.ddmanager.droppables[e.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,n,o,a=t.ui.intersect(e,this,this.options.tolerance),r=!a&&this.isover?"isout":a&&!this.isover?"isover":null;r&&(this.options.greedy&&(n=this.options.scope,o=this.element.parents(":data(ui-droppable)").filter(function(){return t.data(this,"ui-droppable").options.scope===n}),o.length&&(s=t.data(o[0],"ui-droppable"),s.greedyChild="isover"===r)),s&&"isover"===r&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[r]=!0,this["isout"===r?"isover":"isout"]=!1,this["isover"===r?"_over":"_out"].call(this,i),s&&"isout"===r&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(e,i){e.element.parentsUntil("body").unbind("scroll.droppable"),e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)}}}(jQuery),function(t){function e(t){return parseInt(t,10)||0}function i(t){return!isNaN(parseInt(t,10))}t.widget("ui.resizable",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_create:function(){var e,i,s,n,o,a=this,r=this.options;if(this.element.addClass("ui-resizable"),t.extend(this,{_aspectRatio:!!r.aspectRatio,aspectRatio:r.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:r.helper||r.ghost||r.animate?r.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.data("ui-resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=r.handles||(t(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),e=this.handles.split(","),this.handles={},i=0;e.length>i;i++)s=t.trim(e[i]),o="ui-resizable-"+s,n=t("<div class='ui-resizable-handle "+o+"'></div>"),n.css({zIndex:r.zIndex}),"se"===s&&n.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(n);this._renderAxis=function(e){var i,s,n,o;e=e||this.element;for(i in this.handles)this.handles[i].constructor===String&&(this.handles[i]=t(this.handles[i],this.element).show()),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)&&(s=t(this.handles[i],this.element),o=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),e.css(n,o),this._proportionallyResize()),t(this.handles[i]).length},this._renderAxis(this.element),this._handles=t(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){a.resizing||(this.className&&(n=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),a.axis=n&&n[1]?n[1]:"se")}),r.autoHide&&(this._handles.hide(),t(this.element).addClass("ui-resizable-autohide").mouseenter(function(){r.disabled||(t(this).removeClass("ui-resizable-autohide"),a._handles.show())}).mouseleave(function(){r.disabled||a.resizing||(t(this).addClass("ui-resizable-autohide"),a._handles.hide())})),this._mouseInit()},_destroy:function(){this._mouseDestroy();var e,i=function(e){t(e).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),e=this.element,this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")}).insertAfter(e),e.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_mouseCapture:function(e){var i,s,n=!1;for(i in this.handles)s=t(this.handles[i])[0],(s===e.target||t.contains(s,e.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(i){var s,n,o,a=this.options,r=this.element.position(),h=this.element;return this.resizing=!0,/absolute/.test(h.css("position"))?h.css({position:"absolute",top:h.css("top"),left:h.css("left")}):h.is(".ui-draggable")&&h.css({position:"absolute",top:r.top,left:r.left}),this._renderProxy(),s=e(this.helper.css("left")),n=e(this.helper.css("top")),a.containment&&(s+=t(a.containment).scrollLeft()||0,n+=t(a.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:s,top:n},this.size=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalSize=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalPosition={left:s,top:n},this.sizeDiff={width:h.outerWidth()-h.width(),height:h.outerHeight()-h.height()},this.originalMousePosition={left:i.pageX,top:i.pageY},this.aspectRatio="number"==typeof a.aspectRatio?a.aspectRatio:this.originalSize.width/this.originalSize.height||1,o=t(".ui-resizable-"+this.axis).css("cursor"),t("body").css("cursor","auto"===o?this.axis+"-resize":o),h.addClass("ui-resizable-resizing"),this._propagate("start",i),!0},_mouseDrag:function(e){var i,s=this.helper,n={},o=this.originalMousePosition,a=this.axis,r=this.position.top,h=this.position.left,l=this.size.width,c=this.size.height,u=e.pageX-o.left||0,d=e.pageY-o.top||0,p=this._change[a];return p?(i=p.apply(this,[e,u,d]),this._updateVirtualBoundaries(e.shiftKey),(this._aspectRatio||e.shiftKey)&&(i=this._updateRatio(i,e)),i=this._respectSize(i,e),this._updateCache(i),this._propagate("resize",e),this.position.top!==r&&(n.top=this.position.top+"px"),this.position.left!==h&&(n.left=this.position.left+"px"),this.size.width!==l&&(n.width=this.size.width+"px"),this.size.height!==c&&(n.height=this.size.height+"px"),s.css(n),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),t.isEmptyObject(n)||this._trigger("resize",e,this.ui()),!1):!1},_mouseStop:function(e){this.resizing=!1;var i,s,n,o,a,r,h,l=this.options,c=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&t.ui.hasScroll(i[0],"left")?0:c.sizeDiff.height,o=s?0:c.sizeDiff.width,a={width:c.helper.width()-o,height:c.helper.height()-n},r=parseInt(c.element.css("left"),10)+(c.position.left-c.originalPosition.left)||null,h=parseInt(c.element.css("top"),10)+(c.position.top-c.originalPosition.top)||null,l.animate||this.element.css(t.extend(a,{top:h,left:r})),c.helper.height(c.size.height),c.helper.width(c.size.width),this._helper&&!l.animate&&this._proportionallyResize()),t("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",e),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(t){var e,s,n,o,a,r=this.options;a={minWidth:i(r.minWidth)?r.minWidth:0,maxWidth:i(r.maxWidth)?r.maxWidth:1/0,minHeight:i(r.minHeight)?r.minHeight:0,maxHeight:i(r.maxHeight)?r.maxHeight:1/0},(this._aspectRatio||t)&&(e=a.minHeight*this.aspectRatio,n=a.minWidth/this.aspectRatio,s=a.maxHeight*this.aspectRatio,o=a.maxWidth/this.aspectRatio,e>a.minWidth&&(a.minWidth=e),n>a.minHeight&&(a.minHeight=n),a.maxWidth>s&&(a.maxWidth=s),a.maxHeight>o&&(a.maxHeight=o)),this._vBoundaries=a},_updateCache:function(t){this.offset=this.helper.offset(),i(t.left)&&(this.position.left=t.left),i(t.top)&&(this.position.top=t.top),i(t.height)&&(this.size.height=t.height),i(t.width)&&(this.size.width=t.width)},_updateRatio:function(t){var e=this.position,s=this.size,n=this.axis;return i(t.height)?t.width=t.height*this.aspectRatio:i(t.width)&&(t.height=t.width/this.aspectRatio),"sw"===n&&(t.left=e.left+(s.width-t.width),t.top=null),"nw"===n&&(t.top=e.top+(s.height-t.height),t.left=e.left+(s.width-t.width)),t},_respectSize:function(t){var e=this._vBoundaries,s=this.axis,n=i(t.width)&&e.maxWidth&&e.maxWidth<t.width,o=i(t.height)&&e.maxHeight&&e.maxHeight<t.height,a=i(t.width)&&e.minWidth&&e.minWidth>t.width,r=i(t.height)&&e.minHeight&&e.minHeight>t.height,h=this.originalPosition.left+this.originalSize.width,l=this.position.top+this.size.height,c=/sw|nw|w/.test(s),u=/nw|ne|n/.test(s);return a&&(t.width=e.minWidth),r&&(t.height=e.minHeight),n&&(t.width=e.maxWidth),o&&(t.height=e.maxHeight),a&&c&&(t.left=h-e.minWidth),n&&c&&(t.left=h-e.maxWidth),r&&u&&(t.top=l-e.minHeight),o&&u&&(t.top=l-e.maxHeight),t.width||t.height||t.left||!t.top?t.width||t.height||t.top||!t.left||(t.left=null):t.top=null,t},_proportionallyResize:function(){if(this._proportionallyResizeElements.length){var t,e,i,s,n,o=this.helper||this.element;for(t=0;this._proportionallyResizeElements.length>t;t++){if(n=this._proportionallyResizeElements[t],!this.borderDif)for(this.borderDif=[],i=[n.css("borderTopWidth"),n.css("borderRightWidth"),n.css("borderBottomWidth"),n.css("borderLeftWidth")],s=[n.css("paddingTop"),n.css("paddingRight"),n.css("paddingBottom"),n.css("paddingLeft")],e=0;i.length>e;e++)this.borderDif[e]=(parseInt(i[e],10)||0)+(parseInt(s[e],10)||0);n.css({height:o.height()-this.borderDif[0]-this.borderDif[2]||0,width:o.width()-this.borderDif[1]-this.borderDif[3]||0})}}},_renderProxy:function(){var e=this.element,i=this.options;this.elementOffset=e.offset(),this._helper?(this.helper=this.helper||t("<div style='overflow:hidden;'></div>"),this.helper.addClass(this._helper).css({width:this.element.outerWidth()-1,height:this.element.outerHeight()-1,position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(t,e){return{width:this.originalSize.width+e}},w:function(t,e){var i=this.originalSize,s=this.originalPosition;return{left:s.left+e,width:i.width-e}},n:function(t,e,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(t,e,i){return{height:this.originalSize.height+i}},se:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},sw:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[e,i,s]))},ne:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},nw:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[e,i,s]))}},_propagate:function(e,i){t.ui.plugin.call(this,e,[i,this.ui()]),"resize"!==e&&this._trigger(e,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),t.ui.plugin.add("resizable","animate",{stop:function(e){var i=t(this).data("ui-resizable"),s=i.options,n=i._proportionallyResizeElements,o=n.length&&/textarea/i.test(n[0].nodeName),a=o&&t.ui.hasScroll(n[0],"left")?0:i.sizeDiff.height,r=o?0:i.sizeDiff.width,h={width:i.size.width-r,height:i.size.height-a},l=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,c=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null;i.element.animate(t.extend(h,c&&l?{top:c,left:l}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseInt(i.element.css("width"),10),height:parseInt(i.element.css("height"),10),top:parseInt(i.element.css("top"),10),left:parseInt(i.element.css("left"),10)};n&&n.length&&t(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",e)}})}}),t.ui.plugin.add("resizable","containment",{start:function(){var i,s,n,o,a,r,h,l=t(this).data("ui-resizable"),c=l.options,u=l.element,d=c.containment,p=d instanceof t?d.get(0):/parent/.test(d)?u.parent().get(0):d;p&&(l.containerElement=t(p),/document/.test(d)||d===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:t(document),left:0,top:0,width:t(document).width(),height:t(document).height()||document.body.parentNode.scrollHeight}):(i=t(p),s=[],t(["Top","Right","Left","Bottom"]).each(function(t,n){s[t]=e(i.css("padding"+n))}),l.containerOffset=i.offset(),l.containerPosition=i.position(),l.containerSize={height:i.innerHeight()-s[3],width:i.innerWidth()-s[1]},n=l.containerOffset,o=l.containerSize.height,a=l.containerSize.width,r=t.ui.hasScroll(p,"left")?p.scrollWidth:a,h=t.ui.hasScroll(p)?p.scrollHeight:o,l.parentData={element:p,left:n.left,top:n.top,width:r,height:h}))},resize:function(e){var i,s,n,o,a=t(this).data("ui-resizable"),r=a.options,h=a.containerOffset,l=a.position,c=a._aspectRatio||e.shiftKey,u={top:0,left:0},d=a.containerElement;d[0]!==document&&/static/.test(d.css("position"))&&(u=h),l.left<(a._helper?h.left:0)&&(a.size.width=a.size.width+(a._helper?a.position.left-h.left:a.position.left-u.left),c&&(a.size.height=a.size.width/a.aspectRatio),a.position.left=r.helper?h.left:0),l.top<(a._helper?h.top:0)&&(a.size.height=a.size.height+(a._helper?a.position.top-h.top:a.position.top),c&&(a.size.width=a.size.height*a.aspectRatio),a.position.top=a._helper?h.top:0),a.offset.left=a.parentData.left+a.position.left,a.offset.top=a.parentData.top+a.position.top,i=Math.abs((a._helper?a.offset.left-u.left:a.offset.left-u.left)+a.sizeDiff.width),s=Math.abs((a._helper?a.offset.top-u.top:a.offset.top-h.top)+a.sizeDiff.height),n=a.containerElement.get(0)===a.element.parent().get(0),o=/relative|absolute/.test(a.containerElement.css("position")),n&&o&&(i-=a.parentData.left),i+a.size.width>=a.parentData.width&&(a.size.width=a.parentData.width-i,c&&(a.size.height=a.size.width/a.aspectRatio)),s+a.size.height>=a.parentData.height&&(a.size.height=a.parentData.height-s,c&&(a.size.width=a.size.height*a.aspectRatio))},stop:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.containerOffset,n=e.containerPosition,o=e.containerElement,a=t(e.helper),r=a.offset(),h=a.outerWidth()-e.sizeDiff.width,l=a.outerHeight()-e.sizeDiff.height;e._helper&&!i.animate&&/relative/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:h,height:l}),e._helper&&!i.animate&&/static/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:h,height:l})}}),t.ui.plugin.add("resizable","alsoResize",{start:function(){var e=t(this).data("ui-resizable"),i=e.options,s=function(e){t(e).each(function(){var e=t(this);e.data("ui-resizable-alsoresize",{width:parseInt(e.width(),10),height:parseInt(e.height(),10),left:parseInt(e.css("left"),10),top:parseInt(e.css("top"),10)})})};"object"!=typeof i.alsoResize||i.alsoResize.parentNode?s(i.alsoResize):i.alsoResize.length?(i.alsoResize=i.alsoResize[0],s(i.alsoResize)):t.each(i.alsoResize,function(t){s(t)})},resize:function(e,i){var s=t(this).data("ui-resizable"),n=s.options,o=s.originalSize,a=s.originalPosition,r={height:s.size.height-o.height||0,width:s.size.width-o.width||0,top:s.position.top-a.top||0,left:s.position.left-a.left||0},h=function(e,s){t(e).each(function(){var e=t(this),n=t(this).data("ui-resizable-alsoresize"),o={},a=s&&s.length?s:e.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];t.each(a,function(t,e){var i=(n[e]||0)+(r[e]||0);i&&i>=0&&(o[e]=i||null)}),e.css(o)})};"object"!=typeof n.alsoResize||n.alsoResize.nodeType?h(n.alsoResize):t.each(n.alsoResize,function(t,e){h(t,e)})},stop:function(){t(this).removeData("resizable-alsoresize")}}),t.ui.plugin.add("resizable","ghost",{start:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.size;e.ghost=e.originalElement.clone(),e.ghost.css({opacity:.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass("string"==typeof i.ghost?i.ghost:""),e.ghost.appendTo(e.helper)},resize:function(){var e=t(this).data("ui-resizable");e.ghost&&e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})},stop:function(){var e=t(this).data("ui-resizable");e.ghost&&e.helper&&e.helper.get(0).removeChild(e.ghost.get(0))}}),t.ui.plugin.add("resizable","grid",{resize:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.size,n=e.originalSize,o=e.originalPosition,a=e.axis,r="number"==typeof i.grid?[i.grid,i.grid]:i.grid,h=r[0]||1,l=r[1]||1,c=Math.round((s.width-n.width)/h)*h,u=Math.round((s.height-n.height)/l)*l,d=n.width+c,p=n.height+u,f=i.maxWidth&&d>i.maxWidth,g=i.maxHeight&&p>i.maxHeight,m=i.minWidth&&i.minWidth>d,v=i.minHeight&&i.minHeight>p;i.grid=r,m&&(d+=h),v&&(p+=l),f&&(d-=h),g&&(p-=l),/^(se|s|e)$/.test(a)?(e.size.width=d,e.size.height=p):/^(ne)$/.test(a)?(e.size.width=d,e.size.height=p,e.position.top=o.top-u):/^(sw)$/.test(a)?(e.size.width=d,e.size.height=p,e.position.left=o.left-c):(e.size.width=d,e.size.height=p,e.position.top=o.top-u,e.position.left=o.left-c)}})}(jQuery),function(t){t.widget("ui.selectable",t.ui.mouse,{version:"1.10.3",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var e,i=this;this.element.addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){e=t(i.options.filter,i.element[0]),e.addClass("ui-selectee"),e.each(function(){var e=t(this),i=e.offset();t.data(this,"selectable-item",{element:this,$element:e,left:i.left,top:i.top,right:i.left+e.outerWidth(),bottom:i.top+e.outerHeight(),startselected:!1,selected:e.hasClass("ui-selected"),selecting:e.hasClass("ui-selecting"),unselecting:e.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=e.addClass("ui-selectee"),this._mouseInit(),this.helper=t("<div class='ui-selectable-helper'></div>")},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled"),this._mouseDestroy()},_mouseStart:function(e){var i=this,s=this.options;this.opos=[e.pageX,e.pageY],this.options.disabled||(this.selectees=t(s.filter,this.element[0]),this._trigger("start",e),t(s.appendTo).append(this.helper),this.helper.css({left:e.pageX,top:e.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=t.data(this,"selectable-item");s.startselected=!0,e.metaKey||e.ctrlKey||(s.$element.removeClass("ui-selected"),s.selected=!1,s.$element.addClass("ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",e,{unselecting:s.element}))}),t(e.target).parents().addBack().each(function(){var s,n=t.data(this,"selectable-item");return n?(s=!e.metaKey&&!e.ctrlKey||!n.$element.hasClass("ui-selected"),n.$element.removeClass(s?"ui-unselecting":"ui-selected").addClass(s?"ui-selecting":"ui-unselecting"),n.unselecting=!s,n.selecting=s,n.selected=s,s?i._trigger("selecting",e,{selecting:n.element}):i._trigger("unselecting",e,{unselecting:n.element}),!1):undefined}))},_mouseDrag:function(e){if(this.dragged=!0,!this.options.disabled){var i,s=this,n=this.options,o=this.opos[0],a=this.opos[1],r=e.pageX,h=e.pageY;return o>r&&(i=r,r=o,o=i),a>h&&(i=h,h=a,a=i),this.helper.css({left:o,top:a,width:r-o,height:h-a}),this.selectees.each(function(){var i=t.data(this,"selectable-item"),l=!1;i&&i.element!==s.element[0]&&("touch"===n.tolerance?l=!(i.left>r||o>i.right||i.top>h||a>i.bottom):"fit"===n.tolerance&&(l=i.left>o&&r>i.right&&i.top>a&&h>i.bottom),l?(i.selected&&(i.$element.removeClass("ui-selected"),i.selected=!1),i.unselecting&&(i.$element.removeClass("ui-unselecting"),i.unselecting=!1),i.selecting||(i.$element.addClass("ui-selecting"),i.selecting=!0,s._trigger("selecting",e,{selecting:i.element}))):(i.selecting&&((e.metaKey||e.ctrlKey)&&i.startselected?(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.$element.addClass("ui-selected"),i.selected=!0):(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.startselected&&(i.$element.addClass("ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",e,{unselecting:i.element}))),i.selected&&(e.metaKey||e.ctrlKey||i.startselected||(i.$element.removeClass("ui-selected"),i.selected=!1,i.$element.addClass("ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",e,{unselecting:i.element})))))}),!1}},_mouseStop:function(e){var i=this;return this.dragged=!1,t(".ui-unselecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");s.$element.removeClass("ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",e,{unselected:s.element})}),t(".ui-selecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");s.$element.removeClass("ui-selecting").addClass("ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",e,{selected:s.element})}),this._trigger("stop",e),this.helper.remove(),!1}})}(jQuery),function(t){function e(t,e,i){return t>e&&e+i>t}function i(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))}t.widget("ui.sortable",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_create:function(){var t=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===t.axis||i(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_setOption:function(e,i){"disabled"===e?(this.options[e]=i,this.widget().toggleClass("ui-sortable-disabled",!!i)):t.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(e,i){var s=null,n=!1,o=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,o.widgetName+"-item")===o?(s=t(this),!1):undefined}),t.data(e.target,o.widgetName+"-item")===o&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,o,a=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,a.cursorAt&&this._adjustOffsetFromHelper(a.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),a.containment&&this._setContainment(),a.cursor&&"auto"!==a.cursor&&(o=this.document.find("body"),this.storedCursor=o.css("cursor"),o.css("cursor",a.cursor),this.storedStylesheet=t("<style>*{ cursor: "+a.cursor+" !important; }</style>").appendTo(o)),a.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",a.opacity)),a.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",a.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,o,a=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<a.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+a.scrollSpeed:e.pageY-this.overflowOffset.top<a.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-a.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<a.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+a.scrollSpeed:e.pageX-this.overflowOffset.left<a.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-a.scrollSpeed)):(e.pageY-t(document).scrollTop()<a.scrollSensitivity?r=t(document).scrollTop(t(document).scrollTop()-a.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<a.scrollSensitivity&&(r=t(document).scrollTop(t(document).scrollTop()+a.scrollSpeed)),e.pageX-t(document).scrollLeft()<a.scrollSensitivity?r=t(document).scrollLeft(t(document).scrollLeft()-a.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<a.scrollSensitivity&&(r=t(document).scrollLeft(t(document).scrollLeft()+a.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],o=this._intersectsWithPointer(s),o&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===o?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===o?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;
this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),o=this.options.axis,a={};o&&"x"!==o||(a.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),o&&"y"!==o||(a.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(a,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,o=t.left,a=o+t.width,r=t.top,h=r+t.height,l=this.offset.click.top,c=this.offset.click.left,u="x"===this.options.axis||s+l>r&&h>s+l,d="y"===this.options.axis||e+c>o&&a>e+c,p=u&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?p:e+this.helperProportions.width/2>o&&a>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var i="x"===this.options.axis||e(this.positionAbs.top+this.offset.click.top,t.top,t.height),s="y"===this.options.axis||e(this.positionAbs.left+this.offset.click.left,t.left,t.width),n=i&&s,o=this._getDragVerticalDirection(),a=this._getDragHorizontalDirection();return n?this.floating?a&&"right"===a||"down"===o?2:1:o&&("down"===o?2:1):!1},_intersectsWithSides:function(t){var i=e(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),s=e(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),n=this._getDragVerticalDirection(),o=this._getDragHorizontalDirection();return this.floating&&o?"right"===o&&s||"left"===o&&!s:n&&("down"===n&&i||"up"===n&&!i)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){var i,s,n,o,a=[],r=[],h=this._connectWith();if(h&&e)for(i=h.length-1;i>=0;i--)for(n=t(h[i]),s=n.length-1;s>=0;s--)o=t.data(n[s],this.widgetFullName),o&&o!==this&&!o.options.disabled&&r.push([t.isFunction(o.options.items)?o.options.items.call(o.element):t(o.options.items,o.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),o]);for(r.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),i=r.length-1;i>=0;i--)r[i][0].each(function(){a.push(this)});return t(a)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,o,a,r,h,l,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i]),s=n.length-1;s>=0;s--)o=t.data(n[s],this.widgetFullName),o&&o!==this&&!o.options.disabled&&(u.push([t.isFunction(o.options.items)?o.options.items.call(o.element[0],e,{item:this.currentItem}):t(o.options.items,o.element),o]),this.containers.push(o));for(i=u.length-1;i>=0;i--)for(a=u[i][1],r=u[i][0],s=0,l=r.length;l>s;s++)h=t(r[s]),h.data(this.widgetName+"-item",a),c.push({item:h,instance:a,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,o;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),o=n.offset(),s.left=o.left,s.top=o.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)o=this.containers[i].element.offset(),this.containers[i].containerCache.left=o.left,this.containers[i].containerCache.top=o.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t("<"+s+">",e.document[0]).addClass(i||e.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?e.currentItem.children().each(function(){t("<td>&#160;</td>",e.document[0]).attr("colspan",t(this).attr("colspan")||1).appendTo(n)}):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_contactContainers:function(s){var n,o,a,r,h,l,c,u,d,p,f=null,g=null;for(n=this.containers.length-1;n>=0;n--)if(!t.contains(this.currentItem[0],this.containers[n].element[0]))if(this._intersectsWith(this.containers[n].containerCache)){if(f&&t.contains(this.containers[n].element[0],f.element[0]))continue;f=this.containers[n],g=n}else this.containers[n].containerCache.over&&(this.containers[n]._trigger("out",s,this._uiHash(this)),this.containers[n].containerCache.over=0);if(f)if(1===this.containers.length)this.containers[g].containerCache.over||(this.containers[g]._trigger("over",s,this._uiHash(this)),this.containers[g].containerCache.over=1);else{for(a=1e4,r=null,p=f.floating||i(this.currentItem),h=p?"left":"top",l=p?"width":"height",c=this.positionAbs[h]+this.offset.click[h],o=this.items.length-1;o>=0;o--)t.contains(this.containers[g].element[0],this.items[o].item[0])&&this.items[o].item[0]!==this.currentItem[0]&&(!p||e(this.positionAbs.top+this.offset.click.top,this.items[o].top,this.items[o].height))&&(u=this.items[o].item.offset()[h],d=!1,Math.abs(u-c)>Math.abs(u+this.items[o][l]-c)&&(d=!0,u+=this.items[o][l]),a>Math.abs(u-c)&&(a=Math.abs(u-c),r=this.items[o],this.direction=d?"up":"down"));if(!r&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[g])return;r?this._rearrange(s,r,null,!0):this._rearrange(s,null,this.containers[g].element,!0),this._trigger("change",s,this._uiHash()),this.containers[g]._trigger("change",s,this._uiHash(this)),this.currentContainer=this.containers[g],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[g]._trigger("over",s,this._uiHash(this)),this.containers[g].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,t("document"===n.containment?document:window).width()-this.helperProportions.width-this.margins.left,(t("document"===n.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():o?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():o?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,o=e.pageX,a=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(o=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(a=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(o=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(a=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((a-this.originalPageY)/n.grid[1])*n.grid[1],a=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((o-this.originalPageX)/n.grid[0])*n.grid[0],o=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:a-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:o-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(t,e){this.reverting=!1;var i,s=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(i in this._storedCSS)("auto"===this._storedCSS[i]||"static"===this._storedCSS[i])&&(this._storedCSS[i]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&s.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||s.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(s.push(function(t){this._trigger("remove",t,this._uiHash())}),s.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),s.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),i=this.containers.length-1;i>=0;i--)e||s.push(function(t){return function(e){t._trigger("deactivate",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(s.push(function(t){return function(e){t._trigger("out",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!e){for(this._trigger("beforeStop",t,this._uiHash()),i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!1}if(e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!e){for(i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}})}(jQuery),function(t,e){var i="ui-effects-";t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=l(),n=s._rgba=[];return i=i.toLowerCase(),f(h,function(t,o){var a,r=o.re.exec(i),h=r&&o.parse(r),l=o.space||"rgba";return h?(a=s[l](h),s[c[l].cache]=a[c[l].cache],n=s._rgba=a._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,o.transparent),s):o[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var o,a="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,h=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],l=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=l.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),l.fn=t.extend(l.prototype,{parse:function(n,a,r,h){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(a),a=e);var u=this,d=t.type(n),p=this._rgba=[];return a!==e&&(n=[n,a,r,h],d="array"),"string"===d?this.parse(s(n)||o._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof l?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var o=s.cache;f(s.props,function(t,e){if(!u[o]&&s.to){if("alpha"===t||null==n[t])return;u[o]=s.to(u._rgba)}u[o][e.idx]=i(n[t],e,!0)}),u[o]&&0>t.inArray(null,u[o].slice(0,3))&&(u[o][3]=1,s.from&&(u._rgba=s.from(u[o])))}),this):e},is:function(t){var i=l(t),s=!0,n=this;return f(c,function(t,o){var a,r=i[o.cache];return r&&(a=n[o.cache]||o.to&&o.to(n._rgba)||[],f(o.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===a[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=l(t),n=s._space(),o=c[n],a=0===this.alpha()?l("transparent"):this,r=a[o.cache]||o.to(a._rgba),h=r.slice();return s=s[o.cache],f(o.props,function(t,n){var o=n.idx,a=r[o],l=s[o],c=u[n.type]||{};null!==l&&(null===a?h[o]=l:(c.mod&&(l-a>c.mod/2?a+=c.mod:a-l>c.mod/2&&(a-=c.mod)),h[o]=i((l-a)*e+a,n)))}),this[n](h)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=l(e)._rgba;return l(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,o=t[2]/255,a=t[3],r=Math.max(s,n,o),h=Math.min(s,n,o),l=r-h,c=r+h,u=.5*c;return e=h===r?0:s===r?60*(n-o)/l+360:n===r?60*(o-s)/l+120:60*(s-n)/l+240,i=0===l?0:.5>=u?l/c:l/(2-c),[Math.round(e)%360,i,u,null==a?1:a]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],o=t[3],a=.5>=s?s*(1+i):s+i-s*i,r=2*s-a;return[Math.round(255*n(r,a,e+1/3)),Math.round(255*n(r,a,e)),Math.round(255*n(r,a,e-1/3)),o]},f(c,function(s,n){var o=n.props,a=n.cache,h=n.to,c=n.from;l.fn[s]=function(s){if(h&&!this[a]&&(this[a]=h(this._rgba)),s===e)return this[a].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[a].slice();return f(o,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=l(c(d)),n[a]=d,n):l(d)},f(o,function(e,i){l.fn[e]||(l.fn[e]=function(n){var o,a=t.type(n),h="alpha"===e?this._hsla?"hsla":"rgba":s,l=this[h](),c=l[i.idx];return"undefined"===a?c:("function"===a&&(n=n.call(this,c),a=t.type(n)),null==n&&i.empty?this:("string"===a&&(o=r.exec(n),o&&(n=c+parseFloat(o[2])*("+"===o[1]?1:-1))),l[i.idx]=n,this[h](l)))})})}),l.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var o,a,r="";if("transparent"!==n&&("string"!==t.type(n)||(o=s(n)))){if(n=l(o||n),!d.rgba&&1!==n._rgba[3]){for(a="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&a&&a.style;)try{r=t.css(a,"backgroundColor"),a=a.parentNode}catch(h){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(h){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=l(e.elem,i),e.end=l(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},l.hook(a),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},o=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,o={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(o[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(o[i]=n[i]);return o}function s(e,i){var s,n,a={};for(s in i)n=i[s],e[s]!==n&&(o[s]||(t.fx.step[s]||!isNaN(parseFloat(n)))&&(a[s]=n));return a}var n=["add","remove","toggle"],o={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(jQuery.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(e,o,a,r){var h=t.speed(o,a,r);return this.queue(function(){var o,a=t(this),r=a.attr("class")||"",l=h.children?a.find("*").addBack():a;l=l.map(function(){var e=t(this);return{el:e,start:i(this)}}),o=function(){t.each(n,function(t,i){e[i]&&a[i+"Class"](e[i])})},o(),l=l.map(function(){return this.end=i(this.el[0]),this.diff=s(this.start,this.end),this}),a.attr("class",r),l=l.map(function(){var e=this,i=t.Deferred(),s=t.extend({},h,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,l.get()).done(function(){o(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),h.complete.call(a[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,o){return s?t.effects.animateClass.call(this,{add:i},s,n,o):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,o){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,o):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(i){return function(s,n,o,a,r){return"boolean"==typeof n||n===e?o?t.effects.animateClass.call(this,n?{add:s}:{remove:s},o,a,r):i.apply(this,arguments):t.effects.animateClass.call(this,{toggle:s},n,o,a)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,o){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,o)}})}(),function(){function s(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function n(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}t.extend(t.effects,{version:"1.10.3",save:function(t,e){for(var s=0;e.length>s;s++)null!==e[s]&&t.data(i+e[s],t[0].style[e[s]])},restore:function(t,s){var n,o;for(o=0;s.length>o;o++)null!==s[o]&&(n=t.data(i+s[o]),n===e&&(n=""),t.css(s[o],n))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},o=document.activeElement;try{o.id}catch(a){o=document.body}return e.wrap(s),(e[0]===o||t.contains(e[0],o))&&t(o).focus(),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).focus()),e},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var o=e.cssUnit(i);o[0]>0&&(n[i]=o[0]*s+o[1])}),n}}),t.fn.extend({effect:function(){function e(e){function s(){t.isFunction(o)&&o.call(n[0]),t.isFunction(e)&&e()}var n=t(this),o=i.complete,r=i.mode;(n.is(":hidden")?"hide"===r:"show"===r)?(n[r](),s()):a.call(n[0],i,s)}var i=s.apply(this,arguments),n=i.mode,o=i.queue,a=t.effects.effect[i.effect];return t.fx.off||!a?n?this[n](i.duration,i.complete):this.each(function(){i.complete&&i.complete.call(this)}):o===!1?this.each(e):this.queue(o||"fx",e)},show:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="show",this.effect.call(this,i)}}(t.fn.show),hide:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="hide",this.effect.call(this,i)}}(t.fn.hide),toggle:function(t){return function(e){if(n(e)||"boolean"==typeof e)return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s}})}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}()}(jQuery),function(t){var e=0,i={},s={};i.height=i.paddingTop=i.paddingBottom=i.borderTopWidth=i.borderBottomWidth="hide",s.height=s.paddingTop=s.paddingBottom=s.borderTopWidth=s.borderBottomWidth="show",t.widget("ui.accordion",{version:"1.10.3",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},_create:function(){var e=this.options;this.prevShow=this.prevHide=t(),this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role","tablist"),e.collapsible||e.active!==!1&&null!=e.active||(e.active=0),this._processPanels(),0>e.active&&(e.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():t(),content:this.active.length?this.active.next():t()}},_createIcons:function(){var e=this.options.icons;e&&(t("<span>").addClass("ui-accordion-header-icon ui-icon "+e.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(e.header).addClass(e.activeHeader),this.headers.addClass("ui-accordion-icons"))
},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var t;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),this._destroyIcons(),t=this.headers.next().css("display","").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),"content"!==this.options.heightStyle&&t.css("height","")},_setOption:function(t,e){return"active"===t?(this._activate(e),undefined):("event"===t&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(e)),this._super(t,e),"collapsible"!==t||e||this.options.active!==!1||this._activate(0),"icons"===t&&(this._destroyIcons(),e&&this._createIcons()),"disabled"===t&&this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!e),undefined)},_keydown:function(e){if(!e.altKey&&!e.ctrlKey){var i=t.ui.keyCode,s=this.headers.length,n=this.headers.index(e.target),o=!1;switch(e.keyCode){case i.RIGHT:case i.DOWN:o=this.headers[(n+1)%s];break;case i.LEFT:case i.UP:o=this.headers[(n-1+s)%s];break;case i.SPACE:case i.ENTER:this._eventHandler(e);break;case i.HOME:o=this.headers[0];break;case i.END:o=this.headers[s-1]}o&&(t(e.target).attr("tabIndex",-1),t(o).attr("tabIndex",0),o.focus(),e.preventDefault())}},_panelKeyDown:function(e){e.keyCode===t.ui.keyCode.UP&&e.ctrlKey&&t(e.currentTarget).prev().focus()},refresh:function(){var e=this.options;this._processPanels(),e.active===!1&&e.collapsible===!0||!this.headers.length?(e.active=!1,this.active=t()):e.active===!1?this._activate(0):this.active.length&&!t.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(e.active=!1,this.active=t()):this._activate(Math.max(0,e.active-1)):e.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){this.headers=this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"),this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide()},_refresh:function(){var i,s=this.options,n=s.heightStyle,o=this.element.parent(),a=this.accordionId="ui-accordion-"+(this.element.attr("id")||++e);this.active=this._findActive(s.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"),this.active.next().addClass("ui-accordion-content-active").show(),this.headers.attr("role","tab").each(function(e){var i=t(this),s=i.attr("id"),n=i.next(),o=n.attr("id");s||(s=a+"-header-"+e,i.attr("id",s)),o||(o=a+"-panel-"+e,n.attr("id",o)),i.attr("aria-controls",o),n.attr("aria-labelledby",s)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false",tabIndex:-1}).next().attr({"aria-expanded":"false","aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true",tabIndex:0}).next().attr({"aria-expanded":"true","aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(s.event),"fill"===n?(i=o.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.headers.each(function(){i-=t(this).outerHeight(!0)}),this.headers.next().each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===n&&(i=0,this.headers.next().each(function(){i=Math.max(i,t(this).css("height","").height())}).height(i))},_activate:function(e){var i=this._findActive(e)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return"number"==typeof e?this.headers.eq(e):t()},_setupEvents:function(e){var i={keydown:"_keydown"};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,i),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),o=n[0]===s[0],a=o&&i.collapsible,r=a?t():n.next(),h=s.next(),l={oldHeader:s,oldPanel:h,newHeader:a?t():n,newPanel:r};e.preventDefault(),o&&!i.collapsible||this._trigger("beforeActivate",e,l)===!1||(i.active=a?!1:this.headers.index(n),this.active=o?t():n,this._toggle(l),s.removeClass("ui-accordion-header-active ui-state-active"),i.icons&&s.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header),o||(n.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),i.icons&&n.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader),n.next().addClass("ui-accordion-content-active")))},_toggle:function(e){var i=e.newPanel,s=this.prevShow.length?this.prevShow:e.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=i,this.prevHide=s,this.options.animate?this._animate(i,s,e):(s.hide(),i.show(),this._toggleComplete(e)),s.attr({"aria-expanded":"false","aria-hidden":"true"}),s.prev().attr("aria-selected","false"),i.length&&s.length?s.prev().attr("tabIndex",-1):i.length&&this.headers.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),i.attr({"aria-expanded":"true","aria-hidden":"false"}).prev().attr({"aria-selected":"true",tabIndex:0})},_animate:function(t,e,n){var o,a,r,h=this,l=0,c=t.length&&(!e.length||t.index()<e.index()),u=this.options.animate||{},d=c&&u.down||u,p=function(){h._toggleComplete(n)};return"number"==typeof d&&(r=d),"string"==typeof d&&(a=d),a=a||d.easing||u.easing,r=r||d.duration||u.duration,e.length?t.length?(o=t.show().outerHeight(),e.animate(i,{duration:r,easing:a,step:function(t,e){e.now=Math.round(t)}}),t.hide().animate(s,{duration:r,easing:a,complete:p,step:function(t,i){i.now=Math.round(t),"height"!==i.prop?l+=i.now:"content"!==h.options.heightStyle&&(i.now=Math.round(o-e.outerHeight()-l),l=0)}}),undefined):e.animate(i,r,a,p):t.animate(s,r,a,p)},_toggleComplete:function(t){var e=t.oldPanel;e.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),e.length&&(e.parent()[0].className=e.parent()[0].className),this._trigger("activate",null,t)}})}(jQuery),function(t){var e=0;t.widget("ui.autocomplete",{version:"1.10.3",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var e,i,s,n=this.element[0].nodeName.toLowerCase(),o="textarea"===n,a="input"===n;this.isMultiLine=o?!0:a?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[o||a?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return e=!0,s=!0,i=!0,undefined;e=!1,s=!1,i=!1;var o=t.ui.keyCode;switch(n.keyCode){case o.PAGE_UP:e=!0,this._move("previousPage",n);break;case o.PAGE_DOWN:e=!0,this._move("nextPage",n);break;case o.UP:e=!0,this._keyEvent("previous",n);break;case o.DOWN:e=!0,this._keyEvent("next",n);break;case o.ENTER:case o.NUMPAD_ENTER:this.menu.active&&(e=!0,n.preventDefault(),this.menu.select(n));break;case o.TAB:this.menu.active&&this.menu.select(n);break;case o.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(e)return e=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),undefined;if(!i){var n=t.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(t){return s?(s=!1,t.preventDefault(),undefined):(this._searchTimeout(t),undefined)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,undefined):(clearTimeout(this.searching),this.close(t),this._change(t),undefined)}}),this._initSource(),this.menu=t("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().data("ui-menu"),this._on(this.menu.element,{mousedown:function(e){e.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];t(e.target).closest(".ui-menu-item").length||this._delay(function(){var e=this;this.document.one("mousedown",function(s){s.target===e.element[0]||s.target===i||t.contains(i,s.target)||e.close()})})},menufocus:function(e,i){if(this.isNewMenu&&(this.isNewMenu=!1,e.originalEvent&&/^mouse/.test(e.originalEvent.type)))return this.menu.blur(),this.document.one("mousemove",function(){t(e.target).trigger(e.originalEvent)}),undefined;var s=i.item.data("ui-autocomplete-item");!1!==this._trigger("focus",e,{item:s})?e.originalEvent&&/^key/.test(e.originalEvent.type)&&this._value(s.value):this.liveRegion.text(s.value)},menuselect:function(t,e){var i=e.item.data("ui-autocomplete-item"),s=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s,this.selectedItem=i})),!1!==this._trigger("select",t,{item:i})&&this._value(i.value),this.term=this._value(),this.close(t),this.selectedItem=i}}),this.liveRegion=t("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(t,e){this._super(t,e),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(this._appendTo()),"disabled"===t&&e&&this.xhr&&this.xhr.abort()},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e||(e=this.element.closest(".ui-front")),e.length||(e=this.document[0].body),e},_initSource:function(){var e,i,s=this;t.isArray(this.options.source)?(e=this.options.source,this.source=function(i,s){s(t.ui.autocomplete.filter(e,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(e,n){s.xhr&&s.xhr.abort(),s.xhr=t.ajax({url:i,data:e,dataType:"json",success:function(t){n(t)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(t){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,t))},this.options.delay)},search:function(t,e){return t=null!=t?t:this._value(),this.term=this._value(),t.length<this.options.minLength?this.close(e):this._trigger("search",e)!==!1?this._search(t):undefined},_search:function(t){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:t},this._response())},_response:function(){var t=this,i=++e;return function(s){i===e&&t.__response(s),t.pending--,t.pending||t.element.removeClass("ui-autocomplete-loading")}},__response:function(t){t&&(t=this._normalize(t)),this._trigger("response",null,{content:t}),!this.options.disabled&&t&&t.length&&!this.cancelSearch?(this._suggest(t),this._trigger("open")):this._close()},close:function(t){this.cancelSearch=!0,this._close(t)},_close:function(t){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",t))},_change:function(t){this.previous!==this._value()&&this._trigger("change",t,{item:this.selectedItem})},_normalize:function(e){return e.length&&e[0].label&&e[0].value?e:t.map(e,function(e){return"string"==typeof e?{label:e,value:e}:t.extend({label:e.label||e.value,value:e.value||e.label},e)})},_suggest:function(e){var i=this.menu.element.empty();this._renderMenu(i,e),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(t.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var t=this.menu.element;t.outerWidth(Math.max(t.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(e,i){var s=this;t.each(i,function(t,i){s._renderItemData(e,i)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-autocomplete-item",e)},_renderItem:function(e,i){return t("<li>").append(t("<a>").text(i.label)).appendTo(e)},_move:function(t,e){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(t)||this.menu.isLastItem()&&/^next/.test(t)?(this._value(this.term),this.menu.blur(),undefined):(this.menu[t](e),undefined):(this.search(null,e),undefined)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(t,e){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(t,e),e.preventDefault())}}),t.extend(t.ui.autocomplete,{escapeRegex:function(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(e,i){var s=RegExp(t.ui.autocomplete.escapeRegex(i),"i");return t.grep(e,function(t){return s.test(t.label||t.value||t)})}}),t.widget("ui.autocomplete",t.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(t){return t+(t>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(t){var e;this._superApply(arguments),this.options.disabled||this.cancelSearch||(e=t&&t.length?this.options.messages.results(t.length):this.options.messages.noResults,this.liveRegion.text(e))}})}(jQuery),function(t){var e,i,s,n,o="ui-button ui-widget ui-state-default ui-corner-all",a="ui-state-hover ui-state-active ",r="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",h=function(){var e=t(this);setTimeout(function(){e.find(":ui-button").button("refresh")},1)},l=function(e){var i=e.name,s=e.form,n=t([]);return i&&(i=i.replace(/'/g,"\\'"),n=s?t(s).find("[name='"+i+"']"):t("[name='"+i+"']",e.ownerDocument).filter(function(){return!this.form})),n};t.widget("ui.button",{version:"1.10.3",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,h),"boolean"!=typeof this.options.disabled?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var a=this,r=this.options,c="checkbox"===this.type||"radio"===this.type,u=c?"":"ui-state-active",d="ui-state-focus";null===r.label&&(r.label="input"===this.type?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(o).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){r.disabled||this===e&&t(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){r.disabled||t(this).removeClass(u)}).bind("click"+this.eventNamespace,function(t){r.disabled&&(t.preventDefault(),t.stopImmediatePropagation())}),this.element.bind("focus"+this.eventNamespace,function(){a.buttonElement.addClass(d)}).bind("blur"+this.eventNamespace,function(){a.buttonElement.removeClass(d)}),c&&(this.element.bind("change"+this.eventNamespace,function(){n||a.refresh()}),this.buttonElement.bind("mousedown"+this.eventNamespace,function(t){r.disabled||(n=!1,i=t.pageX,s=t.pageY)}).bind("mouseup"+this.eventNamespace,function(t){r.disabled||(i!==t.pageX||s!==t.pageY)&&(n=!0)})),"checkbox"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){return r.disabled||n?!1:undefined}):"radio"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(r.disabled||n)return!1;t(this).addClass("ui-state-active"),a.buttonElement.attr("aria-pressed","true");var e=a.element[0];l(e).not(e).map(function(){return t(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){return r.disabled?!1:(t(this).addClass("ui-state-active"),e=this,a.document.one("mouseup",function(){e=null}),undefined)}).bind("mouseup"+this.eventNamespace,function(){return r.disabled?!1:(t(this).removeClass("ui-state-active"),undefined)}).bind("keydown"+this.eventNamespace,function(e){return r.disabled?!1:((e.keyCode===t.ui.keyCode.SPACE||e.keyCode===t.ui.keyCode.ENTER)&&t(this).addClass("ui-state-active"),undefined)}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){t(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(e){e.keyCode===t.ui.keyCode.SPACE&&t(this).click()})),this._setOption("disabled",r.disabled),this._resetButton()},_determineButtonType:function(){var t,e,i;this.type=this.element.is("[type=checkbox]")?"checkbox":this.element.is("[type=radio]")?"radio":this.element.is("input")?"input":"button","checkbox"===this.type||"radio"===this.type?(t=this.element.parents().last(),e="label[for='"+this.element.attr("id")+"']",this.buttonElement=t.find(e),this.buttonElement.length||(t=t.length?t.siblings():this.element.siblings(),this.buttonElement=t.filter(e),this.buttonElement.length||(this.buttonElement=t.find(e))),this.element.addClass("ui-helper-hidden-accessible"),i=this.element.is(":checked"),i&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",i)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(o+" "+a+" "+r).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(t,e){return this._super(t,e),"disabled"===t?(e?this.element.prop("disabled",!0):this.element.prop("disabled",!1),undefined):(this._resetButton(),undefined)},refresh:function(){var e=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");e!==this.options.disabled&&this._setOption("disabled",e),"radio"===this.type?l(this.element[0]).each(function(){t(this).is(":checked")?t(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):t(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):"checkbox"===this.type&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if("input"===this.type)return this.options.label&&this.element.val(this.options.label),undefined;var e=this.buttonElement.removeClass(r),i=t("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(e.empty()).text(),s=this.options.icons,n=s.primary&&s.secondary,o=[];s.primary||s.secondary?(this.options.text&&o.push("ui-button-text-icon"+(n?"s":s.primary?"-primary":"-secondary")),s.primary&&e.prepend("<span class='ui-button-icon-primary ui-icon "+s.primary+"'></span>"),s.secondary&&e.append("<span class='ui-button-icon-secondary ui-icon "+s.secondary+"'></span>"),this.options.text||(o.push(n?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||e.attr("title",t.trim(i)))):o.push("ui-button-text-only"),e.addClass(o.join(" "))}}),t.widget("ui.buttonset",{version:"1.10.3",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(t,e){"disabled"===t&&this.buttons.button("option",t,e),this._super(t,e)},refresh:function(){var e="rtl"===this.element.css("direction");this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return t(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(e?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(e?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return t(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})}(jQuery),function(t,e){function i(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},t.extend(this._defaults,this.regional[""]),this.dpDiv=s(t("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function s(e){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return e.delegate(i,"mouseout",function(){t(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).removeClass("ui-datepicker-next-hover")}).delegate(i,"mouseover",function(){t.datepicker._isDisabledDatepicker(o.inline?e.parent()[0]:o.input[0])||(t(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),t(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).addClass("ui-datepicker-next-hover"))})}function n(e,i){t.extend(e,i);for(var s in i)null==i[s]&&(e[s]=i[s]);return e}t.extend(t.ui,{datepicker:{version:"1.10.3"}});var o,a="datepicker";t.extend(i.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(t){return n(this._defaults,t||{}),this},_attachDatepicker:function(e,i){var s,n,o;s=e.nodeName.toLowerCase(),n="div"===s||"span"===s,e.id||(this.uuid+=1,e.id="dp"+this.uuid),o=this._newInst(t(e),n),o.settings=t.extend({},i||{}),"input"===s?this._connectDatepicker(e,o):n&&this._inlineDatepicker(e,o)},_newInst:function(e,i){var n=e[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:n,input:e,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?s(t("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(e,i){var s=t(e);i.append=t([]),i.trigger=t([]),s.hasClass(this.markerClassName)||(this._attachments(s,i),s.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(i),t.data(e,a,i),i.settings.disabled&&this._disableDatepicker(e))},_attachments:function(e,i){var s,n,o,a=this._get(i,"appendText"),r=this._get(i,"isRTL");i.append&&i.append.remove(),a&&(i.append=t("<span class='"+this._appendClass+"'>"+a+"</span>"),e[r?"before":"after"](i.append)),e.unbind("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),s=this._get(i,"showOn"),("focus"===s||"both"===s)&&e.focus(this._showDatepicker),("button"===s||"both"===s)&&(n=this._get(i,"buttonText"),o=this._get(i,"buttonImage"),i.trigger=t(this._get(i,"buttonImageOnly")?t("<img/>").addClass(this._triggerClass).attr({src:o,alt:n,title:n}):t("<button type='button'></button>").addClass(this._triggerClass).html(o?t("<img/>").attr({src:o,alt:n,title:n}):n)),e[r?"before":"after"](i.trigger),i.trigger.click(function(){return t.datepicker._datepickerShowing&&t.datepicker._lastInput===e[0]?t.datepicker._hideDatepicker():t.datepicker._datepickerShowing&&t.datepicker._lastInput!==e[0]?(t.datepicker._hideDatepicker(),t.datepicker._showDatepicker(e[0])):t.datepicker._showDatepicker(e[0]),!1}))},_autoSize:function(t){if(this._get(t,"autoSize")&&!t.inline){var e,i,s,n,o=new Date(2009,11,20),a=this._get(t,"dateFormat");a.match(/[DM]/)&&(e=function(t){for(i=0,s=0,n=0;t.length>n;n++)t[n].length>i&&(i=t[n].length,s=n);return s},o.setMonth(e(this._get(t,a.match(/MM/)?"monthNames":"monthNamesShort"))),o.setDate(e(this._get(t,a.match(/DD/)?"dayNames":"dayNamesShort"))+20-o.getDay())),t.input.attr("size",this._formatDate(t,o).length)}},_inlineDatepicker:function(e,i){var s=t(e);s.hasClass(this.markerClassName)||(s.addClass(this.markerClassName).append(i.dpDiv),t.data(e,a,i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(e),i.dpDiv.css("display","block"))},_dialogDatepicker:function(e,i,s,o,r){var h,l,c,u,d,p=this._dialogInst;return p||(this.uuid+=1,h="dp"+this.uuid,this._dialogInput=t("<input type='text' id='"+h+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),t("body").append(this._dialogInput),p=this._dialogInst=this._newInst(this._dialogInput,!1),p.settings={},t.data(this._dialogInput[0],a,p)),n(p.settings,o||{}),i=i&&i.constructor===Date?this._formatDate(p,i):i,this._dialogInput.val(i),this._pos=r?r.length?r:[r.pageX,r.pageY]:null,this._pos||(l=document.documentElement.clientWidth,c=document.documentElement.clientHeight,u=document.documentElement.scrollLeft||document.body.scrollLeft,d=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[l/2-100+u,c/2-150+d]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),p.settings.onSelect=s,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),t.blockUI&&t.blockUI(this.dpDiv),t.data(this._dialogInput[0],a,p),this},_destroyDatepicker:function(e){var i,s=t(e),n=t.data(e,a);s.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),t.removeData(e,a),"input"===i?(n.append.remove(),n.trigger.remove(),s.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):("div"===i||"span"===i)&&s.removeClass(this.markerClassName).empty())},_enableDatepicker:function(e){var i,s,n=t(e),o=t.data(e,a);n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!1,o.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().removeClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}))},_disableDatepicker:function(e){var i,s,n=t(e),o=t.data(e,a);n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!0,o.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().addClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}),this._disabledInputs[this._disabledInputs.length]=e)},_isDisabledDatepicker:function(t){if(!t)return!1;for(var e=0;this._disabledInputs.length>e;e++)if(this._disabledInputs[e]===t)return!0;return!1},_getInst:function(e){try{return t.data(e,a)}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(i,s,o){var a,r,h,l,c=this._getInst(i);return 2===arguments.length&&"string"==typeof s?"defaults"===s?t.extend({},t.datepicker._defaults):c?"all"===s?t.extend({},c.settings):this._get(c,s):null:(a=s||{},"string"==typeof s&&(a={},a[s]=o),c&&(this._curInst===c&&this._hideDatepicker(),r=this._getDateDatepicker(i,!0),h=this._getMinMaxDate(c,"min"),l=this._getMinMaxDate(c,"max"),n(c.settings,a),null!==h&&a.dateFormat!==e&&a.minDate===e&&(c.settings.minDate=this._formatDate(c,h)),null!==l&&a.dateFormat!==e&&a.maxDate===e&&(c.settings.maxDate=this._formatDate(c,l)),"disabled"in a&&(a.disabled?this._disableDatepicker(i):this._enableDatepicker(i)),this._attachments(t(i),c),this._autoSize(c),this._setDate(c,r),this._updateAlternate(c),this._updateDatepicker(c)),e)},_changeDatepicker:function(t,e,i){this._optionDatepicker(t,e,i)},_refreshDatepicker:function(t){var e=this._getInst(t);e&&this._updateDatepicker(e)},_setDateDatepicker:function(t,e){var i=this._getInst(t);i&&(this._setDate(i,e),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(t,e){var i=this._getInst(t);return i&&!i.inline&&this._setDateFromField(i,e),i?this._getDate(i):null},_doKeyDown:function(e){var i,s,n,o=t.datepicker._getInst(e.target),a=!0,r=o.dpDiv.is(".ui-datepicker-rtl");if(o._keyEvent=!0,t.datepicker._datepickerShowing)switch(e.keyCode){case 9:t.datepicker._hideDatepicker(),a=!1;break;case 13:return n=t("td."+t.datepicker._dayOverClass+":not(."+t.datepicker._currentClass+")",o.dpDiv),n[0]&&t.datepicker._selectDay(e.target,o.selectedMonth,o.selectedYear,n[0]),i=t.datepicker._get(o,"onSelect"),i?(s=t.datepicker._formatDate(o),i.apply(o.input?o.input[0]:null,[s,o])):t.datepicker._hideDatepicker(),!1;
case 27:t.datepicker._hideDatepicker();break;case 33:t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(o,"stepBigMonths"):-t.datepicker._get(o,"stepMonths"),"M");break;case 34:t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(o,"stepBigMonths"):+t.datepicker._get(o,"stepMonths"),"M");break;case 35:(e.ctrlKey||e.metaKey)&&t.datepicker._clearDate(e.target),a=e.ctrlKey||e.metaKey;break;case 36:(e.ctrlKey||e.metaKey)&&t.datepicker._gotoToday(e.target),a=e.ctrlKey||e.metaKey;break;case 37:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,r?1:-1,"D"),a=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(o,"stepBigMonths"):-t.datepicker._get(o,"stepMonths"),"M");break;case 38:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,-7,"D"),a=e.ctrlKey||e.metaKey;break;case 39:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,r?-1:1,"D"),a=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(o,"stepBigMonths"):+t.datepicker._get(o,"stepMonths"),"M");break;case 40:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,7,"D"),a=e.ctrlKey||e.metaKey;break;default:a=!1}else 36===e.keyCode&&e.ctrlKey?t.datepicker._showDatepicker(this):a=!1;a&&(e.preventDefault(),e.stopPropagation())},_doKeyPress:function(i){var s,n,o=t.datepicker._getInst(i.target);return t.datepicker._get(o,"constrainInput")?(s=t.datepicker._possibleChars(t.datepicker._get(o,"dateFormat")),n=String.fromCharCode(null==i.charCode?i.keyCode:i.charCode),i.ctrlKey||i.metaKey||" ">n||!s||s.indexOf(n)>-1):e},_doKeyUp:function(e){var i,s=t.datepicker._getInst(e.target);if(s.input.val()!==s.lastVal)try{i=t.datepicker.parseDate(t.datepicker._get(s,"dateFormat"),s.input?s.input.val():null,t.datepicker._getFormatConfig(s)),i&&(t.datepicker._setDateFromField(s),t.datepicker._updateAlternate(s),t.datepicker._updateDatepicker(s))}catch(n){}return!0},_showDatepicker:function(e){if(e=e.target||e,"input"!==e.nodeName.toLowerCase()&&(e=t("input",e.parentNode)[0]),!t.datepicker._isDisabledDatepicker(e)&&t.datepicker._lastInput!==e){var i,s,o,a,r,h,l;i=t.datepicker._getInst(e),t.datepicker._curInst&&t.datepicker._curInst!==i&&(t.datepicker._curInst.dpDiv.stop(!0,!0),i&&t.datepicker._datepickerShowing&&t.datepicker._hideDatepicker(t.datepicker._curInst.input[0])),s=t.datepicker._get(i,"beforeShow"),o=s?s.apply(e,[e,i]):{},o!==!1&&(n(i.settings,o),i.lastVal=null,t.datepicker._lastInput=e,t.datepicker._setDateFromField(i),t.datepicker._inDialog&&(e.value=""),t.datepicker._pos||(t.datepicker._pos=t.datepicker._findPos(e),t.datepicker._pos[1]+=e.offsetHeight),a=!1,t(e).parents().each(function(){return a|="fixed"===t(this).css("position"),!a}),r={left:t.datepicker._pos[0],top:t.datepicker._pos[1]},t.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),t.datepicker._updateDatepicker(i),r=t.datepicker._checkOffset(i,r,a),i.dpDiv.css({position:t.datepicker._inDialog&&t.blockUI?"static":a?"fixed":"absolute",display:"none",left:r.left+"px",top:r.top+"px"}),i.inline||(h=t.datepicker._get(i,"showAnim"),l=t.datepicker._get(i,"duration"),i.dpDiv.zIndex(t(e).zIndex()+1),t.datepicker._datepickerShowing=!0,t.effects&&t.effects.effect[h]?i.dpDiv.show(h,t.datepicker._get(i,"showOptions"),l):i.dpDiv[h||"show"](h?l:null),t.datepicker._shouldFocusInput(i)&&i.input.focus(),t.datepicker._curInst=i))}},_updateDatepicker:function(e){this.maxRows=4,o=e,e.dpDiv.empty().append(this._generateHTML(e)),this._attachHandlers(e),e.dpDiv.find("."+this._dayOverClass+" a").mouseover();var i,s=this._getNumberOfMonths(e),n=s[1],a=17;e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),n>1&&e.dpDiv.addClass("ui-datepicker-multi-"+n).css("width",a*n+"em"),e.dpDiv[(1!==s[0]||1!==s[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),e.dpDiv[(this._get(e,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),e===t.datepicker._curInst&&t.datepicker._datepickerShowing&&t.datepicker._shouldFocusInput(e)&&e.input.focus(),e.yearshtml&&(i=e.yearshtml,setTimeout(function(){i===e.yearshtml&&e.yearshtml&&e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml),i=e.yearshtml=null},0))},_shouldFocusInput:function(t){return t.input&&t.input.is(":visible")&&!t.input.is(":disabled")&&!t.input.is(":focus")},_checkOffset:function(e,i,s){var n=e.dpDiv.outerWidth(),o=e.dpDiv.outerHeight(),a=e.input?e.input.outerWidth():0,r=e.input?e.input.outerHeight():0,h=document.documentElement.clientWidth+(s?0:t(document).scrollLeft()),l=document.documentElement.clientHeight+(s?0:t(document).scrollTop());return i.left-=this._get(e,"isRTL")?n-a:0,i.left-=s&&i.left===e.input.offset().left?t(document).scrollLeft():0,i.top-=s&&i.top===e.input.offset().top+r?t(document).scrollTop():0,i.left-=Math.min(i.left,i.left+n>h&&h>n?Math.abs(i.left+n-h):0),i.top-=Math.min(i.top,i.top+o>l&&l>o?Math.abs(o+r):0),i},_findPos:function(e){for(var i,s=this._getInst(e),n=this._get(s,"isRTL");e&&("hidden"===e.type||1!==e.nodeType||t.expr.filters.hidden(e));)e=e[n?"previousSibling":"nextSibling"];return i=t(e).offset(),[i.left,i.top]},_hideDatepicker:function(e){var i,s,n,o,r=this._curInst;!r||e&&r!==t.data(e,a)||this._datepickerShowing&&(i=this._get(r,"showAnim"),s=this._get(r,"duration"),n=function(){t.datepicker._tidyDialog(r)},t.effects&&(t.effects.effect[i]||t.effects[i])?r.dpDiv.hide(i,t.datepicker._get(r,"showOptions"),s,n):r.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?s:null,n),i||n(),this._datepickerShowing=!1,o=this._get(r,"onClose"),o&&o.apply(r.input?r.input[0]:null,[r.input?r.input.val():"",r]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),t.blockUI&&(t.unblockUI(),t("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(t){t.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(e){if(t.datepicker._curInst){var i=t(e.target),s=t.datepicker._getInst(i[0]);(i[0].id!==t.datepicker._mainDivId&&0===i.parents("#"+t.datepicker._mainDivId).length&&!i.hasClass(t.datepicker.markerClassName)&&!i.closest("."+t.datepicker._triggerClass).length&&t.datepicker._datepickerShowing&&(!t.datepicker._inDialog||!t.blockUI)||i.hasClass(t.datepicker.markerClassName)&&t.datepicker._curInst!==s)&&t.datepicker._hideDatepicker()}},_adjustDate:function(e,i,s){var n=t(e),o=this._getInst(n[0]);this._isDisabledDatepicker(n[0])||(this._adjustInstDate(o,i+("M"===s?this._get(o,"showCurrentAtPos"):0),s),this._updateDatepicker(o))},_gotoToday:function(e){var i,s=t(e),n=this._getInst(s[0]);this._get(n,"gotoCurrent")&&n.currentDay?(n.selectedDay=n.currentDay,n.drawMonth=n.selectedMonth=n.currentMonth,n.drawYear=n.selectedYear=n.currentYear):(i=new Date,n.selectedDay=i.getDate(),n.drawMonth=n.selectedMonth=i.getMonth(),n.drawYear=n.selectedYear=i.getFullYear()),this._notifyChange(n),this._adjustDate(s)},_selectMonthYear:function(e,i,s){var n=t(e),o=this._getInst(n[0]);o["selected"+("M"===s?"Month":"Year")]=o["draw"+("M"===s?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(o),this._adjustDate(n)},_selectDay:function(e,i,s,n){var o,a=t(e);t(n).hasClass(this._unselectableClass)||this._isDisabledDatepicker(a[0])||(o=this._getInst(a[0]),o.selectedDay=o.currentDay=t("a",n).html(),o.selectedMonth=o.currentMonth=i,o.selectedYear=o.currentYear=s,this._selectDate(e,this._formatDate(o,o.currentDay,o.currentMonth,o.currentYear)))},_clearDate:function(e){var i=t(e);this._selectDate(i,"")},_selectDate:function(e,i){var s,n=t(e),o=this._getInst(n[0]);i=null!=i?i:this._formatDate(o),o.input&&o.input.val(i),this._updateAlternate(o),s=this._get(o,"onSelect"),s?s.apply(o.input?o.input[0]:null,[i,o]):o.input&&o.input.trigger("change"),o.inline?this._updateDatepicker(o):(this._hideDatepicker(),this._lastInput=o.input[0],"object"!=typeof o.input[0]&&o.input.focus(),this._lastInput=null)},_updateAlternate:function(e){var i,s,n,o=this._get(e,"altField");o&&(i=this._get(e,"altFormat")||this._get(e,"dateFormat"),s=this._getDate(e),n=this.formatDate(i,s,this._getFormatConfig(e)),t(o).each(function(){t(this).val(n)}))},noWeekends:function(t){var e=t.getDay();return[e>0&&6>e,""]},iso8601Week:function(t){var e,i=new Date(t.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),e=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((e-i)/864e5)/7)+1},parseDate:function(i,s,n){if(null==i||null==s)throw"Invalid arguments";if(s="object"==typeof s?""+s:s+"",""===s)return null;var o,a,r,h,l=0,c=(n?n.shortYearCutoff:null)||this._defaults.shortYearCutoff,u="string"!=typeof c?c:(new Date).getFullYear()%100+parseInt(c,10),d=(n?n.dayNamesShort:null)||this._defaults.dayNamesShort,p=(n?n.dayNames:null)||this._defaults.dayNames,f=(n?n.monthNamesShort:null)||this._defaults.monthNamesShort,g=(n?n.monthNames:null)||this._defaults.monthNames,m=-1,v=-1,_=-1,b=-1,y=!1,w=function(t){var e=i.length>o+1&&i.charAt(o+1)===t;return e&&o++,e},k=function(t){var e=w(t),i="@"===t?14:"!"===t?20:"y"===t&&e?4:"o"===t?3:2,n=RegExp("^\\d{1,"+i+"}"),o=s.substring(l).match(n);if(!o)throw"Missing number at position "+l;return l+=o[0].length,parseInt(o[0],10)},x=function(i,n,o){var a=-1,r=t.map(w(i)?o:n,function(t,e){return[[e,t]]}).sort(function(t,e){return-(t[1].length-e[1].length)});if(t.each(r,function(t,i){var n=i[1];return s.substr(l,n.length).toLowerCase()===n.toLowerCase()?(a=i[0],l+=n.length,!1):e}),-1!==a)return a+1;throw"Unknown name at position "+l},D=function(){if(s.charAt(l)!==i.charAt(o))throw"Unexpected literal at position "+l;l++};for(o=0;i.length>o;o++)if(y)"'"!==i.charAt(o)||w("'")?D():y=!1;else switch(i.charAt(o)){case"d":_=k("d");break;case"D":x("D",d,p);break;case"o":b=k("o");break;case"m":v=k("m");break;case"M":v=x("M",f,g);break;case"y":m=k("y");break;case"@":h=new Date(k("@")),m=h.getFullYear(),v=h.getMonth()+1,_=h.getDate();break;case"!":h=new Date((k("!")-this._ticksTo1970)/1e4),m=h.getFullYear(),v=h.getMonth()+1,_=h.getDate();break;case"'":w("'")?D():y=!0;break;default:D()}if(s.length>l&&(r=s.substr(l),!/^\s+/.test(r)))throw"Extra/unparsed characters found in date: "+r;if(-1===m?m=(new Date).getFullYear():100>m&&(m+=(new Date).getFullYear()-(new Date).getFullYear()%100+(u>=m?0:-100)),b>-1)for(v=1,_=b;;){if(a=this._getDaysInMonth(m,v-1),a>=_)break;v++,_-=a}if(h=this._daylightSavingAdjust(new Date(m,v-1,_)),h.getFullYear()!==m||h.getMonth()+1!==v||h.getDate()!==_)throw"Invalid date";return h},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(t,e,i){if(!e)return"";var s,n=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,o=(i?i.dayNames:null)||this._defaults.dayNames,a=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,r=(i?i.monthNames:null)||this._defaults.monthNames,h=function(e){var i=t.length>s+1&&t.charAt(s+1)===e;return i&&s++,i},l=function(t,e,i){var s=""+e;if(h(t))for(;i>s.length;)s="0"+s;return s},c=function(t,e,i,s){return h(t)?s[e]:i[e]},u="",d=!1;if(e)for(s=0;t.length>s;s++)if(d)"'"!==t.charAt(s)||h("'")?u+=t.charAt(s):d=!1;else switch(t.charAt(s)){case"d":u+=l("d",e.getDate(),2);break;case"D":u+=c("D",e.getDay(),n,o);break;case"o":u+=l("o",Math.round((new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()-new Date(e.getFullYear(),0,0).getTime())/864e5),3);break;case"m":u+=l("m",e.getMonth()+1,2);break;case"M":u+=c("M",e.getMonth(),a,r);break;case"y":u+=h("y")?e.getFullYear():(10>e.getYear()%100?"0":"")+e.getYear()%100;break;case"@":u+=e.getTime();break;case"!":u+=1e4*e.getTime()+this._ticksTo1970;break;case"'":h("'")?u+="'":d=!0;break;default:u+=t.charAt(s)}return u},_possibleChars:function(t){var e,i="",s=!1,n=function(i){var s=t.length>e+1&&t.charAt(e+1)===i;return s&&e++,s};for(e=0;t.length>e;e++)if(s)"'"!==t.charAt(e)||n("'")?i+=t.charAt(e):s=!1;else switch(t.charAt(e)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":n("'")?i+="'":s=!0;break;default:i+=t.charAt(e)}return i},_get:function(t,i){return t.settings[i]!==e?t.settings[i]:this._defaults[i]},_setDateFromField:function(t,e){if(t.input.val()!==t.lastVal){var i=this._get(t,"dateFormat"),s=t.lastVal=t.input?t.input.val():null,n=this._getDefaultDate(t),o=n,a=this._getFormatConfig(t);try{o=this.parseDate(i,s,a)||n}catch(r){s=e?"":s}t.selectedDay=o.getDate(),t.drawMonth=t.selectedMonth=o.getMonth(),t.drawYear=t.selectedYear=o.getFullYear(),t.currentDay=s?o.getDate():0,t.currentMonth=s?o.getMonth():0,t.currentYear=s?o.getFullYear():0,this._adjustInstDate(t)}},_getDefaultDate:function(t){return this._restrictMinMax(t,this._determineDate(t,this._get(t,"defaultDate"),new Date))},_determineDate:function(e,i,s){var n=function(t){var e=new Date;return e.setDate(e.getDate()+t),e},o=function(i){try{return t.datepicker.parseDate(t.datepicker._get(e,"dateFormat"),i,t.datepicker._getFormatConfig(e))}catch(s){}for(var n=(i.toLowerCase().match(/^c/)?t.datepicker._getDate(e):null)||new Date,o=n.getFullYear(),a=n.getMonth(),r=n.getDate(),h=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,l=h.exec(i);l;){switch(l[2]||"d"){case"d":case"D":r+=parseInt(l[1],10);break;case"w":case"W":r+=7*parseInt(l[1],10);break;case"m":case"M":a+=parseInt(l[1],10),r=Math.min(r,t.datepicker._getDaysInMonth(o,a));break;case"y":case"Y":o+=parseInt(l[1],10),r=Math.min(r,t.datepicker._getDaysInMonth(o,a))}l=h.exec(i)}return new Date(o,a,r)},a=null==i||""===i?s:"string"==typeof i?o(i):"number"==typeof i?isNaN(i)?s:n(i):new Date(i.getTime());return a=a&&"Invalid Date"==""+a?s:a,a&&(a.setHours(0),a.setMinutes(0),a.setSeconds(0),a.setMilliseconds(0)),this._daylightSavingAdjust(a)},_daylightSavingAdjust:function(t){return t?(t.setHours(t.getHours()>12?t.getHours()+2:0),t):null},_setDate:function(t,e,i){var s=!e,n=t.selectedMonth,o=t.selectedYear,a=this._restrictMinMax(t,this._determineDate(t,e,new Date));t.selectedDay=t.currentDay=a.getDate(),t.drawMonth=t.selectedMonth=t.currentMonth=a.getMonth(),t.drawYear=t.selectedYear=t.currentYear=a.getFullYear(),n===t.selectedMonth&&o===t.selectedYear||i||this._notifyChange(t),this._adjustInstDate(t),t.input&&t.input.val(s?"":this._formatDate(t))},_getDate:function(t){var e=!t.currentYear||t.input&&""===t.input.val()?null:this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return e},_attachHandlers:function(e){var i=this._get(e,"stepMonths"),s="#"+e.id.replace(/\\\\/g,"\\");e.dpDiv.find("[data-handler]").map(function(){var e={prev:function(){t.datepicker._adjustDate(s,-i,"M")},next:function(){t.datepicker._adjustDate(s,+i,"M")},hide:function(){t.datepicker._hideDatepicker()},today:function(){t.datepicker._gotoToday(s)},selectDay:function(){return t.datepicker._selectDay(s,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return t.datepicker._selectMonthYear(s,this,"M"),!1},selectYear:function(){return t.datepicker._selectMonthYear(s,this,"Y"),!1}};t(this).bind(this.getAttribute("data-event"),e[this.getAttribute("data-handler")])})},_generateHTML:function(t){var e,i,s,n,o,a,r,h,l,c,u,d,p,f,g,m,v,_,b,y,w,k,x,D,C,I,P,T,M,S,z,A,H,E,N,W,O,F,R,L=new Date,j=this._daylightSavingAdjust(new Date(L.getFullYear(),L.getMonth(),L.getDate())),Y=this._get(t,"isRTL"),B=this._get(t,"showButtonPanel"),V=this._get(t,"hideIfNoPrevNext"),K=this._get(t,"navigationAsDateFormat"),U=this._getNumberOfMonths(t),q=this._get(t,"showCurrentAtPos"),Q=this._get(t,"stepMonths"),X=1!==U[0]||1!==U[1],$=this._daylightSavingAdjust(t.currentDay?new Date(t.currentYear,t.currentMonth,t.currentDay):new Date(9999,9,9)),G=this._getMinMaxDate(t,"min"),J=this._getMinMaxDate(t,"max"),Z=t.drawMonth-q,te=t.drawYear;if(0>Z&&(Z+=12,te--),J)for(e=this._daylightSavingAdjust(new Date(J.getFullYear(),J.getMonth()-U[0]*U[1]+1,J.getDate())),e=G&&G>e?G:e;this._daylightSavingAdjust(new Date(te,Z,1))>e;)Z--,0>Z&&(Z=11,te--);for(t.drawMonth=Z,t.drawYear=te,i=this._get(t,"prevText"),i=K?this.formatDate(i,this._daylightSavingAdjust(new Date(te,Z-Q,1)),this._getFormatConfig(t)):i,s=this._canAdjustMonth(t,-1,te,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":V?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",n=this._get(t,"nextText"),n=K?this.formatDate(n,this._daylightSavingAdjust(new Date(te,Z+Q,1)),this._getFormatConfig(t)):n,o=this._canAdjustMonth(t,1,te,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>":V?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>",a=this._get(t,"currentText"),r=this._get(t,"gotoCurrent")&&t.currentDay?$:j,a=K?this.formatDate(a,r,this._getFormatConfig(t)):a,h=t.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(t,"closeText")+"</button>",l=B?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?h:"")+(this._isInRange(t,r)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+a+"</button>":"")+(Y?"":h)+"</div>":"",c=parseInt(this._get(t,"firstDay"),10),c=isNaN(c)?0:c,u=this._get(t,"showWeek"),d=this._get(t,"dayNames"),p=this._get(t,"dayNamesMin"),f=this._get(t,"monthNames"),g=this._get(t,"monthNamesShort"),m=this._get(t,"beforeShowDay"),v=this._get(t,"showOtherMonths"),_=this._get(t,"selectOtherMonths"),b=this._getDefaultDate(t),y="",k=0;U[0]>k;k++){for(x="",this.maxRows=4,D=0;U[1]>D;D++){if(C=this._daylightSavingAdjust(new Date(te,Z,t.selectedDay)),I=" ui-corner-all",P="",X){if(P+="<div class='ui-datepicker-group",U[1]>1)switch(D){case 0:P+=" ui-datepicker-group-first",I=" ui-corner-"+(Y?"right":"left");break;case U[1]-1:P+=" ui-datepicker-group-last",I=" ui-corner-"+(Y?"left":"right");break;default:P+=" ui-datepicker-group-middle",I=""}P+="'>"}for(P+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+I+"'>"+(/all|left/.test(I)&&0===k?Y?o:s:"")+(/all|right/.test(I)&&0===k?Y?s:o:"")+this._generateMonthYearHeader(t,Z,te,G,J,k>0||D>0,f,g)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",T=u?"<th class='ui-datepicker-week-col'>"+this._get(t,"weekHeader")+"</th>":"",w=0;7>w;w++)M=(w+c)%7,T+="<th"+((w+c+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+d[M]+"'>"+p[M]+"</span></th>";for(P+=T+"</tr></thead><tbody>",S=this._getDaysInMonth(te,Z),te===t.selectedYear&&Z===t.selectedMonth&&(t.selectedDay=Math.min(t.selectedDay,S)),z=(this._getFirstDayOfMonth(te,Z)-c+7)%7,A=Math.ceil((z+S)/7),H=X?this.maxRows>A?this.maxRows:A:A,this.maxRows=H,E=this._daylightSavingAdjust(new Date(te,Z,1-z)),N=0;H>N;N++){for(P+="<tr>",W=u?"<td class='ui-datepicker-week-col'>"+this._get(t,"calculateWeek")(E)+"</td>":"",w=0;7>w;w++)O=m?m.apply(t.input?t.input[0]:null,[E]):[!0,""],F=E.getMonth()!==Z,R=F&&!_||!O[0]||G&&G>E||J&&E>J,W+="<td class='"+((w+c+6)%7>=5?" ui-datepicker-week-end":"")+(F?" ui-datepicker-other-month":"")+(E.getTime()===C.getTime()&&Z===t.selectedMonth&&t._keyEvent||b.getTime()===E.getTime()&&b.getTime()===C.getTime()?" "+this._dayOverClass:"")+(R?" "+this._unselectableClass+" ui-state-disabled":"")+(F&&!v?"":" "+O[1]+(E.getTime()===$.getTime()?" "+this._currentClass:"")+(E.getTime()===j.getTime()?" ui-datepicker-today":""))+"'"+(F&&!v||!O[2]?"":" title='"+O[2].replace(/'/g,"&#39;")+"'")+(R?"":" data-handler='selectDay' data-event='click' data-month='"+E.getMonth()+"' data-year='"+E.getFullYear()+"'")+">"+(F&&!v?"&#xa0;":R?"<span class='ui-state-default'>"+E.getDate()+"</span>":"<a class='ui-state-default"+(E.getTime()===j.getTime()?" ui-state-highlight":"")+(E.getTime()===$.getTime()?" ui-state-active":"")+(F?" ui-priority-secondary":"")+"' href='#'>"+E.getDate()+"</a>")+"</td>",E.setDate(E.getDate()+1),E=this._daylightSavingAdjust(E);P+=W+"</tr>"}Z++,Z>11&&(Z=0,te++),P+="</tbody></table>"+(X?"</div>"+(U[0]>0&&D===U[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),x+=P}y+=x}return y+=l,t._keyEvent=!1,y},_generateMonthYearHeader:function(t,e,i,s,n,o,a,r){var h,l,c,u,d,p,f,g,m=this._get(t,"changeMonth"),v=this._get(t,"changeYear"),_=this._get(t,"showMonthAfterYear"),b="<div class='ui-datepicker-title'>",y="";if(o||!m)y+="<span class='ui-datepicker-month'>"+a[e]+"</span>";else{for(h=s&&s.getFullYear()===i,l=n&&n.getFullYear()===i,y+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",c=0;12>c;c++)(!h||c>=s.getMonth())&&(!l||n.getMonth()>=c)&&(y+="<option value='"+c+"'"+(c===e?" selected='selected'":"")+">"+r[c]+"</option>");y+="</select>"}if(_||(b+=y+(!o&&m&&v?"":"&#xa0;")),!t.yearshtml)if(t.yearshtml="",o||!v)b+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(u=this._get(t,"yearRange").split(":"),d=(new Date).getFullYear(),p=function(t){var e=t.match(/c[+\-].*/)?i+parseInt(t.substring(1),10):t.match(/[+\-].*/)?d+parseInt(t,10):parseInt(t,10);return isNaN(e)?d:e},f=p(u[0]),g=Math.max(f,p(u[1]||"")),f=s?Math.max(f,s.getFullYear()):f,g=n?Math.min(g,n.getFullYear()):g,t.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";g>=f;f++)t.yearshtml+="<option value='"+f+"'"+(f===i?" selected='selected'":"")+">"+f+"</option>";t.yearshtml+="</select>",b+=t.yearshtml,t.yearshtml=null}return b+=this._get(t,"yearSuffix"),_&&(b+=(!o&&m&&v?"":"&#xa0;")+y),b+="</div>"},_adjustInstDate:function(t,e,i){var s=t.drawYear+("Y"===i?e:0),n=t.drawMonth+("M"===i?e:0),o=Math.min(t.selectedDay,this._getDaysInMonth(s,n))+("D"===i?e:0),a=this._restrictMinMax(t,this._daylightSavingAdjust(new Date(s,n,o)));t.selectedDay=a.getDate(),t.drawMonth=t.selectedMonth=a.getMonth(),t.drawYear=t.selectedYear=a.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(t)},_restrictMinMax:function(t,e){var i=this._getMinMaxDate(t,"min"),s=this._getMinMaxDate(t,"max"),n=i&&i>e?i:e;return s&&n>s?s:n},_notifyChange:function(t){var e=this._get(t,"onChangeMonthYear");e&&e.apply(t.input?t.input[0]:null,[t.selectedYear,t.selectedMonth+1,t])},_getNumberOfMonths:function(t){var e=this._get(t,"numberOfMonths");return null==e?[1,1]:"number"==typeof e?[1,e]:e},_getMinMaxDate:function(t,e){return this._determineDate(t,this._get(t,e+"Date"),null)},_getDaysInMonth:function(t,e){return 32-this._daylightSavingAdjust(new Date(t,e,32)).getDate()},_getFirstDayOfMonth:function(t,e){return new Date(t,e,1).getDay()},_canAdjustMonth:function(t,e,i,s){var n=this._getNumberOfMonths(t),o=this._daylightSavingAdjust(new Date(i,s+(0>e?e:n[0]*n[1]),1));return 0>e&&o.setDate(this._getDaysInMonth(o.getFullYear(),o.getMonth())),this._isInRange(t,o)},_isInRange:function(t,e){var i,s,n=this._getMinMaxDate(t,"min"),o=this._getMinMaxDate(t,"max"),a=null,r=null,h=this._get(t,"yearRange");return h&&(i=h.split(":"),s=(new Date).getFullYear(),a=parseInt(i[0],10),r=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(a+=s),i[1].match(/[+\-].*/)&&(r+=s)),(!n||e.getTime()>=n.getTime())&&(!o||e.getTime()<=o.getTime())&&(!a||e.getFullYear()>=a)&&(!r||r>=e.getFullYear())},_getFormatConfig:function(t){var e=this._get(t,"shortYearCutoff");return e="string"!=typeof e?e:(new Date).getFullYear()%100+parseInt(e,10),{shortYearCutoff:e,dayNamesShort:this._get(t,"dayNamesShort"),dayNames:this._get(t,"dayNames"),monthNamesShort:this._get(t,"monthNamesShort"),monthNames:this._get(t,"monthNames")}},_formatDate:function(t,e,i,s){e||(t.currentDay=t.selectedDay,t.currentMonth=t.selectedMonth,t.currentYear=t.selectedYear);var n=e?"object"==typeof e?e:this._daylightSavingAdjust(new Date(s,i,e)):this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return this.formatDate(this._get(t,"dateFormat"),n,this._getFormatConfig(t))}}),t.fn.datepicker=function(e){if(!this.length)return this;t.datepicker.initialized||(t(document).mousedown(t.datepicker._checkExternalClick),t.datepicker.initialized=!0),0===t("#"+t.datepicker._mainDivId).length&&t("body").append(t.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof e||"isDisabled"!==e&&"getDate"!==e&&"widget"!==e?"option"===e&&2===arguments.length&&"string"==typeof arguments[1]?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof e?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this].concat(i)):t.datepicker._attachDatepicker(this,e)}):t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i))},t.datepicker=new i,t.datepicker.initialized=!1,t.datepicker.uuid=(new Date).getTime(),t.datepicker.version="1.10.3"}(jQuery),function(t){var e={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};t.widget("ui.dialog",{version:"1.10.3",options:{appendTo:"body",autoOpen:!0,buttons:[],closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(e){var i=t(this).css(e).offset().top;0>i&&t(this).css("top",e.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),this.options.title=this.options.title||this.originalTitle,this._createWrapper(),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&t.fn.draggable&&this._makeDraggable(),this.options.resizable&&t.fn.resizable&&this._makeResizable(),this._isOpen=!1},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var e=this.options.appendTo;return e&&(e.jquery||e.nodeType)?t(e):this.document.find(e||"body").eq(0)},_destroy:function(){var t,e=this.originalPosition;this._destroyOverlay(),this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach(),this.uiDialog.stop(!0,!0).remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),t=e.parent.children().eq(e.index),t.length&&t[0]!==this.element[0]?t.before(this.element):e.parent.append(this.element)},widget:function(){return this.uiDialog},disable:t.noop,enable:t.noop,close:function(e){var i=this;this._isOpen&&this._trigger("beforeClose",e)!==!1&&(this._isOpen=!1,this._destroyOverlay(),this.opener.filter(":focusable").focus().length||t(this.document[0].activeElement).blur(),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",e)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(t,e){var i=!!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;return i&&!e&&this._trigger("focus",t),i},open:function(){var e=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),undefined):(this._isOpen=!0,this.opener=t(this.document[0].activeElement),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this._show(this.uiDialog,this.options.show,function(){e._focusTabbable(),e._trigger("focus")}),this._trigger("open"),undefined)},_focusTabbable:function(){var t=this.element.find("[autofocus]");t.length||(t=this.element.find(":tabbable")),t.length||(t=this.uiDialogButtonPane.find(":tabbable")),t.length||(t=this.uiDialogTitlebarClose.filter(":tabbable")),t.length||(t=this.uiDialog),t.eq(0).focus()},_keepFocus:function(e){function i(){var e=this.document[0].activeElement,i=this.uiDialog[0]===e||t.contains(this.uiDialog[0],e);i||this._focusTabbable()}e.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=t("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "+this.options.dialogClass).hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._on(this.uiDialog,{keydown:function(e){if(this.options.closeOnEscape&&!e.isDefaultPrevented()&&e.keyCode&&e.keyCode===t.ui.keyCode.ESCAPE)return e.preventDefault(),this.close(e),undefined;if(e.keyCode===t.ui.keyCode.TAB){var i=this.uiDialog.find(":tabbable"),s=i.filter(":first"),n=i.filter(":last");e.target!==n[0]&&e.target!==this.uiDialog[0]||e.shiftKey?e.target!==s[0]&&e.target!==this.uiDialog[0]||!e.shiftKey||(n.focus(1),e.preventDefault()):(s.focus(1),e.preventDefault())}},mousedown:function(t){this._moveToTop(t)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var e;this.uiDialogTitlebar=t("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog),this._on(this.uiDialogTitlebar,{mousedown:function(e){t(e.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.focus()}}),this.uiDialogTitlebarClose=t("<button></button>").button({label:this.options.closeText,icons:{primary:"ui-icon-closethick"},text:!1}).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar),this._on(this.uiDialogTitlebarClose,{click:function(t){t.preventDefault(),this.close(t)}}),e=t("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar),this._title(e),this.uiDialog.attr({"aria-labelledby":e.attr("id")})},_title:function(t){this.options.title||t.html("&#160;"),t.text(this.options.title)},_createButtonPane:function(){this.uiDialogButtonPane=t("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),this.uiButtonSet=t("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane),this._createButtons()},_createButtons:function(){var e=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),t.isEmptyObject(i)||t.isArray(i)&&!i.length?(this.uiDialog.removeClass("ui-dialog-buttons"),undefined):(t.each(i,function(i,s){var n,o;s=t.isFunction(s)?{click:s,text:i}:s,s=t.extend({type:"button"},s),n=s.click,s.click=function(){n.apply(e.element[0],arguments)},o={icons:s.icons,text:s.showText},delete s.icons,delete s.showText,t("<button></button>",s).button(o).appendTo(e.uiButtonSet)}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),undefined)},_makeDraggable:function(){function e(t){return{position:t.position,offset:t.offset}}var i=this,s=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(s,n){t(this).addClass("ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",s,e(n))},drag:function(t,s){i._trigger("drag",t,e(s))},stop:function(n,o){s.position=[o.position.left-i.document.scrollLeft(),o.position.top-i.document.scrollTop()],t(this).removeClass("ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",n,e(o))}})},_makeResizable:function(){function e(t){return{originalPosition:t.originalPosition,originalSize:t.originalSize,position:t.position,size:t.size}
}var i=this,s=this.options,n=s.resizable,o=this.uiDialog.css("position"),a="string"==typeof n?n:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:s.maxWidth,maxHeight:s.maxHeight,minWidth:s.minWidth,minHeight:this._minHeight(),handles:a,start:function(s,n){t(this).addClass("ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",s,e(n))},resize:function(t,s){i._trigger("resize",t,e(s))},stop:function(n,o){s.height=t(this).height(),s.width=t(this).width(),t(this).removeClass("ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",n,e(o))}}).css("position",o)},_minHeight:function(){var t=this.options;return"auto"===t.height?t.minHeight:Math.min(t.minHeight,t.height)},_position:function(){var t=this.uiDialog.is(":visible");t||this.uiDialog.show(),this.uiDialog.position(this.options.position),t||this.uiDialog.hide()},_setOptions:function(s){var n=this,o=!1,a={};t.each(s,function(t,s){n._setOption(t,s),t in e&&(o=!0),t in i&&(a[t]=s)}),o&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",a)},_setOption:function(t,e){var i,s,n=this.uiDialog;"dialogClass"===t&&n.removeClass(this.options.dialogClass).addClass(e),"disabled"!==t&&(this._super(t,e),"appendTo"===t&&this.uiDialog.appendTo(this._appendTo()),"buttons"===t&&this._createButtons(),"closeText"===t&&this.uiDialogTitlebarClose.button({label:""+e}),"draggable"===t&&(i=n.is(":data(ui-draggable)"),i&&!e&&n.draggable("destroy"),!i&&e&&this._makeDraggable()),"position"===t&&this._position(),"resizable"===t&&(s=n.is(":data(ui-resizable)"),s&&!e&&n.resizable("destroy"),s&&"string"==typeof e&&n.resizable("option","handles",e),s||e===!1||this._makeResizable()),"title"===t&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var t,e,i,s=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),s.minWidth>s.width&&(s.width=s.minWidth),t=this.uiDialog.css({height:"auto",width:s.width}).outerHeight(),e=Math.max(0,s.minHeight-t),i="number"==typeof s.maxHeight?Math.max(0,s.maxHeight-t):"none","auto"===s.height?this.element.css({minHeight:e,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,s.height-t)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var e=t(this);return t("<div>").css({position:"absolute",width:e.outerWidth(),height:e.outerHeight()}).appendTo(e.parent()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(e){return t(e.target).closest(".ui-dialog").length?!0:!!t(e.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var e=this,i=this.widgetFullName;t.ui.dialog.overlayInstances||this._delay(function(){t.ui.dialog.overlayInstances&&this.document.bind("focusin.dialog",function(s){e._allowInteraction(s)||(s.preventDefault(),t(".ui-dialog:visible:last .ui-dialog-content").data(i)._focusTabbable())})}),this.overlay=t("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo()),this._on(this.overlay,{mousedown:"_keepFocus"}),t.ui.dialog.overlayInstances++}},_destroyOverlay:function(){this.options.modal&&this.overlay&&(t.ui.dialog.overlayInstances--,t.ui.dialog.overlayInstances||this.document.unbind("focusin.dialog"),this.overlay.remove(),this.overlay=null)}}),t.ui.dialog.overlayInstances=0,t.uiBackCompat!==!1&&t.widget("ui.dialog",t.ui.dialog,{_position:function(){var e,i=this.options.position,s=[],n=[0,0];i?(("string"==typeof i||"object"==typeof i&&"0"in i)&&(s=i.split?i.split(" "):[i[0],i[1]],1===s.length&&(s[1]=s[0]),t.each(["left","top"],function(t,e){+s[t]===s[t]&&(n[t]=s[t],s[t]=e)}),i={my:s[0]+(0>n[0]?n[0]:"+"+n[0])+" "+s[1]+(0>n[1]?n[1]:"+"+n[1]),at:s.join(" ")}),i=t.extend({},t.ui.dialog.prototype.options.position,i)):i=t.ui.dialog.prototype.options.position,e=this.uiDialog.is(":visible"),e||this.uiDialog.show(),this.uiDialog.position(i),e||this.uiDialog.hide()}})}(jQuery),function(t){var e=/up|down|vertical/,i=/up|left|vertical|horizontal/;t.effects.effect.blind=function(s,n){var o,a,r,h=t(this),l=["position","top","bottom","left","right","height","width"],c=t.effects.setMode(h,s.mode||"hide"),u=s.direction||"up",d=e.test(u),p=d?"height":"width",f=d?"top":"left",g=i.test(u),m={},v="show"===c;h.parent().is(".ui-effects-wrapper")?t.effects.save(h.parent(),l):t.effects.save(h,l),h.show(),o=t.effects.createWrapper(h).css({overflow:"hidden"}),a=o[p](),r=parseFloat(o.css(f))||0,m[p]=v?a:0,g||(h.css(d?"bottom":"right",0).css(d?"top":"left","auto").css({position:"absolute"}),m[f]=v?r:a+r),v&&(o.css(p,0),g||o.css(f,r+a)),o.animate(m,{duration:s.duration,easing:s.easing,queue:!1,complete:function(){"hide"===c&&h.hide(),t.effects.restore(h,l),t.effects.removeWrapper(h),n()}})}}(jQuery),function(t){t.effects.effect.bounce=function(e,i){var s,n,o,a=t(this),r=["position","top","bottom","left","right","height","width"],h=t.effects.setMode(a,e.mode||"effect"),l="hide"===h,c="show"===h,u=e.direction||"up",d=e.distance,p=e.times||5,f=2*p+(c||l?1:0),g=e.duration/f,m=e.easing,v="up"===u||"down"===u?"top":"left",_="up"===u||"left"===u,b=a.queue(),y=b.length;for((c||l)&&r.push("opacity"),t.effects.save(a,r),a.show(),t.effects.createWrapper(a),d||(d=a["top"===v?"outerHeight":"outerWidth"]()/3),c&&(o={opacity:1},o[v]=0,a.css("opacity",0).css(v,_?2*-d:2*d).animate(o,g,m)),l&&(d/=Math.pow(2,p-1)),o={},o[v]=0,s=0;p>s;s++)n={},n[v]=(_?"-=":"+=")+d,a.animate(n,g,m).animate(o,g,m),d=l?2*d:d/2;l&&(n={opacity:0},n[v]=(_?"-=":"+=")+d,a.animate(n,g,m)),a.queue(function(){l&&a.hide(),t.effects.restore(a,r),t.effects.removeWrapper(a),i()}),y>1&&b.splice.apply(b,[1,0].concat(b.splice(y,f+1))),a.dequeue()}}(jQuery),function(t){t.effects.effect.clip=function(e,i){var s,n,o,a=t(this),r=["position","top","bottom","left","right","height","width"],h=t.effects.setMode(a,e.mode||"hide"),l="show"===h,c=e.direction||"vertical",u="vertical"===c,d=u?"height":"width",p=u?"top":"left",f={};t.effects.save(a,r),a.show(),s=t.effects.createWrapper(a).css({overflow:"hidden"}),n="IMG"===a[0].tagName?s:a,o=n[d](),l&&(n.css(d,0),n.css(p,o/2)),f[d]=l?o:0,f[p]=l?0:o/2,n.animate(f,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){l||a.hide(),t.effects.restore(a,r),t.effects.removeWrapper(a),i()}})}}(jQuery),function(t){t.effects.effect.drop=function(e,i){var s,n=t(this),o=["position","top","bottom","left","right","opacity","height","width"],a=t.effects.setMode(n,e.mode||"hide"),r="show"===a,h=e.direction||"left",l="up"===h||"down"===h?"top":"left",c="up"===h||"left"===h?"pos":"neg",u={opacity:r?1:0};t.effects.save(n,o),n.show(),t.effects.createWrapper(n),s=e.distance||n["top"===l?"outerHeight":"outerWidth"](!0)/2,r&&n.css("opacity",0).css(l,"pos"===c?-s:s),u[l]=(r?"pos"===c?"+=":"-=":"pos"===c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===a&&n.hide(),t.effects.restore(n,o),t.effects.removeWrapper(n),i()}})}}(jQuery),function(t){t.effects.effect.explode=function(e,i){function s(){b.push(this),b.length===u*d&&n()}function n(){p.css({visibility:"visible"}),t(b).remove(),g||p.hide(),i()}var o,a,r,h,l,c,u=e.pieces?Math.round(Math.sqrt(e.pieces)):3,d=u,p=t(this),f=t.effects.setMode(p,e.mode||"hide"),g="show"===f,m=p.show().css("visibility","hidden").offset(),v=Math.ceil(p.outerWidth()/d),_=Math.ceil(p.outerHeight()/u),b=[];for(o=0;u>o;o++)for(h=m.top+o*_,c=o-(u-1)/2,a=0;d>a;a++)r=m.left+a*v,l=a-(d-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-a*v,top:-o*_}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:v,height:_,left:r+(g?l*v:0),top:h+(g?c*_:0),opacity:g?0:1}).animate({left:r+(g?0:l*v),top:h+(g?0:c*_),opacity:g?1:0},e.duration||500,e.easing,s)}}(jQuery),function(t){t.effects.effect.fade=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"toggle");s.animate({opacity:n},{queue:!1,duration:e.duration,easing:e.easing,complete:i})}}(jQuery),function(t){t.effects.effect.fold=function(e,i){var s,n,o=t(this),a=["position","top","bottom","left","right","height","width"],r=t.effects.setMode(o,e.mode||"hide"),h="show"===r,l="hide"===r,c=e.size||15,u=/([0-9]+)%/.exec(c),d=!!e.horizFirst,p=h!==d,f=p?["width","height"]:["height","width"],g=e.duration/2,m={},v={};t.effects.save(o,a),o.show(),s=t.effects.createWrapper(o).css({overflow:"hidden"}),n=p?[s.width(),s.height()]:[s.height(),s.width()],u&&(c=parseInt(u[1],10)/100*n[l?0:1]),h&&s.css(d?{height:0,width:c}:{height:c,width:0}),m[f[0]]=h?n[0]:c,v[f[1]]=h?n[1]:0,s.animate(m,g,e.easing).animate(v,g,e.easing,function(){l&&o.hide(),t.effects.restore(o,a),t.effects.removeWrapper(o),i()})}}(jQuery),function(t){t.effects.effect.highlight=function(e,i){var s=t(this),n=["backgroundImage","backgroundColor","opacity"],o=t.effects.setMode(s,e.mode||"show"),a={backgroundColor:s.css("backgroundColor")};"hide"===o&&(a.opacity=0),t.effects.save(s,n),s.show().css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(a,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&s.hide(),t.effects.restore(s,n),i()}})}}(jQuery),function(t){t.effects.effect.pulsate=function(e,i){var s,n=t(this),o=t.effects.setMode(n,e.mode||"show"),a="show"===o,r="hide"===o,h=a||"hide"===o,l=2*(e.times||5)+(h?1:0),c=e.duration/l,u=0,d=n.queue(),p=d.length;for((a||!n.is(":visible"))&&(n.css("opacity",0).show(),u=1),s=1;l>s;s++)n.animate({opacity:u},c,e.easing),u=1-u;n.animate({opacity:u},c,e.easing),n.queue(function(){r&&n.hide(),i()}),p>1&&d.splice.apply(d,[1,0].concat(d.splice(p,l+1))),n.dequeue()}}(jQuery),function(t){t.effects.effect.puff=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"hide"),o="hide"===n,a=parseInt(e.percent,10)||150,r=a/100,h={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()};t.extend(e,{effect:"scale",queue:!1,fade:!0,mode:n,complete:i,percent:o?a:100,from:o?h:{height:h.height*r,width:h.width*r,outerHeight:h.outerHeight*r,outerWidth:h.outerWidth*r}}),s.effect(e)},t.effects.effect.scale=function(e,i){var s=t(this),n=t.extend(!0,{},e),o=t.effects.setMode(s,e.mode||"effect"),a=parseInt(e.percent,10)||(0===parseInt(e.percent,10)?0:"hide"===o?0:100),r=e.direction||"both",h=e.origin,l={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()},c={y:"horizontal"!==r?a/100:1,x:"vertical"!==r?a/100:1};n.effect="size",n.queue=!1,n.complete=i,"effect"!==o&&(n.origin=h||["middle","center"],n.restore=!0),n.from=e.from||("show"===o?{height:0,width:0,outerHeight:0,outerWidth:0}:l),n.to={height:l.height*c.y,width:l.width*c.x,outerHeight:l.outerHeight*c.y,outerWidth:l.outerWidth*c.x},n.fade&&("show"===o&&(n.from.opacity=0,n.to.opacity=1),"hide"===o&&(n.from.opacity=1,n.to.opacity=0)),s.effect(n)},t.effects.effect.size=function(e,i){var s,n,o,a=t(this),r=["position","top","bottom","left","right","width","height","overflow","opacity"],h=["position","top","bottom","left","right","overflow","opacity"],l=["width","height","overflow"],c=["fontSize"],u=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],d=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=t.effects.setMode(a,e.mode||"effect"),f=e.restore||"effect"!==p,g=e.scale||"both",m=e.origin||["middle","center"],v=a.css("position"),_=f?r:h,b={height:0,width:0,outerHeight:0,outerWidth:0};"show"===p&&a.show(),s={height:a.height(),width:a.width(),outerHeight:a.outerHeight(),outerWidth:a.outerWidth()},"toggle"===e.mode&&"show"===p?(a.from=e.to||b,a.to=e.from||s):(a.from=e.from||("show"===p?b:s),a.to=e.to||("hide"===p?b:s)),o={from:{y:a.from.height/s.height,x:a.from.width/s.width},to:{y:a.to.height/s.height,x:a.to.width/s.width}},("box"===g||"both"===g)&&(o.from.y!==o.to.y&&(_=_.concat(u),a.from=t.effects.setTransition(a,u,o.from.y,a.from),a.to=t.effects.setTransition(a,u,o.to.y,a.to)),o.from.x!==o.to.x&&(_=_.concat(d),a.from=t.effects.setTransition(a,d,o.from.x,a.from),a.to=t.effects.setTransition(a,d,o.to.x,a.to))),("content"===g||"both"===g)&&o.from.y!==o.to.y&&(_=_.concat(c).concat(l),a.from=t.effects.setTransition(a,c,o.from.y,a.from),a.to=t.effects.setTransition(a,c,o.to.y,a.to)),t.effects.save(a,_),a.show(),t.effects.createWrapper(a),a.css("overflow","hidden").css(a.from),m&&(n=t.effects.getBaseline(m,s),a.from.top=(s.outerHeight-a.outerHeight())*n.y,a.from.left=(s.outerWidth-a.outerWidth())*n.x,a.to.top=(s.outerHeight-a.to.outerHeight)*n.y,a.to.left=(s.outerWidth-a.to.outerWidth)*n.x),a.css(a.from),("content"===g||"both"===g)&&(u=u.concat(["marginTop","marginBottom"]).concat(c),d=d.concat(["marginLeft","marginRight"]),l=r.concat(u).concat(d),a.find("*[width]").each(function(){var i=t(this),s={height:i.height(),width:i.width(),outerHeight:i.outerHeight(),outerWidth:i.outerWidth()};f&&t.effects.save(i,l),i.from={height:s.height*o.from.y,width:s.width*o.from.x,outerHeight:s.outerHeight*o.from.y,outerWidth:s.outerWidth*o.from.x},i.to={height:s.height*o.to.y,width:s.width*o.to.x,outerHeight:s.height*o.to.y,outerWidth:s.width*o.to.x},o.from.y!==o.to.y&&(i.from=t.effects.setTransition(i,u,o.from.y,i.from),i.to=t.effects.setTransition(i,u,o.to.y,i.to)),o.from.x!==o.to.x&&(i.from=t.effects.setTransition(i,d,o.from.x,i.from),i.to=t.effects.setTransition(i,d,o.to.x,i.to)),i.css(i.from),i.animate(i.to,e.duration,e.easing,function(){f&&t.effects.restore(i,l)})})),a.animate(a.to,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){0===a.to.opacity&&a.css("opacity",a.from.opacity),"hide"===p&&a.hide(),t.effects.restore(a,_),f||("static"===v?a.css({position:"relative",top:a.to.top,left:a.to.left}):t.each(["top","left"],function(t,e){a.css(e,function(e,i){var s=parseInt(i,10),n=t?a.to.left:a.to.top;return"auto"===i?n+"px":s+n+"px"})})),t.effects.removeWrapper(a),i()}})}}(jQuery),function(t){t.effects.effect.shake=function(e,i){var s,n=t(this),o=["position","top","bottom","left","right","height","width"],a=t.effects.setMode(n,e.mode||"effect"),r=e.direction||"left",h=e.distance||20,l=e.times||3,c=2*l+1,u=Math.round(e.duration/c),d="up"===r||"down"===r?"top":"left",p="up"===r||"left"===r,f={},g={},m={},v=n.queue(),_=v.length;for(t.effects.save(n,o),n.show(),t.effects.createWrapper(n),f[d]=(p?"-=":"+=")+h,g[d]=(p?"+=":"-=")+2*h,m[d]=(p?"-=":"+=")+2*h,n.animate(f,u,e.easing),s=1;l>s;s++)n.animate(g,u,e.easing).animate(m,u,e.easing);n.animate(g,u,e.easing).animate(f,u/2,e.easing).queue(function(){"hide"===a&&n.hide(),t.effects.restore(n,o),t.effects.removeWrapper(n),i()}),_>1&&v.splice.apply(v,[1,0].concat(v.splice(_,c+1))),n.dequeue()}}(jQuery),function(t){t.effects.effect.slide=function(e,i){var s,n=t(this),o=["position","top","bottom","left","right","width","height"],a=t.effects.setMode(n,e.mode||"show"),r="show"===a,h=e.direction||"left",l="up"===h||"down"===h?"top":"left",c="up"===h||"left"===h,u={};t.effects.save(n,o),n.show(),s=e.distance||n["top"===l?"outerHeight":"outerWidth"](!0),t.effects.createWrapper(n).css({overflow:"hidden"}),r&&n.css(l,c?isNaN(s)?"-"+s:-s:s),u[l]=(r?c?"+=":"-=":c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===a&&n.hide(),t.effects.restore(n,o),t.effects.removeWrapper(n),i()}})}}(jQuery),function(t){t.effects.effect.transfer=function(e,i){var s=t(this),n=t(e.to),o="fixed"===n.css("position"),a=t("body"),r=o?a.scrollTop():0,h=o?a.scrollLeft():0,l=n.offset(),c={top:l.top-r,left:l.left-h,height:n.innerHeight(),width:n.innerWidth()},u=s.offset(),d=t("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(e.className).css({top:u.top-r,left:u.left-h,height:s.innerHeight(),width:s.innerWidth(),position:o?"fixed":"absolute"}).animate(c,e.duration,e.easing,function(){d.remove(),i()})}}(jQuery),function(t){t.widget("ui.menu",{version:"1.10.3",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,t.proxy(function(t){this.options.disabled&&t.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(t){t.preventDefault()},"click .ui-state-disabled > a":function(t){t.preventDefault()},"click .ui-menu-item:has(a)":function(e){var i=t(e.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.mouseHandled=!0,this.select(e),i.has(".ui-menu").length?this.expand(e):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(e){var i=t(e.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(e,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.children(".ui-menu-item").eq(0);e||this.focus(t,i)},blur:function(e){this._delay(function(){t.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(e)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(e){t(e.target).closest(".ui-menu").length||this.collapseAll(e),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var e=t(this);e.data("ui-menu-submenu-carat")&&e.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(e){function i(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var s,n,o,a,r,h=!0;switch(e.keyCode){case t.ui.keyCode.PAGE_UP:this.previousPage(e);break;case t.ui.keyCode.PAGE_DOWN:this.nextPage(e);break;case t.ui.keyCode.HOME:this._move("first","first",e);break;case t.ui.keyCode.END:this._move("last","last",e);break;case t.ui.keyCode.UP:this.previous(e);break;case t.ui.keyCode.DOWN:this.next(e);break;case t.ui.keyCode.LEFT:this.collapse(e);break;case t.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(e);break;case t.ui.keyCode.ENTER:case t.ui.keyCode.SPACE:this._activate(e);break;case t.ui.keyCode.ESCAPE:this.collapse(e);break;default:h=!1,n=this.previousFilter||"",o=String.fromCharCode(e.keyCode),a=!1,clearTimeout(this.filterTimer),o===n?a=!0:o=n+o,r=RegExp("^"+i(o),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())}),s=a&&-1!==s.index(this.active.next())?this.active.nextAll(".ui-menu-item"):s,s.length||(o=String.fromCharCode(e.keyCode),r=RegExp("^"+i(o),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())})),s.length?(this.focus(e,s),s.length>1?(this.previousFilter=o,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}h&&e.preventDefault()},_activate:function(t){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var e,i=this.options.icons.submenu,s=this.element.find(this.options.menus);s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var e=t(this),s=e.prev("a"),n=t("<span>").addClass("ui-menu-icon ui-icon "+i).data("ui-menu-submenu-carat",!0);s.attr("aria-haspopup","true").prepend(n),e.attr("aria-labelledby",s.attr("id"))}),e=s.add(this.element),e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),e.children(":not(.ui-menu-item)").each(function(){var e=t(this);/[^\-\u2014\u2013\s]/.test(e.text())||e.addClass("ui-widget-content ui-menu-divider")}),e.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!t.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){"icons"===t&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu),this._super(t,e)},focus:function(t,e){var i,s;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),s=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=e.children(".ui-menu"),i.length&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(e){var i,s,n,o,a,r;this._hasScroll()&&(i=parseFloat(t.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(t.css(this.activeMenu[0],"paddingTop"))||0,n=e.offset().top-this.activeMenu.offset().top-i-s,o=this.activeMenu.scrollTop(),a=this.activeMenu.height(),r=e.height(),0>n?this.activeMenu.scrollTop(o+n):n+r>a&&this.activeMenu.scrollTop(o+n-a+r))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",t,{item:this.active}))},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(t)},this.delay))},_open:function(e){var i=t.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden","true"),e.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:t(e&&e.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(e),this.activeMenu=s},this.delay)},_close:function(t){t||(t=this.active?this.active.parent():this.element),t.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();e&&e.length&&(this._open(e.parent()),this._delay(function(){this.focus(t,e)}))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.children(".ui-menu-item")[e]()),this.focus(i,s)},nextPage:function(e){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=t(this),0>i.offset().top-s-n}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())),undefined):(this.next(e),undefined)},previousPage:function(e){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=t(this),i.offset().top-s+n>0}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item").first())),undefined):(this.next(e),undefined)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(e){this.active=this.active||t(e.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(e,!0),this._trigger("select",e,i)}})}(jQuery),function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var o,a=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(o!==e)return o;var i,s,n=t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),a=n.children()[0];return t("body").append(n),i=a.offsetWidth,n.css("overflow","scroll"),s=a.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),o=i-s},getScrollInfo:function(e){var i=e.isWindow?"":e.element.css("overflow-x"),s=e.isWindow?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,o="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:o?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]);return{element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},t.fn.position=function(e){if(!e||!e.of)return f.apply(this,arguments);e=t.extend({},e);var o,p,g,m,v,_,b=t(e.of),y=t.position.getWithinInfo(e.within),w=t.position.getScrollInfo(y),k=(e.collision||"flip").split(" "),x={};return _=n(b),b[0].preventDefault&&(e.at="left top"),p=_.width,g=_.height,m=_.offset,v=t.extend({},m),t.each(["my","at"],function(){var t,i,s=(e[this]||"").split(" ");1===s.length&&(s=l.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=l.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),x[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===k.length&&(k[1]=k[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=g:"center"===e.at[1]&&(v.top+=g/2),o=i(x.at,p,g),v.left+=o[0],v.top+=o[1],this.each(function(){var n,l,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),_=s(this,"marginTop"),D=u+f+s(this,"marginRight")+w.width,C=d+_+s(this,"marginBottom")+w.height,I=t.extend({},v),P=i(x.my,c.outerWidth(),c.outerHeight());"right"===e.my[0]?I.left-=u:"center"===e.my[0]&&(I.left-=u/2),"bottom"===e.my[1]?I.top-=d:"center"===e.my[1]&&(I.top-=d/2),I.left+=P[0],I.top+=P[1],t.support.offsetFractions||(I.left=h(I.left),I.top=h(I.top)),n={marginLeft:f,marginTop:_},t.each(["left","top"],function(i,s){t.ui.position[k[i]]&&t.ui.position[k[i]][s](I,{targetWidth:p,targetHeight:g,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:D,collisionHeight:C,offset:[o[0]+P[0],o[1]+P[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(l=function(t){var i=m.left-I.left,s=i+p-u,n=m.top-I.top,o=n+g-d,h={target:{element:b,left:m.left,top:m.top,width:p,height:g},element:{element:c,left:I.left,top:I.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>o?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(h.horizontal="center"),d>g&&g>r(n+o)&&(h.vertical="middle"),h.important=a(r(i),r(s))>a(r(n),r(o))?"horizontal":"vertical",e.using.call(this,t,h)}),c.offset(t.extend(I,{using:l}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,o=s.width,r=t.left-e.collisionPosition.marginLeft,h=n-r,l=r+e.collisionWidth-o-n;e.collisionWidth>o?h>0&&0>=l?(i=t.left+h+e.collisionWidth-o-n,t.left+=h-i):t.left=l>0&&0>=h?n:h>l?n+o-e.collisionWidth:n:h>0?t.left+=h:l>0?t.left-=l:t.left=a(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,o=e.within.height,r=t.top-e.collisionPosition.marginTop,h=n-r,l=r+e.collisionHeight-o-n;e.collisionHeight>o?h>0&&0>=l?(i=t.top+h+e.collisionHeight-o-n,t.top+=h-i):t.top=l>0&&0>=h?n:h>l?n+o-e.collisionHeight:n:h>0?t.top+=h:l>0?t.top-=l:t.top=a(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,o=n.offset.left+n.scrollLeft,a=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=t.left-e.collisionPosition.marginLeft,c=l-h,u=l+e.collisionWidth-a-h,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-a-o,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-h,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,o=n.offset.top+n.scrollTop,a=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=t.top-e.collisionPosition.marginTop,c=l-h,u=l+e.collisionHeight-a-h,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-a-o,t.top+p+f+g>c&&(0>s||r(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-h,t.top+p+f+g>u&&(i>0||u>r(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,o,a=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(a?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},a&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(o in s)e.style[o]=s[o];e.appendChild(r),i=a||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()}(jQuery),function(t,e){t.widget("ui.progressbar",{version:"1.10.3",options:{max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue(),this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min}),this.valueDiv=t("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove()
},value:function(t){return t===e?this.options.value:(this.options.value=this._constrainedValue(t),this._refreshValue(),e)},_constrainedValue:function(t){return t===e&&(t=this.options.value),this.indeterminate=t===!1,"number"!=typeof t&&(t=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,t))},_setOptions:function(t){var e=t.value;delete t.value,this._super(t),this.options.value=this._constrainedValue(e),this._refreshValue()},_setOption:function(t,e){"max"===t&&(e=Math.max(this.min,e)),this._super(t,e)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var e=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||e>this.min).toggleClass("ui-corner-right",e===this.options.max).width(i.toFixed(0)+"%"),this.element.toggleClass("ui-progressbar-indeterminate",this.indeterminate),this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=t("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":e}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this.oldValue!==e&&(this.oldValue=e,this._trigger("change")),e===this.options.max&&this._trigger("complete")}})}(jQuery),function(t){var e=5;t.widget("ui.slider",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"),this._refresh(),this._setOption("disabled",this.options.disabled),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var e,i,s=this.options,n=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),o="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",a=[];for(i=s.values&&s.values.length||1,n.length>i&&(n.slice(i).remove(),n=n.slice(0,i)),e=n.length;i>e;e++)a.push(o);this.handles=n.add(t(a.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.each(function(e){t(this).data("ui-slider-handle-index",e)})},_createRange:function(){var e=this.options,i="";e.range?(e.range===!0&&(e.values?e.values.length&&2!==e.values.length?e.values=[e.values[0],e.values[0]]:t.isArray(e.values)&&(e.values=e.values.slice(0)):e.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=t("<div></div>").appendTo(this.element),i="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(i+("min"===e.range||"max"===e.range?" ui-slider-range-"+e.range:""))):this.range=t([])},_setupEvents:function(){var t=this.handles.add(this.range).filter("a");this._off(t),this._on(t,this._handleEvents),this._hoverable(t),this._focusable(t)},_destroy:function(){this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(e){var i,s,n,o,a,r,h,l,c=this,u=this.options;return u.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:e.pageX,y:e.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(e){var i=Math.abs(s-c.values(e));(n>i||n===i&&(e===c._lastChangedValue||c.values(e)===u.min))&&(n=i,o=t(this),a=e)}),r=this._start(e,a),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=a,o.addClass("ui-state-active").focus(),h=o.offset(),l=!t(e.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:e.pageX-h.left-o.width()/2,top:e.pageY-h.top-o.height()/2-(parseInt(o.css("borderTopWidth"),10)||0)-(parseInt(o.css("borderBottomWidth"),10)||0)+(parseInt(o.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(e,a,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(t){var e={x:t.pageX,y:t.pageY},i=this._normValueFromMouse(e);return this._slide(t,this._handleIndex,i),!1},_mouseStop:function(t){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(t,this._handleIndex),this._change(t,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(t){var e,i,s,n,o;return"horizontal"===this.orientation?(e=this.elementSize.width,i=t.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(e=this.elementSize.height,i=t.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/e,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),o=this._valueMin()+s*n,this._trimAlignValue(o)},_start:function(t,e){var i={handle:this.handles[e],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._trigger("start",t,i)},_slide:function(t,e,i){var s,n,o;this.options.values&&this.options.values.length?(s=this.values(e?0:1),2===this.options.values.length&&this.options.range===!0&&(0===e&&i>s||1===e&&s>i)&&(i=s),i!==this.values(e)&&(n=this.values(),n[e]=i,o=this._trigger("slide",t,{handle:this.handles[e],value:i,values:n}),s=this.values(e?0:1),o!==!1&&this.values(e,i,!0))):i!==this.value()&&(o=this._trigger("slide",t,{handle:this.handles[e],value:i}),o!==!1&&this.value(i))},_stop:function(t,e){var i={handle:this.handles[e],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._trigger("stop",t,i)},_change:function(t,e){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[e],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._lastChangedValue=e,this._trigger("change",t,i)}},value:function(t){return arguments.length?(this.options.value=this._trimAlignValue(t),this._refreshValue(),this._change(null,0),undefined):this._value()},values:function(e,i){var s,n,o;if(arguments.length>1)return this.options.values[e]=this._trimAlignValue(i),this._refreshValue(),this._change(null,e),undefined;if(!arguments.length)return this._values();if(!t.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(e):this.value();for(s=this.options.values,n=arguments[0],o=0;s.length>o;o+=1)s[o]=this._trimAlignValue(n[o]),this._change(null,o);this._refreshValue()},_setOption:function(e,i){var s,n=0;switch("range"===e&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),t.isArray(this.options.values)&&(n=this.options.values.length),t.Widget.prototype._setOption.apply(this,arguments),e){case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=0;n>s;s+=1)this._change(null,s);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_value:function(){var t=this.options.value;return t=this._trimAlignValue(t)},_values:function(t){var e,i,s;if(arguments.length)return e=this.options.values[t],e=this._trimAlignValue(e);if(this.options.values&&this.options.values.length){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(t){if(this._valueMin()>=t)return this._valueMin();if(t>=this._valueMax())return this._valueMax();var e=this.options.step>0?this.options.step:1,i=(t-this._valueMin())%e,s=t-i;return 2*Math.abs(i)>=e&&(s+=i>0?e:-e),parseFloat(s.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var e,i,s,n,o,a=this.options.range,r=this.options,h=this,l=this._animateOff?!1:r.animate,c={};this.options.values&&this.options.values.length?this.handles.each(function(s){i=100*((h.values(s)-h._valueMin())/(h._valueMax()-h._valueMin())),c["horizontal"===h.orientation?"left":"bottom"]=i+"%",t(this).stop(1,1)[l?"animate":"css"](c,r.animate),h.options.range===!0&&("horizontal"===h.orientation?(0===s&&h.range.stop(1,1)[l?"animate":"css"]({left:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({width:i-e+"%"},{queue:!1,duration:r.animate})):(0===s&&h.range.stop(1,1)[l?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({height:i-e+"%"},{queue:!1,duration:r.animate}))),e=i}):(s=this.value(),n=this._valueMin(),o=this._valueMax(),i=o!==n?100*((s-n)/(o-n)):0,c["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[l?"animate":"css"](c,r.animate),"min"===a&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:i+"%"},r.animate),"max"===a&&"horizontal"===this.orientation&&this.range[l?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:r.animate}),"min"===a&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:i+"%"},r.animate),"max"===a&&"vertical"===this.orientation&&this.range[l?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:r.animate}))},_handleEvents:{keydown:function(i){var s,n,o,a,r=t(i.target).data("ui-slider-handle-index");switch(i.keyCode){case t.ui.keyCode.HOME:case t.ui.keyCode.END:case t.ui.keyCode.PAGE_UP:case t.ui.keyCode.PAGE_DOWN:case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(i.preventDefault(),!this._keySliding&&(this._keySliding=!0,t(i.target).addClass("ui-state-active"),s=this._start(i,r),s===!1))return}switch(a=this.options.step,n=o=this.options.values&&this.options.values.length?this.values(r):this.value(),i.keyCode){case t.ui.keyCode.HOME:o=this._valueMin();break;case t.ui.keyCode.END:o=this._valueMax();break;case t.ui.keyCode.PAGE_UP:o=this._trimAlignValue(n+(this._valueMax()-this._valueMin())/e);break;case t.ui.keyCode.PAGE_DOWN:o=this._trimAlignValue(n-(this._valueMax()-this._valueMin())/e);break;case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:if(n===this._valueMax())return;o=this._trimAlignValue(n+a);break;case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(n===this._valueMin())return;o=this._trimAlignValue(n-a)}this._slide(i,r,o)},click:function(t){t.preventDefault()},keyup:function(e){var i=t(e.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(e,i),this._change(e,i),t(e.target).removeClass("ui-state-active"))}}})}(jQuery),function(t){function e(t){return function(){var e=this.element.val();t.apply(this,arguments),this._refresh(),e!==this.element.val()&&this._trigger("change")}}t.widget("ui.spinner",{version:"1.10.3",defaultElement:"<input>",widgetEventPrefix:"spin",options:{culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var e={},i=this.element;return t.each(["min","max","step"],function(t,s){var n=i.attr(s);void 0!==n&&n.length&&(e[s]=n)}),e},_events:{keydown:function(t){this._start(t)&&this._keydown(t)&&t.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,void 0):(this._stop(),this._refresh(),this.previous!==this.element.val()&&this._trigger("change",t),void 0)},mousewheel:function(t,e){if(e){if(!this.spinning&&!this._start(t))return!1;this._spin((e>0?1:-1)*this.options.step,t),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(t)},100),t.preventDefault()}},"mousedown .ui-spinner-button":function(e){function i(){var t=this.element[0]===this.document[0].activeElement;t||(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s}))}var s;s=this.element[0]===this.document[0].activeElement?this.previous:this.element.val(),e.preventDefault(),i.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,i.call(this)}),this._start(e)!==!1&&this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(e){return t(e.currentTarget).hasClass("ui-state-active")?this._start(e)===!1?!1:(this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e),void 0):void 0},"mouseleave .ui-spinner-button":"_stop"},_draw:function(){var t=this.uiSpinner=this.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());this.element.attr("role","spinbutton"),this.buttons=t.find(".ui-spinner-button").attr("tabIndex",-1).button().removeClass("ui-corner-all"),this.buttons.height()>Math.ceil(.5*t.height())&&t.height()>0&&t.height(t.height()),this.options.disabled&&this.disable()},_keydown:function(e){var i=this.options,s=t.ui.keyCode;switch(e.keyCode){case s.UP:return this._repeat(null,1,e),!0;case s.DOWN:return this._repeat(null,-1,e),!0;case s.PAGE_UP:return this._repeat(null,i.page,e),!0;case s.PAGE_DOWN:return this._repeat(null,-i.page,e),!0}return!1},_uiSpinnerHtml:function(){return"<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>"},_buttonHtml:function(){return"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon "+this.options.icons.up+"'>&#9650;</span>"+"</a>"+"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>"+"<span class='ui-icon "+this.options.icons.down+"'>&#9660;</span>"+"</a>"},_start:function(t){return this.spinning||this._trigger("start",t)!==!1?(this.counter||(this.counter=1),this.spinning=!0,!0):!1},_repeat:function(t,e,i){t=t||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,e,i)},t),this._spin(e*this.options.step,i)},_spin:function(t,e){var i=this.value()||0;this.counter||(this.counter=1),i=this._adjustValue(i+t*this._increment(this.counter)),this.spinning&&this._trigger("spin",e,{value:i})===!1||(this._value(i),this.counter++)},_increment:function(e){var i=this.options.incremental;return i?t.isFunction(i)?i(e):Math.floor(e*e*e/5e4-e*e/500+17*e/200+1):1},_precision:function(){var t=this._precisionOf(this.options.step);return null!==this.options.min&&(t=Math.max(t,this._precisionOf(this.options.min))),t},_precisionOf:function(t){var e=""+t,i=e.indexOf(".");return-1===i?0:e.length-i-1},_adjustValue:function(t){var e,i,s=this.options;return e=null!==s.min?s.min:0,i=t-e,i=Math.round(i/s.step)*s.step,t=e+i,t=parseFloat(t.toFixed(this._precision())),null!==s.max&&t>s.max?s.max:null!==s.min&&s.min>t?s.min:t},_stop:function(t){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",t))},_setOption:function(t,e){if("culture"===t||"numberFormat"===t){var i=this._parse(this.element.val());return this.options[t]=e,this.element.val(this._format(i)),void 0}("max"===t||"min"===t||"step"===t)&&"string"==typeof e&&(e=this._parse(e)),"icons"===t&&(this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(e.up),this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(e.down)),this._super(t,e),"disabled"===t&&(e?(this.element.prop("disabled",!0),this.buttons.button("disable")):(this.element.prop("disabled",!1),this.buttons.button("enable")))},_setOptions:e(function(t){this._super(t),this._value(this.element.val())}),_parse:function(t){return"string"==typeof t&&""!==t&&(t=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(t,10,this.options.culture):+t),""===t||isNaN(t)?null:t},_format:function(t){return""===t?"":window.Globalize&&this.options.numberFormat?Globalize.format(t,this.options.numberFormat,this.options.culture):t},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},_value:function(t,e){var i;""!==t&&(i=this._parse(t),null!==i&&(e||(i=this._adjustValue(i)),t=this._format(i))),this.element.val(t),this._refresh()},_destroy:function(){this.element.removeClass("ui-spinner-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:e(function(t){this._stepUp(t)}),_stepUp:function(t){this._start()&&(this._spin((t||1)*this.options.step),this._stop())},stepDown:e(function(t){this._stepDown(t)}),_stepDown:function(t){this._start()&&(this._spin((t||1)*-this.options.step),this._stop())},pageUp:e(function(t){this._stepUp((t||1)*this.options.page)}),pageDown:e(function(t){this._stepDown((t||1)*this.options.page)}),value:function(t){return arguments.length?(e(this._value).call(this,t),void 0):this._parse(this.element.val())},widget:function(){return this.uiSpinner}})}(jQuery),function(t,e){function i(){return++n}function s(t){return t.hash.length>1&&decodeURIComponent(t.href.replace(o,""))===decodeURIComponent(location.href.replace(o,""))}var n=0,o=/#.*$/;t.widget("ui.tabs",{version:"1.10.3",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var e=this,i=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",i.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(e){t(this).is(".ui-state-disabled")&&e.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){t(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this._processTabs(),i.active=this._initialActive(),t.isArray(i.disabled)&&(i.disabled=t.unique(i.disabled.concat(t.map(this.tabs.filter(".ui-state-disabled"),function(t){return e.tabs.index(t)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):t(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var i=this.options.active,s=this.options.collapsible,n=location.hash.substring(1);return null===i&&(n&&this.tabs.each(function(s,o){return t(o).attr("aria-controls")===n?(i=s,!1):e}),null===i&&(i=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===i||-1===i)&&(i=this.tabs.length?0:!1)),i!==!1&&(i=this.tabs.index(this.tabs.eq(i)),-1===i&&(i=s?!1:0)),!s&&i===!1&&this.anchors.length&&(i=0),i},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):t()}},_tabKeydown:function(i){var s=t(this.document[0].activeElement).closest("li"),n=this.tabs.index(s),o=!0;if(!this._handlePageNav(i)){switch(i.keyCode){case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:n++;break;case t.ui.keyCode.UP:case t.ui.keyCode.LEFT:o=!1,n--;break;case t.ui.keyCode.END:n=this.anchors.length-1;break;case t.ui.keyCode.HOME:n=0;break;case t.ui.keyCode.SPACE:return i.preventDefault(),clearTimeout(this.activating),this._activate(n),e;case t.ui.keyCode.ENTER:return i.preventDefault(),clearTimeout(this.activating),this._activate(n===this.options.active?!1:n),e;default:return}i.preventDefault(),clearTimeout(this.activating),n=this._focusNextTab(n,o),i.ctrlKey||(s.attr("aria-selected","false"),this.tabs.eq(n).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",n)},this.delay))}},_panelKeydown:function(e){this._handlePageNav(e)||e.ctrlKey&&e.keyCode===t.ui.keyCode.UP&&(e.preventDefault(),this.active.focus())},_handlePageNav:function(i){return i.altKey&&i.keyCode===t.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):i.altKey&&i.keyCode===t.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):e},_findNextTab:function(e,i){function s(){return e>n&&(e=0),0>e&&(e=n),e}for(var n=this.tabs.length-1;-1!==t.inArray(s(),this.options.disabled);)e=i?e+1:e-1;return e},_focusNextTab:function(t,e){return t=this._findNextTab(t,e),this.tabs.eq(t).focus(),t},_setOption:function(t,i){return"active"===t?(this._activate(i),e):"disabled"===t?(this._setupDisabled(i),e):(this._super(t,i),"collapsible"===t&&(this.element.toggleClass("ui-tabs-collapsible",i),i||this.options.active!==!1||this._activate(0)),"event"===t&&this._setupEvents(i),"heightStyle"===t&&this._setupHeightStyle(i),e)},_tabId:function(t){return t.attr("aria-controls")||"ui-tabs-"+i()},_sanitizeSelector:function(t){return t?t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var e=this.options,i=this.tablist.children(":has(a[href])");e.disabled=t.map(i.filter(".ui-state-disabled"),function(t){return i.index(t)}),this._processTabs(),e.active!==!1&&this.anchors.length?this.active.length&&!t.contains(this.tablist[0],this.active[0])?this.tabs.length===e.disabled.length?(e.active=!1,this.active=t()):this._activate(this._findNextTab(Math.max(0,e.active-1),!1)):e.active=this.tabs.index(this.active):(e.active=!1,this.active=t()),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var e=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return t("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=t(),this.anchors.each(function(i,n){var o,a,r,h=t(n).uniqueId().attr("id"),l=t(n).closest("li"),c=l.attr("aria-controls");s(n)?(o=n.hash,a=e.element.find(e._sanitizeSelector(o))):(r=e._tabId(l),o="#"+r,a=e.element.find(o),a.length||(a=e._createPanel(r),a.insertAfter(e.panels[i-1]||e.tablist)),a.attr("aria-live","polite")),a.length&&(e.panels=e.panels.add(a)),c&&l.data("ui-tabs-aria-controls",c),l.attr({"aria-controls":o.substring(1),"aria-labelledby":h}),a.attr("aria-labelledby",h)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.element.find("ol,ul").eq(0)},_createPanel:function(e){return t("<div>").attr("id",e).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(e){t.isArray(e)&&(e.length?e.length===this.anchors.length&&(e=!0):e=!1);for(var i,s=0;i=this.tabs[s];s++)e===!0||-1!==t.inArray(s,e)?t(i).addClass("ui-state-disabled").attr("aria-disabled","true"):t(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=e},_setupEvents:function(e){var i={click:function(t){t.preventDefault()}};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(e){var i,s=this.element.parent();"fill"===e?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=t(this).outerHeight(!0)}),this.panels.each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===e&&(i=0,this.panels.each(function(){i=Math.max(i,t(this).height("").height())}).height(i))},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),o=n.closest("li"),a=o[0]===s[0],r=a&&i.collapsible,h=r?t():this._getPanelForTab(o),l=s.length?this._getPanelForTab(s):t(),c={oldTab:s,oldPanel:l,newTab:r?t():o,newPanel:h};e.preventDefault(),o.hasClass("ui-state-disabled")||o.hasClass("ui-tabs-loading")||this.running||a&&!i.collapsible||this._trigger("beforeActivate",e,c)===!1||(i.active=r?!1:this.tabs.index(o),this.active=a?t():o,this.xhr&&this.xhr.abort(),l.length||h.length||t.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(o),e),this._toggle(e,c))},_toggle:function(e,i){function s(){o.running=!1,o._trigger("activate",e,i)}function n(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),a.length&&o.options.show?o._show(a,o.options.show,s):(a.show(),s())}var o=this,a=i.newPanel,r=i.oldPanel;this.running=!0,r.length&&this.options.hide?this._hide(r,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),n()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),r.hide(),n()),r.attr({"aria-expanded":"false","aria-hidden":"true"}),i.oldTab.attr("aria-selected","false"),a.length&&r.length?i.oldTab.attr("tabIndex",-1):a.length&&this.tabs.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),a.attr({"aria-expanded":"true","aria-hidden":"false"}),i.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(e){var i,s=this._findActive(e);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return e===!1?t():this.tabs.eq(e)},_getIndex:function(t){return"string"==typeof t&&(t=this.anchors.index(this.anchors.filter("[href$='"+t+"']"))),t},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){t.data(this,"ui-tabs-destroy")?t(this).remove():t(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var e=t(this),i=e.data("ui-tabs-aria-controls");i?e.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):e.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(i){var s=this.options.disabled;s!==!1&&(i===e?s=!1:(i=this._getIndex(i),s=t.isArray(s)?t.map(s,function(t){return t!==i?t:null}):t.map(this.tabs,function(t,e){return e!==i?e:null})),this._setupDisabled(s))},disable:function(i){var s=this.options.disabled;if(s!==!0){if(i===e)s=!0;else{if(i=this._getIndex(i),-1!==t.inArray(i,s))return;s=t.isArray(s)?t.merge([i],s).sort():[i]}this._setupDisabled(s)}},load:function(e,i){e=this._getIndex(e);var n=this,o=this.tabs.eq(e),a=o.find(".ui-tabs-anchor"),r=this._getPanelForTab(o),h={tab:o,panel:r};s(a[0])||(this.xhr=t.ajax(this._ajaxSettings(a,i,h)),this.xhr&&"canceled"!==this.xhr.statusText&&(o.addClass("ui-tabs-loading"),r.attr("aria-busy","true"),this.xhr.success(function(t){setTimeout(function(){r.html(t),n._trigger("load",i,h)},1)}).complete(function(t,e){setTimeout(function(){"abort"===e&&n.panels.stop(!1,!0),o.removeClass("ui-tabs-loading"),r.removeAttr("aria-busy"),t===n.xhr&&delete n.xhr},1)})))},_ajaxSettings:function(e,i,s){var n=this;return{url:e.attr("href"),beforeSend:function(e,o){return n._trigger("beforeLoad",i,t.extend({jqXHR:e,ajaxSettings:o},s))}}},_getPanelForTab:function(e){var i=t(e).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}})}(jQuery),function(t){function e(e,i){var s=(e.attr("aria-describedby")||"").split(/\s+/);s.push(i),e.data("ui-tooltip-id",i).attr("aria-describedby",t.trim(s.join(" ")))}function i(e){var i=e.data("ui-tooltip-id"),s=(e.attr("aria-describedby")||"").split(/\s+/),n=t.inArray(i,s);-1!==n&&s.splice(n,1),e.removeData("ui-tooltip-id"),s=t.trim(s.join(" ")),s?e.attr("aria-describedby",s):e.removeAttr("aria-describedby")}var s=0;t.widget("ui.tooltip",{version:"1.10.3",options:{content:function(){var e=t(this).attr("title")||"";return t("<a>").text(e).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable()},_setOption:function(e,i){var s=this;return"disabled"===e?(this[i?"_disable":"_enable"](),this.options[e]=i,void 0):(this._super(e,i),"content"===e&&t.each(this.tooltips,function(t,e){s._updateContent(e)}),void 0)},_disable:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s[0],e.close(n,!0)}),this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.is("[title]")&&e.data("ui-tooltip-title",e.attr("title")).attr("title","")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.data("ui-tooltip-title")&&e.attr("title",e.data("ui-tooltip-title"))})},open:function(e){var i=this,s=t(e?e.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),e&&"mouseover"===e.type&&s.parents().each(function(){var e,s=t(this);s.data("ui-tooltip-open")&&(e=t.Event("blur"),e.target=e.currentTarget=this,i.close(e,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._updateContent(s,e))},_updateContent:function(t,e){var i,s=this.options.content,n=this,o=e?e.type:null;return"string"==typeof s?this._open(e,t,s):(i=s.call(t[0],function(i){t.data("ui-tooltip-open")&&n._delay(function(){e&&(e.type=o),this._open(e,t,i)})}),i&&this._open(e,t,i),void 0)},_open:function(i,s,n){function o(t){l.of=t,a.is(":hidden")||a.position(l)}var a,r,h,l=t.extend({},this.options.position);
if(n){if(a=this._find(s),a.length)return a.find(".ui-tooltip-content").html(n),void 0;s.is("[title]")&&(i&&"mouseover"===i.type?s.attr("title",""):s.removeAttr("title")),a=this._tooltip(s),e(s,a.attr("id")),a.find(".ui-tooltip-content").html(n),this.options.track&&i&&/^mouse/.test(i.type)?(this._on(this.document,{mousemove:o}),o(i)):a.position(t.extend({of:s},this.options.position)),a.hide(),this._show(a,this.options.show),this.options.show&&this.options.show.delay&&(h=this.delayedShow=setInterval(function(){a.is(":visible")&&(o(l.of),clearInterval(h))},t.fx.interval)),this._trigger("open",i,{tooltip:a}),r={keyup:function(e){if(e.keyCode===t.ui.keyCode.ESCAPE){var i=t.Event(e);i.currentTarget=s[0],this.close(i,!0)}},remove:function(){this._removeTooltip(a)}},i&&"mouseover"!==i.type||(r.mouseleave="close"),i&&"focusin"!==i.type||(r.focusout="close"),this._on(!0,s,r)}},close:function(e){var s=this,n=t(e?e.currentTarget:this.element),o=this._find(n);this.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&n.attr("title",n.data("ui-tooltip-title")),i(n),o.stop(!0),this._hide(o,this.options.hide,function(){s._removeTooltip(t(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),e&&"mouseleave"===e.type&&t.each(this.parents,function(e,i){t(i.element).attr("title",i.title),delete s.parents[e]}),this.closing=!0,this._trigger("close",e,{tooltip:o}),this.closing=!1)},_tooltip:function(e){var i="ui-tooltip-"+s++,n=t("<div>").attr({id:i,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||""));return t("<div>").addClass("ui-tooltip-content").appendTo(n),n.appendTo(this.document[0].body),this.tooltips[i]=e,n},_find:function(e){var i=e.data("ui-tooltip-id");return i?t("#"+i):t()},_removeTooltip:function(t){t.remove(),delete this.tooltips[t.attr("id")]},_destroy:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s[0],e.close(n,!0),t("#"+i).remove(),s.data("ui-tooltip-title")&&(s.attr("title",s.data("ui-tooltip-title")),s.removeData("ui-tooltip-title"))})}})}(jQuery);
(function() {
  $(function() {
    $('#side_tab a:first').tab('show');
    $('#entertainment_books a:first').tab('show');
    $('#entertainment_other a:first').tab('show');
    $('.carousel').carousel();
    $(".collapse").collapse();
    if ($(window).width() < 1162) {
      $(".social_bar").hide();
    }
    return $(window).resize(function() {
      if ($(window).width() < 1162) {
        return $(".social_bar").hide();
      } else {
        return $(".social_bar").show();
      }
    });
  });

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//






$('#side_tab a:first').tab('show');
