{
  description = "ほうどう寺 WEBサイト 2025 - SvelteKit project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
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

          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.stdenv.cc.cc.lib
            pkgs.vips
          ];
        };
      }
    );
}
