/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export h */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return h; });
/* unused harmony export cloneElement */
/* unused harmony export Component */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return render; });
/* unused harmony export rerender */
/* unused harmony export options */
/** Virtual DOM Node */
function VNode() {}

/** Global options
 *	@public
 *	@namespace options {Object}
 */
var options = {

	/** If `true`, `prop` changes trigger synchronous component updates.
  *	@name syncComponentUpdates
  *	@type Boolean
  *	@default true
  */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
  *	@param {VNode} vnode	A newly-created VNode to normalize/process
  */
	//vnode(vnode) { }

	/** Hook invoked after a component is mounted. */
	// afterMount(component) { }

	/** Hook invoked after the DOM is updated with a component's latest render. */
	// afterUpdate(component) { }

	/** Hook invoked immediately before a component is unmounted. */
	// beforeUnmount(component) { }
};

var stack = [];

var EMPTY_CHILDREN = [];

/** JSX/hyperscript reviver
*	Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *	@see http://jasonformat.com/wtf-is-jsx
 *	@public
 */
function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') child = null;

			if (simple = typeof nodeName !== 'function') {
				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode !== undefined) options.vnode(p);

	return p;
}

/** Copy own-properties from `props` onto `obj`.
 *	@returns obj
 *	@private
 */
function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }return obj;
}

/** Call a function asynchronously, as soon as possible.
 *	@param {Function} callback
 */
var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
	return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

// DOM properties that should NOT have "px" added when numeric
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

/** Check if two nodes are equivalent.
 *	@param {Element} node
 *	@param {VNode} vnode
 *	@private
 */
function isSameNodeType(node, vnode, hydrating) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return node.splitText !== undefined;
	}
	if (typeof vnode.nodeName === 'string') {
		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
	}
	return hydrating || node._componentConstructor === vnode.nodeName;
}

/** Check if an Element has a given normalized name.
*	@param {Element} node
*	@param {String} nodeName
 */
function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
	var props = extend({}, vnode.attributes);
	props.children = vnode.children;

	var defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps !== undefined) {
		for (var i in defaultProps) {
			if (props[i] === undefined) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

/** Create an element with the given nodeName.
 *	@param {String} nodeName
 *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
 *	@returns {Element} node
 */
function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */
function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */
function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') name = 'class';

	if (name === 'key') {
		// ignore
	} else if (name === 'ref') {
		if (old) old(null);
		if (value) value(node);
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) node.style[i] = '';
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		setProperty(node, name, value == null ? '' : value);
		if (value == null || value === false) node.removeAttribute(name);
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
		if (value == null || value === false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
		} else if (typeof value !== 'function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
		}
	}
}

/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
	try {
		node[name] = value;
	} catch (e) {}
}

/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

/** Queue of components that have been mounted and are awaiting componentDidMount */
var mounts = [];

/** Diff recursion count, used to track the end of the diff cycle. */
var diffLevel = 0;

/** Global flag indicating if the diff is currently within an SVG */
var isSvgMode = false;

/** Global flag indicating if the diff is performing hydration */
var hydrating = false;

/** Invoke queued componentDidMount lifecycle methods */
function flushMounts() {
	var c;
	while (c = mounts.pop()) {
		if (options.afterMount) options.afterMount(c);
		if (c.componentDidMount) c.componentDidMount();
	}
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	// diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
	if (!diffLevel++) {
		// when first starting the diff, check if we're diffing an SVG or within an SVG
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		// hydration is indicated by the existing element to be diffed not having a prop cache
		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	// append the element if its a new parent
	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

	// diffLevel being reduced to 0 means we're exiting the diff
	if (! --diffLevel) {
		hydrating = false;
		// invoke queued componentDidMount lifecycle methods
		if (!componentRoot) flushMounts();
	}

	return ret;
}

/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	// empty values (null, undefined, booleans) render as empty Text nodes
	if (vnode == null || typeof vnode === 'boolean') vnode = '';

	// Fast case: Strings & Numbers create/update Text nodes.
	if (typeof vnode === 'string' || typeof vnode === 'number') {

		// update if it's already a Text node:
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			/* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			// it wasn't a Text node: replace it with one and recycle the old Element
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	// If the VNode represents a Component, perform a component diff:
	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	// If there's no existing element or it's the wrong type, create a new one:
	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			// move children into the replacement node
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			} // if the previous Element was mounted into the DOM, replace it inline
			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

			// recycle the old element (skips non-Element node types)
			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	// Optimization: fast-path for elements containing a single TextNode:
	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	}
	// otherwise, if there are existing or new children, diff them:
	else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	// Apply attributes/props from VNode to the DOM Element:
	diffAttributes(out, vnode.attributes, props);

	// restore previous SVG mode: (in case we're exiting an SVG namespace)
	isSvgMode = prevSvgMode;

	return out;
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	// Build up a map of keyed children and an Array of unkeyed children:
	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			// attempt to find a node based on key matching
			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			}
			// attempt to pluck a node of the same type from the existing children
			else if (!child && min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) childrenLen--;
							if (j === min) min++;
							break;
						}
					}
				}

			// morph the matched/found/created DOM child to match vchild (deep)
			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	// remove unused keyed children:
	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
		}
	}

	// remove orphaned unkeyed children:
	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		// if node is owned by a Component, unmount that component (ends up recursing back here)
		unmountComponent(component);
	} else {
		// If the node's VNode had a ref function, invoke it with null here.
		// (this is part of the React spec, and smart for unsetting references)
		if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
	var name;

	// remove attributes no longer present on the vnode by setting them to undefined
	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	// add new & update changed attributes
	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */
var components = {};

/** Reclaim a component for later re-use by the recycler. */
function collectComponent(component) {
	var name = component.constructor.name;
	(components[name] || (components[name] = [])).push(component);
}

/** Create a component. Normalizes differences between PFC's and classful Components. */
function createComponent(Ctor, props, context) {
	var list = components[Ctor.name],
	    inst;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	if (list) {
		for (var i = list.length; i--;) {
			if (list[i].constructor === Ctor) {
				inst.nextBase = list[i].nextBase;
				list.splice(i, 1);
				break;
			}
		}
	}
	return inst;
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}

/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */
function setComponentProps(component, props, opts, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	if (component.__ref = props.ref) delete props.ref;
	if (component.__key = props.key) delete props.key;

	if (!component.base || mountAll) {
		if (component.componentWillMount) component.componentWillMount();
	} else if (component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props, context);
	}

	if (context && context !== component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (opts !== 0) {
		if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	if (component.__ref) component.__ref(component);
}

/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts, mountAll, isChild) {
	if (component._disable) return;

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    rendered,
	    inst,
	    cbase;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		// context to pass to the child, can be updated via (grand-)parent component
		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {
			// set up high order component link

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			// destroy high order component link
			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || opts === 1) {
				if (cbase) cbase._component = null;
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.unshift(component);
	} else if (!skip) {
		// Ensure that pending componentDidMount() hooks of child components
		// are called before the componentDidUpdate() hook in the parent.
		// Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
		// flushMounts();

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, previousContext);
		}
		if (options.afterUpdate) options.afterUpdate(component);
	}

	if (component._renderCallbacks != null) {
		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}
	}

	if (!diffLevel && !isChild) flushMounts();
}

/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;
			// passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component) {
	if (options.beforeUnmount) options.beforeUnmount(component);

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	// recursively tear down & recollect high-order component children:
	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);

		component.nextBase = base;

		removeNode(base);
		collectComponent(component);

		removeChildren(base);
	}

	if (component.__ref) component.__ref(null);
}

/** Base Component class.
 *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
function Component(props, context) {
	this._dirty = true;

	/** @public
  *	@type {object}
  */
	this.context = context;

	/** @public
  *	@type {object}
  */
	this.props = props;

	/** @public
  *	@type {object}
  */
	this.state = this.state || {};
}

extend(Component.prototype, {

	/** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
  *	@param {object} nextProps
  *	@param {object} nextState
  *	@param {object} nextContext
  *	@returns {Boolean} should the component re-render
  *	@name shouldComponentUpdate
  *	@function
  */

	/** Update component state by copying properties from `state` to `this.state`.
  *	@param {object} state		A hash of state properties to update with new values
  *	@param {function} callback	A function to be called once component state is updated
  */
	setState: function setState(state, callback) {
		var s = this.state;
		if (!this.prevState) this.prevState = extend({}, s);
		extend(s, typeof state === 'function' ? state(s, this.props) : state);
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		enqueueRender(this);
	},


	/** Immediately perform a synchronous re-render of the component.
  *	@param {function} callback		A function to be called after component is re-rendered.
  *	@private
  */
	forceUpdate: function forceUpdate(callback) {
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		renderComponent(this, 2);
	},


	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
  *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
  *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
  *	@param {object} state		The component's current state
  *	@param {object} context		Context object (if a parent component has provided context)
  *	@returns VNode
  */
	render: function render() {}
});

/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */
function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

var preact = {
	h: h,
	createElement: h,
	cloneElement: cloneElement,
	Component: Component,
	render: render,
	rerender: rerender,
	options: options
};


/* harmony default export */ __webpack_exports__["b"] = (preact);
//# sourceMappingURL=preact.esm.js.map


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MenuItems; });
/* unused harmony export getComponentFromMenuItem */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MainComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__header_component__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__footer_component__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__alarm_config__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__bamboo_config__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__networks_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dashboard__ = __webpack_require__(26);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







var MenuItems = {
    Dashboard: 'dashboard',
    BambooConfig: 'bamboo-config',
    AlarmConfig: 'alarm-config',
    NetworkConfig: 'network-config'
};
var getComponentFromMenuItem = function (menuItem) {
    if (menuItem === MenuItems.Dashboard)
        return __WEBPACK_IMPORTED_MODULE_6__dashboard__["a" /* DashboardComponent */];
    if (menuItem === MenuItems.AlarmConfig)
        return __WEBPACK_IMPORTED_MODULE_3__alarm_config__["a" /* AlarmConfigComponent */];
    if (menuItem === MenuItems.BambooConfig)
        return __WEBPACK_IMPORTED_MODULE_4__bamboo_config__["a" /* BambooConfigComponent */];
    if (menuItem === MenuItems.NetworkConfig)
        return __WEBPACK_IMPORTED_MODULE_5__networks_config__["a" /* NetworksConfigComponent */];
    throw new Error(menuItem + " has no component defined");
};
var MainComponent = /** @class */ (function (_super) {
    __extends(MainComponent, _super);
    function MainComponent() {
        var _this = _super.call(this) || this;
        _this.state.selectedMenuItem = MenuItems.Dashboard;
        return _this;
    }
    MainComponent.prototype.selectMenuItem = function (itemToSelect) {
        this.setState({ selectedMenuItem: itemToSelect });
    };
    MainComponent.prototype.render = function () {
        var _this = this;
        var ContentComponent = getComponentFromMenuItem(this.state.selectedMenuItem);
        return (__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { class: "main-component" },
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement(__WEBPACK_IMPORTED_MODULE_1__header_component__["a" /* HeaderComponent */], null),
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("section", null,
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement(ContentComponent, null)),
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement(__WEBPACK_IMPORTED_MODULE_2__footer_component__["a" /* FooterComponent */], { selectedMenuItem: this.state.selectedMenuItem, onMenuItemSelect: function (item) { return _this.selectMenuItem(item); } })));
    };
    return MainComponent;
}(__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].Component));



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Icon; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);

var Icon = function (_a) {
    var icon = _a.icon, className = _a.className, onClick = _a.onClick;
    return (__WEBPACK_IMPORTED_MODULE_0_preact__["a" /* createElement */]("i", { onClick: onClick, className: className, dangerouslySetInnerHTML: { __html: icon } }));
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NetworkConnectionStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getNetworks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getNetworkConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return connectToNetwork; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return disconnectFromNetwork; });
var NetworkConnectionStatus;
(function (NetworkConnectionStatus) {
    NetworkConnectionStatus[NetworkConnectionStatus["Disconnected"] = 0] = "Disconnected";
    NetworkConnectionStatus[NetworkConnectionStatus["Connected"] = 1] = "Connected";
})(NetworkConnectionStatus || (NetworkConnectionStatus = {}));
// type ServerSideNetwork = Network & { password?: string };
// const fixedNetworks: ServerSideNetwork[] = [{
//     ssid: 'Nania',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Marvel',
//     isSecured: false
// }, {
//     ssid: 'DC Comics',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Squirle',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Marcus figo',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Tora tora',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Szakawina',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Merlin',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Hellfire',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'GoldeN',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Baoblir',
//     isSecured: false
// }];
// let connectedNetworkSSID: string;
// export const getNetworks = () => {
//     return new Promise<Network[]>((res: ((value: Network[]) => void)) => {
//         setTimeout(() => res(fixedNetworks), 250);
//     });
// };
var getNetworks = function () { return new Promise(function (result) {
    fetch('/networks').then(function (res) { return result(res.json()); });
}); };
// export const getNetworkConfig = () => new Promise<NetworkConfig>(res=>{
//     setTimeout(()=>{
//         res({
//             ssid: 'Szakawina',
//             password: Array.from(Array(4)).reduce(s => `${s}*`, ''),
//             status: NetworkConnectionStatus.Connected,
//             ip: '10.110.12.12',
//             mac: 'a4:17:31:4b:97:f1'
//         });
//     }, 250);
// });
var getNetworkConfig = function () { return new Promise(function (result) {
    fetch('/network-config').then(function (res) { return result(res.json()); });
}); };
// export const connectToNetwork = (ssid: string, password: string) => new Promise((res, rej) => {
//     setTimeout(() => {
//         const networkCandidates = fixedNetworks.filter(n => n.ssid === ssid);
//         if (networkCandidates.length !== 1) rej();
//
//         const networkToConnect = networkCandidates[0];
//         if (networkToConnect.password && networkToConnect.password !== password) rej();
//
//         // connectedNetworkSSID = networkToConnect.ssid;
//         res();
//     }, 250);
// });
var connectToNetwork = function (ssid, password) { return new Promise(function (res, rej) {
    fetch('/network-connect', {
        method: "POST",
        body: JSON.stringify({ ssid: ssid, password: password })
    }).then(function (response) { return response.json(); }).then(function (response) {
        if (response.result == 0)
            res();
        else
            rej();
    });
}); };
// export const disconnectFromNetwork = () => new Promise((res) => {
//     setTimeout(() => res(), 250);
// });
var disconnectFromNetwork = function () { return new Promise(function (res, rej) {
    fetch('/network-disconnect', {
        method: "POST",
        body: JSON.stringify({})
    })
        .then(function (response) { return response.json(); }).then(function (response) {
        if (response.result == 1)
            res();
        else
            rej();
    });
}); };


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_scss__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__style_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_main__ = __webpack_require__(1);




Object(__WEBPACK_IMPORTED_MODULE_0_preact__["c" /* render */])(__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement(__WEBPACK_IMPORTED_MODULE_2__components_main__["a" /* MainComponent */], null), document.body);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(8)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(undefined);
// imports


// module
exports.push([module.i, "html {\n  height: 100%; }\n\nbody {\n  height: 100%;\n  margin: 0em;\n  color: white;\n  background: -webkit-gradient(linear, left top, left bottom, from(#7374E4), to(#864B9C));\n  background: linear-gradient(#7374E4, #864B9C);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  overflow-y: hidden;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  height: 100%; }\n  body * {\n    font-family: 'Roboto', sans-serif; }\n\nheader {\n  -ms-flex-item-align: center;\n      align-self: center;\n  font-weight: 600;\n  font-size: 1.5em;\n  margin: 1em;\n  cursor: pointer; }\n  header span {\n    margin-left: 1em;\n    font-weight: lighter;\n    font-size: 0.5em;\n    letter-spacing: 0.2em;\n    opacity: 0.5;\n    text-transform: uppercase;\n    -webkit-transition: all 0.25s;\n    transition: all 0.25s; }\n  header:hover span {\n    opacity: 1; }\n\n.main-component {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1; }\n\nfooter {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  background: white;\n  -webkit-filter: drop-shadow(0px 0px 5px black);\n          filter: drop-shadow(0px 0px 5px black); }\n\n.menu-item {\n  padding: 0.75em 1em;\n  -webkit-transition: all 0.25s;\n  transition: all 0.25s;\n  cursor: pointer;\n  color: rgba(134, 75, 156, 0.5); }\n  .menu-item svg {\n    fill: #864B9C; }\n  .menu-item:hover {\n    background: #864B9C; }\n    .menu-item:hover svg {\n      fill: white; }\n  .menu-item.active {\n    color: #864B9C; }\n    .menu-item.active:hover {\n      color: white; }\n\n.input-group label {\n  text-transform: uppercase;\n  display: block;\n  font-size: 0.65em;\n  font-weight: 500;\n  opacity: 0.5; }\n\n.input-group input {\n  background: transparent;\n  border-width: 0px 0px 1px 0px;\n  color: white;\n  border-color: rgba(255, 255, 255, 0.5);\n  -webkit-transition: border-color 0.25s;\n  transition: border-color 0.25s; }\n  .input-group input:focus {\n    border-color: white;\n    outline-color: transparent; }\n\nsection {\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -ms-flex-item-align: stretch;\n      align-self: stretch;\n  overflow: auto; }\n\nhr {\n  margin: 3em 0em; }\n\n.networks-config-component .networks-list {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column; }\n  .networks-config-component .networks-list .network-component {\n    padding: 1em;\n    min-width: 300px;\n    margin: 0.1em;\n    background: rgba(255, 255, 255, 0.25); }\n    .networks-config-component .networks-list .network-component .network-info {\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex; }\n      .networks-config-component .networks-list .network-component .network-info > div {\n        padding: 0em 0.5em; }\n    .networks-config-component .networks-list .network-component .network-actions > div {\n      margin-top: 0.5em;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center;\n      -webkit-box-pack: justify;\n          -ms-flex-pack: justify;\n              justify-content: space-between; }\n    .networks-config-component .networks-list .network-component .network-status {\n      opacity: .75; }\n\nbutton {\n  padding: 0.6em 0.75em;\n  border: none;\n  background: white;\n  text-transform: uppercase;\n  font-weight: bold;\n  -webkit-filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.25));\n          filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.25));\n  -webkit-transition: all 0.25s;\n  transition: all 0.25s;\n  cursor: pointer; }\n  button:hover {\n    -webkit-filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.75));\n            filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.75)); }\n\n.alarm-config-item-component {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 1.5em;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  cursor: pointer; }\n  .alarm-config-item-component > i {\n    font-size: 3em; }\n    .alarm-config-item-component > i.enabled {\n      opacity: 1; }\n    .alarm-config-item-component > i.disabled {\n      opacity: 0.6; }\n  .alarm-config-item-component > label {\n    cursor: pointer;\n    text-transform: uppercase;\n    opacity: 0.6;\n    font-weight: bold;\n    letter-spacing: 0.1em;\n    font-size: 0.75em;\n    display: block;\n    -webkit-transition: opacity 0.25s;\n    transition: opacity 0.25s; }\n  .alarm-config-item-component:hover > label {\n    opacity: 1; }\n\nbody select {\n  display: block;\n  width: 100%;\n  padding: 10px 70px 10px 13px !important;\n  border: 1px solid #e3e3e3;\n  background-color: #fff;\n  color: #444444;\n  font-size: 0.75em;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  /* this is must */ }\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(9);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);

var HeaderComponent = function () { return (__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("header", null,
    "Bamboo",
    __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("span", null, "build tracker"))); };


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icon__ = __webpack_require__(2);



var AlarmIcon = __webpack_require__(12);
var BuildIcon = __webpack_require__(13);
var HomeIcon = __webpack_require__(14);
var WifiIcon = __webpack_require__(15);
var getMenuItemClass = function (menuItem, selectedMenuItem) { return (menuItem === selectedMenuItem ? 'active' : '') + " menu-item material-icons"; };
var FooterComponent = function (_a) {
    var onMenuItemSelect = _a.onMenuItemSelect, selectedMenuItem = _a.selectedMenuItem;
    return (__WEBPACK_IMPORTED_MODULE_0_preact__["a" /* createElement */]("footer", null,
        __WEBPACK_IMPORTED_MODULE_0_preact__["a" /* createElement */](__WEBPACK_IMPORTED_MODULE_2__icon__["a" /* Icon */], { icon: HomeIcon, className: getMenuItemClass(__WEBPACK_IMPORTED_MODULE_1__main__["b" /* MenuItems */].Dashboard, selectedMenuItem), onClick: function () { return onMenuItemSelect(__WEBPACK_IMPORTED_MODULE_1__main__["b" /* MenuItems */].Dashboard); } }),
        __WEBPACK_IMPORTED_MODULE_0_preact__["a" /* createElement */](__WEBPACK_IMPORTED_MODULE_2__icon__["a" /* Icon */], { icon: AlarmIcon, className: getMenuItemClass(__WEBPACK_IMPORTED_MODULE_1__main__["b" /* MenuItems */].AlarmConfig, selectedMenuItem), onClick: function () { return onMenuItemSelect(__WEBPACK_IMPORTED_MODULE_1__main__["b" /* MenuItems */].AlarmConfig); } }),
        __WEBPACK_IMPORTED_MODULE_0_preact__["a" /* createElement */](__WEBPACK_IMPORTED_MODULE_2__icon__["a" /* Icon */], { icon: WifiIcon, className: getMenuItemClass(__WEBPACK_IMPORTED_MODULE_1__main__["b" /* MenuItems */].NetworkConfig, selectedMenuItem), onClick: function () { return onMenuItemSelect(__WEBPACK_IMPORTED_MODULE_1__main__["b" /* MenuItems */].NetworkConfig); } }),
        __WEBPACK_IMPORTED_MODULE_0_preact__["a" /* createElement */](__WEBPACK_IMPORTED_MODULE_2__icon__["a" /* Icon */], { icon: BuildIcon, className: getMenuItemClass(__WEBPACK_IMPORTED_MODULE_1__main__["b" /* MenuItems */].BambooConfig, selectedMenuItem), onClick: function () { return onMenuItemSelect(__WEBPACK_IMPORTED_MODULE_1__main__["b" /* MenuItems */].BambooConfig); } })));
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "<svg fill=\"#000000\" height=\"18\" viewBox=\"0 0 24 24\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n    <path d=\"M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z\"/>\n</svg>"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<svg fill=\"#000000\" height=\"18\" viewBox=\"0 0 24 24\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n    <path clip-rule=\"evenodd\" d=\"M0 0h24v24H0z\" fill=\"none\"/>\n    <path d=\"M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z\"/>\n</svg>"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<svg fill=\"#000000\" height=\"18\" viewBox=\"0 0 24 24\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n    <path d=\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z\"/>\n    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n</svg>"

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "<svg fill=\"#000000\" height=\"18\" viewBox=\"0 0 24 24\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n    <path d=\"M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 2c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.48-.81 2.75-2 3.45l1 1.74c1.79-1.04 3-2.97 3-5.19zM12 3C6.48 3 2 7.48 2 13c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 18.53 4 15.96 4 13c0-4.42 3.58-8 8-8s8 3.58 8 8c0 2.96-1.61 5.53-4 6.92l1 1.73c2.99-1.73 5-4.95 5-8.65 0-5.52-4.48-10-10-10z\"/>\n</svg>"

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AlarmConfigComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__alarm_config_item__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__apis_alarm__ = __webpack_require__(18);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};



var LightBulb = __webpack_require__(19);
var VolumeUp = __webpack_require__(20);
var AlarmConfigComponent = /** @class */ (function (_super) {
    __extends(AlarmConfigComponent, _super);
    function AlarmConfigComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AlarmConfigComponent.prototype.componentDidMount = function () {
        var _this = this;
        Object(__WEBPACK_IMPORTED_MODULE_2__apis_alarm__["a" /* getAlarmConfig */])().then(function (config) { return _this.setState({ config: config }); });
    };
    AlarmConfigComponent.prototype.toggleLight = function () {
        var _this = this;
        Object(__WEBPACK_IMPORTED_MODULE_2__apis_alarm__["b" /* toggleLight */])().then(function () {
            _this.setState({ config: __assign({}, _this.state.config, { lightState: !_this.state.config.lightState }) });
        });
    };
    AlarmConfigComponent.prototype.toggleSignal = function () {
        var _this = this;
        Object(__WEBPACK_IMPORTED_MODULE_2__apis_alarm__["c" /* toggleSignal */])().then(function () {
            _this.setState({ config: __assign({}, _this.state.config, { signalState: !_this.state.config.signalState }) });
        });
    };
    AlarmConfigComponent.prototype.render = function () {
        var config = this.state.config;
        return (config ? __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { className: "alarm-config-component" },
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement(__WEBPACK_IMPORTED_MODULE_1__alarm_config_item__["a" /* AlarmConfigItemComponent */], { onClick: this.toggleLight.bind(this), state: config.lightState, icon: LightBulb, label: 'Light effects' }),
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement(__WEBPACK_IMPORTED_MODULE_1__alarm_config_item__["a" /* AlarmConfigItemComponent */], { onClick: this.toggleSignal.bind(this), state: config.signalState, icon: VolumeUp, label: 'Sound effects' })) : null);
    };
    return AlarmConfigComponent;
}(__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].Component));



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AlarmConfigItemComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__icon__ = __webpack_require__(2);


var getClassName = function (state) { return "material-icons " + (state ? 'enabled' : 'disabled'); };
var AlarmConfigItemComponent = function (_a) {
    var icon = _a.icon, label = _a.label, state = _a.state, onClick = _a.onClick;
    return (__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { onClick: onClick, className: 'alarm-config-item-component' },
        __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("i", { className: getClassName(state) }, icon),
        __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement(__WEBPACK_IMPORTED_MODULE_1__icon__["a" /* Icon */], { icon: icon, className: getClassName(state) }),
        __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("label", null, label)));
};


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return toggleLight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return toggleSignal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getAlarmConfig; });
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var fakeAlarmConfig = {
    lightState: true,
    signalState: false
};
var toggleLight = function () { return new Promise(function (res) {
    setTimeout(function () {
        fakeAlarmConfig.lightState = !fakeAlarmConfig.lightState;
        res();
    }, 250);
}); };
var toggleSignal = function () { return new Promise(function (res) {
    setTimeout(function () {
        fakeAlarmConfig.signalState = !fakeAlarmConfig.signalState;
        res();
    }, 250);
}); };
var getAlarmConfig = function () { return new Promise(function (res) {
    setTimeout(function () {
        res(__assign({}, fakeAlarmConfig));
    }, 250);
}); };


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "<svg fill=\"#000000\" height=\"18\" viewBox=\"0 0 24 24\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <defs>\n        <path d=\"M0 0h24v24H0V0z\" id=\"a\"/>\n    </defs>\n    <clipPath id=\"b\">\n        <use overflow=\"visible\" xlink:href=\"#a\"/>\n    </clipPath>\n    <path clip-path=\"url(#b)\" d=\"M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z\"/>\n</svg>"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "<svg fill=\"#000000\" height=\"18\" viewBox=\"0 0 24 24\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n    <path d=\"M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z\"/>\n    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n</svg>"

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BambooConfigComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__apis_networks__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__apis_bamboo__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__drop_down__ = __webpack_require__(23);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var BambooConfigComponent = /** @class */ (function (_super) {
    __extends(BambooConfigComponent, _super);
    function BambooConfigComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._getBambooConfig = function () {
            Object(__WEBPACK_IMPORTED_MODULE_2__apis_bamboo__["a" /* getBambooConfig */])()
                .then(function (bambooConfig) {
                _this.setState({ bambooConfig: bambooConfig });
                _this.bambooServerInput.value = bambooConfig.url;
                _this.usernameInput.value = bambooConfig.login;
                _this.passwordInput.value = bambooConfig.password;
                (bambooConfig.connected) &&
                    Object(__WEBPACK_IMPORTED_MODULE_2__apis_bamboo__["c" /* getBambooProjects */])().then(function (projects) {
                        _this.setState({ projects: projects });
                    });
                (bambooConfig.connected && bambooConfig.project) &&
                    Object(__WEBPACK_IMPORTED_MODULE_2__apis_bamboo__["b" /* getBambooPlans */])(bambooConfig.project).then(function (plans) {
                        _this.setState({ plans: plans });
                    });
            });
        };
        _this.onSelectProject = function (project) {
            Object(__WEBPACK_IMPORTED_MODULE_2__apis_bamboo__["e" /* selectProject */])(project);
            _this._getBambooConfig();
        };
        _this.onSelectPlan = function (plan) {
            Object(__WEBPACK_IMPORTED_MODULE_2__apis_bamboo__["d" /* selectPlan */])(plan);
        };
        return _this;
    }
    BambooConfigComponent.prototype.componentDidMount = function () {
        var _this = this;
        Object(__WEBPACK_IMPORTED_MODULE_1__apis_networks__["d" /* getNetworkConfig */])()
            .then(function (networkConfig) {
            _this.setState({ networkConfig: networkConfig });
            return (networkConfig.status !== __WEBPACK_IMPORTED_MODULE_1__apis_networks__["a" /* NetworkConnectionStatus */].Connected)
                ? Promise.reject(undefined)
                : Promise.resolve();
        }).then(this._getBambooConfig);
    };
    BambooConfigComponent.prototype.render = function () {
        var _this = this;
        var _a = this.state, projects = _a.projects, plans = _a.plans, bambooConfig = _a.bambooConfig;
        return (__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { className: "bamboo-config-component" },
            this.state.networkConfig
                ? __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("span", null,
                    __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", null,
                        "IP: ",
                        this.state.networkConfig.mac),
                    __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", null,
                        "MAC: ",
                        this.state.networkConfig.ip))
                : null,
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { className: "input-group" },
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("label", null, "Bamboo server url"),
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("input", { ref: function (el) { _this.bambooServerInput = el; } })),
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { className: "input-group" },
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("label", null, "Username"),
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("input", { ref: function (el) { _this.usernameInput = el; } })),
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { className: "input-group" },
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("label", null, "Password"),
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("input", { ref: function (el) { _this.passwordInput = el; } })),
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", null,
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("button", null, "Login")),
            bambooConfig &&
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", null,
                    projects &&
                        __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement(__WEBPACK_IMPORTED_MODULE_3__drop_down__["a" /* DropDown */], { label: "Select project", options: projects, selected: bambooConfig.project, onChange: this.onSelectProject }),
                    plans && bambooConfig.project &&
                        __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement(__WEBPACK_IMPORTED_MODULE_3__drop_down__["a" /* DropDown */], { onChange: this.onSelectPlan, label: "Select plan", options: plans, selected: bambooConfig.plan }))));
    };
    return BambooConfigComponent;
}(__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].Component));



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export connect */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return selectProject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return selectPlan; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getBambooConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getBambooProjects; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getBambooPlans; });
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var fakeBambooProjectConfig = {
    url: 'bamboo.sample.net',
    login: 'john.doe',
    password: '******',
    connected: true,
    project: '',
    plan: ''
};
var projects = ['Aspen', 'Medivio', 'Silvermedic', 'WCA', 'KGHM'];
var plans = ['Innergy-dev', 'Innergy-test', 'Innergy-beta'];
var connect = function (bambooProjectUrl, login, password) { return new Promise(function (res, rej) {
    setTimeout(function () {
        if (fakeBambooProjectConfig.url !== bambooProjectUrl)
            rej();
        if (fakeBambooProjectConfig.login !== login)
            rej();
        if (fakeBambooProjectConfig.password !== password)
            rej();
        res();
    }, 250);
}); };
var selectProject = function (project) { return new Promise(function (res) {
    setTimeout(function () {
        fakeBambooProjectConfig.project = project;
        if (project === project)
            res();
    }, 250);
}); };
var selectPlan = function (plan) { return new Promise(function (res) {
    setTimeout(function () {
        fakeBambooProjectConfig.plan = plan;
        if (plan === plan)
            res();
    }, 250);
}); };
var getBambooConfig = function () { return new Promise(function (res) {
    setTimeout(function () {
        res(__assign({}, fakeBambooProjectConfig));
    }, 250);
}); };
var getBambooProjects = function () { return new Promise(function (res) {
    setTimeout(function () {
        res(projects);
    }, 250);
}); };
var getBambooPlans = function (project) { return new Promise(function (res) {
    setTimeout(function () {
        res(plans.filter(function () { return project === project; }));
    }, 250);
}); };


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DropDown; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);

var DropDown = function (_a) {
    var options = _a.options, selected = _a.selected, label = _a.label, onChange = _a.onChange;
    return __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("select", { onChange: function (e) { return onChange(e.target.value); }, placeholder: "" },
        __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("option", { value: "" }, label),
        options.map(function (option) {
            return __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("option", { value: option, selected: option === selected }, option);
        }));
};


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NetworksConfigComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__network__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__apis_networks__ = __webpack_require__(3);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var NetworksConfigComponent = /** @class */ (function (_super) {
    __extends(NetworksConfigComponent, _super);
    function NetworksConfigComponent() {
        var _this = _super.call(this) || this;
        _this.state = {
            networks: []
        };
        return _this;
    }
    NetworksConfigComponent.prototype.componentDidMount = function () {
        var _this = this;
        Object(__WEBPACK_IMPORTED_MODULE_2__apis_networks__["e" /* getNetworks */])().then(function (networks) { return _this.setState({ networks: networks }); });
        Object(__WEBPACK_IMPORTED_MODULE_2__apis_networks__["d" /* getNetworkConfig */])().then(function (config) {
            _this.setState({
                connectedNetwork: config.ssid
            });
        });
    };
    NetworksConfigComponent.prototype.selectNetwork = function (network) {
        this.setState({ selectedNetwork: network.ssid });
    };
    NetworksConfigComponent.prototype.connectToNetwork = function (password) {
        var _this = this;
        this.state.selectedNetwork && Object(__WEBPACK_IMPORTED_MODULE_2__apis_networks__["b" /* connectToNetwork */])(this.state.selectedNetwork, password).then(function () { return _this.setState({
            connectedNetwork: _this.state.selectedNetwork,
            selectedNetwork: undefined
        }); });
    };
    NetworksConfigComponent.prototype.disconnectFromNetwork = function () {
        var _this = this;
        Object(__WEBPACK_IMPORTED_MODULE_2__apis_networks__["c" /* disconnectFromNetwork */])().then(function () { return _this.setState({
            connectedNetwork: undefined,
            selectedNetwork: undefined
        }); });
    };
    NetworksConfigComponent.prototype.render = function () {
        var _this = this;
        return (__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { className: "networks-config-component" },
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { className: "networks-list" }, this.state.networks ? this.state.networks.map(function (n) { return (__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement(__WEBPACK_IMPORTED_MODULE_1__network__["a" /* NetworkComponent */], { isExpanded: n.ssid === _this.state.selectedNetwork, onConnect: function (password) { return _this.connectToNetwork(password); }, onDisconnect: function () { return _this.disconnectFromNetwork(); }, isConnected: n.ssid === _this.state.connectedNetwork, onSelect: function () { return _this.selectNetwork(n); }, name: n.ssid, isSecured: n.isSecured })); }) : null)));
    };
    return NetworksConfigComponent;
}(__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].Component));



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NetworkComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var NetworkComponent = /** @class */ (function (_super) {
    __extends(NetworkComponent, _super);
    function NetworkComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NetworkComponent.prototype.updatePassword = function (password) {
        this.setState({ password: password });
    };
    NetworkComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props, onSelect = _a.onSelect, name = _a.name, isSecured = _a.isSecured, isConnected = _a.isConnected, isExpanded = _a.isExpanded, onConnect = _a.onConnect, onDisconnect = _a.onDisconnect;
        return (__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("span", { onClick: onSelect, className: 'network-component' },
            __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { className: "network-info" },
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("i", { className: "material-icons" }, isSecured ? 'signal_wifi_4_bar_lock' : 'signal_wifi_4_bar'),
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", null,
                    __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { className: "network-name" }, name),
                    __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { className: "network-status" },
                        isConnected ? 'Connected, ' : null,
                        isSecured ? 'Secured' : 'Open'))),
            isExpanded ? __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("span", { className: "network-actions" }, isConnected ? __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", null,
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("button", { onClick: onDisconnect }, "Disconnect")) : __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", null,
                __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("button", { onClick: function () { return onConnect(_this.state.password); } }, "Connect"),
                isSecured ? __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", { class: "input-group" },
                    __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("label", null, "Password"),
                    __WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("input", { onKeyUp: function (e) { return _this.updatePassword(e.target.value); } })) : null)) : null));
    };
    return NetworkComponent;
}(__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].Component));



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);

var DashboardComponent = function () { return (__WEBPACK_IMPORTED_MODULE_0_preact__["b" /* default */].createElement("div", null, "Dashboared here")); };


/***/ })
/******/ ]);