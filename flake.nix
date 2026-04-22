{
  description = "日本仏教徒協会 WEBサイト 2025 - SvelteKit project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        # Playwright 同梱 chromium-headless-shell が dlopen するランタイム共有ライブラリ。
        # NixOS では /usr/lib 系の共有ライブラリが存在しないため LD_LIBRARY_PATH で渡す。
        playwrightLibs = with pkgs; [
          glib
          nss
          nspr
          dbus.lib
          atk
          at-spi2-atk
          at-spi2-core
          cups.lib
          libdrm
          expat
          libxkbcommon
          libgbm
          mesa
          cairo
          pango
          alsa-lib
          fontconfig.lib
          freetype
          xorg.libX11
          xorg.libXcomposite
          xorg.libXdamage
          xorg.libXext
          xorg.libXfixes
          xorg.libXrandr
          xorg.libxcb
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            nodePackages.pnpm
            # sharp dependencies
            vips
            pkg-config
          ];

          shellHook = ''
            echo "🛕 ほうどう寺 開発環境"
            echo "Node.js: $(node --version)"
            echo "pnpm: $(pnpm --version)"
          '';

          # Playwright 公式バイナリは NixOS 非対応のためホスト検証をスキップ。
          PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";

          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath ([
            pkgs.stdenv.cc.cc.lib
            pkgs.vips
          ] ++ playwrightLibs);
        };
      }
    );
}
