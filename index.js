

const GameState = require('tera-game-state');


module.exports = function (mod) {
	const game = GameState(mod);
	let timer,
		speed = 100,
		mode = 'hue',
		increment = 5,
		lIncrement = 0.1,
		sIncrement = 0.1,
		satVal = 0.8,
		lightVal = 0.2,
		hueValue = 1,
		dyeCol = 0,
		outfit = {};

	function hslToRgb(h, s, l) {
		// Achromatic
		if (s === 0) return [l, l, l]
		h /= 360

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s
		var p = 2 * l - q

		return [
			Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
			Math.round(hueToRgb(p, q, h) * 255),
			Math.round(hueToRgb(p, q, h - 1 / 3) * 255)
		]
	}

	function hueToRgb(p, q, t) {
		if (t < 0) t += 1
		if (t > 1) t -= 1
		if (t < 1 / 6) return p + (q - p) * 6 * t
		if (t < 1 / 2) return q
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6

		return p
	}

	mod.command.add('rainbow', (cmd, arg) => {
		switch (cmd) {
			case 'reset':
				speed = 100,
					mode = 'hue',
					dyeInt = 0,
					increment = 5,
					satVal = 0.8,
					lightVal = 0.2,
					hueValue = 1
				break
			case 'increment':
				increment = arg
				mod.command.message(`Value increment set to ${arg}`)
				break
			case 'speed':
				speed = arg
				mod.command.message(`Speed set to ${arg}ms`)
				break
			case 'mode':
				switch (arg) {
					case 'hue':
					case 'h':
						mode = 'hue'
						mod.command.message(`Mode set to hue cycle`)
						break
					case 'saturation':
					case 's':
					case 'sat':
						mode = 'sat'
						mod.command.message(`Mode set to saturation cycle`)
						break
					case 'light':
					case 'l':
						mode = 'light'
						mod.command.message(`Mode set to light cycle`)
						break
					default:
						mod.command.message(`Incorrect argument for mode, acceptable arguments are 'h, s, l`)
						break
				}
				break
			case 'hue':
			case 'h':
				hueValue = arg
				mod.command.message(`Hue value set to ${arg}`)
				break
			case 'saturation':
			case 's':
			case 'sat':
				if (arg > 1) {
					mod.command.message(`Light is between 0 - 1, try decimals, eg 0.5`)
				}
				satVal = arg
				mod.command.message(`Saturation value set to ${arg}`)
				break
			case 'light':
			case 'l':
				if (arg > 1) {
					mod.command.message(`Light is between 0 - 1, try decimals, eg 0.5`)
				}
				lightVal = arg
				mod.command.message(`Light value set to ${arg}`)
				break

			case 'start':
				mod.command.message(`<div><font color="#ff0000">F</font><font color="#ff2000">U</font><font color="#ff4000">C</font><font color="#ff5f00">K</font><font color="#ff7f00"> </font><font color="#ff9f00">O</font><font color="#ffbf00">U</font><font color="#ffdf00">T</font><font color="#ffff00"> </font><font color="#ccff00">M</font><font color="#99ff00">Y</font><font color="#66ff00"> </font><font color="#33ff00">W</font><font color="#00ff00">A</font><font color="#00ff40">Y</font><font color="#00ff80"> </font><font color="#00ffbf">W</font><font color="#00ffff">H</font><font color="#00bfff">E</font><font color="#0080ff">N</font><font color="#0040ff"> </font><font color="#0000ff">Y</font><font color="#2300ff">O</font><font color="#4600ff">U</font><font color="#6800ff"> </font><font color="#8b00ff">S</font><font color="#a200cc">E</font><font color="#b90099">E</font><font color="#d10066"> </font><font color="#e80033">M</font><font color="#ff0000">E</font><font color="#ff2000"> </font><font color="#ff4000">I</font><font color="#ff5f00">'</font><font color="#ff7f00">M</font><font color="#ff9f00"> </font><font color="#ffbf00">R</font><font color="#ffdf00">O</font><font color="#ffff00">L</font><font color="#bfff00">L</font><font color="#80ff00">I</font><font color="#40ff00">N</font><font color="#00ff00"> </font><font color="#00ff33">W</font><font color="#00ff66">I</font><font color="#00ff99">T</font><font color="#00ffcc">H</font><font color="#00ffff"> </font><font color="#00bfff">T</font><font color="#0080ff">H</font><font color="#0040ff">E</font><font color="#0000ff"> </font><font color="#2300ff">L</font><font color="#4600ff">G</font><font color="#6800ff">B</font><font color="#8b00ff">T</font></div>`)
				cTimer()
				break
			case 'stop':
				mod.command.message(`fun stopppppppp`)
				clearInterval(timer);
				break
			default:
				mod.command.message(`Command ${cmd} not recognized!`)
				break
		}
	})

	function lgbtMe(rgb) {
		rgb = (50 << 24) | (rgb[0] << 16) | (rgb[1] << 8) | rgb[2]
		return rgb
	}

	function cTimer() {
		timer = setInterval(applyDye, speed);
	}

	function applyDye() {
		switch (mode) {
			case 'hue':
				hueValue = parseFloat(increment, 10) + parseFloat(hueValue, 10)
				break
			case 'sat':
				satVal = parseFloat(increment / 360, 10) + parseFloat(satVal, 10)
				break
			case 'light':
				lightVal = parseFloat(increment / 360, 10) + parseFloat(lightVal, 10)
				break
		}
		if (hueValue >= 360) {
			hueValue = 0
		}
		if (satVal >= 1) {
			satVal = 0
		}
		if (lightVal >= 1) {
			lightVal = 0
		}
		dyeCol = hslToRgb(hueValue, satVal, lightVal)
		outfit.styleBodyDye = (lgbtMe(dyeCol))
		mod.send('S_USER_EXTERNAL_CHANGE', 6, Object.assign({},
			outfit));
	}

	mod.hook('S_USER_EXTERNAL_CHANGE', 6, { order: 999, filter: { fake: null } }, (event) => {
		if (event.gameId.equals(game.me.gameId)) {
			Object.assign(outfit, event);
		}
	})
	mod.hook('S_USER_EXTERNAL_CHANGE', 6, { order: 900 }, (event) => {
		if (event.gameId.equals(game.me.gameId)) {
			Object.assign(outfit, event);
		}
	});

	this.destructor = () => {
		clearInterval(timer);
		mod.command.remove('rainbow');
	};
}