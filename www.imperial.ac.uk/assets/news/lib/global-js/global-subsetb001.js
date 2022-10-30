/**
  *
  * GlobalJS - Turbo 2012
  *
  * Specially cut down, tidied, optimised
  * - Self-Initializing
  *
  * Used On:
  *		PWP (www.imperial.ac.uk/people)
  *		NEWS (www3.imperial.ac.uk/news)
  *
  *
  * Documentation:
  *		https://123.writeboard.com/v6lerzdfag7fj841twhls3zc
  *
  * KEEP IT MODULAR PEOPLE
* */
/* global jQuery */
(function($, doc, win) {
	$.globalJS = function(options) {
		if ((typeof(options) === 'undefined') || (options === null)) { options = {}; }

		var gb = {

	//*** PUBLIC VARIABLES

			options: $.extend({
				/* options  */
				debug: true,

				/* items to load */
				loadSlideshow: true,
				loadSlideshow2016: true,
				loadDca: true,
				loadYoutube: true,
				loadStoryfy: true,
				loadStorifyEmbed: true,
				loadImedia: true,
				loadVimeo: true,
				loadVideo: true,
				loadOEmbed: true,
				loadGiphy: true,
				loadFacebook: true,
				loadFigshare: false,				
				loadMobiledetect: true,
				loadTabletdetect: true,
				loadMathjax: true,

				/* extendables */
				getEnv: null,

				/* callbacks */
				done: function() {},
				always: function() {}


			}, options),

	//*** PRIVATE VARIABLES

			capabilities: { // used to be public, now not - ah, yes it is tho $.fn.globalJS.capailities.isMobile
				isMobile: undefined,
				isTablet: undefined,
				ieVersion: undefined,
				isSSL: true // secure by default, insecure by default causes things not to load if it fails to choose
			},

			cache: {},
			promises: [],
			promise: {
				hasCapabilities: null,
				isMobile: null
			},

	//*** INIT

			/**
			 * Initialise and run everything specified in options.load
			 * @return {void} (but run options.done, options.always when everything is complete)
			 */
			init: function() {
				var opts = gb.options;

				gb.debug(); console.log('GlobalJS:', 'loading');
				gb.getProt(); console.log('GlobalJS:', 'secure assets', gb.capabilities.isSSL);

				if (opts.loadSlideshow) { gb.loadSlideshow(); } else { console.log('GlobalJS:', 'without slideshow'); }
				if (opts.loadSlideshow2016) { gb.loadSlideshow2016(); } else { console.log('GlobalJS:', 'without slideshow2016'); }
				if (opts.loadDca) { gb.loadDca(); } else { console.log('GlobalJS:', 'without dca'); }
				if (opts.loadYoutube) { gb.loadYoutube(); } else { console.log('GlobalJS:', 'without youtube'); }
				if (opts.loadVideo) { gb.loadVideo(); } else { console.log('GlobalJS:', 'without video'); }
				if (opts.loadStoryfy) { gb.loadStoryfy(); } else { console.log('GlobalJS:', 'without storify'); }
				if (opts.loadStorifyEmbed) { gb.loadStorifyEmbed(); } else { console.log('GlobalJS:', 'without storify embed'); }
				if (opts.loadImedia) { gb.loadIMediaJW700(); } else { console.log('GlobalJS:', 'without imedia'); }
				if (opts.loadVimeo) { gb.loadVimeo(); } else { console.log('GlobalJS:', 'without vimeo'); }
				if (opts.loadOEmbed) { gb.loadOEmbed(); } else { console.log('GlobalJS:', 'without oEmbed'); }
				if (opts.loadGiphy) { gb.loadGiphy(); } else { console.log('GlobalJS:', 'without giphy'); }
				if (opts.loadFacebook) { gb.loadFacebook(); } else { console.log('GlobalJS:', 'without facebook'); }
				if (opts.loadFigshare) { gb.loadFigshare(); } else { console.log('GlobalJS:', 'without figshare'); }
				if (opts.loadMobiledetect) { gb.loadMobileClientDetect(); } else { console.log('GlobalJS:', 'without mobiledetect'); }
				if (opts.loadTabletdetect) { gb.loadTabletClientDetect(); } else { console.log('GlobalJS:', 'without tabletdetect'); }
				if (opts.loadMathjax) { gb.loadMathjax(); } else { console.log('GlobalJS:', 'without mathjax'); }

				gb.callbackReady();

				return gb.init; // return self, so we can be reinitialised in the future
			},

			/**
			 * Protect against anything which doesn't have a debug console object
			 * @return {void}
			 */
			debug: function() {
				if ((!win.console) || (!gb.options.debug) || (!window.console) || (typeof window.console === 'undefined')) {
					window.console = { log: function() {}, warn: function() {}, error: function() {} };
				}
				// for some reason IE doesnt like win so...extra conditions added

			},

	//*** LOAD DYNAMIC ELEMENTS

			/**
			 * Load the slideshow
			 * @return {void} / deferred promise added to gb.promises
			 */
			loadSlideshow: function() {
				/* prepare slideshow */
				if(gb.getCache('.slideShowInPage').length) {
					$(".cycleslides img").removeAttr("style");
					gb.getCache('.slideShowInPage').hide();
					var promise = $.getScript("/2007templates/plugins/slideshow/prepslideshowcms.js", function() {
						win.buildSlideshows();
					});
					gb.promises.push(promise);
				}
			},

			/**
			 * Load the slideshow for 2016 plugin
			 * @return {void} / deferred promise added to gb.promises
			 */
			loadSlideshow2016: function() {
				/* prepare slideshow */
				if ($('.slide-show').length) {
					var url = gb.getEnv() + '/assets/plugins/slideshow2016/imperialSlideshow.min.js';
					var promise = $.getScript(url, function() {
						$('.slide-show').slideshow();
					});
					gb.promises.push(promise);
				}
			},

			/**
			 * Load the DCA code
			 * @return {void}
			 */
			loadDca: function() {
				if ($('.dcacontainer').length) {
					$.getScript(gb.getProt() + '//wwwf.imperial.ac.uk/utils/assets/apps/dca/js/dca_readonly.js');
				}
			},

			/**
			 * Load video, based on the 2014 style
			 * <div class="video-player" data-src="<!--url to video-->"></div>
			 * @return {void} / promise
			 */
			loadVideo: function() {
				var container = $('.video-player');

				if (container.length) {
					// manually initialise after script is loaded, since self-init doesn't work when domain is the same as script source
					var promise = $.getScript(gb.getProt() + '//www.imperial.ac.uk/t4assets/js/require/imperialVideo.jquery.js')
									.done(function() { $.fn.imperialVideo.init(); });
					gb.promises.push(promise);
				}
			},

			/**
			 * Load YouTube videos
			 * @return {void}
			 */
			loadYoutube: function() {
				/* prepare YouTube */
				var container = $('.youtube_container');
				if (container.length) {
					container.each(function() {
						//take clip:
						var c = $(this).find("a").attr("href");
						var h = $(this).find('img').height();
						var pos, startpos, endpos;

						if(c !== undefined && h !== undefined)
						{
							//// LONG URLS
							if(c.indexOf("v=") > -1)
							{
								pos = c.indexOf("v=");
								c = c.substr(pos + 2);
							}

							//clean up:
							if(c.indexOf("&") > -1)
							{
								endpos = c.indexOf("&");
								c = c.substr(0, endpos);

								startpos = c.indexOf("v=");
								c = c.substr(startpos + 2);
							}

							c = c.replace("/", '');

							//// SHORT URLS
							if(c.indexOf("youtu.be") > -1)
							{
								startpos = c.indexOf("u.be") + 5;
								c = c.substr(startpos);

								endpos = (c.indexOf("?") > -1) ? c.indexOf("?") : c.length;
								c = c.slice(0, endpos);
							}

							//finish
							c = gb.getProt() + "//www.youtube.com/embed/" + c + "?wmode=opaque";

							//iframe
							var ifr = '<iframe width="100%" height="' + h + '" src="' + c + '" frameborder="0" allowfullscreen></iframe>';
							$(this).find(".yt_id").html(ifr);

						}

					});
				}
			},

			/**
			 * Load a Storyfy area
			 * @return {void} / deferred promise added to gb.promises
			 */
			loadStoryfy: function() {
				var container = $('.storify_container');
				container.each(function(index, element) {
				//take clip:
					var link = $(element).find("a").attr("href");
					if (typeof link !== 'undefined') {
						var js = link + ".js";
						var pid = $(element).parents("div[id^='storify']");
						$(element).empty();

						// go to vanilla js for this kind of malarky
						// yes, it has to be done by adding the <script> to the page, no promises here
						var myscript = document.createElement('script');
						myscript.src = js; myscript.type = 'text/javascript';
						document.getElementById(pid.attr('id')).appendChild(myscript);

						// gb.promises.push(promise);
					}
				});
			},

			/**
			 * load a storify embed (2016)
			 * @return {void}
			 */
			loadStorifyEmbed: function() {
				var container = $('.embedded-content.Storify, .embedded-content.storify');
				var template = '<div class="storify"><iframe src="{{{url}}}" width="100%" height="750" frameborder="no" allowtransparency="true"></iframe><script src="{{{url}}}"></script><noscript>[<a href="{{{link}}}" target="_blank">View the story "{{title}}" on Storify</a>]</noscript></div>';
				container.each(function(index, element) {
					var $element = $(element);
					var params = ['url', 'link', 'title'];

					//Create a scoped copy of the template so we don't override it for subsequent uses
					var embed = template;
					for (var i = params.length - 1; i >= 0; i--) {
						var param = params[i];
						var value = $element.data(param);
						// do some templating
						var regex = new RegExp('({{2,3}' + param + '}{2,3})', 'gi');
						embed = embed.replace(regex, value);
					}

					$element.html(embed);
				});
			},

			/**
			 * Load an iMedia video
			 * @return {void} / deferred promise added to gb.promises
			 */
			loadIMedia: function() {
				// this only works for one video per page (problem in imedia.jquery.js)
				if(($('#flashcontainer').length) || ($("div[id|='imedia']").length)) {
					$.getScript(gb.getProt() + '//wwwf.imperial.ac.uk/imedia/js/jwplayer.js', function() {
						// make a promise
						var promise = $.getScript(gb.getProt() + '//wwwf.imperial.ac.uk/imedia/js/imedia.jquery.js');
						gb.promises.push(promise);
					});
					var getCss = function(url) {
						var head = $('head');
						head.append("<link>");
						var css = head.children(":last");
						css.attr({
							rel:  "stylesheet",
							type: "text/css",
							media: "screen",
							href: url
						});
					};
					var url = gb.getProt() + "//wwwf.imperial.ac.uk/imedia/css/player";
					url += (gb.getIE()) ? "_ie.css" : ".css";
					getCss(url);
				}
			},


			/**
			 * load an iMedia video with JWPlayer 6.10 (temporary)
			 * @return {void} / deferred promise added to gb.promises
			 */
			loadIMediaJW700: function() {
				if(($('#flashcontainer').length) || ($("div[id|='imedia']").length)) {
					// load the player
					$.getScript(gb.getProt() + '//wwwf.imperial.ac.uk/imedia/jwplayer/v7.0/jwplayer.js', function() {
						// make a promise
						var promise = $.getScript(gb.getProt() + '//wwwf.imperial.ac.uk/imedia/js/imedia-jwplayer.jquery.js');
						gb.promises.push(promise);
					});
				}
			},

			/**
			 * load a Vimeo video in a container
			 * @return {void}
			 */
			loadVimeo: function() {
				var container = $('.vimeo_container');
				container.each(function(index, element) {
				//take clip:
					var url = $(element).find("a").attr("href");
					if(url !== 'undefined') {
						var id = url.match(/https?:\/\/(?:www.)?(\w*).com\/[\D]*(\d*)/)[2];
						var height = container.find('img').height();

						var ifr = '<iframe src="//player.vimeo.com/video/' + id + '?byline=0&portrait=0&badge=0&title=0" width="100%" height="' + height + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
						container.html(ifr);
					}
				});
			},

			/**
			 * load an oEmbed item (2017)
			 * @return {void}
			 */
			loadOEmbed: function() {
				var container = $('.embedded-content.oembed');
				var services = {
					'twitter': {
						'api': 'https://publish.twitter.com/oembed',
						'dataType': 'jsonp'
					},
					'instagram': {
						'api': 'https://www.imperial.ac.uk/api/instagram/',
						'dataType': 'json'
					},
					'soundcloud': {
						'api': 'https://soundcloud.com/oembed?format=json',
						'dataType': 'json'
					},
					'infogram': {
						'api': 'https://infogram.com/oembed/',
						'dataType': 'json'
					}
				};

				container.each(function(index, element) {
					var $el = $(element);
					var url = $el.data('url');
					if (!url) { return true; } // continue

					/**
					 * extract the service name from the embed code
					 * @param  {$} $embed - embed code
					 * @return {String}        - service name
					 */
					var getServiceName = function($embed) {
						// console.log('getServiceName', $embed);

						return $embed.attr('class')
										.replace('oembed', '')
										.replace('standard', '')
										.replace('embedded-content', '')
										.trim();
					};

					/**
					 * this is a crap solution...duplicate info with the ic_embed plugin
					 * @todo write this data into the embed code, or do it server-side with an oembed proxy
					 * @param  {String} service - the name of the service
					 * @return {String}         - the api address to call
					 */
					var getOEmbedService = function(service) {
						return services[service.toLowerCase()];
					};

					var service = getOEmbedService(getServiceName($el));
					if (typeof service === 'undefined') { return true; }

					var promise = $.ajax({
						url: service.api,
						crossDomain: true,
						data: {
							url: decodeURIComponent(url)
						},
						'dataType': service.dataType
					});

					promise.done(function(response) {
						// console.log('loadOEmbed', 'done', response);
						var data = response;
						data[data.type] = true; // set a boolean type for the template
						if (data.type === 'rich') { // @todo support more types
							$el.html(data.html);
						}
					});

					promise.fail(function(response) {
						console.error('loadOEmbed', 'fail', response);
					});
				});
			},

			/**
			 * load a giphy embed (for animated gifs) 2017
			 * @return {void}
			 */
			loadGiphy: function() {
				var container = $('.embedded-content.giphy');
				var template = '<div class="giphy" style="width:100%;height:0;padding-bottom:50%;position:relative;"><iframe src="{{{url}}}" width="100%" height="100%" style="position:absolute" frameBorder="0" allowFullScreen></iframe></div><p><a href="{{{link}}}">{{title}}</a></p>';

				container.each(function(index, element) {
					var $el = $(element);
					var $hide = $('<a>', {'href':'#toggle', 'id':'giphy-visibility'}).html('Hide')
								.click(function(ev) {
									ev.preventDefault();
									if ($el.is(':visible')) {
										$el.toggle(false);
										$hide.html('Show animated gif');
									} else {
										$el.toggle(true);
										$hide.html('Hide');
									}
								});
					var params = ['url', 'link', 'title'];

					//Create a scoped copy of the template so we don't override it for subsequent uses
					var embed = template;

					for (var i = params.length - 1; i >= 0; i--) {
						var param = params[i];
						var value = $el.data(param);
						// do some templating
						var regex = new RegExp('({{2,3}' + param + '}{2,3})', 'gi');
						embed = embed.replace(regex, value);
					}

					$el.html(embed);
					$el.before($hide);
				});
			},

			/**
			 * load a facebook post embed
			 * @return {void}
			 */
			loadFacebook: function() {
				var container = $('.embedded-content.facebook');
				var template = '<div class="facebook-embed"><iframe src="https://www.facebook.com/plugins/post.php?href={{{url}}}&show_text=true&appId=674884772674087" width="100%" height="{{height}}" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe><p class="facebook-alternative-link"><a href="{{{link}}}">View post on Facebook</a></p></div>'

				container.each(function(index, element) {
					var $element = $(element);
					var params = ['url', 'link', 'height'];

					//Create a scoped copy of the template so we don't override it for subsequent uses
					var embed = template;

					for (var i = params.length - 1; i >= 0; i--) {
						var param = params[i];
						var value = $element.data(param);
						// do some templating
						var regex = new RegExp('({{2,3}' + param + '}{2,3})', 'gi');
						embed = embed.replace(regex, value);
					}

					// console.log('embed',embed);
					$element.html(embed);
				});
			},

			/**
			 * load a figshare post embed
			 * @return {void}
			 */
			loadFigshare: function() {
				var container = $('.embedded-content.figshare');
				// https://widgets.figshare.com/articles/3985233/embed?show_title=1
				var template = '<div class="figshare-embed"><iframe src="https://widgets.figshare.com/articles/{{{url}}}/embed?show_title=1" width="100%" height="{{height}}" allowfullscreen="true" frameborder="0"></iframe></div>'

				container.each(function(index, element) {
					var $element = $(element);
					var params = ['url', 'height'];

					//Create a scoped copy of the template so we don't override it in loop
					var embed = template;

					for (var i = params.length - 1; i >= 0; i--) {
						var param = params[i];
						var value = $element.data(param);
						// do some templating
						var regex = new RegExp('({{2,3}' + param + '}{2,3})', 'gi');
						embed = embed.replace(regex, value);
					}

					// console.log('embed',embed);
					$element.html(embed);
				});
			},

			/**
			 * Load MathJax script
			 * @return {void} / deferred promise added to gb.promises
			 */
			loadMathjax: function() {
				if (!$('.mathjax').length) {
					// no mathjax spotted
					return;
				}

				// make sure this is the same as the tinymce plugin
				var version = '3.1.2';
				// this can be 'chtml' or 'svg', currently chtml is 769Kb and svg is 1.7Mb(!)
				var output = 'chtml';

				// set the configuration options
				window.MathJax = {
					loader: {
						load: ['ui/safe']
					},
					options: {
						processHtmlClass: 'mathjax',
					},
					tex: {
					  inlineMath: [['$', '$'], ['\\(', '\\)']]
					},
					svg: {
					  fontCache: 'global'
					}
				};

				// decode the mathjax 'safe' string
				$('.mathjax').each(function(i, el) {
					var $el = $(el);
					// check if we are dealing with an encoded mathjax string
					if (!$el.data('encoded')) {
						return;
					}

					// decode the string
					var encoded = $el.data('formula');
					var formula = window.atob(encoded);

					// update the dom
					$el.text(formula);
					$el.attr('data-formula', formula);
					$el.attr('data-encoded', false);
				});

				// load the mathjax library from cdn
				// @todo: host this locally and hardcode the version
				var promise = $.getScript('https://cdn.jsdelivr.net/npm/mathjax@' + version + '/es5/tex-mml-' + output + '.js');
				gb.promises.push(promise);
			},

	//*** LOAD FEATURE DETECTION

			/**
			 * Get the browser capabilities using the server-side WURFL script
			 * @return {void} / deferred promise added to gb.promises (returns array to gb.capabilities)
			 */
			loadBrowserCapabilities: function() {
				// find the script
				var scriptPath = gb.getEnv() + '/apps/plugins/mobiledetect/index.php';

				// is it a mobile device or a browser?
				var promise = $.getJSON(scriptPath + '?jsonCallBack=?', {'mode':'cap'})
					.success(function(r) {
						gb.capabilities = r;
						if (r.brand_name == 'generic web browser') {
							gb.capabilities.isMobile = false;
						} else {
							gb.capabilities.isMobile = true;
						}
					})
					.fail(function(r) {
						console.warn('GlobalJS: browser capability check failed', r);
				});

				// push me a couple of promises
				gb.promises.push(promise);
				gb.promise.hasCapabilities = promise; // we will need this to check using getCapabilities()
			},

			/**
			 * Server-side script to check whether the browsing device is mobile or not
			 * troublesome if the php server is not working properly.
			 * @return {void} / deferred promise added to gb.promises
			 */
			loadMobileDetect: function() {
				// find the script
				var scriptPath = gb.getEnv() + '/apps/plugins/mobiledetect/index.php';

				// is it a mobile device or a browser?
				var promise = $.getJSON(scriptPath + '?jsonCallBack=?', {'mode':'ismobile'})
					.success(function(r) {
						gb.capabilities.isMobile = r;
					})
					.fail(function(r) {
						console.warn('GlobalJS: mobile detect failed', r);
						gb.capabilities.isMobile = false;
				});

				// push me a couple of promises
				gb.promises.push(promise);
				gb.promise.isMobile = promise; // we will need this to check using getMobile()
			},

			/**
			 * Client-side script to detect mobile devices
			 * uses user-agent string, so prone to inaccuracies as user agents change
			 * @return {void} / boolean isMobile set
			 */
			loadMobileClientDetect: function() {
				// giant regex from detectmobilebrowsers.com, keep an eye out for regex updates
				var a = navigator.userAgent || navigator.vendor || window.opera;

				if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
					gb.capabilities.isMobile = true;
				} else {
					gb.capabilities.isMobile = false;
				}

			},

			loadTabletClientDetect: function() {
				// another giant regex from detectmobilebrowsers.com, keep an eye out for regex updates
				// TODO concatinate these perhaps
				var a = navigator.userAgent || navigator.vendor || window.opera;

				if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
					gb.capabilities.isTablet = true;
				} else {
					gb.capabilities.isTablet = false;
				}
			},

	//*** USEFULS

			/**
			 * determine the current staging environment (dev, test or prod) and give the appropriate asset server back
			 * @param  {String} location - specify the hostname to get the asset location
			 * @return {String}          - asset server address for this environment
			 */
			getEnv: function(location) {
				// get the development, testing or production environment servers
				if (typeof location === 'undefined') { location = window.location.hostname; }

				// standard asset locations - make sure there is no trailing slash
				var dev = (gb.capabilities.isSSL) ? 'https://dev-utils.cc.ic.ac.uk:9443' : 'http://dev-utils.cc.ic.ac.uk';
				var test = (gb.capabilities.isSSL) ? 'https://test-utils.cc.ic.ac.uk' : 'http://test-utils.cc.ic.ac.uk';
				var prod = (gb.capabilities.isSSL) ? 'https://wwwf.imperial.ac.uk/utils' : 'http://wwwf.imperial.ac.uk/utils';

				var envMap = {
					// New website - sep 2014
					'www-staging.imperial.ac.uk':test,
					// PWP - jun 2013
					'wwwdev.cc.ic.ac.uk':dev,
					'wwwtest.imperial.ac.uk':test,
					'www.imperial.ac.uk':prod,
					// PWP - jun 2014
					'wlsdev.imperial.ac.uk':dev,
					'wlstst.imperial.ac.uk':test,
					// News - mar 2013
					'portdev.ad.ic.ac.uk':dev,
					'porttst.ad.ic.ac.uk':test,
					'www3.imperial.ac.uk':prod,
					// Other
					'www2.imperial.ac.uk':prod,
					'wwwf.imperial.ac.uk':prod,
					// Local Development
					'localhost':dev,
					'127.0.0.1':dev
				};

				if (gb.options.envMap !== null) { $.extend(envMap, gb.options.envMap); } // add extra location data specified as options

				// default is production
				if (typeof envMap[location] !== 'undefined') {
					return envMap[location];
				} else {
					return prod;
				}
			},

			/**
			 * because this is the result of a xhr, we need a special callback (unless it the promise isn't set)
			 * @param  {Function} cb - callback to run when isMobile is determined
			 * @param {[type]} [varname] [description] ??
			 * @return {boolean} - is mobile or not
			 */
			getMobile: function(cb, wurfl) {
				if (typeof gb.promise.isMobile === 'undefined' && typeof wurfl === 'undefined') {
					console.log('getMobile', gb.capabilities.isMobile);
					return (typeof cb === 'function') ? cb(gb.capabilities.isMobile) : gb.capabilities.isMobile;
				} else {
					$.when(gb.promise.isMobile)
						.done(function() {
							return (typeof cb === 'function') ? cb(gb.capabilities.isMobile) : gb.capabilities.isMobile;
					});
				}
			},

			/**
			 * function to get the capabilities of the browser (server-side)
			 * @param  {Function} cb - callback to run when the server-side script is complete
			 * @return {void}
			 */
			getCapabilities: function(cb) {
				if (typeof gb.promise.hasCapabilities === 'undefined' && gb.capabilities.length === 3) {
					gb.loadBrowserCapabilities();
					// because this is the result of a xhr, we need a special callback
					$.when(gb.promise.hasCapabilities)
						.done(function() {
							return (typeof cb === 'function') ? cb(gb.capabilities) : gb.capabilities;
					});
				} else {
					// run the callback if set, or just return the capabilities object
					return (typeof cb === 'function') ? cb(gb.capabilities) : gb.capabilities;
				}
			},

			/**
			 * Detect IE version, returns ie === undefined for non ie, otherwise returns the version number
			 * @return {Integer}     version of IE, undef if not.
			 */
			getIE: function() {

				var ua = window.navigator.userAgent;

				// Test values; Uncomment to check result …

				// IE 10
				// ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

				// IE 11
				// ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

				// Edge 12 (Spartan)
				// ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

				// Edge 13
				// ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

				var msie = ua.indexOf('MSIE ');
				if (msie > 0) {
				// IE 10 or older => return version number
				return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
				}

				var trident = ua.indexOf('Trident/');
				if (trident > 0) {
				// IE 11 => return version number
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
				}

				var edge = ua.indexOf('Edge/');
				if (edge > 0) {
				// Edge (IE 12+) => return version number
				return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
				}

				// other browser
				return undefined;

			},

			/**
			 * Decide whether this is an SSL page or not, serve assets accordingly
			 * @return {String} 'https:' or 'http:'
			 */
			getProt : function() {
				gb.capabilities.isSSL = ('https:' == document.location.protocol);
				return document.location.protocol;
			},

			/**
			 * returns an item from the DOM cache{}, or adds it if not present
			 * @param  {String} selector	the jquery selector to grab from the cache
			 * @param  {boolean} refresh	force an update of the cache
			 * @return {$object}			jquery object for the requested selector
			 */
			getCache: function(selector, refresh) {
				if (gb.cache[selector] !== undefined && refresh === undefined) {
					return gb.cache[selector];
				}
				gb.cache[selector] = $(selector);
				return gb.cache[selector];
			},

	//*** CALLBACKS

			/**
			 * trigger the two callback functions when scripts are done processing
			 * @return {void}
			 */
			callbackReady: function() {
				$.when.apply($, gb.promises)
					.done(function() {
						/* all promises kept (scripts loaded), run callback  */
						gb.options.done();
					})
					.always(function() {
						/* script has finished it's promises, some may have failed */
						gb.options.always();
					});
			}

		};

	//*** API

		/* these can be accessed by $.fn.globalJS.getEnv() etc. */
		return {
			init: gb.init(),						// this will self-init
			getEnv: gb.getEnv,						// return the 'asset' server name for this environment, can be given a param to specifiy environment (eg. wwwdev.cc.ic.ac.uk)
			getMobile: gb.getMobile,				// return true or false, depending on whether this environment is mobile or not
			getCapabilities: gb.getCapabilities,	// returns json with all browser capabilities
			getIE: gb.getIE,						// get version of IE or undefined if not
			capabilities: gb.capabilities,			// browser capabilities variable, isMobile, ieVersion and isTablet are default properties
			cache: gb.getCache						// dom cache
		};


	};

	//*** SELF-INITIALISE

	$(function() {
		if ($("script[src*='global-subset']").attr('src').split('?')[1] !== 'init=false') {
			$.fn.globalJS = $.globalJS({
				done: function() {
					console.log('GlobalJS:', 'all present and correct');
				}
			});
			console.log('GlobalJS:', 'self-initialising');
		} else { console.log('GlobalJS:', 'ready'); }
	});

})(jQuery, document, window);

$(document).ready(function() {
	var isPWPEdit = !!document.location.pathname.match('/AP/faces/pages/edit/');
	var isIE = $.fn.globalJS.getIE();

	if (isIE !== undefined && isPWPEdit) {
		$.getScript('https://wwwf.imperial.ac.uk/utils/assets/plugins/html5shiv/html5shiv.js', function() { html5.shivDocument(document); });
	}
});
