export const clientId = "bd380eb281e54a3ea2232f198513736e";
export const redirectUri = "http://127.0.0.1:1029/auth/callback";
export const scope = [
	"user-read-private",
	"user-read-playback-state",
	"user-modify-playback-state",
	"user-library-read",
];
export const authUrl = new URL("https://accounts.spotify.com/authorize");
