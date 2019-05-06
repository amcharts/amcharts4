// Also detects iOS
export function isSafari(): boolean {
	return /apple/i.test(navigator.vendor);
}

export function isInternetExplorer(): boolean {
	return /MSIE |Trident\//.test(navigator.userAgent);
}
