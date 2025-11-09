import { loadEnv } from "vite";
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
	// modeに応じた.envファイルを読み込み

	return {
		test: {
			// インテグレーションテストを実行するための環境変数を設定
			env: loadEnv(mode, process.cwd(), ''),
			environment: 'node',
			globals: true,
		},
	};
});
