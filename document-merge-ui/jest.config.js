module.exports = {
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
		".+\\.(css|styl|less|sass|scss|png|svg|gif|jpg|ttf|woff|woff2)$": "jest-transform-stub"
	},
	testEnvironment: 'jsdom',
	moduleDirectories: ["node_modules", "src"],
	moduleNameMapper: {
		"^uuid$": "uuid",
		"^@resources(.*)$": "<rootDir>/resources/$1",
		"^@constant(.*)$": "<rootDir>/src/constant",
		"^@config(.*)$": "<rootDir>/src/config",
		"^@component(.*)$": "<rootDir>/src/component",
		"^@data(.*)$": "<rootDir>/src/data",
		"^@service(.*)$": "<rootDir>/src/service",
		"^@test(.*)$": "<rootDir>/src/test",
		"^@scope(.*)$": "<rootDir>/src/scope",
		"^@reducer(.*)$": "<rootDir>/src/reducer",
		"^@store(.*)$": "<rootDir>/src/store",
		"^@utils(.*)$": "<rootDir>/src/utils",
		"^@theme(.*)$": "<rootDir>/src/theme",
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/test/__mocks__/fileMock.js',
		"\\.(css|less|scss|sass)$": "<rootDir>/test/__mocks__/styleMock.js"
	},
};
