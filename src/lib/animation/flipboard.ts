/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function flipboard(node: HTMLHeadingElement, params: Record<string, number>) {
	const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	const text = node.textContent?.trim();

	return {
		duration: 3000,
		...params,
		tick(t: number) {
			if (t === 1) {
				node.textContent = text!;
				return;
			}

			let str = '';
			for (let i = 0; i < text!.length; i++) {
				const progress = i / text!.length;
				if (text![i] === ' ' || progress < t * 0.9) {
					str += text![i];
				} else if (progress < t * 1.5) {
					str += randomChars[Math.floor(Math.random() * randomChars.length)];
				} else if (progress < t * 2) {
					str += '-';
				} else {
					str += ' ';
				}
			}
			node.textContent = str;
		}
	};
}
