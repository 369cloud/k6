/**
 * Released on: 2016-4-18
 * =====================================================
 * DEBUG v1.0.1 (http://docs.369cloud.com/engine/jssdk/JS-SDK)
 * =====================================================
 */
;
(function($L, global) {
	$L.debug = function() {
		document.body.style.cursor = '-webkit-grab'
		$L.debug.uuid = 0;
		$L.debug.xhr = {}
		$L.debug.eve = {}
		window.addEventListener('message', function(e) {
			var origin = e.origin;
			// if (origin != 'http://localhost:3000') {
			var res = JSON.parse(e.data)
			var type = res.type;
			if (type == 'init') {
				$L.debug.isReady = true;
			} else if (type == 'evaluateScript') {
				var data = res.data;
				eval(data);
			} else if (type == 'event') {
				var data = res.data;
				var eventName = res.eventName;
				var params = res.params;
				var callback = $L.debug.eve[eventName]
				if ($L.isFunction(callback)) {
					if (params) {
						params = JSON.parse(params)
						callback.call(global, params)
					} else {
						callback.call(global)
					}

				}
			} else if (type == 'ajax') {
				var token = res.token;
				var success = $L.debug.xhr[token].success;
				var error = $L.debug.xhr[token].error;
				var data = res.data;
				var dataType = $L.debug.xhr[token].dataType;
				if (dataType == 'json') {
					if ($L.isFunction(success)) {
						if (data) {
							try {
								data = JSON.parse(data)
								success.call(global, {}, data)
							} catch (e) {
								error.call(global, 0, {}, data)
							}
						} else {
							success.call(global, {}, data)
						}
					}
				} else {
					if ($L.isFunction(success)) {
						success.call(global, {}, data)
					}
				}
				delete $L.debug.xhr[token]
			}
			// }
		}, false);

		$L.debug.getQueryString = function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return (r[2]);
			return null;
		}
		$L.debug.postMessage = function(js) {
			window.parent.postMessage(js, '*');
			// window.parent.postMessage(js, 'http://localhost:3000');
		}

		$L.executeNativeJS = function() {
			var res;
			if (arguments[0][0] == 'window') {
				var res = $L.debug.window.apply($L.debug, Array.prototype.slice.call(arguments))
			} else if (arguments[0][0] == 'httpManager') {
				var res = $L.debug.http.apply($L.debug, Array.prototype.slice.call(arguments))
			} else if (arguments[0][0] == 'storage') {
				var res = $L.debug.storage.apply($L.debug, Array.prototype.slice.call(arguments))
			} else if (arguments[0][0] == 'audio') {
				var res = $L.debug.audio.apply($L.debug, Array.prototype.slice.call(arguments))
			} else if (arguments[0][0] == 'eventListener') {
				var res = $L.debug.event.apply($L.debug, Array.prototype.slice.call(arguments))
			}
			if (typeof res !== 'undefined') return res;
		}

		$L.executeObjFunJS = function() {
			var res;
			if (arguments[0][0] == 'tabMark') {
				var res = $L.debug.tabMark.apply($L.debug, Array.prototype.slice.call(arguments))
			}
			if (typeof res !== 'undefined') return res;
		}

		$L.executeConstantJS = function() {
			if (arguments[0][0] == 'device') {
				return $L.debug.device.apply($L.debug, Array.prototype.slice.call(arguments))
			} else if (arguments[0][0] == 'os') {
				return $L.debug.os.apply($L.debug, Array.prototype.slice.call(arguments))
			} else if (arguments[0][0] == 'app') {
				return $L.debug.app.apply($L.debug, Array.prototype.slice.call(arguments))
			}
		}
		if (window.$) {
			$L.debug.dom()
		}

	}
}(app, this))
;
(function($L, global) {
	$L.debug.device = function() {
		var key = arguments[0][1];
		if(key == "imei"){
			return '865743028006921'
		}else if(key == "imsi"){
			return ' '
		}else if(key == "model"){
			return 'Che1-CL20'
		}else if(key == "vendor"){
			return 'IPHONE'
		}else if(key == "uuid"){
			return '48a9511b-d23a-43c4-a868-0ed2ad80e75b'
		}
	}
}(app, this))
;
(function($L, global) {
	$L.debug.os = function() {
		var key = arguments[0][1];
		if (key == "language") {
			return 'zh'
		} else if (key == "version") {
			if ($.os.android || $.os.ios) {
				return $.os.version
			} else {
				return '4.4.4'
			}

		} else if (key == "name") {
			if ($.os.android) {
				return 'Android'
			} else if ($.os.ios) {
				return 'iOS'
			} else {
				return 'iOS'
			}
		} else if (key == "vendor") {
			if ($.os.android) {
				return 'HUAWEI'
			} else if ($.os.ios) {
				return 'IPHONE'
			} else {
				return 'IPHONE'
			}

		}
	}
}(app, this))
;
(function($L, global) {
	$L.debug.app = function() {
		var key = arguments[0][1];
		if(key == "platformName"){
			return 'Android'
		}else if(key == "platformVersion"){
			return '4.4.4'
		}else if(key == "deviceModel"){
			return 'Che1-CL20'
		}else if(key == "deviceName"){
			return 'Che1'
		}
	}
}(app, this))
;
(function($L, global) {
	$L.debug.dom = function() {
		var on = $.fn.on;

		$.fn.on = function(event, selector, data, callback, one) {
			if (event == 'tap') {
				event = 'click';
			}
			// else if (event == 'touchstart') {
			// 	event = 'mousedown';
			// } else if (event == 'touchmove') {
			// 	event = 'mousemove';
			// } else if (event == 'touchend') {
			// 	event = 'mouseup';
			// }
			return on.call(this, event, selector, data, callback, one);
		}

		var off = $.fn.off;
		$.fn.off = function(event, selector, callback) {
			if (event == 'tap') {
				event = 'click';
			}
			// else if (event == 'touchstart') {
			// 	event = 'mousedown';
			// } else if (event == 'touchmove') {
			// 	event = 'mousemove';
			// } else if (event == 'touchend') {
			// 	event = 'mouseup';
			// }
			return off.call(this, event, selector, callback);
		}

		var trigger = $.fn.trigger;
		$.fn.trigger = function(event, args) {
			if (event == 'tap') {
				event = 'click';
			}
			// else if (event == 'touchstart') {
			// 	event = 'mousedown';
			// } else if (event == 'touchmove') {
			// 	event = 'mousemove';
			// } else if (event == 'touchend') {
			// 	event = 'mouseup';
			// }
			return trigger.call(this, event, args);
		}

		var one = $.fn.one;
		$.fn.one = function(event, selector, data, callback) {
			if (event == 'tap') {
				event = 'click';
			}
			// else if (event == 'touchstart') {
			// 	event = 'mousedown';
			// } else if (event == 'touchmove') {
			// 	event = 'mousemove';
			// } else if (event == 'touchend') {
			// 	event = 'mouseup';
			// }
			return one.call(this, event, selector, data, callback);
		}
	}
}(app, this))
;
(function($L, global) {
	$L.debug.window = function() {
		var args = Array.prototype.slice.call(arguments, 1);
		var key = arguments[0][1];
		if (key == 'openWindow') {
			var windowname = args[0]
			var type = args[1]
			var url = args[2]
			var js = "openWindow," + windowname + "|" + url + "|" + type;
			this.postMessage(js);
		} else if (key == 'closeSelf') {
			var pageId = this.getQueryString('pageId');
			var js = "closeWindow('" + windowname + "','" + pageId + "')"
			this.postMessage(js);
		} else if (key == 'closeWindow') {
			var windowname = args[0]
			var js = "closeWindow('" + windowname + "','" + pageId + "')"
			this.postMessage(js);
		} else if (key == 'backToWindow') {
			var windowname = args[0]
			var js = "backToWindow('" + windowname + "')"
			this.postMessage(js);
		} else if (key == 'openPopover') {
			var popname = args[0]
			var url = args[2]
			var rect = JSON.stringify(args[3])
			var windowname = this.getQueryString('pageId');
			var js = "openPopover('" + popname + "','" + url + "','" + rect + "','" + windowname + "')"
			this.postMessage(js);
		} else if (key == 'closePopover') {
			var popname = args[0]
			var pageId = this.getQueryString('pageId');
			var js = "closePopover('" + popname + "','" + pageId + "')"
			this.postMessage(js);
		} else if (key == 'bringPopoverToFront') {
			var popname = args[0]
			var windowname = this.getQueryString('pageId');
			var js = "openPopover('" + popname + "','" + url + "','" + rect + "','" + windowname + "')"
			this.postMessage(js);
		} else if (key == 'setSlideLayout') {
			var params = args[0]
			var type = params.type
			if (type == 'left') {
				params.leftPane.url = params.leftPane.url
			} else {
				params.rightPane.url = params.rightPane.url
			}
			var params = JSON.stringify(args[0])
			var js = "setSlideLayout('" + params + "')"
			this.postMessage(js);
		} else if (key == 'openSlidePane') {
			var params = JSON.stringify(args[0])
			var js = "openSlidePane('" + params + "')"
			this.postMessage(js);
		} else if (key == 'closeSlidePane') {
			var js = "closeSlidePane()"
			this.postMessage(js);
		} else if (key == 'getWidth') {
			var winWidth;
			if (window.innerWidth)
				winWidth = window.innerWidth;
			else if ((document.body) && (document.body.clientWidth))
				winWidth = document.body.clientWidth;
			return winWidth
		} else if (key == 'getHeight') {
			var winHeight;
			// 获取窗口高度
			if (window.innerHeight)
				winHeight = window.innerHeight;
			else if ((document.body) && (document.body.clientHeight))
				winHeight = document.body.clientHeight;
			return winHeight
		} else if (key == 'alert') {
			alert(args[0].msg)
		} else if (key == 'confirm') {
			alert(args[0].msg)
		} else if (key == 'evaluateScript') {
			var windowname = args[1]
			var popoverName = args[2]
			var script = args[3]
			var pageId = this.getQueryString('pageId');
			var js = "evaluateScript('" + windowname + "','" + popoverName + "','" + script + "','" + pageId + "')"
			this.postMessage(js);
		}
	}
}(app, this))
;
(function($L, global) {
	var serialize = function(params, obj, scope) {
		var type, array = $L.isArray(obj),
			hash = $L.isPlainObject(obj)
		$L.each(obj, function(key, value) {
			type = $L.type(value)
			if (scope) key = scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
				// handle data in serializeArray() format
			if (!scope && array) params.add(value.name, value.value)
				// recurse into nested objects
			else if (type == "array" || (type == "object"))
				serialize(params, value, key)
			else params.add(key, value)
		})
	}
	var escape = encodeURIComponent
	var appendQuery = function(url, query) {
		if (query == '') return url
		return (url + '&' + query).replace(/[&?]{1,2}/, '?')
	}

	var param = function(obj) {
		var params = []
		params.add = function(key, value) {
			if ($L.isFunction(value)) value = value()
			if (value == null) value = ""
			this.push(escape(key) + '=' + escape(value))
		}
		serialize(params, obj)
		return params.join('&').replace(/%20/g, '+')
	}

	var serializeData = function(settings) {
		if (settings.body && $L.type(settings.body) != "string")
			settings.body = param(settings.body)
		if (settings.body && (!settings.method || settings.method.toUpperCase() == 'GET'))
			settings.url = appendQuery(settings.url, settings.body), settings.body = undefined
	}


	$L.debug.http = function() {
		var args = Array.prototype.slice.call(arguments, 1);
		var key = arguments[0][1];
		if (key == "sendRequest") {
			var settings = args[0];
			var body = settings.body;
			if (body && $L.type(body) == "string") {
				settings.body = JSON.parse(body)
			}
			serializeData(settings)
			settings = JSON.stringify(settings)
			var pageId = this.getQueryString('pageId');
			var token = this.uuid++;
			this.xhr[token] = {
				success: args[1],
				error: args[2],
				dataType: args[0].dataType
			}
			var js = "sendRequest('" + settings + "','" + pageId + "','" + token + "')"
			this.postMessage(js);
		}
	}
}(app, this))
;
(function($L, global) {
	$L.debug.storage = function() {
		var args = Array.prototype.slice.call(arguments, 1);
		var key = arguments[0][1];
		if (key == "getLength") {
			return window.localStorage.length;
		} else if (key == "getItem") {
			return window.localStorage.getItem(args[0]);
		} else if (key == "setItem") {
			window.localStorage.setItem(args[0], args[1]);
		} else if (key == "removeItem") {
			window.localStorage.removeItem(args[0]);
		} else if (key == "clear") {
			window.localStorage.clear();
		} else if (key == "key") {
			return window.localStorage.key(args[0]);
		}
	}
}(app, this))
;
(function($L, global) {
	$L.debug.screen = function() {
		var args = Array.prototype.slice.call(arguments, 1);
		var key = arguments[0][1];
		if (key == "getResolutionWidth") {
			return "720"
		} else if (key == "getResolutionHeight") {
			return "1280"
		} else if (key == "getScale") {
			return "2"
		} else if (key == "getDpiX") {
			return "268.941"
		} else if (key == "getDpiY") {
			return "68.694"
		} else if (key == "getBrightness") {
			return "1"
		}
	}
}(app, this))
;
(function($L, global) {
	$L.debug.audio = function() {
		// var key = arguments[0][1];
		// if(key == "createPlayer"){
			
		// 	return '865743028006921'
		// }else if(key == "imsi"){
		// 	return ' '
		// }else if(key == "model"){
		// 	return 'Che1-CL20'
		// }else if(key == "vendor"){
		// 	return 'IPHONE'
		// }else if(key == "uuid"){
		// 	return '48a9511b-d23a-43c4-a868-0ed2ad80e75b'
		// }
	}
}(app, this))
;
(function($L, global) {
	$L.debug.tabMark = function() {
		var key = arguments[0][1];
		if (key == "show") {
			var dataS = arguments[1];
			var frameRect = arguments[2];
			if (dataS && frameRect) {
				dataS = JSON.stringify(dataS);
				frameRect = JSON.stringify(frameRect);
			} else {
				return;
			}
			var windowname = this.getQueryString('pageId');
			var js = "tabMarkShow('" + dataS + "','" + frameRect + "','" + windowname + "')"
			this.postMessage(js);
		} else if (key == "hide") {
			var windowname = this.getQueryString('pageId');
			var js = "tabMarkHide('" + windowname + "')"
			this.postMessage(js);
		} else if (key == "showContentAtIndex") {
			var index = arguments[1];
			var windowname = this.getQueryString('pageId');
			var js = "tabMarkShowIndex('" + windowname + "','" + index + "')"
			this.postMessage(js);
		} 
	}
}(app, this))
;
(function($L, global) {
	var token = this.uuid++;
	$L.debug.event = function() {
		var key = arguments[0][1];
		if (key == "sendEvent") {
			var eventName = arguments[1]
			var params = arguments[2]
			if (params && $L.isPlainObject(params)) {
				params = JSON.stringify(params)
				var js = "sendEvent," + eventName + "|" + params;
			} else {
				var js = "sendEvent," + eventName;
			}
			this.postMessage(js);
		} else if (key == "addEventListener") {
			var pageId = this.getQueryString('pageId');
			var eventName = arguments[1]
			var callback = arguments[2]
			this.eve[eventName] = callback
			var js = "addEvent," + pageId + "|" + eventName;
			this.postMessage(js);
		} else if (key == "removeEventListener") {
			var pageId = this.getQueryString('pageId');
			var eventName = arguments[1]
			this.eve[eventName] = null
			var js = "removeEvent," + pageId + "|" + eventName;
			this.postMessage(js);
		}
	}
}(app, this))