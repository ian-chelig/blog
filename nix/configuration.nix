{
  lib,
  modulesPath,
  pkgs,
  self,
  ...
}:

{

  imports = [
    ./networking.nix
    ./wireguard.nix
  ]
  # Required for Digital Ocean droplets.
  ++ lib.optional (builtins.pathExists ./do-userdata.nix) ./do-userdata.nix
  ++ [
    (modulesPath + "/virtualisation/digital-ocean-config.nix")
  ];

  nix.settings = {
    # NOTE: Enable this if you want to allow deploying
    # via sudoers!
    trusted-users = [
      "@wheel" # Allow sudoers to push Nix closures.
    ];
    # Enable flakes.
    experimental-features = [
      "nix-command"
      "flakes"
    ];
  };

  # Set your default locale, as you wish.
  i18n.defaultLocale = "C.UTF-8";

  # System-wide packages.
  environment.systemPackages = with pkgs; [
    neovim # Change to your favourite tiny text editor.
    arion
    docker-client
    self.packages.${system}.blogServerRunnable
  ];

  users.users.daisy = {
    isNormalUser = true;
    extraGroups = [ "wheel" ]; # Enable ‘sudo’ for the user.
    openssh = {
      # NOTE: Change this to whatever public key you use!
      authorizedKeys.keys = [
        "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINFs2mr6UYCjEtcP0DwBKd2lIAx/McPLF5kX5kpikfZy daisy@unwound"
      ];
    };
  };
  services = {
    #fail2ban
    fail2ban = {
      enable = true;
      # Ban IP after 5 failures
      maxretry = 5;
      ignoreIP = [
        # Whitelist some subnets
      ];
      bantime = "24h"; # Ban IPs for one day on the first ban
      bantime-increment = {
        enable = true; # Enable increment of bantime after each violation
        formula = "ban.Time * math.exp(float(ban.Count+1)*banFactor)/math.exp(1*banFactor)";
        maxtime = "168h"; # Do not ban for more than 1 week
        overalljails = true; # Calculate the bantime based on all the violations
      };
    };

    #meilisearch config
    meilisearch = {
      enable = true;
      masterKeyFile = "/secrets/meilisearch.key";
      listenAddress = "0.0.0.0";
    };

    #nginx config
    nginx = {
      enable = true;
      virtualHosts = {
        "ianmadeit.org" = {
          enableACME = true;
          serverAliases = [ "www.ianmadeit.org" ];
          forceSSL = true;
          locations."/".proxyPass = "http://localhost:3000";
        };
        "strapi.ianmadeit.org" = {
          enableACME = true;
          forceSSL = true;
          locations."/".proxyPass = "http://localhost:1337"; # default Strapi port
        };
      };
    };
  };

  #docker config
  virtualisation = {
    docker.enable = true;
    arion = {
      backend = "docker";
    };
  };

  #strapi config
  virtualisation.arion.projects.strapi.settings =
    let
      appdir = "/docker/appdata/";
      env = {
        PUID = "1000";
        PGID = "1000";
        TZ = "America/Chicago";
        NODE_ENV = "development";
      };

      restart = "unless-stopped";
    in
    {
      config.services.strapi.service = {
        useHostStore = true;
        inherit restart;
        image = "vshadbolt/strapi:5.33.0";
        environment = env;
        volumes = [
          (appdir + "strapi:/config")
          (appdir + "app:/srv/app")
        ];
        ports = [ "127.0.0.1:1337:1337" ];
      };
    };

  #systemd unit for frontend
  systemd.services.blogServer = {
    enable = true;
    wantedBy = [ "network.target" ];
    environment = {
      STRAPI_URL = "http://localhost:1337";
      MEILI_HOST = "http://localhost:7700";
      NEXT_PUBLIC_SITE_URL = "https://ianmadeit.org";
    };
    serviceConfig = {
      ExecStart = "${self.packages.x86_64-linux.blogServerRunnable}/bin/run";
    };
  };

  security.acme = {
    # Accept the CA’s terms of service. The default provider is Let’s Encrypt, you can find their ToS at https://letsencrypt.org/repository/.
    acceptTerms = true;
    # Optional: You can configure the email address used with Let's Encrypt.
    # This way you get renewal reminders (automated by NixOS) as well as expiration emails.
    defaults.email = "ianm.chelig@gmail.com";
  };

  # Passwordless sudo.
  # WARNING!
  # If you decide to change this, remember you NEED to set a password
  # for the chosen user with an "authorizedKeys" setting. Passwords are
  # public in the nix store, so know what you're doing!
  security.sudo.wheelNeedsPassword = false;

  # Set this to whichever system state version you're installing now.
  # Afterwards, don't change this lightly. It doesn't need to change to
  # upgrade.
  system.stateVersion = "25.05";
}
