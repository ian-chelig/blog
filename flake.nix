{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/6eac218f2d3dfe6c09aaf61a5bfa09d8aa396129";
    nixos-generator = {
      url = "github:nix-community/nixos-generators/d002ce9b6e7eb467cd1c6bb9aef9c35d191b5453";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    colmena.url = "github:zhaofengli/colmena";
    devshell.url = "github:numtide/devshell";
  };
  outputs =
    { self, nixpkgs, colmena, devshell, ... }@flakeInputs:
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
];
    in
      with pkgs;
    {
colmenaHive = colmena.lib.makeHive {
      meta = {
        nixpkgs = import nixpkgs {
          system = "x86_64-linux";
          overlays = [];
        };
      };

      blogServer = {
        deployment = {
          targetHost = "colmena.blogServer"; # <- defined in ~/.ssh/config
            targetUser = "daisy";
        };
        imports = [ ./configuration.nix ];
      };
    };
      packages.${system} = {
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
            name = (builtins.fromJSON (builtins.readFile "${self}/package.json")).name + " devshell";
            packages = packages;

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
                package = (
                  writeShellApplication {
                    name = "pr";
                    text = ''
                      echo "vvvvvvvvvvvv-Click-Me-vvvvvvvvvvvvvv"
                      echo ""
                      echo "$(git config --get remote.origin.url)/pullrequestcreate?sourceRef=$(git branch --show-current)&targetRef=main" |  sed "s/\/[a-zA-Z].*@/\//";
                      echo ""
                      echo "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
                    '';

                    meta = {
                      mainProgram = "pr";
                      description = "Create pull request";
                    };

                  }
                );

                category = "Dev Tools";
              }
              {
                package = (
                  writeShellApplication {
                    name = "deploy";
                    text = ''
                      colmena build && colmena apply
                    '';

                    meta = {
                      mainProgram = "deploy";
                      description = "Deploy changes to droplet";
                    };

                  }
                );

                category = "Dev Tools";
              }
              {
                package = (
                  writeShellApplication {
                    name = "run";
                    text = ''
                      if [ -d "$(git rev-parse --show-toplevel)/node_modules" ]; then
                        npm start;
                      else
                        npm i;
                      fi
                    '';

                    meta = {
                      mainProgram = "run";
                      description = "(Project Alias) Start developing the project";
                    };

                  }
                );

                category = "Dev Tools";
              }
              {
                package = writeShellApplication {
                  name = "incrvers";
                  text = ''
                    # @describe increment the version in a package.json according to semantic versioning rules and optionally commit package.json

                    # @cmd Increment major version
                    # @alias M
                    major() {
                      VERSION=$(getCurrentVersion)
                      NEW_VERSION=$(echo "$VERSION" | awk -F. '{$1++; $2=0; $3=0; print $1"."$2"."$3}')
                      echo "New major version: $NEW_VERSION"
                      writeNewVersion "$NEW_VERSION"
                    }

                    # @cmd Increment minor version
                    # @alias m
                    minor() {
                      VERSION=$(getCurrentVersion)
                      NEW_VERSION=$(echo "$VERSION" | awk -F. '{$2++; $3=0; print $1"."$2"."$3}')
                      echo "New minor version: $NEW_VERSION"
                    }

                    # @cmd Increment patch version
                    # @alias p
                    patch() {
                      VERSION=$(getCurrentVersion)
                      NEW_VERSION=$(echo "$VERSION" | awk -F. '{$3++; print $1"."$2"."$3}')
                      echo "New patch version: $NEW_VERSION"
                    }

                    writeNewVersion() {
                      jq ".version = \"$1\"" "$(git rev-parse --show-toplevel)/package.json" | ${moreutils}/bin/sponge "$(git rev-parse --show-toplevel)/package.json"
                      SHOULDCOMMIT=$(printf "Yes\nNo" | ${pkgs.fzf}/bin/fzf --prompt="Commit package.json?> ")
                      case $SHOULDCOMMIT in
                        "Yes")
                          git add package.json
                          git commit -m "chore: Increment version to $1"
                        ;;
                      esac

                    }

                    getCurrentVersion() {
                      jq -r '.version' "$(git rev-parse --show-toplevel)/package.json"
                    }

                    eval "$(${pkgs.argc}/bin/argc --argc-eval "$0" "$@")"
                  '';

                  meta = {
                    mainProgram = "incrvers";
                    description = "Increment version in package.json according to semver and optionally make a commit";
                  };
                };
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
              {
                category = "Repo Tools";
                package = writeShellApplication {
                  name = "auth";
                  text = ''
                    pushd "$(git rev-parse --show-toplevel)"
                    eval "$(${fnm}/bin/fnm env)"

                    ${fnm}/bin/fnm use

                    set +e
                    npx better-vsts-npm-auth

                    if [[ $? -eq 1 ]]; then
                      echo "ATTENTION: If this is your first time authenticating then please follow the instructions at this link: https://stateless-vsts-oauth.azurewebsites.net"
                    fi

                    popd
                  '';

                  meta = {
                    mainProgram = "auth";
                    description = "(Project Alias) authenticate with azure node repository";
                  };

                };
              }

            ];
          }
        );

    };
}
