import './App.css';
import { useEffect, useState } from 'react';

class Node {
	terminal = false;
	data = '';
	m = new Map();

	constructor(data, terminal = false) {
		this.terminal = terminal;
		this.data = data;
	}
}

var root = new Node('\0', false);
// we need atleast one word too show suugestions
var firstWord = false;

function insert(root, s) {
	if (s.trim() === '') {
		return;
	}
	var temp = root;
	for (let idx in s) {
		let ch = s[idx];
		if (temp.m.has(ch) === false) {
			var n = new Node(ch);
			temp.m.set(ch, n);
		}
		temp = temp.m.get(ch);
	}
	temp.terminal = true;
	return;
}


function App() {
	var [val, setVal] = useState('');
	var [suggestions, setSuggesstions] = useState([]);
	var [x,setX] = useState(0);
	var [y,setY] = useState(0);

	useEffect(() => {
		var arr = [];

		function dfs(root, str) {
			if (root.m.size === 0) {
				arr.push(str);
				return;
			}
			if (root.terminal === true) {
				arr.push(str);
			}
			for (let [k, v] of root.m) {
				dfs(v, str + k);
			}
		}

		function getLastWord() {
			const lastword = val.split(" ").splice(-1)[0].trim();
			if (lastword !== '' && firstWord === true) {
				// show suggestions
				let temp = root;

				for (let idx in lastword) {
					var ch = lastword[idx];
					if (temp.m.has(ch)) {
						temp = temp.m.get(ch);
					}
					else {
						// currently no word is present return
						setSuggesstions([]);
						return;
					}
				}

				// currently no word is present return
				if (temp === root) {
					setSuggesstions([]);
					return;
				}

				// now temp points to last charater of last word run a dfs type function to get all words
				for (let [k, v] of temp.m) {
					dfs(v, lastword + k);
				}
				setSuggesstions(arr);
				arr = [];
			}
			else {
				setSuggesstions([]);
			}
		}
		getLastWord();
		var pos = coords();
		setY(pos.top);
		setX(pos.left);
	}, [val]);

	// we will insert word when we add space or enter
	function handleChange(e) {
		var keyCode = (e.keyCode ? e.keyCode : e.which);
		const lastword = val.split(" ").splice(-1)[0];
		if (keyCode === 32 || keyCode === 13) {
			insert(root, lastword);
			// we have added atleat one word so we can now show suggestions
			firstWord = true;
		}
	}

	function coords() {
		
		var properties = [
			'boxSizing',
			'width',  
			'height',
			'overflowX',
			'overflowY',  

			'borderTopWidth',
			'borderRightWidth',
			'borderBottomWidth',
			'borderLeftWidth',

			'paddingTop',
			'paddingRight',
			'paddingBottom',
			'paddingLeft',

			
			'fontStyle',
			'fontVariant',
			'fontWeight',
			'fontStretch',
			'fontSize',
			'lineHeight',
			'fontFamily',

			'textAlign',
			'textTransform',
			'textIndent',
			'textDecoration',  

			'letterSpacing',
			'wordSpacing'
		];

		var isFirefox = !(window.mozInnerScreenX == null);
		var mirrorDivDisplayCheckbox = document.getElementById('mirrorDivDisplay');
		var mirrorDiv, computed, style;

		const getCaretCoordinates = function (element, position) {
			// mirrored div
			mirrorDiv = document.getElementById(element.nodeName + '--mirror-div');
			if (!mirrorDiv) {
				mirrorDiv = document.createElement('div');
				mirrorDiv.id = element.nodeName + '--mirror-div';
				document.body.appendChild(mirrorDiv);
			}

			style = mirrorDiv.style;
			computed = getComputedStyle(element);

			// default textarea styles
			style.whiteSpace = 'pre-wrap';
			if (element.nodeName !== 'INPUT')
				style.wordWrap = 'break-word';  // only for textarea-s

			// position off-screen
			style.position = 'absolute';  // required to return coordinates properly
			style.top = element.offsetTop + parseInt(computed.borderTopWidth) + 'px';
			style.left = "400px";
			style.visibility = mirrorDivDisplayCheckbox.checked ? 'visible' : 'hidden';  

			// transfer the element's properties to the div
			properties.forEach(function (prop) {
				style[prop] = computed[prop];
			});

			if (isFirefox) {
				style.width = parseInt(computed.width) - 2 + 'px'  
				
				if (element.scrollHeight > parseInt(computed.height))
					style.overflowY = 'hidden';
			} else {
				style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
			}

			mirrorDiv.textContent = element.value.substring(0, position);
			
			if (element.nodeName === 'INPUT')
				mirrorDiv.textContent = mirrorDiv.textContent.replace(/\s/g, "\u00a0");

			var span = document.createElement('span');
			
			span.textContent = element.value.substring(position) || '.';  
			span.style.backgroundColor = "lightgrey";
			mirrorDiv.appendChild(span);

			var coordinates = {
				top: span.offsetTop + parseInt(computed['borderTopWidth']),
				left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
			};

			return coordinates;
		}
		
		var ele = document.getElementById('custom_text_area')
		var coordinates = getCaretCoordinates(ele, ele.selectionEnd);
		return coordinates;
	}

	// add word in the end if selected 
	function addWord(word) {
		var words = val.split(' ');
		words.pop();
		words.push(word);
		setVal(words.join(' '));
	}

	return (
		<div className="App">
			<h1>Text Editor</h1>
			<div id="mirrorDivDisplay"></div>
			<br />
			<div className="area">
				<textarea id='custom_text_area' value={val} onChange={(e) => setVal(e.target.value)} onKeyPress={(e) => handleChange(e)}></textarea>
				<div className="suggestion_box" style={{'top':y+20,'left': x+60}}>{suggestions.map((val, idx) => <span key={idx} onClick={() => addWord(val)}> {val} </span>)}</div>
			</div>
		</div>
	);
}

export default App;
