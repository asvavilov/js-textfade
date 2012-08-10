/**
 * author: Alexander Vavilov (asvavilov)
 * www: yasla.net
 * 
 * text fade
 * tags with classes around last chars of text
 * 
 * init:
 *  new TexFade(blocks, counter, options)
 *
 * options:
 *  blocks
 *  counter:
 *   tag: 'span'
 *   class: 'letter_'
 *   total: 10
 *   min: 0
 * 
 * TODO trim, strip, clean whitespace
 * 
 * Changelog:
 * * 1.0 (20120810)
 * * * First version
 */

var TextFade = function(blocks, counter, options) {
	// ---------------
	// init parameters
	this.blocks = blocks;
	this.counter = jQuery.extend({'tag': 'span', 'class': 'letter_', 'total': 10, 'min': 0}, counter || {});
	this.options = jQuery.extend({}, options || {});

	// -------
	// methods
	this.init = function() {
		for (var n = 0, mn = this.blocks.length; n < mn; n++) {
			var block = this.blocks[n];
			block.innerHTML = block.innerHTML.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s{2,}/g, ' ');
			var inner_text = (block.innerText != undefined ? block.innerText : block.textContent);
			if (inner_text && inner_text.length <= this.counter['min']) {
				continue;
			}
			if (block.hasChildNodes()){
				this.nodes = [];
				this.getChildNodes(block.childNodes);
				var c = 0;
				for (var i = this.nodes.length - 1, mi = 0; i >= mi; i--) {
					var node = this.nodes[i];
					var df = document.createDocumentFragment();
					var tag = document.createElement(this.counter.tag);
					var letters = node.nodeValue.split('');
					for (var l = letters.length - 1, ml = 0; l >= ml; l--) {
						if (c > this.counter.total - 1) break;
						var tag_clone = tag.cloneNode(false);
						tag_clone.className = this.counter['class']+c;
						if (tag_clone.innerText != undefined) {
							tag_clone.innerText = letters[l];
						} else {
							tag_clone.textContent = letters[l];
						}
						letters[l] = tag_clone;
						c++;
					}
					var part_letters = '';
					for (l = 0, ml = letters.length; l < ml; l++) {
						if (letters[l].constructor == String) {
							part_letters += letters[l];
						} else {
							if (part_letters) {
								df.appendChild(document.createTextNode(part_letters));
								part_letters = '';
							}
							df.appendChild(letters[l]);
						}
					}
					if (part_letters) {
						df.appendChild(document.createTextNode(part_letters));
					}
					node.parentNode.replaceChild(df, node);
				}
			}
		}
	};
	this.getChildNodes = function(child_nodes) {
		for (var n = 0, m = child_nodes.length; n < m; n++) {
			var node = child_nodes[n];
			if (node.nodeType == 3) {
				this.nodes.push(node);
			} else if ((node.nodeType in [1, 4]) && node.hasChildNodes()) {
				this.getChildNodes(node.childNodes);
			}
		}
	};

	// -------
	// init
	this.init();
}
