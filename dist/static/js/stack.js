/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
;(function(window) {

	'use strict';

	var animEndEventName = 'animationend',
		onEndAnimation = function( el, callback ) {
			var onEndCallbackFn = function( ev ) {
				if( ev.target != this ) return;
				this.removeEventListener( animEndEventName, onEndCallbackFn );
				if( callback && typeof callback === 'function' ) { callback.call(); }
			};
			el.addEventListener( animEndEventName, onEndCallbackFn )
		}
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function Stack(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this.items = [].slice.call(this.el.children);
		this.itemsTotal = this.items.length;
		if( this.options.infinite && this.options.visible >= this.itemsTotal || !this.options.infinite && this.options.visible > this.itemsTotal || this.options.visible <=0 ) {
			this.options.visible = 1;
		}
		this.current = 0;
		this._init();
	}

	Stack.prototype.options = {
		// stack's perspective value
		perspective: 1000,
		// stack's perspective origin
		perspectiveOrigin : '50% -50%',
		// number of visible items in the stack
		visible : 3,
		// infinite navigation
		infinite : true,
		// callback: when reaching the end of the stack
		onEndStack : function() {return false;},
		// animation settings for the items' movements in the stack when the items rearrange
		// object that is passed to the dynamicsjs animate function (see more at http://dynamicsjs.com/)
		// example:
		// {type: dynamics.spring,duration: 1641,frequency: 557,friction: 459,anticipationSize: 206,anticipationStrength: 392}
		stackItemsAnimation : {
			duration : 500,
			type : dynamics.bezier,
			points : [{'x':0,'y':0,'cp':[{'x':0.25,'y':0.1}]},{'x':1,'y':1,'cp':[{'x':0.25,'y':1}]}]
		},
		// delay for the items' rearrangement / delay before stackItemsAnimation is applied
		stackItemsAnimationDelay : 0,
		// animation settings for the items' movements in the stack before the rearrangement
		// we can set up different settings depending on whether we are approving or rejecting an item
		/*
		stackItemsPreAnimation : {
			reject : {
				// if true, then the settings.properties parameter will be distributed through the items in a non equal fashion
				// for instance, if we set settings.properties = {translateX:100} and we have options.visible = 4, 
				// then the second item in the stack will translate 100px, the second one 75px and the third 50px
				elastic : true,
				// object that is passed into the dynamicsjs animate function - second parameter -  (see more at http://dynamicsjs.com/)
				animationProperties : {},
				// object that is passed into the dynamicsjs animate function - third parameter - (see more at http://dynamicsjs.com/)
				animationSettings : {} 
			},
			accept : {
				// if true, then the settings.properties parameter will be distributed through the items in a non equal fashion
				// for instance, if we set settings.properties = {translateX:100} and we have options.visible = 4, 
				// then the second item on the stack will translate 100px, the second one 75px and the third 50px
				elastic : true,
				// object that is passed into the dynamicsjs animate function - second parameter -  (see more at http://dynamicsjs.com/)
				animationProperties : {},
				// object that is passed into the dynamicsjs animate function (see more at http://dynamicsjs.com/)
				animationSettings : {}
			}
		}
		*/
	};

	// set the initial styles for the visible items
	Stack.prototype._init = function() {
		// set default styles
		// first, the stack
		this.el.style.WebkitPerspective = this.el.style.perspective = this.options.perspective + 'px';
		this.el.style.WebkitPerspectiveOrigin = this.el.style.perspectiveOrigin = this.options.perspectiveOrigin;

		var self = this;

		// the items
		for(var i = 0; i < this.itemsTotal; ++i) {
			var item = this.items[i];
			// 设置index属性
			item.setAttribute("ind", i)
			if( i < this.options.visible ) {
				item.style.opacity = 1;
				item.style.pointerEvents = 'auto';
				item.style.zIndex = i === 0 ? parseInt(this.options.visible + 1) : parseInt(this.options.visible - i);
				item.style.WebkitTransform = item.style.transform = 'translate3d(0px, 0px, ' + parseInt(-1 * 50 * i) + 'px)';
			}
			else {
				item.style.opacity = 0;
				item.classList.remove('stack__item--current')
				item.style.WebkitTransform = item.style.transform = 'translate3d(0,0,-' + parseInt(this.options.visible * 50) + 'px)';
			}
		}

		this.items[this.current].classList.add('stack__item--current')
	};

	Stack.prototype.reject = function(callback) {
		this._next('reject', callback);
	};

	Stack.prototype.accept = function(callback) {
		this._next('accept', callback);
	};

	Stack.prototype.back = function(callback) {
		this._last('back', callback);
	};

	Stack.prototype.pick = function(callback) {
		this._last('pick', callback);
	}

	Stack.prototype.restart = function() {
		this.current = 0
		this.hasEnded = false;
		this._init();
	};

	Stack.prototype.moveCard = function () {
		var self = this;
		var maxIndex = this.options.visible < this.itemsTotal ? this.options.visible : this.itemsTotal
		// set style for the other items
		for(var i = 0; i < maxIndex; ++i) {
			// 判断是否设置了无限
			if( !this.options.infinite ) {
				if( this.current + i >= this.itemsTotal - 1 ) break;
				var pos = this.current + i + 1;
			}
			else {
				var pos = this.current + i < this.itemsTotal - 1 ? this.current + i + 1 : i - (this.itemsTotal - this.current - 1);
			}

			var item = this.items[pos]
			function animateStackItems (item, i) {
				item.style.pointerEvents = 'auto';
				item.style.opacity = 1;
				item.style.zIndex = parseInt(self.options.visible - i);
				
				dynamics.animate(item, {
					translateZ : parseInt(-1 * 50 * i)
				}, self.options.stackItemsAnimation);
			}

			setTimeout(function(item,i) {
				return function() {
					var preAnimation;

					if( self.options.stackItemsPreAnimation ) {
						preAnimation = action === 'accept' ? self.options.stackItemsPreAnimation.accept : self.options.stackItemsPreAnimation.reject;
					}
					
					if( preAnimation ) {
						// items "pre animation" properties
						var animProps = {};
						
						for (var key in preAnimation.animationProperties) {
							var interval = preAnimation.elastic ? preAnimation.animationProperties[key]/self.options.visible : 0;
							animProps[key] = preAnimation.animationProperties[key] - Number(i*interval);
						}

						// this one remains the same..
						animProps.translateZ = parseInt(-1 * 50 * (i+1));

						preAnimation.animationSettings.complete = function() {
							animateStackItems(item, i);
						};
						
						dynamics.animate(item, animProps, preAnimation.animationSettings);
					}
					else {
						animateStackItems(item, i);
					}
				};
			}(item,i), this.options.stackItemsAnimationDelay);
		}
	}

	Stack.prototype._next = function(action, callback) {
		if( this.isAnimating || ( !this.options.infinite && this.hasEnded ) ) return;
		this.isAnimating = true;
		// current item
		var currentItem = this.items[this.current];
		currentItem.classList.remove('stack__item--current')
		// add animation class
		currentItem.classList.add(action === 'accept' ? 'stack__item--accept' : 'stack__item--reject')
		var self = this;
		onEndAnimation(currentItem, function() {
			// reset current item
			currentItem.style.opacity = 0;
			currentItem.style.pointerEvents = 'none';
			currentItem.style.zIndex = -1;
			currentItem.style.WebkitTransform = currentItem.style.transform = 'translate3d(0px, 0px, -' + parseInt(self.options.visible * 50) + 'px)';

			currentItem.classList.remove(action === 'accept' ? 'stack__item--accept' : 'stack__item--reject')

			self.items[self.current].style.zIndex = self.options.visible + 1;
			self.isAnimating = false;

			if( callback ) callback();
			
			if( !self.options.infinite && self.current === 0 ) {
				self.hasEnded = true;
				// callback
				self.options.onEndStack(self);
			}
		});

		this.moveCard()

		// update current
		this.current = this.current < this.itemsTotal - 1 ? this.current + 1 : 0;
		this.items[this.current].classList.add('stack__item--current')
	}

	// 上一个
	Stack.prototype._last = function(action, callback) {
		if( this.isAnimating || ( !this.options.infinite && this.hasEnded ) ) return;
		this.isAnimating = true;

		// 当前卡片
		var currentItem = this.items[this.current];
		currentItem.classList.remove('stack__item--current')
		
		
		// add animation class
		
		var lastIndex = this.current <= 0 ? this.itemsTotal - 2 : this.current - 2
		var activeItem = this.items[lastIndex + 1]
		activeItem.classList.remove('stack__item--current')
		console.log(lastIndex)
		activeItem.classList.add('stack__item--current')
		activeItem.style.transform = ''
		activeItem.style.opacity = '0'
		activeItem.style.zIndex = '5'
		activeItem.classList.add('stack-item-' + action)
		onEndAnimation(activeItem, () => {
			this.current = lastIndex
			this.moveCard()
			this.current++
			setTimeout(() => {
				activeItem.classList.remove('stack-item-' + action)
				activeItem.style.zIndex = '4'
				this.isAnimating = false
			}, 100)
		})
	}

	window.Stack = Stack;

})(window);