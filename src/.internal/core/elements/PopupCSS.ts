import { StyleRule } from "../utils/DOM";
import { Dictionary } from "../utils/Dictionary";
import { MultiDisposer, IDisposer, CounterDisposer } from "../utils/Disposer";


const rules = new Dictionary<string, CounterDisposer>();

/**
 * Default CSS for Popup.
 *
 * @ignore Exclude from docs
 * @param  {string}     prefix  Prefix for CSS classes
 * @return {IDisposer}          Disposer for the CSS definition
 */
export default function(prefix?: string): IDisposer {
	if (!prefix) {
		prefix = "ampopup";
	}

	const counter = rules.insertKeyIfEmpty(prefix, () => {
		const disposer = new MultiDisposer([
			new StyleRule(`.${prefix}`, {
				//"width": "100%",
				//"height": "100%",
				"overflow": "visible",
				"position": "absolute",
				"top": "0",
				"left": "0",
				"z-index": "2000"
			}),

			new StyleRule(`.${prefix}-curtain`, {
				"width": "100%",
				"height": "100%",
				"position": "absolute",
				"top": "0",
				"left": "0",
				"z-index": "2001",
				"background": "#fff",
				"opacity": "0.5"
			}),

			new StyleRule(`.${prefix}-title`, {
				"font-weight": "bold",
				"font-size": "120%"
			}),

			new StyleRule(`.${prefix}-content`, {
				/*"width": "100%",
				"height": "100%",*/
				"padding": "1em 2em",
				"background": "rgb(255, 255, 255);",
				"background-color": "rgba(255, 255, 255, 0.8)",
				"display": "inline-block",
				"position": "absolute",
				"top": "0",
				"left": "0",
				"max-width": "90%",
				"max-height": "90%",
				"overflow": "auto",
				"z-index": "2002"
			}),

			new StyleRule(`.${prefix}-close`, {
				"display": "block",
				"position": "absolute",
				"top": "0.3em",
				"right": "0.3em",
				"background-color": "rgb(100, 100, 100)",
				"background": "rgba(100, 100, 100, 0.1) url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmVyc2lvbj0iMSIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQ0NS4yIDEwOS4ybC00Mi40LTQyLjRMMjU2IDIxMy42IDEwOS4yIDY2LjhsLTQyLjQgNDIuNEwyMTMuNiAyNTYgNjYuOCA0MDIuOGw0Mi40IDQyLjRMMjU2IDI5OC40bDE0Ni44IDE0Ni44IDQyLjQtNDIuNEwyOTguNCAyNTYiLz48L3N2Zz4=) no-repeat center",
				"background-size": "80%",
				"width": "1.2em",
				"height": "1.2em",
				"cursor": "pointer"
			}),

		]);

		return new CounterDisposer(() => {
			rules.removeKey(prefix);
			disposer.dispose();
		});
	});

	return counter.increment();
}