{
  inputs = {
    arion = {
      url = "github:hercules-ci/arion";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    node2nix.url = "github:svanderburg/node2nix";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    nixos-generator = {
      url = "github:nix-community/nixos-generators/d002ce9b6e7eb467cd1c6bb9aef9c35d191b5453";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    colmena.url = "github:zhaofengli/colmena";
    devshell.url = "github:numtide/devshell";
  };
  outputs =
    {
      self,
      nixpkgs,
      colmena,
      devshell,
      arion,
      node2nix,
      ...
    }@flakeInputs:
    let
      system = "x86_64-linux";
      modules = [
        {
          # Pin nixpkgs to the flake input.
          nix.registry.nixpkgs.flake = nixpkgs;
          virtualisation.diskSize = 8 * 1024; # 8GiB
        }
        ./configuration.nix
      ];
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ devshell.overlays.default ];
      };
      packages = with pkgs; [
        nil
        lefthook
        nixfmt-rfc-style
        libwebp
        commitlint-rs
        jq
        fnm
        colmena.packages.${system}.colmena
        node2nix.packages.${system}.node2nix
        statix
        nil
      ];
    in
    with pkgs;
    {

      colmenaHive = colmena.lib.makeHive {
        meta = {
          nixpkgs = import nixpkgs {
            system = "x86_64-linux";
            overlays = [ ];
          };
          specialArgs = {
            inherit self;
            # or: packages = self.packages.x86_64-linux;
          };
        };

        blogServer = {
          deployment = {
            targetHost = "colmena.blogServer"; # <- defined in ~/.ssh/config
            targetUser = "daisy";
          };
          imports = [
            ./configuration.nix
            arion.nixosModules.arion
          ];
        };
      };
      packages.${system} = {
        blogServerRunnable = writeShellApplication {
          name = "run";
          text = ''
            cd ${self.packages.${system}.blogServer}
            ${pkgs.nodejs}/bin/node ${self.packages.${system}.blogServer}/standalone/server.js
          '';

          meta = {
            mainProgram = "run";
            description = "Run nextjs project";
          };

        };

        blogServer =
          let
            inherit ((pkgs.callPackage ./frontend/default.nix { })) nodeDependencies;
          in
          pkgs.stdenv.mkDerivation {
            pname = "blogServer";
            version = "1.0.0";

            # Source code of your project
            src = ./frontend;
            nativeBuildInputs = [
              pkgs.nodejs
              pkgs.typescript
              pkgs.bash
              pkgs.curl
            ];

            buildPhase = ''
              ln -s ${nodeDependencies}/lib/node_modules ./node_modules
              export PATH="${nodeDependencies}/bin:$PATH"

              # Build the Next.js app
              npm run build
            '';

            installPhase = ''
              mkdir -p $out
              cp -r .next/standalone $out/
              cp -r .next/static $out/standalone/.next
            '';

            # Run command when invoking the package
            # Mirrors the Docker CMD ["node", "server.js"]
            shellHook = ''
              export NODE_ENV=production
              export HOSTNAME=0.0.0.0
            '';

            # Metadata
            meta = with pkgs.lib; {
              description = "Next.js application packaged with Nix";
              license = licenses.mit;
              maintainers = [ ];
            };
          };

        digitalOceanVM = flakeInputs.nixos-generator.nixosGenerate {
          inherit system;
          inherit modules;
          format = "do"; # DigitalOcean
        };
      };

      nixosConfigurations.myDigitalOceanDroplet = nixpkgs.lib.nixosSystem {
        inherit system;
        inherit modules;
      };

      devShells.${system}.default = pkgs.devshell.mkShell (
        { config, ... }:
        {
          # name of the dev shell
          # For more info https://github.com/numtide/devshell/blob/main/docs/src/modules_schema.md
          name = "devshell";
          inherit packages;

          # use FNM in setup hooks so the user has access to the right node version
          devshell.startup.setup-fnm.text = ''eval "$(${fnm}/bin/fnm env)"'';
          devshell.interactive.setup-fnm.text = ''eval "$(${fnm}/bin/fnm env)"; fnm use'';

          # More programs to be installed in the container, but also generates an entry in the `menu` command
          commands = [
            {
              package = nodePackages.prettier;
              category = "Build Tools";
            }
            {
              package = lazygit;
              category = "Dev Tools";
            }
            {
              package = writeShellApplication {
                name = "deploy";
                text = ''
                  colmena build && colmena apply
                '';

                meta = {
                  mainProgram = "deploy";
                  description = "Deploy changes to droplet";
                };
              };
              category = "Dev Tools";
            }
            {
              package = writeShellApplication {
                name = "generate-dependencies";
                text = ''
                  cd "$(${pkgs.git}/bin/git rev-parse --show-toplevel)/frontend"
                  node2nix -i package.json -l package-lock.json
                '';

                meta = {
                  mainProgram = "generate-dependencies";
                  description = "Generate node2nix package dependencies";
                };

              };
              category = "Build Tools";
            }
            {
              package = writeShellApplication {
                name = "build";
                text = ''
                  nix build .#blogServer
                '';

                meta = {
                  mainProgram = "build";
                  description = "Build nextjs frontend";
                };
              };
              category = "Build Tools";
            }
            {
              package = writeShellApplication {
                name = "build-image";
                text = ''
                  nix build .#digitalOceanVM
                '';

                meta = {
                  mainProgram = "build-image";
                  description = "Build digital ocean droplet image";
                };
              };
              category = "Build Tools";
            }
            {
              package = writeShellApplication {
                name = "run";
                text = ''
                  nix run .#blogServerRunnable
                '';

                meta = {
                  mainProgram = "run";
                  description = "Run nextjs frontend";
                };
              };
              category = "Dev Tools";
            }
            {
              category = "Repo Tools";
              package = writeShellApplication {
                name = "update";
                text = ''
                  if [[ -z $(git status --porcelain) ]] ; then
                    echo "Updating Flake"
                    nix flake update
                  else
                    echo "Your Git tree is dirty, its best to commit your changes now so its easier to rollback incase of failure."
                  while true; do
                    read -r -p "Continue anyway? " yn
                    case $yn in
                      [Yy]* ) nix flake update; break;;
                      [Nn]* ) exit;;
                      * ) echo "y or n";;
                    esac
                  done
                  fi
                '';

                meta = {
                  mainProgram = "update";
                  description = "(Project Alias) Update the nix flake (packages in devshell)";
                };
              };
            }
          ];
        }
      );
    };
}
